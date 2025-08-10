import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { storyService } from '../services/storyService';
import AIWritingAssistant from '../components/AIWritingAssistant';
import StoryPrompts from '../components/StoryPrompts';
import { useAuth } from '../contexts/AuthContext';
import { useNotifications } from '../components/Notification';
import { Card, Form, Input, Button, Select, Typography, Space, Tag, Alert, Row, Col, Statistic } from 'antd';
import { FileTextOutlined, TagsOutlined, ClockCircleOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;
const { TextArea } = Input;
const { Option } = Select;

const CreateStory: React.FC = () => {
  const [form] = Form.useForm();
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    excerpt: '',
    difficulty: 'beginner' as 'beginner' | 'intermediate' | 'advanced',
    tags: [] as string[]
  });
  const [tagInput, setTagInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const navigate = useNavigate();
  const { user } = useAuth();
  const { showAchievement, showLevelUp, showPoints, NotificationContainer } = useNotifications();

  useEffect(() => {
    document.title = 'Create Story - English Story Hub';
    return () => {
      document.title = 'English Story Hub';
    };
  }, []);

  useEffect(() => {
    if (user?.level && ['beginner', 'intermediate', 'advanced'].includes(user.level)) {
      setFormData(prev => ({
        ...prev,
        difficulty: user.level as 'beginner' | 'intermediate' | 'advanced'
      }));
    }
  }, [user?.level]);

  const handlePromptSelect = (prompt: string) => {
    console.log('Prompt selected:', prompt);
    const newContent = formData.content + (formData.content ? '\n\n' : '') + prompt;
    console.log('New content:', newContent);
    
    // Update both local state and form field
    setFormData(prev => ({
      ...prev,
      content: newContent
    }));
    
    form.setFieldsValue({
      content: newContent
    });
    
    console.log('Form updated successfully');
  };

  const handleAddTag = () => {
    const tag = tagInput.trim().toLowerCase();
    if (tag && !formData.tags.includes(tag) && formData.tags.length < 10) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, tag]
      }));
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const wordCount = formData.content.trim().split(/\s+/).filter(word => word.length > 0).length;
  const estimatedReadTime = Math.max(1, Math.ceil(wordCount / 200));

  const handleFormSubmit = async (values: any) => {
    setError('');
    setLoading(true);

    try {
      const response = await storyService.createStory({
        ...formData,
        ...values
      });
      if (response.success) {
        console.log('Story created successfully:', response.data);
        
        // Show points earned notification
        showPoints(response.data.pointsEarned, 'Story created successfully!');
        
        // Show new achievements
        if (response.data.newAchievements.length > 0) {
          response.data.newAchievements.forEach(achievement => {
            showAchievement(achievement);
          });
        }
        
        // Show level up notification
        if (response.data.levelUp) {
          showLevelUp(response.data.levelUp);
        }
        
        // Navigate to story after a short delay to show notifications
        setTimeout(() => {
          navigate(`/stories/${response.data.story._id}`);
        }, 1000);
      } else {
        setError(response.message || 'Failed to create story');
      }
    } catch (error: any) {
      setError(error.response?.data?.message || 'Failed to create story');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #f0f5ff 0%, #fffbe6 100%)', padding: '32px 24px' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <Card 
          bordered={false}
          style={{ borderRadius: 16, boxShadow: '0 4px 24px rgba(0,0,0,0.08)' }}
          bodyStyle={{ padding: 40 }}
        >
          <Space direction="vertical" size="large" style={{ width: '100%' }}>
            <div style={{ textAlign: 'center' }}>
              <Title level={2} style={{ marginBottom: 8 }}>
                <FileTextOutlined style={{ marginRight: 12, color: '#1890ff' }} />
                Create New Story
              </Title>
              <Text type="secondary" style={{ fontSize: 16 }}>
                Share your creativity with the community
              </Text>
            </div>

            {error && (
              <Alert
                message={error}
                type="error"
                showIcon
                closable
                onClose={() => setError('')}
              />
            )}

            <Row gutter={32}>
              <Col xs={24} lg={16}>
                <Form
                  form={form}
                  layout="vertical"
                  onFinish={handleFormSubmit}
                  size="large"
                  initialValues={{
                    difficulty: formData.difficulty
                  }}
                >
                  <StoryPrompts
                    userLevel={user?.level || 'beginner'}
                    onPromptSelect={handlePromptSelect}
                  />

                  <Form.Item
                    name="title"
                    label="Story Title"
                    rules={[
                      { required: true, message: 'Please enter a title!' },
                      { min: 5, message: 'Title must be at least 5 characters!' },
                      { max: 100, message: 'Title cannot exceed 100 characters!' }
                    ]}
                  >
                    <Input
                      placeholder="Enter an engaging title for your story"
                      value={formData.title}
                      onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                      showCount
                      maxLength={100}
                    />
                  </Form.Item>

                  <Form.Item
                    name="excerpt"
                    label="Story Excerpt"
                    extra="This will be shown as a preview of your story"
                    rules={[
                      { required: true, message: 'Please enter an excerpt!' },
                      { min: 20, message: 'Excerpt must be at least 20 characters!' },
                      { max: 200, message: 'Excerpt cannot exceed 200 characters!' }
                    ]}
                  >
                    <TextArea
                      placeholder="Write a short summary or teaser for your story to attract readers..."
                      value={formData.excerpt}
                      onChange={(e) => setFormData(prev => ({ ...prev, excerpt: e.target.value }))}
                      showCount
                      maxLength={200}
                      rows={3}
                    />
                  </Form.Item>

                  <Form.Item
                    name="difficulty"
                    label="Difficulty Level"
                    rules={[{ required: true, message: 'Please select difficulty!' }]}
                  >
                    <Select
                      value={formData.difficulty}
                      onChange={(value) => setFormData(prev => ({ ...prev, difficulty: value }))}
                      placeholder="Select difficulty level"
                    >
                      <Option value="beginner">Beginner - Simple vocabulary and grammar</Option>
                      <Option value="intermediate">Intermediate - Moderate complexity</Option>
                      <Option value="advanced">Advanced - Complex language and concepts</Option>
                    </Select>
                  </Form.Item>

                  <Form.Item label="Tags (optional)" extra="Add up to 10 tags to help others discover your story">
                    <Space direction="vertical" style={{ width: '100%' }}>
                      <Space size={[0, 8]} wrap>
                        {formData.tags.map((tag) => (
                          <Tag
                            key={tag}
                            closable
                            onClose={() => handleRemoveTag(tag)}
                            color="blue"
                          >
                            <TagsOutlined style={{ marginRight: 4 }} />
                            {tag}
                          </Tag>
                        ))}
                      </Space>
                      <Input.Search
                        placeholder="Add a tag and press Enter"
                        value={tagInput}
                        onChange={(e) => setTagInput(e.target.value)}
                        onSearch={handleAddTag}
                        onPressEnter={handleAddTag}
                        enterButton="Add"
                        disabled={formData.tags.length >= 10}
                        maxLength={20}
                      />
                    </Space>
                  </Form.Item>

                  <AIWritingAssistant
                    content={formData.content}
                    onContentChange={(newContent) => setFormData(prev => ({ ...prev, content: newContent }))}
                  />

                  <Form.Item
                    name="content"
                    label="Story Content"
                    rules={[
                      { required: true, message: 'Please write your story!' },
                      { min: 50, message: 'Story must be at least 50 characters!' },
                      { max: 5000, message: 'Story cannot exceed 5000 characters!' }
                    ]}
                    extra={
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8 }}>
                        <Text type="secondary">{formData.content.length}/5000 characters</Text>
                        <Text type="secondary">{wordCount} words • ~{estimatedReadTime} min read</Text>
                      </div>
                    }
                  >
                    <TextArea
                      value={formData.content}
                      onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
                      placeholder="Write your story here... Make it engaging and educational for English learners!"
                      rows={15}
                      showCount
                      maxLength={5000}
                      style={{ fontFamily: 'monospace' }}
                    />
                  </Form.Item>

                  <Form.Item style={{ marginBottom: 0 }}>
                    <Space>
                      <Button size="large" onClick={() => navigate(-1)}>
                        Cancel
                      </Button>
                      <Button
                        type="primary"
                        htmlType="submit"
                        loading={loading}
                        size="large"
                        disabled={formData.title.length < 5 || formData.excerpt.length < 20 || formData.content.length < 50}
                        style={{
                          background: 'linear-gradient(135deg, #1890ff 0%, #722ed1 100%)',
                          border: 'none'
                        }}
                      >
                        {loading ? 'Publishing...' : 'Publish Story'}
                      </Button>
                    </Space>
                  </Form.Item>
                </Form>
              </Col>

              <Col xs={24} lg={8}>
                <Space direction="vertical" size="large" style={{ width: '100%' }}>
                  <Card title="Story Statistics" size="small">
                    <Row gutter={16}>
                      <Col span={12}>
                        <Statistic
                          title="Words"
                          value={wordCount}
                          prefix={<FileTextOutlined />}
                        />
                      </Col>
                      <Col span={12}>
                        <Statistic
                          title="Read Time"
                          value={estimatedReadTime}
                          suffix="min"
                          prefix={<ClockCircleOutlined />}
                        />
                      </Col>
                    </Row>
                  </Card>

                  <Card title="Writing Tips" size="small">
                    <Space direction="vertical" size="small">
                      <Text>• Keep sentences clear and simple</Text>
                      <Text>• Use descriptive language</Text>
                      <Text>• Include dialogue to make it engaging</Text>
                      <Text>• Check grammar and spelling</Text>
                    </Space>
                  </Card>
                </Space>
              </Col>
            </Row>
          </Space>
        </Card>
      </div>
      <NotificationContainer />
    </div>
  );
};

export default CreateStory;
