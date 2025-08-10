import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import statsService from '../services/statsService';
import { UserStats } from '../types';
import { Link } from 'react-router-dom';
import LevelBadge from './LevelBadge';

const PointsDisplay: React.FC = () => {
  const { user, isAuthenticated } = useAuth();
  const [userStats, setUserStats] = useState<UserStats | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isAuthenticated && user) {
      loadUserStats();
    }
  }, [isAuthenticated, user]);

  const loadUserStats = async () => {
    setLoading(true);
    try {
      const stats = await statsService.getUserStats();
      setUserStats(stats);
    } catch (error) {
      console.error('Error loading user stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!isAuthenticated || !user) {
    return (
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl p-6 text-white">
        <div className="text-center">
          <h3 className="text-xl font-bold mb-2">Join the Community!</h3>
          <p className="text-blue-100 mb-4">
            Earn points by creating stories, engaging with others, and achieving milestones!
          </p>
          <Link
            to="/register"
            className="inline-flex items-center px-6 py-3 bg-white text-blue-600 rounded-lg font-semibold hover:bg-blue-50 transition-colors"
          >
            Get Started
            <span className="ml-2">🚀</span>
          </Link>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="bg-white rounded-xl p-6 border shadow-sm">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
          <div className="h-8 bg-gray-200 rounded mb-4"></div>
          <div className="space-y-2">
            <div className="h-3 bg-gray-200 rounded"></div>
            <div className="h-3 bg-gray-200 rounded w-5/6"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-blue-50 to-indigo-100 rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300 border border-blue-100 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-200/30 to-indigo-300/30 rounded-full transform translate-x-16 -translate-y-16"></div>
      
      <div className="relative z-10">
        <div className="flex items-start justify-between mb-6">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl shadow-lg">
                <span className="text-lg">🎯</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900">
                Your Progress
              </h3>
            </div>
            <p className="text-sm text-gray-600 font-medium">
              Rank #{userStats?.rank} in the community
            </p>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold bg-gradient-to-r from-yellow-500 to-orange-500 bg-clip-text text-transparent">
              ⭐ {user.points}
            </div>
            <div className="text-xs text-gray-600 font-medium">Total Points</div>
          </div>
        </div>

        {userStats && (
          <>
            <div className="mb-6">
              <LevelBadge levelInfo={userStats.levelInfo} showProgress={true} size="small" />
            </div>

            <div className="grid grid-cols-3 gap-4 mb-6">
              {[
                { 
                  value: userStats.stats.storiesPublished, 
                  label: 'Stories', 
                  icon: '📖', 
                  color: 'from-purple-500 to-pink-500' 
                },
                { 
                  value: userStats.stats.totalLikes, 
                  label: 'Likes', 
                  icon: '❤️', 
                  color: 'from-red-500 to-rose-500' 
                },
                { 
                  value: userStats.stats.totalViews, 
                  label: 'Views', 
                  icon: '👁️', 
                  color: 'from-cyan-500 to-blue-500' 
                }
              ].map((stat, index) => (
                <div key={index} className="relative group">
                  <div className={`bg-gradient-to-br ${stat.color} p-4 rounded-xl text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105`}>
                    <div className="text-center">
                      <div className="text-lg mb-2">{stat.icon}</div>
                      <div style={{color:"black"}} className="text-2xl font-black mb-1 text-white drop-shadow-lg">{stat.value}</div>
                      <div style={{color:"black"}}  className="text-xs font-bold text-white/95 drop-shadow tracking-wide">{stat.label}</div>
                    </div>
                    {/* Shine effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl"></div>
                  </div>
                </div>
              ))}
            </div>

            {userStats.recentAchievements && userStats.recentAchievements.length > 0 && (
              <div className="mb-6">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-lg">🎉</span>
                  <h4 className="text-sm font-bold text-gray-900">Recent Achievement</h4>
                </div>
                <div className="relative group">
                  <div className="flex items-center gap-3 p-4 bg-gradient-to-br from-yellow-50 to-orange-50 rounded-xl border-2 border-yellow-200 hover:shadow-lg transition-all duration-300">
                    <div className="text-3xl group-hover:scale-110 transition-transform duration-200">
                      {userStats.recentAchievements[0].badge}
                    </div>
                    <div className="flex-1">
                      <span className="text-sm font-bold text-gray-900 block">
                        {userStats.recentAchievements[0].title}
                      </span>
                      <span className="text-xs text-yellow-600 font-medium">
                        Recently unlocked!
                      </span>
                    </div>
                    <div className="text-right">
                      <div className="text-yellow-600 font-bold text-sm">New!</div>
                    </div>
                  </div>
                  {/* Glow effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-yellow-400/20 to-orange-400/20 rounded-xl blur opacity-0 group-hover:opacity-50 transition-opacity duration-300"></div>
                </div>
              </div>
            )}

            <Link
              to="/profile"
              className="w-full inline-flex items-center justify-center px-6 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 text-sm font-bold shadow-lg hover:shadow-xl transform hover:scale-[1.02] group"
            >
              <span>View Full Profile</span>
              <span className="ml-2 group-hover:translate-x-1 transition-transform duration-200">→</span>
            </Link>
          </>
        )}
      </div>
    </div>
  );
};

export default PointsDisplay;
