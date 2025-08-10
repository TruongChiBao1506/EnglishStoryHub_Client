import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import statsService from '../services/statsService';
import { LeaderboardUser } from '../types';

const MiniLeaderboard: React.FC = () => {
  const [topUsers, setTopUsers] = useState<LeaderboardUser[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTopUsers();
  }, []);

  const loadTopUsers = async () => {
    try {
      const data = await statsService.getLeaderboard(1, 5);
      setTopUsers(data.leaderboard.slice(0, 5));
    } catch (error) {
      console.error('Error loading leaderboard:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-gradient-to-br from-yellow-50 to-orange-100 rounded-2xl p-6 shadow-xl border border-yellow-200">
        <div className="animate-pulse">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-gradient-to-br from-yellow-300 to-orange-400 rounded-xl"></div>
            <div className="h-6 bg-yellow-200 rounded-lg w-32"></div>
          </div>
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex items-center gap-4 mb-4 p-4 bg-white/50 rounded-xl">
              <div className="w-12 h-12 bg-yellow-200 rounded-full"></div>
              <div className="flex-1">
                <div className="h-4 bg-yellow-200 rounded w-2/3 mb-2"></div>
                <div className="h-3 bg-yellow-200 rounded w-1/2"></div>
              </div>
              <div className="w-8 h-8 bg-yellow-200 rounded-full"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-yellow-50 to-orange-100 rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300 border border-yellow-200 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-yellow-200/30 to-orange-300/30 rounded-full transform translate-x-16 -translate-y-16"></div>
      
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-gradient-to-br from-yellow-500 to-orange-600 rounded-xl shadow-lg">
              <span className="text-xl">🏆</span>
            </div>
            <h3 className="text-xl font-bold text-gray-900">
              Top Writers
            </h3>
          </div>
          <Link
            to="/profile"
            className="text-sm text-blue-600 hover:text-blue-800 font-medium px-3 py-2 rounded-lg hover:bg-white/50 transition-all duration-200"
          >
            View Full
          </Link>
        </div>

        <div className="space-y-4">
          {topUsers.map((user, index) => {
            const isTop3 = index < 3;
            const borderColors = ['border-yellow-400', 'border-gray-300', 'border-amber-400'];
            const bgGradients = [
              'from-yellow-100 to-yellow-50',
              'from-gray-100 to-gray-50', 
              'from-amber-100 to-amber-50'
            ];
            
            return (
              <div 
                key={user._id}
                className={`flex items-center gap-4 p-1 rounded-xl transition-all duration-300 hover:shadow-md transform hover:scale-[1.02] border-2 ${
                  isTop3 
                    ? `bg-gradient-to-r ${bgGradients[index]} ${borderColors[index]} border-opacity-50` 
                    : 'bg-white/80 border-gray-200 hover:bg-white'
                }`}
              >
                <div className="flex items-center gap-3">
                  {/* Rank badge - Outside avatar */}
                  <div className={`text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center shadow-lg p-1 ${
                    index === 0 ? 'bg-yellow-500 text-white' :
                    index === 1 ? 'bg-gray-400 text-white' :
                    index === 2 ? 'bg-amber-600 text-white' : 'bg-blue-500 text-white'
                  }`}>
                    #{user.rank}
                  </div>

                  {/* Avatar - Clean without overlays */}
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 shadow-lg border-2 border-white overflow-hidden relative">
                    {user.avatar ? (
                      <img 
                        src={user.avatar} 
                        alt={user.username}
                        className="w-full h-full object-cover rounded-full"
                      />
                    ) : (
                      <div 
                        className="absolute inset-0 flex items-center justify-center text-white font-bold text-sm"
                        style={{
                          position: 'absolute',
                          top: '0',
                          left: '0',
                          right: '0',
                          bottom: '0',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          textAlign: 'center',
                          lineHeight: '1'
                        }}
                      >
                        {user.username.charAt(0).toUpperCase()}
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-gray-900 truncate">
                    {user.username}
                  </p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs text-yellow-600 font-bold">
                      ⭐ {user.points}
                    </span>
                    <span className="text-xs text-gray-500">•</span>
                    <span className="text-xs text-gray-600 font-medium">
                      {user.levelInfo.name}
                    </span>
                  </div>
                </div>

                <div className="text-2xl hover:scale-110 transition-transform duration-200">
                  {user.levelInfo.badge}
                </div>
              </div>
            );
          })}
        </div>

        {topUsers.length === 0 && (
          <div className="text-center text-gray-500 py-8">
            <div className="text-4xl mb-3">🏁</div>
            <p className="text-sm font-medium">No writers yet!</p>
            <p className="text-xs text-gray-400 mt-1">Be the first to start writing</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MiniLeaderboard;
