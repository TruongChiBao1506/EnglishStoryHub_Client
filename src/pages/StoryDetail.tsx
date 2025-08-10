import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Story, Comment } from '../types';
import { storyService } from '../services/storyService';
import { commentService } from '../services/commentService';
import { translationService, SupportedLanguage } from '../services/translationService';
import { useAuth } from '../contexts/AuthContext';
import CommentItem from '../components/CommentItem';
import { useNotifications } from '../components/Notification';
import { Card, Typography, Space, Button, Input, Tag, Avatar, Divider, Spin, Alert, Row, Col, Select } from 'antd';
import { HeartOutlined, HeartFilled, EyeOutlined, CalendarOutlined, UserOutlined, MessageOutlined, ArrowLeftOutlined, SendOutlined, TranslationOutlined, SoundOutlined
} from '@ant-design/icons';

const { Title, Text } = Typography;
const { TextArea } = Input;

const StoryDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const { showPoints, NotificationContainer } = useNotifications();
  
  const [story, setStory] = useState<Story | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(true);
  const [submittingComment, setSubmittingComment] = useState(false);
  const [likingStory, setLikingStory] = useState(false);
  const [error, setError] = useState('');
  
  // Translation states
  const [showTranslation, setShowTranslation] = useState(false);
  const [translatedContent, setTranslatedContent] = useState<string>('');
  const [translatedTitle, setTranslatedTitle] = useState<string>('');
  const [translatingContent, setTranslatingContent] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState<SupportedLanguage>('vi');
  const [translationCache, setTranslationCache] = useState<{[key: string]: {title: string, content: string}}>({});

  // Story reading states
  const [isReadingStory, setIsReadingStory] = useState(false);

  const fetchStoryAndComments = useCallback(async () => {
    if (!id) return;
    
    setLoading(true);
    try {
      const [storyResponse, commentsResponse] = await Promise.all([
        storyService.getStoryById(id),
        commentService.getStoryComments(id)
      ]);
      
      if (storyResponse.success) {
        // Backend returns { success: true, story: {...} }
        const storyData = storyResponse.story;
        if (storyData) {
          setStory(storyData);
        } else {
          setError('Story not found');
        }
      } else {
        setError('Story not found');
      }
      
      if (commentsResponse.success) {
        const commentsData = (commentsResponse as any).comments || commentsResponse.data || [];
        setComments(commentsData);
      }
    } catch (error) {
      console.error('Error fetching story:', error);
      setError('Failed to load story');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchStoryAndComments();
  }, [fetchStoryAndComments]);

  // Update page title when story loads
  useEffect(() => {
    if (story) {
      document.title = `${story.title} - English Story Hub`;
    } else {
      document.title = 'Story - English Story Hub';
    }
    return () => {
      document.title = 'English Story Hub';
    };
  }, [story]);

  // Cleanup audio when component unmounts or story changes
  useEffect(() => {
    return () => {
      if (isReadingStory) {
        window.speechSynthesis.cancel();
      }
    };
  }, [isReadingStory]);

  // Stop reading when translation changes
  useEffect(() => {
    if (isReadingStory) {
      window.speechSynthesis.cancel();
      setIsReadingStory(false);
    }
  }, [showTranslation, selectedLanguage]); // eslint-disable-line react-hooks/exhaustive-deps

  // Calculate if story is liked by current user
  const isLiked = user && story && story.likes && story.likes.includes(user._id);

  const handleLike = async () => {
    if (!story || !isAuthenticated || likingStory) {
      console.log('Cannot like story:', { hasStory: !!story, isAuthenticated, likingStory });
      if (!isAuthenticated) {
        alert('Please login to like stories');
      }
      return;
    }
    
    console.log('Attempting to like story:', story._id);
    console.log('Current user:', user);
    console.log('Story likes:', story.likes);
    console.log('Is already liked:', user && story.likes.includes(user._id));
    
    setLikingStory(true);
    
    try {
      const response = await storyService.likeStory(story._id);
      console.log('Like story response:', response);
      
      if (response.success) {
        // Backend returns: { success: true, likesCount: number, hasLiked: boolean }
        // Update the story state with new like information
        if (user) {
          const isCurrentlyLiked = story.likes.includes(user._id);
          const updatedLikes = isCurrentlyLiked 
            ? story.likes.filter(id => id !== user._id)  // Remove like
            : [...story.likes, user._id];  // Add like
          
          setStory(prevStory => ({
            ...prevStory!,
            likes: updatedLikes,
            likesCount: response.likesCount || updatedLikes.length
          }));
          
          // Show points notification if user liked the story (not unliked)
          if (!isCurrentlyLiked) {
            showPoints(1, 'Thanks for engaging with the community! 💙');
          }
        }
        
        console.log('Story like updated successfully');
      } else {
        console.error('Like story failed:', response);
        alert('Failed to like story: ' + (response.message || 'Unknown error'));
      }
    } catch (error) {
      console.error('Error liking story:', error);
      if (error && typeof error === 'object' && 'response' in error) {
        const errorResponse = (error as any).response;
        console.error('Response error:', errorResponse);
        alert('Error: ' + (errorResponse?.data?.message || errorResponse?.statusText || 'Network error'));
      } else {
        alert('Network error occurred');
      }
    } finally {
      setLikingStory(false);
    }
  };

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim() || !story || !isAuthenticated) return;
    
    setSubmittingComment(true);
    try {
      const response = await commentService.createComment(story._id, newComment.trim());
      if (response.success) {
        const newCommentData = (response as any).comment || response.data;
        if (newCommentData) {
          setComments(prev => [newCommentData, ...prev]);
          setNewComment('');
        }
      }
    } catch (error) {
      console.error('Error submitting comment:', error);
    } finally {
      setSubmittingComment(false);
    }
  };

  const handleLikeComment = async (commentId: string) => {
    if (!isAuthenticated) return;
    
    try {
      const response = await commentService.likeComment(commentId);
      if (response.success) {
        const updatedComment = (response as any).comment || response.data;
        if (updatedComment) {
          setComments(prev =>
            prev.map(comment =>
              comment._id === commentId ? updatedComment : comment
            )
          );
        }
      }
    } catch (error) {
      console.error('Error liking comment:', error);
    }
  };

  const handleEditComment = async (commentId: string, newContent: string) => {
    try {
      const response = await commentService.updateComment(commentId, newContent);
      if (response.success && response.data) {
        setComments(prev =>
          prev.map(comment =>
            comment._id === commentId ? response.data! : comment
          )
        );
      }
    } catch (error) {
      console.error('Error editing comment:', error);
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    if (!window.confirm('Are you sure you want to delete this comment?')) {
      return;
    }
    
    try {
      const response = await commentService.deleteComment(commentId);
      if (response.success) {
        setComments(prev => prev.filter(comment => comment._id !== commentId));
      }
    } catch (error) {
      console.error('Error deleting comment:', error);
    }
  };

  // Translation handlers
  const handleTranslate = async () => {
    if (!story || translatingContent) return;
    
    const cacheKey = `${selectedLanguage}-${story._id}`;
    
    // Check cache first
    if (translationCache[cacheKey]) {
      setTranslatedTitle(translationCache[cacheKey].title);
      setTranslatedContent(translationCache[cacheKey].content);
      setShowTranslation(true);
      return;
    }
    
    setTranslatingContent(true);
    
    try {
      // Translate title and content in parallel
      const [titleResponse, contentResponse] = await Promise.all([
        translationService.translateText(story.title, selectedLanguage),
        translationService.translateText(story.content, selectedLanguage)
      ]);
      
      if (titleResponse.success && contentResponse.success) {
        const newTranslatedTitle = titleResponse.translatedText || story.title;
        const newTranslatedContent = contentResponse.translatedText || story.content;
        
        setTranslatedTitle(newTranslatedTitle);
        setTranslatedContent(newTranslatedContent);
        
        // Cache the translation
        setTranslationCache(prev => ({
          ...prev,
          [cacheKey]: {
            title: newTranslatedTitle,
            content: newTranslatedContent
          }
        }));
        
        setShowTranslation(true);
      } else {
        console.error('Translation failed:', titleResponse.message, contentResponse.message);
        // Fallback to showing original content
        setShowTranslation(false);
      }
    } catch (error) {
      console.error('Error translating story:', error);
      setShowTranslation(false);
    } finally {
      setTranslatingContent(false);
    }
  };

  const handleToggleTranslation = () => {
    if (!showTranslation) {
      handleTranslate();
    } else {
      setShowTranslation(false);
    }
  };

  // Story Text-to-Speech handlers
  const handleReadStory = async () => {
    if (!story) return;

    if (isReadingStory) {
      // Stop reading
      window.speechSynthesis.cancel();
      setIsReadingStory(false);
      return;
    }

    try {
      setIsReadingStory(true);
      
      const textToRead = showTranslation && translatedContent 
        ? `${translatedTitle}. ${translatedContent}` 
        : `${story.title}. ${story.content}`;

      const utterance = new SpeechSynthesisUtterance(textToRead);
      
      // Set language based on current view
      if (showTranslation) {
        const langMap: Record<string, string> = {
          'vi': 'vi-VN',
          'zh': 'zh-CN',
          'ja': 'ja-JP',
          'ko': 'ko-KR',
          'th': 'th-TH',
          'fr': 'fr-FR',
          'de': 'de-DE',
          'es': 'es-ES',
          'ru': 'ru-RU'
        };
        utterance.lang = langMap[selectedLanguage] || 'vi-VN';
      } else {
        utterance.lang = 'en-US';
      }

      utterance.rate = 0.8;
      utterance.pitch = 1.0;
      utterance.volume = 1.0;

      utterance.onend = () => {
        setIsReadingStory(false);
      };

      utterance.onerror = (error) => {
        console.error('Speech synthesis error:', error);
        setIsReadingStory(false);
      };

      window.speechSynthesis.speak(utterance);

    } catch (error) {
      console.error('Error starting text-to-speech:', error);
      setIsReadingStory(false);
    }
  };

  const handleLanguageChange = (language: SupportedLanguage) => {
    setSelectedLanguage(language);
    setShowTranslation(false); // Reset translation view when language changes
  };

  const getSupportedLanguages = () => {
    return translationService.getSupportedLanguages();
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'green';
      case 'intermediate': return 'orange';
      case 'advanced': return 'red';
      default: return 'blue';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div style={{ 
        minHeight: '100vh', 
        background: 'linear-gradient(135deg, #f0f5ff 0%, #fffbe6 100%)', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center' 
      }}>
        <Spin size="large" />
      </div>
    );
  }

  if (error || !story) {
    return (
      <div style={{ 
        minHeight: '100vh', 
        background: 'linear-gradient(135deg, #f0f5ff 0%, #fffbe6 100%)', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        padding: '24px'
      }}>
        <Card style={{ maxWidth: 400, textAlign: 'center' }}>
          <Alert
            message="Story Not Found"
            description={error || 'The story you are looking for does not exist.'}
            type="error"
            showIcon
          />
          <Button 
            type="primary" 
            style={{ marginTop: 16 }}
            onClick={() => navigate('/stories')}
            icon={<ArrowLeftOutlined />}
          >
            Back to Stories
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #f0f5ff 0%, #fffbe6 100%)', padding: '32px 24px' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <Row gutter={[32, 32]}>
          <Col xs={24} lg={16}>
            {/* Story Header */}
            <Card 
              variant="borderless"
              style={{ borderRadius: 16, boxShadow: '0 4px 24px rgba(0,0,0,0.08)', marginBottom: 32 }}
            >
              <Space direction="vertical" size="large" style={{ width: '100%' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div style={{ flex: 1 }}>
                    <Title level={2} style={{ marginBottom: 16 }}>{story.title}</Title>
                    <Space size="middle" wrap>
                      <Tag color={getDifficultyColor(story.difficulty)}>{story.difficulty}</Tag>
                      <Text type="secondary">{story.estimatedReadTime} min read</Text>
                      <Text type="secondary">
                        <CalendarOutlined style={{ marginRight: 4 }} />
                        {formatDate(story.createdAt)}
                      </Text>
                    </Space>
                  </div>
                  {story.isFeatured && (
                    <Tag color="gold" style={{ fontSize: 16, padding: '4px 8px' }}>⭐ Featured</Tag>
                  )}
                </div>

                <Divider />

                {/* Author & Stats */}
                <Row justify="space-between" align="middle">
                  <Col>
                    <Space>
                      <Avatar size={48} icon={<UserOutlined />} style={{ backgroundColor: '#1890ff' }}>
                        {story.author?.username?.charAt(0).toUpperCase()}
                      </Avatar>
                      <div>
                        <Text strong style={{ display: 'block' }}>{story.author?.username}</Text>
                        <Text type="secondary" style={{ textTransform: 'capitalize' }}>
                          {story.author?.level} level • {story.author?.points || 0} points
                        </Text>
                      </div>
                    </Space>
                  </Col>
                  <Col>
                    <Space size="large">
                      <Button
                        type={isLiked ? 'primary' : 'default'}
                        icon={isLiked ? <HeartFilled /> : <HeartOutlined />}
                        loading={likingStory}
                        onClick={handleLike}
                        style={{
                          background: isLiked ? 'linear-gradient(135deg, #ff4d4f 0%, #ff7875 100%)' : undefined,
                          border: isLiked ? 'none' : undefined
                        }}
                      >
                        {story.likesCount}
                      </Button>
                      <Space>
                        <MessageOutlined />
                        <Text>{story.commentsCount}</Text>
                      </Space>
                      <Space>
                        <EyeOutlined />
                        <Text>{story.viewsCount}</Text>
                      </Space>
                    </Space>
                  </Col>
                </Row>

                {/* Translation Controls */}
                <div style={{ 
                  background: 'linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)', 
                  padding: '16px', 
                  borderRadius: '12px',
                  border: '1px solid #bae6fd'
                }}>
                  <Row justify="space-between" align="middle">
                    <Col>
                      <Space>
                        <TranslationOutlined style={{ color: '#0ea5e9' }} />
                        <Text strong style={{ color: '#0c4a6e' }}>Language Tools</Text>
                        {translatingContent && <Spin size="small" />}
                      </Space>
                    </Col>
                    <Col>
                      <Space wrap>
                        <Select
                          value={selectedLanguage}
                          onChange={handleLanguageChange}
                          style={{ width: 150 }}
                          size="small"
                        >
                          {getSupportedLanguages().map(lang => (
                            <Select.Option key={lang.code} value={lang.code}>
                              {lang.flag} {lang.name}
                            </Select.Option>
                          ))}
                        </Select>
                        <Button
                          type={showTranslation ? "primary" : "default"}
                          size="small"
                          loading={translatingContent}
                          onClick={handleToggleTranslation}
                          icon={<TranslationOutlined />}
                          style={{
                            background: showTranslation ? 'linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%)' : undefined,
                            border: showTranslation ? 'none' : undefined
                          }}
                        >
                          {showTranslation ? 'Show Original' : 'Translate'}
                        </Button>
                        <Button
                          type={isReadingStory ? "primary" : "default"}
                          size="small"
                          onClick={handleReadStory}
                          icon={<SoundOutlined />}
                          loading={isReadingStory}
                          style={{
                            background: isReadingStory ? 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)' : undefined,
                            border: isReadingStory ? 'none' : undefined
                          }}
                        >
                          {isReadingStory ? 'Stop Reading' : 'Read Story'}
                        </Button>
                      </Space>
                    </Col>
                  </Row>
                </div>
              </Space>
            </Card>
            
            {/* Story Content */}
            <Card variant="borderless" style={{ borderRadius: 16, boxShadow: '0 4px 24px rgba(0,0,0,0.08)', marginBottom: 32 }}>
              {/* Title Display */}
              <Title level={3} style={{ marginBottom: 24, color: '#1f2937' }}>
                {showTranslation && translatedTitle ? translatedTitle : story.title}
                {showTranslation && (
                  <Text type="secondary" style={{ fontSize: '14px', fontWeight: 'normal', marginLeft: '8px' }}>
                    (translated to {getSupportedLanguages().find(l => l.code === selectedLanguage)?.name})
                  </Text>
                )}
              </Title>
              
              <div 
                style={{ 
                  fontSize: '16px', 
                  lineHeight: '1.75',
                  whiteSpace: 'pre-wrap',
                  color: '#595959'
                }}
              >
                {showTranslation && translatedContent ? translatedContent : story.content}
              </div>
              
              {showTranslation && (
                <div style={{ 
                  marginTop: '24px', 
                  padding: '12px', 
                  background: '#f0f9ff', 
                  borderRadius: '8px',
                  borderLeft: '4px solid #0ea5e9'
                }}>
                  <Text type="secondary" style={{ fontSize: '12px' }}>
                    💡 This content has been automatically translated. 
                    <Button type="link" size="small" onClick={() => setShowTranslation(false)} style={{ padding: 0, marginLeft: 4 }}>
                      View original
                    </Button>
                  </Text>
                </div>
              )}
            </Card>

            {/* Like Button */}
            {isAuthenticated && (
              <Card variant="borderless" style={{ borderRadius: 16, boxShadow: '0 4px 24px rgba(0,0,0,0.08)', marginBottom: 32 }}>
                <div style={{ textAlign: 'center' }}>
                  <Button
                    type={isLiked ? 'primary' : 'default'}
                    size="large"
                    icon={isLiked ? <HeartFilled /> : <HeartOutlined />}
                    loading={likingStory}
                    onClick={handleLike}
                    style={{
                      background: isLiked ? 'linear-gradient(135deg, #ff4d4f 0%, #ff7875 100%)' : undefined,
                      border: isLiked ? 'none' : undefined,
                      minWidth: 120
                    }}
                  >
                    {isLiked ? 'Unlike' : 'Like'} ({story.likesCount})
                  </Button>
                </div>
              </Card>
            )}
          </Col>
          
          <Col xs={24} lg={8}>
            {/* Sidebar */}
            <Card variant="borderless" style={{ borderRadius: 16, boxShadow: '0 4px 24px rgba(0,0,0,0.08)' }}>
              <Space direction="vertical" size="large" style={{ width: '100%' }}>
                <div>
                  <Title level={4}>Story Stats</Title>
                  <Space direction="vertical" style={{ width: '100%' }}>
                    <Row justify="space-between">
                      <Col><Text>Views</Text></Col>
                      <Col><Text strong>{story.viewsCount}</Text></Col>
                    </Row>
                    <Row justify="space-between">
                      <Col><Text>Likes</Text></Col>
                      <Col><Text strong>{story.likesCount}</Text></Col>
                    </Row>
                    <Row justify="space-between">
                      <Col><Text>Comments</Text></Col>
                      <Col><Text strong>{story.commentsCount}</Text></Col>
                    </Row>
                  </Space>
                </div>

                {story.tags && story.tags.length > 0 && (
                  <div>
                    <Title level={4}>Tags</Title>
                    <Space size={[8, 8]} wrap>
                      {story.tags.map((tag, index) => (
                        <Tag key={index} color="blue">#{tag}</Tag>
                      ))}
                    </Space>
                  </div>
                )}

                <div>
                  <Title level={4}>Actions</Title>
                  <Space direction="vertical" style={{ width: '100%' }}>
                    <Button block onClick={() => navigate('/stories')} icon={<ArrowLeftOutlined />}>
                      Back to Stories
                    </Button>
                  </Space>
                </div>
              </Space>
            </Card>
          </Col>
        </Row>

        {/* Comments Section */}
        <Card 
          variant="borderless"
          style={{ borderRadius: 16, boxShadow: '0 4px 24px rgba(0,0,0,0.08)', marginTop: 32 }}
          title={<Title level={3}>Comments ({comments.length})</Title>}
        >
          {isAuthenticated && (
            <div style={{ marginBottom: 24 }}>
              <form onSubmit={handleSubmitComment}>
                <Space.Compact style={{ width: '100%' }}>
                  <TextArea
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Write a comment..."
                    rows={3}
                    style={{ flex: 1 }}
                  />
                </Space.Compact>
                <div style={{ marginTop: 16, textAlign: 'right' }}>
                  <Button 
                    type="primary" 
                    htmlType="submit"
                    loading={submittingComment}
                    disabled={!newComment.trim()}
                    icon={<SendOutlined />}
                  >
                    Post Comment
                  </Button>
                </div>
              </form>
            </div>
          )}

          <Space direction="vertical" size="middle" style={{ width: '100%' }}>
            {comments.map((comment) => (
              <CommentItem
                key={comment._id}
                comment={comment}
                currentUserId={user?._id}
                onLike={() => handleLikeComment(comment._id)}
                onEdit={(newContent) => handleEditComment(comment._id, newContent)}
                onDelete={() => handleDeleteComment(comment._id)}
              />
            ))}
          </Space>

          {comments.length === 0 && (
            <div style={{ textAlign: 'center', padding: '48px 0' }}>
              <Text type="secondary" style={{ fontSize: 16 }}>
                No comments yet. Be the first to comment!
              </Text>
            </div>
          )}
        </Card>
      </div>
      
      <NotificationContainer />
    </div>
  );
};

export default StoryDetail;
