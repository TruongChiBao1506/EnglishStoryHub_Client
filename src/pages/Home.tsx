import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Story } from '../types';
import { storyService } from '../services/storyService';
import StoryCard from '../components/StoryCard';
import PointsDisplay from '../components/PointsDisplay';
import MiniLeaderboard from '../components/MiniLeaderboard';
import { useAuth } from '../contexts/AuthContext';
import { Row, Col, Card, Button, Typography, Space, Spin, Divider } from 'antd';
import { BookOutlined, EditOutlined, TeamOutlined, ArrowRightOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

const Home: React.FC = () => {
  const [featuredStories, setFeaturedStories] = useState<Story[]>([]);
  const [recentStories, setRecentStories] = useState<Story[]>([]);
  const [loading, setLoading] = useState(true);
  const { isAuthenticated, user } = useAuth();

  useEffect(() => {
    document.title = 'Home - English Story Hub';
    return () => {
      document.title = 'English Story Hub';
    };
  }, []);

  useEffect(() => {
    const fetchStories = async () => {
      try {
        const [featuredResponse, recentResponse] = await Promise.all([
          storyService.getFeaturedStories(),
          storyService.getStories({ limit: 6 })
        ]);
        
        // Handle featured stories
        if (featuredResponse.success) {
          setFeaturedStories(featuredResponse.stories || []);
        }
        
        // Handle recent stories
        if (recentResponse.success) {
          setRecentStories(recentResponse.stories || []);
        }
      } catch (error) {
        console.error('Error fetching stories:', error);
        if (error instanceof Error) {
          console.error('Error message:', error.message);
        }
        if (error && typeof error === 'object' && 'response' in error) {
          console.error('Response error:', (error as any).response);
        }
        setFeaturedStories([]);
        setRecentStories([]);
      } finally {
        setLoading(false);
      }
    };

    fetchStories();
  }, []);

  const handleStoryClick = (story: Story) => {
    // Navigate to story detail page
    window.location.href = `/stories/${story._id}`;
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
        <div style={{ textAlign: 'center' }}>
          <Spin size="large" />
          <Text style={{ display: 'block', marginTop: 16, color: '#666' }}>Loading stories...</Text>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #f0f5ff 0%, #fffbe6 100%)' }}>
      {/* Hero Section */}
      <Card 
        bordered={false}
        style={{ 
          background: 'linear-gradient(135deg, #1890ff 0%, #722ed1 100%)', 
          color: 'white',
          borderRadius: 0,
          minHeight: 500
        }}
        bodyStyle={{ padding: '80px 24px' }}
      >
        <div style={{ maxWidth: 1200, margin: '0 auto', textAlign: 'center' }}>
          <Title level={1} style={{ color: 'white', fontSize: '4rem', marginBottom: 24, fontWeight: 700 }}>
            Learn English Through Stories
          </Title>
          <Text style={{ 
            color: 'rgba(255,255,255,0.95)', 
            fontSize: '1.3rem', 
            display: 'block', 
            marginBottom: 48,
            maxWidth: 600,
            margin: '0 auto 48px',
            lineHeight: 1.6
          }}>
            Join our vibrant community of learners and master English through engaging stories, 
            creative writing, and meaningful connections.
          </Text>
          
          {isAuthenticated ? (
            <Space direction="vertical" size="large" style={{ width: '100%' }}>
              <Card 
                style={{ 
                  background: 'rgba(255,255,255,0.15)', 
                  backdropFilter: 'blur(20px)', 
                  border: '1px solid rgba(255,255,255,0.2)',
                  borderRadius: 16,
                  maxWidth: 500,
                  margin: '0 auto'
                }}
                bodyStyle={{ padding: 32 }}
              >
                <Space direction="vertical" align="center">
                  <Title level={3} style={{ color: 'white', margin: 0 }}>
                    Welcome back, {user?.username}!
                  </Title>
                  <Text style={{ color: 'rgba(255,255,255,0.85)', fontSize: '1.1rem', textTransform: 'capitalize' }}>
                    {user?.level} Level • {user?.points || 0} Points
                  </Text>
                </Space>
              </Card>
              <Space size="large">
                <Button 
                  type="primary" 
                  size="large" 
                  style={{ 
                    height: 50,
                    paddingLeft: 32,
                    paddingRight: 32,
                    background: 'white', 
                    color: '#1890ff', 
                    border: 'none',
                    fontWeight: 600,
                    borderRadius: 25
                  }}
                >
                  <Link to="/stories" style={{ color: '#1890ff' }}>Explore Stories</Link>
                </Button>
                <Button 
                  size="large" 
                  style={{ 
                    height: 50,
                    paddingLeft: 32,
                    paddingRight: 32,
                    background: 'transparent', 
                    color: 'white', 
                    borderColor: 'rgba(255,255,255,0.5)',
                    fontWeight: 600,
                    borderRadius: 25
                  }}
                >
                  <Link to="/create-story" style={{ color: 'white' }}>Create Story</Link>
                </Button>
              </Space>
            </Space>
          ) : (
            <Space size="large">
              <Button 
                type="primary" 
                size="large" 
                style={{ 
                  height: 50,
                  paddingLeft: 32,
                  paddingRight: 32,
                  background: 'white', 
                  color: '#1890ff', 
                  border: 'none',
                  fontWeight: 600,
                  borderRadius: 25
                }}
              >
                <Link to="/register" style={{ color: '#1890ff' }}>Get Started Free</Link>
              </Button>
              <Button 
                size="large" 
                style={{ 
                  height: 50,
                  paddingLeft: 32,
                  paddingRight: 32,
                  background: 'transparent', 
                  color: 'white', 
                  borderColor: 'rgba(255,255,255,0.5)',
                  fontWeight: 600,
                  borderRadius: 25
                }}
              >
                <Link to="/login" style={{ color: 'white' }}>Sign In</Link>
              </Button>
            </Space>
          )}
        </div>
      </Card>

      {/* Main Content Container */}
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '80px 24px' }}>
        
        {/* Featured Stories Section */}
        {featuredStories.length > 0 && (
          <div style={{ marginBottom: 80 }}>
            <div style={{ 
              textAlign: 'center', 
              marginBottom: 48 
            }}>
              <Title level={2} style={{ 
                fontSize: '2.5rem', 
                marginBottom: 16,
                background: 'linear-gradient(135deg, #1890ff 0%, #722ed1 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text'
              }}>
                ⭐ Featured Stories
              </Title>
              <Text type="secondary" style={{ fontSize: '1.1rem' }}>
                Discover the most popular and engaging stories in our community
              </Text>
            </div>
            <Row gutter={[32, 32]} justify="center">
              {featuredStories.slice(0, 6).map((story) => (
                <Col xs={24} sm={12} lg={8} key={story._id}>
                  <div style={{ 
                    transform: 'translateY(0)', 
                    transition: 'transform 0.3s ease',
                    cursor: 'pointer'
                  }}>
                    <StoryCard
                      story={story}
                      onStoryClick={handleStoryClick}
                    />
                  </div>
                </Col>
              ))}
            </Row>
            <div style={{ textAlign: 'center', marginTop: 48 }}>
              <Button 
                type="link" 
                size="large"
                style={{ fontSize: '1.1rem', fontWeight: 600 }}
                icon={<ArrowRightOutlined />} 
                iconPosition="end"
              >
                <Link to="/stories">View All Featured Stories</Link>
              </Button>
            </div>
          </div>
        )}

        {/* Recent Stories & Sidebar Layout */}
        <Row gutter={[48, 48]}>
          {/* Recent Stories - Main Content */}
          <Col xs={24} lg={18}>
            <div style={{ marginBottom: 48 }}>
              <Title level={2} style={{ 
                fontSize: '2.2rem', 
                marginBottom: 16,
                color: '#1f1f1f'
              }}>
                📚 Recent Stories
              </Title>
              <Text type="secondary" style={{ fontSize: '1.1rem', display: 'block', marginBottom: 32 }}>
                Fresh content from our talented community writers
              </Text>
            </div>
            
            <Row gutter={[24, 32]}>
              {recentStories.slice(0, 6).map((story) => (
                <Col xs={24} md={12} key={story._id}>
                  <div style={{ 
                    transform: 'translateY(0)', 
                    transition: 'all 0.3s ease',
                    cursor: 'pointer'
                  }}>
                    <StoryCard
                      story={story}
                      onStoryClick={handleStoryClick}
                    />
                  </div>
                </Col>
              ))}
            </Row>
            
            <div style={{ textAlign: 'center', marginTop: 48 }}>
              <Button 
                type="primary"
                size="large"
                style={{ 
                  height: 48,
                  paddingLeft: 32,
                  paddingRight: 32,
                  borderRadius: 24,
                  fontWeight: 600
                }}
                icon={<ArrowRightOutlined />} 
                iconPosition="end"
              >
                <Link to="/stories" style={{ color: 'white' }}>Explore All Stories</Link>
              </Button>
            </div>

            {/* Your Progress Section - Moved under Recent Stories */}
            {isAuthenticated && (
              <div style={{ marginTop: 64 }}>
                <Title level={3} style={{ 
                  fontSize: '1.8rem', 
                  marginBottom: 32,
                  color: '#1f1f1f'
                }}>
                  🎯 Your Learning Progress
                </Title>
                <Card
                  bordered={false}
                  style={{ 
                    borderRadius: 16, 
                    boxShadow: '0 8px 32px rgba(24,144,255,0.12)',
                    background: 'linear-gradient(135deg, #f0f9ff 0%, #e6f7ff 100%)'
                  }}
                >
                  <PointsDisplay />
                </Card>
              </div>
            )}
          </Col>

          {/* Compact Sidebar */}
          <Col xs={24} lg={6}>
            <div style={{ position: 'sticky', top: 32 }}>
              <Space direction="vertical" size={32} style={{ width: '100%' }}>
                {/* Leaderboard Card */}
                <Card
                  bordered={false}
                  style={{ 
                    borderRadius: 16, 
                    boxShadow: '0 8px 32px rgba(114,46,209,0.12)',
                    background: 'linear-gradient(135deg, #f9f0ff 0%, #efdbff 100%)'
                  }}
                  title={
                    <Title level={4} style={{ margin: 0, color: '#722ed1' }}>
                      � Top Writers
                    </Title>
                  }
                >
                  <MiniLeaderboard />
                </Card>

                {/* Quick Action Card */}
                {isAuthenticated ? (
                  <Card
                    bordered={false}
                    style={{ 
                      borderRadius: 16, 
                      boxShadow: '0 8px 32px rgba(82,196,26,0.12)',
                      background: 'linear-gradient(135deg, #f6ffed 0%, #d9f7be 100%)',
                      textAlign: 'center'
                    }}
                  >
                    <Title level={4} style={{ color: '#52c41a', marginBottom: 16 }}>
                      ✍️ Ready to Write?
                    </Title>
                    <Text type="secondary" style={{ display: 'block', marginBottom: 24 }}>
                      Share your story with the community
                    </Text>
                    <Button 
                      type="primary"
                      size="large"
                      style={{ 
                        background: '#52c41a',
                        borderColor: '#52c41a',
                        borderRadius: 20,
                        fontWeight: 600
                      }}
                    >
                      <Link to="/create-story" style={{ color: 'white' }}>Start Writing</Link>
                    </Button>
                  </Card>
                ) : (
                  <Card
                    bordered={false}
                    style={{ 
                      borderRadius: 16, 
                      boxShadow: '0 8px 32px rgba(24,144,255,0.12)',
                      background: 'linear-gradient(135deg, #f0f9ff 0%, #e6f7ff 100%)',
                      textAlign: 'center'
                    }}
                  >
                    <Title level={4} style={{ color: '#1890ff', marginBottom: 16 }}>
                      🚀 Join Us Today!
                    </Title>
                    <Text type="secondary" style={{ display: 'block', marginBottom: 24 }}>
                      Start your English learning journey
                    </Text>
                    <Button 
                      type="primary"
                      size="large"
                      style={{ 
                        background: '#1890ff',
                        borderColor: '#1890ff',
                        borderRadius: 20,
                        fontWeight: 600
                      }}
                    >
                      <Link to="/register" style={{ color: 'white' }}>Get Started</Link>
                    </Button>
                  </Card>
                )}
              </Space>
            </div>
          </Col>
        </Row>
      </div>

      {/* Enhanced Features Section */}
      <div style={{ 
        background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
        padding: '100px 24px',
        borderTop: '1px solid #e8f4f8'
      }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 64 }}>
            <Title level={2} style={{ 
              fontSize: '2.8rem', 
              marginBottom: 24,
              background: 'linear-gradient(135deg, #1890ff 0%, #722ed1 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}>
              Why Choose English Story Hub?
            </Title>
            <Text type="secondary" style={{ 
              fontSize: '1.2rem', 
              maxWidth: 600, 
              margin: '0 auto',
              display: 'block',
              lineHeight: 1.6
            }}>
              Discover a revolutionary way to learn English through immersive storytelling 
              and community-driven learning experiences.
            </Text>
          </div>
          
          <Row gutter={[40, 40]} justify="center">
            <Col xs={24} md={8}>
              <Card 
                bordered={false}
                hoverable
                style={{ 
                  textAlign: 'center', 
                  height: '100%',
                  borderRadius: 20,
                  boxShadow: '0 12px 48px rgba(24,144,255,0.08)',
                  transition: 'all 0.3s ease',
                  background: 'linear-gradient(135deg, #f0f9ff 0%, #e6f7ff 100%)'
                }}
                bodyStyle={{ padding: 40 }}
              >
                <div style={{ 
                  width: 80, 
                  height: 80, 
                  background: 'linear-gradient(135deg, #1890ff 0%, #40a9ff 100%)', 
                  borderRadius: '50%', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center', 
                  margin: '0 auto 24px',
                  fontSize: '36px',
                  color: 'white',
                  boxShadow: '0 8px 24px rgba(24,144,255,0.3)'
                }}>
                  <BookOutlined />
                </div>
                <Title level={3} style={{ marginBottom: 16, color: '#1890ff' }}>
                  Learn by Reading
                </Title>
                <Text type="secondary" style={{ fontSize: '1rem', lineHeight: 1.6 }}>
                  Immerse yourself in carefully crafted stories designed to improve your vocabulary, 
                  comprehension, and language intuition at your own pace.
                </Text>
              </Card>
            </Col>
            
            <Col xs={24} md={8}>
              <Card 
                bordered={false}
                hoverable
                style={{ 
                  textAlign: 'center', 
                  height: '100%',
                  borderRadius: 20,
                  boxShadow: '0 12px 48px rgba(82,196,26,0.08)',
                  transition: 'all 0.3s ease',
                  background: 'linear-gradient(135deg, #f6ffed 0%, #d9f7be 100%)'
                }}
                bodyStyle={{ padding: 40 }}
              >
                <div style={{ 
                  width: 80, 
                  height: 80, 
                  background: 'linear-gradient(135deg, #52c41a 0%, #73d13d 100%)', 
                  borderRadius: '50%', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center', 
                  margin: '0 auto 24px',
                  fontSize: '36px',
                  color: 'white',
                  boxShadow: '0 8px 24px rgba(82,196,26,0.3)'
                }}>
                  <EditOutlined />
                </div>
                <Title level={3} style={{ marginBottom: 16, color: '#52c41a' }}>
                  Practice Writing
                </Title>
                <Text type="secondary" style={{ fontSize: '1rem', lineHeight: 1.6 }}>
                  Express your creativity through storytelling while receiving constructive feedback 
                  from our supportive community of learners and native speakers.
                </Text>
              </Card>
            </Col>
            
            <Col xs={24} md={8}>
              <Card 
                bordered={false}
                hoverable
                style={{ 
                  textAlign: 'center', 
                  height: '100%',
                  borderRadius: 20,
                  boxShadow: '0 12px 48px rgba(114,46,209,0.08)',
                  transition: 'all 0.3s ease',
                  background: 'linear-gradient(135deg, #f9f0ff 0%, #efdbff 100%)'
                }}
                bodyStyle={{ padding: 40 }}
              >
                <div style={{ 
                  width: 80, 
                  height: 80, 
                  background: 'linear-gradient(135deg, #722ed1 0%, #9254de 100%)', 
                  borderRadius: '50%', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center', 
                  margin: '0 auto 24px',
                  fontSize: '36px',
                  color: 'white',
                  boxShadow: '0 8px 24px rgba(114,46,209,0.3)'
                }}>
                  <TeamOutlined />
                </div>
                <Title level={3} style={{ marginBottom: 16, color: '#722ed1' }}>
                  Join Community
                </Title>
                <Text type="secondary" style={{ fontSize: '1rem', lineHeight: 1.6 }}>
                  Connect with passionate learners worldwide, participate in discussions, 
                  and accelerate your progress through collaborative learning.
                </Text>
              </Card>
            </Col>
          </Row>
          
          {/* Call to Action */}
          <div style={{ textAlign: 'center', marginTop: 80 }}>
            <Title level={3} style={{ marginBottom: 24, color: '#1f1f1f' }}>
              Ready to Start Your English Journey?
            </Title>
            <Space size="large">
              <Button 
                type="primary" 
                size="large"
                style={{ 
                  height: 56,
                  paddingLeft: 40,
                  paddingRight: 40,
                  borderRadius: 28,
                  fontSize: '1.1rem',
                  fontWeight: 600,
                  background: 'linear-gradient(135deg, #1890ff 0%, #722ed1 100%)',
                  border: 'none',
                  boxShadow: '0 8px 24px rgba(24,144,255,0.3)'
                }}
              >
                <Link to="/register" style={{ color: 'white' }}>Join Free Today</Link>
              </Button>
              <Button 
                size="large"
                style={{ 
                  height: 56,
                  paddingLeft: 40,
                  paddingRight: 40,
                  borderRadius: 28,
                  fontSize: '1.1rem',
                  fontWeight: 600,
                  borderColor: '#d9d9d9',
                  color: '#595959'
                }}
              >
                <Link to="/stories" style={{ color: '#595959' }}>Browse Stories</Link>
              </Button>
            </Space>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
