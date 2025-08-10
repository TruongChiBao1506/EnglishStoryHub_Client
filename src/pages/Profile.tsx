import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import statsService from '../services/statsService';
import { UserStats, LeaderboardUser } from '../types';
import Achievement from '../components/Achievement';
import LevelBadge from '../components/LevelBadge';
import { 
  Card, 
  Row, 
  Col, 
  Avatar, 
  Typography, 
  Tabs, 
  Spin, 
  Space,
  Progress,
  Badge,
  Statistic,
  Alert
} from 'antd';
import { 
  TrophyOutlined, 
  BarChartOutlined, 
  CrownOutlined,
  BookOutlined,
  HeartOutlined,
  EyeOutlined,
  MessageOutlined,
  StarOutlined,
  UserOutlined
} from '@ant-design/icons';

const { Title, Text } = Typography;

const Profile: React.FC = () => {
  const { user } = useAuth();
  const [userStats, setUserStats] = useState<UserStats | null>(null);
  const [leaderboard, setLeaderboard] = useState<LeaderboardUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'stats' | 'achievements' | 'leaderboard'>('stats');

  useEffect(() => {
    document.title = 'Profile - English Story Hub';
    return () => {
      document.title = 'English Story Hub';
    };
  }, []);

  useEffect(() => {
    if (user) {
      loadUserStats();
      loadLeaderboard();
    }
  }, [user]);

  const loadUserStats = async () => {
    try {
      const stats = await statsService.getUserStats();
      setUserStats(stats);
    } catch (error) {
      console.error('Error loading user stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadLeaderboard = async () => {
    try {
      const data = await statsService.getLeaderboard();
      setLeaderboard(data.leaderboard);
    } catch (error) {
      console.error('Error loading leaderboard:', error);
    }
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
          <Text style={{ display: 'block', marginTop: 16, color: '#666' }}>Loading your profile...</Text>
        </div>
      </div>
    );
  }

  if (!userStats) {
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
            message="Profile Error"
            description="Unable to load profile data"
            type="error"
            showIcon
          />
        </Card>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #f0f5ff 0%, #fffbe6 100%)', padding: '32px 24px' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        {/* Profile Header */}
        <Card 
          bordered={false}
          style={{ 
            borderRadius: 16, 
            boxShadow: '0 4px 24px rgba(0,0,0,0.08)', 
            marginBottom: 32,
            overflow: 'hidden'
          }}
        >
          <div style={{ position: 'relative' }}>
            <Row align="middle" gutter={32}>
              <Col>
                <Space size="large">
                  <Badge 
                    dot 
                    color="green" 
                    style={{ 
                      position: 'absolute', 
                      top: 0, 
                      right: 0, 
                      zIndex: 1 
                    }}
                  >
                    <Avatar 
                      size={80} 
                      icon={<UserOutlined />}
                      style={{ 
                        background: 'linear-gradient(135deg, #1890ff 0%, #722ed1 100%)',
                        fontSize: '32px'
                      }}
                    >
                      {userStats.user.username.charAt(0).toUpperCase()}
                    </Avatar>
                  </Badge>
                  <div>
                    <Title level={2} style={{ marginBottom: 8 }}>
                      {userStats.user.username}
                    </Title>
                    <Text type="secondary" style={{ display: 'block', marginBottom: 8 }}>
                      {userStats.user.bio || 'Passionate storyteller sharing creative tales'}
                    </Text>
                    <Space size="middle">
                      <Badge 
                        count={<><CrownOutlined style={{ marginRight: 4 }} />Rank #{userStats.rank}</>}
                        style={{ 
                          background: 'linear-gradient(135deg, #faad14 0%, #fa541c 100%)',
                          color: 'white',
                          fontWeight: 'bold'
                        }}
                      />
                      <Badge 
                        count={<><StarOutlined style={{ marginRight: 4 }} />{userStats.user.points} points</>}
                        style={{ 
                          background: 'linear-gradient(135deg, #1890ff 0%, #722ed1 100%)',
                          color: 'white',
                          fontWeight: 'bold'
                        }}
                      />
                    </Space>
                  </div>
                </Space>
              </Col>
              <Col flex="auto">
                <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                  <LevelBadge levelInfo={userStats.levelInfo} showProgress={true} size="large" />
                </div>
              </Col>
            </Row>
          </div>
        </Card>

        {/* Tabs Section */}
        <Card bordered={false} style={{ borderRadius: 16, boxShadow: '0 4px 24px rgba(0,0,0,0.08)' }}>
          <Tabs 
            activeKey={activeTab} 
            onChange={(key) => setActiveTab(key as any)}
            size="large"
            type="card"
            items={[
              {
                key: 'stats',
                label: (
                  <Space>
                    <BarChartOutlined />
                    Statistics
                  </Space>
                ),
                children: (
                  <Row gutter={[24, 24]}>
                    {[
                      {
                        title: 'Stories Published',
                        value: userStats.stats.storiesPublished,
                        icon: <BookOutlined />,
                        color: '#52c41a'
                      },
                      {
                        title: 'Total Likes',
                        value: userStats.stats.totalLikes,
                        icon: <HeartOutlined />,
                        color: '#f5222d'
                      },
                      {
                        title: 'Total Views',
                        value: userStats.stats.totalViews,
                        icon: <EyeOutlined />,
                        color: '#1890ff'
                      },
                      {
                        title: 'Comments Posted',
                        value: userStats.stats.commentsPosted || 0,
                        icon: <MessageOutlined />,
                        color: '#722ed1'
                      }
                    ].map((stat, index) => (
                      <Col xs={24} sm={12} lg={6} key={index}>
                        <Card 
                          bordered={false} 
                          style={{ 
                            textAlign: 'center',
                            background: `${stat.color}08`,
                            border: `1px solid ${stat.color}30`
                          }}
                        >
                          <Statistic
                            title={stat.title}
                            value={stat.value}
                            prefix={stat.icon}
                            valueStyle={{ color: stat.color, fontSize: '24px' }}
                          />
                          <Progress 
                            percent={Math.min((stat.value / Math.max(...[userStats.stats.storiesPublished, userStats.stats.totalLikes, userStats.stats.totalViews, userStats.stats.commentsPosted || 0])) * 100, 100)}
                            strokeColor={stat.color}
                            showInfo={false}
                            size="small"
                            style={{ marginTop: 16 }}
                          />
                        </Card>
                      </Col>
                    ))}
                  </Row>
                )
              },
              {
                key: 'achievements',
                label: (
                  <Space>
                    <TrophyOutlined />
                    Achievements
                  </Space>
                ),
                children: (
                  <div>
                    <div style={{ textAlign: 'center', marginBottom: 32 }}>
                      <Title level={3}>Your Achievements</Title>
                      <Text type="secondary">Celebrate your milestones and accomplishments</Text>
                      {userStats.achievements && (
                        <div style={{ marginTop: 16 }}>
                          <Space size="large">
                            <Badge 
                              count={<><TrophyOutlined style={{ marginRight: 4 }} />{userStats.achievements.totalAchievements} achievements</>}
                              style={{ 
                                background: 'linear-gradient(135deg, #faad14 0%, #fa541c 100%)',
                                color: 'white',
                                fontWeight: 'bold'
                              }}
                            />
                            <Text type="secondary">
                              {userStats.achievements.totalPointsFromAchievements} bonus points earned
                            </Text>
                          </Space>
                        </div>
                      )}
                    </div>

                    {userStats.achievements?.achievements.length ? (
                      <Row gutter={[24, 24]}>
                        {userStats.achievements.achievements.map((achievement) => (
                          <Col xs={24} md={12} key={achievement._id}>
                            <div style={{ transform: 'scale(1)', transition: 'transform 0.3s' }}>
                              <Achievement 
                                achievement={achievement}
                                size="large"
                              />
                            </div>
                          </Col>
                        ))}
                      </Row>
                    ) : (
                      <div style={{ textAlign: 'center', padding: '64px 0' }}>
                        <div style={{ 
                          width: 120, 
                          height: 120, 
                          margin: '0 auto 24px',
                          background: 'linear-gradient(135deg, #faad14 0%, #fa541c 100%)',
                          borderRadius: '50%',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '48px'
                        }}>
                          🏆
                        </div>
                        <Title level={3}>No achievements yet</Title>
                        <Text type="secondary" style={{ display: 'block', marginBottom: 32 }}>
                          Start creating stories and engaging with the community to unlock your first achievements!
                        </Text>
                        <Row gutter={[16, 16]} justify="center">
                          {[
                            { icon: '🎯', title: 'First Steps', desc: 'Publish your first story' },
                            { icon: '📚', title: 'Storyteller', desc: 'Publish 5 stories' },
                            { icon: '⭐', title: 'Popular Writer', desc: 'Get 25 total likes' },
                            { icon: '💬', title: 'Social Butterfly', desc: 'Make 20 comments' }
                          ].map((hint, index) => (
                            <Col xs={12} md={6} key={index}>
                              <Card 
                                bordered={false}
                                style={{ 
                                  textAlign: 'center',
                                  background: '#fafafa',
                                  height: '100%'
                                }}
                              >
                                <div style={{ fontSize: '24px', marginBottom: 8 }}>{hint.icon}</div>
                                <Title level={5} style={{ fontSize: '14px', marginBottom: 4 }}>{hint.title}</Title>
                                <Text style={{ fontSize: '12px' }} type="secondary">{hint.desc}</Text>
                              </Card>
                            </Col>
                          ))}
                        </Row>
                      </div>
                    )}
                  </div>
                )
              },
              {
                key: 'leaderboard',
                label: (
                  <Space>
                    <CrownOutlined />
                    Leaderboard
                  </Space>
                ),
                children: (
                  <div>
                    <div style={{ textAlign: 'center', marginBottom: 32 }}>
                      <Title level={3}>Community Leaderboard</Title>
                      <Text type="secondary">See where you stand among fellow writers</Text>
                      <Badge 
                        count={<><CrownOutlined style={{ marginRight: 4 }} />Top Writers</>}
                        style={{ 
                          background: 'linear-gradient(135deg, #722ed1 0%, #eb2f96 100%)',
                          color: 'white',
                          fontWeight: 'bold',
                          marginTop: 16
                        }}
                      />
                    </div>
                    
                    <Space direction="vertical" size="middle" style={{ width: '100%' }}>
                      {leaderboard.map((leader, index) => (
                        <Card 
                          key={leader._id}
                          style={{
                            background: leader._id === user?._id 
                              ? 'linear-gradient(135deg, #e6f7ff 0%, #f0f5ff 100%)'
                              : 'white',
                            border: leader._id === user?._id ? '2px solid #1890ff' : '1px solid #d9d9d9',
                            borderRadius: 12,
                            transform: leader._id === user?._id ? 'scale(1.02)' : 'scale(1)',
                            boxShadow: leader._id === user?._id ? '0 4px 16px rgba(24,144,255,0.2)' : '0 2px 8px rgba(0,0,0,0.1)'
                          }}
                        >
                          <Row align="middle" gutter={16}>
                            <Col flex="60px">
                              <div style={{ 
                                textAlign: 'center',
                                fontSize: '24px',
                                fontWeight: 'bold',
                                color: index === 0 ? '#faad14' : index === 1 ? '#8c8c8c' : index === 2 ? '#d46b08' : '#595959'
                              }}>
                                #{leader.rank}
                                {index < 3 && (
                                  <div style={{ fontSize: '16px', marginTop: 4 }}>
                                    {index === 0 ? '🥇' : index === 1 ? '🥈' : '🥉'}
                                  </div>
                                )}
                              </div>
                            </Col>
                            
                            <Col flex="60px">
                              <Badge 
                                dot={leader._id === user?._id} 
                                color="green"
                              >
                                <Avatar 
                                  size={48} 
                                  icon={<UserOutlined />}
                                  style={{ 
                                    background: 'linear-gradient(135deg, #1890ff 0%, #722ed1 100%)'
                                  }}
                                >
                                  {leader.username.charAt(0).toUpperCase()}
                                </Avatar>
                              </Badge>
                            </Col>
                            
                            <Col flex="auto">
                              <div>
                                <Space>
                                  <Text strong style={{ fontSize: '16px' }}>{leader.username}</Text>
                                  {leader._id === user?._id && (
                                    <Badge count="You" style={{ background: '#52c41a' }} />
                                  )}
                                </Space>
                                <br />
                                <Text type="secondary" style={{ textTransform: 'capitalize' }}>
                                  {leader.level} level
                                </Text>
                              </div>
                            </Col>
                            
                            <Col>
                              <div style={{ textAlign: 'right' }}>
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
                                  <StarOutlined style={{ marginRight: 4, color: '#faad14' }} />
                                  <Text strong style={{ fontSize: '18px' }}>{leader.points}</Text>
                                </div>
                                <Text type="secondary" style={{ fontSize: '12px' }}>points</Text>
                              </div>
                            </Col>
                          </Row>
                          
                          {leader._id === user?._id && (
                            <div style={{ 
                              position: 'absolute', 
                              bottom: 0, 
                              left: 0, 
                              right: 0, 
                              height: 3, 
                              background: 'linear-gradient(135deg, #1890ff 0%, #722ed1 100%)',
                              borderRadius: '0 0 12px 12px'
                            }} />
                          )}
                        </Card>
                      ))}
                    </Space>

                    {leaderboard.length === 0 && (
                      <div style={{ textAlign: 'center', padding: '64px 0' }}>
                        <div style={{ 
                          width: 120, 
                          height: 120, 
                          margin: '0 auto 24px',
                          background: 'linear-gradient(135deg, #722ed1 0%, #eb2f96 100%)',
                          borderRadius: '50%',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '48px'
                        }}>
                          🏆
                        </div>
                        <Title level={3}>No rankings yet</Title>
                        <Text type="secondary">
                          Be the first to join the leaderboard by creating stories and earning points!
                        </Text>
                      </div>
                    )}
                  </div>
                )
              }
            ]}
          />
        </Card>
      </div>
    </div>
  );
};

export default Profile;
