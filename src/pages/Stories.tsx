import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Story } from '../types';
import { storyService } from '../services/storyService';
import StoryCard from '../components/StoryCard';
import { Card, Row, Col, Input, Select, Typography, Space, Pagination, Spin, Empty } from 'antd';
import { SearchOutlined, FilterOutlined, BookOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;
const { Option } = Select;

const Stories: React.FC = () => {
  const [stories, setStories] = useState<Story[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filters, setFilters] = useState({
    difficulty: '',
    search: '',
    sortBy: 'newest'
  });
  
  const navigate = useNavigate();

  useEffect(() => {
    document.title = 'All Stories - English Story Hub';
    return () => {
      document.title = 'English Story Hub';
    };
  }, []);

  const fetchStories = useCallback(async () => {
    setLoading(true);
    try {
      const response = await storyService.getStories({
        page,
        limit: 12,
        difficulty: filters.difficulty || undefined,
        search: filters.search || undefined,
        sortBy: filters.sortBy
      });
      
      if (response.success) {
        setStories(response.stories || []);
        setTotalPages(response.pagination?.totalPages || 1);
      } else {
        console.error('API response indicates failure:', response);
        setStories([]);
      }
    } catch (error) {
      console.error('Error fetching stories:', error);
      if (error instanceof Error) {
        console.error('Error message:', error.message);
      }
      if (error && typeof error === 'object' && 'response' in error) {
        console.error('Response error:', (error as any).response);
      }
      setStories([]);
    } finally {
      setLoading(false);
    }
  }, [page, filters]);

  useEffect(() => {
    fetchStories();
  }, [fetchStories]);

  const handleFilterChange = (key: string, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setPage(1); // Reset to first page when filtering
  };

  const handleStoryClick = (story: Story) => {
    navigate(`/stories/${story._id}`);
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const renderPagination = () => {
    const pages = [];
    const maxVisiblePages = 5;
    const startPage = Math.max(1, page - Math.floor(maxVisiblePages / 2));
    const endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    if (page > 1) {
      pages.push(
        <button
          key="prev"
          onClick={() => handlePageChange(page - 1)}
          className="px-3 py-2 rounded-md bg-white border border-gray-300 text-gray-500 hover:bg-gray-50"
        >
          Previous
        </button>
      );
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <button
          key={i}
          onClick={() => handlePageChange(i)}
          className={`px-3 py-2 rounded-md ${
            i === page
              ? 'bg-blue-600 text-white'
              : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
          }`}
        >
          {i}
        </button>
      );
    }

    if (page < totalPages) {
      pages.push(
        <button
          key="next"
          onClick={() => handlePageChange(page + 1)}
          className="px-3 py-2 rounded-md bg-white border border-gray-300 text-gray-500 hover:bg-gray-50"
        >
          Next
        </button>
      );
    }

    return pages;
  };

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #f0f5ff 0%, #fffbe6 100%)', padding: '32px 24px' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        {/* Header */}
        <Card bordered={false} style={{ marginBottom: 32, borderRadius: 16, boxShadow: '0 4px 24px rgba(0,0,0,0.08)' }}>
          <Space direction="vertical" size="middle" style={{ width: '100%', textAlign: 'center' }}>
            <div>
              <BookOutlined style={{ fontSize: 48, color: '#1890ff', marginBottom: 16 }} />
              <Title level={2} style={{ marginBottom: 8 }}>All Stories</Title>
              <Text type="secondary" style={{ fontSize: 16 }}>
                Discover and read stories from our community of English learners.
              </Text>
            </div>
          </Space>
        </Card>

        {/* Filters */}
        <Card 
          bordered={false} 
          style={{ marginBottom: 32, borderRadius: 16, boxShadow: '0 4px 24px rgba(0,0,0,0.08)' }}
          title={
            <Space>
              <FilterOutlined />
              <span>Filter & Search</span>
            </Space>
          }
        >
          <Row gutter={24}>
            <Col xs={24} md={8}>
              <Input.Search
                placeholder="Search stories..."
                value={filters.search}
                onChange={(e) => handleFilterChange('search', e.target.value)}
                size="large"
                prefix={<SearchOutlined />}
                allowClear
              />
            </Col>
            <Col xs={24} md={8}>
              <Select
                placeholder="All Difficulty Levels"
                value={filters.difficulty || undefined}
                onChange={(value) => handleFilterChange('difficulty', value || '')}
                size="large"
                style={{ width: '100%' }}
                allowClear
              >
                <Option value="beginner">Beginner</Option>
                <Option value="intermediate">Intermediate</Option>
                <Option value="advanced">Advanced</Option>
              </Select>
            </Col>
            <Col xs={24} md={8}>
              <Select
                value={filters.sortBy}
                onChange={(value) => handleFilterChange('sortBy', value)}
                size="large"
                style={{ width: '100%' }}
              >
                <Option value="newest">Newest First</Option>
                <Option value="oldest">Oldest First</Option>
                <Option value="popular">Most Popular</Option>
                <Option value="likes">Most Liked</Option>
              </Select>
            </Col>
          </Row>
        </Card>

        {/* Stories Content */}
        {loading ? (
          <Card style={{ textAlign: 'center', padding: '80px 0', borderRadius: 16 }}>
            <Spin size="large" />
            <Text style={{ display: 'block', marginTop: 16, color: '#666' }}>Loading stories...</Text>
          </Card>
        ) : stories.length > 0 ? (
          <>
            <Row gutter={[24, 24]} style={{ marginBottom: 32 }}>
              {stories.map((story) => (
                <Col xs={24} sm={12} lg={8} key={story._id}>
                  <StoryCard
                    story={story}
                    onStoryClick={handleStoryClick}
                  />
                </Col>
              ))}
            </Row>

            {/* Pagination */}
            {totalPages > 1 && (
              <Card style={{ textAlign: 'center', borderRadius: 16 }}>
                <Pagination
                  current={page}
                  total={totalPages * 12}
                  pageSize={12}
                  onChange={handlePageChange}
                  showSizeChanger={false}
                  showQuickJumper
                  showTotal={(total, range) => `${range[0]}-${range[1]} of ${total} stories`}
                />
              </Card>
            )}
          </>
        ) : (
          <Card style={{ textAlign: 'center', padding: '80px 0', borderRadius: 16 }}>
            <Empty
              image={<BookOutlined style={{ fontSize: 64, color: '#d9d9d9' }} />}
              description={
                <Space direction="vertical">
                  <Title level={4} type="secondary">No stories found</Title>
                  <Text type="secondary">
                    Try adjusting your search criteria or be the first to create a story!
                  </Text>
                </Space>
              }
            />
          </Card>
        )}
      </div>
    </div>
  );
};

export default Stories;
