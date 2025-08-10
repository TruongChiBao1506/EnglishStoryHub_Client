import React from 'react';
import { LevelInfo } from '../types';

interface LevelBadgeProps {
  levelInfo: LevelInfo;
  showProgress?: boolean;
  size?: 'small' | 'medium' | 'large';
}

const LevelBadge: React.FC<LevelBadgeProps> = ({ 
  levelInfo, 
  showProgress = true, 
  size = 'medium' 
}) => {
  const sizeClasses = {
    small: 'text-xs p-2',
    medium: 'text-sm p-3',
    large: 'text-base p-4'
  };

  const badgeClasses = {
    small: 'text-base',
    medium: 'text-xl',
    large: 'text-3xl'
  };

  const getProgressPercentage = () => {
    if (!levelInfo.nextLevel) return 100;
    
    const currentLevelPoints = levelInfo.points - levelInfo.min;
    const levelRange = levelInfo.max === Infinity ? 
      levelInfo.nextLevel.pointsNeeded + currentLevelPoints : 
      levelInfo.max - levelInfo.min;
    
    return Math.min((currentLevelPoints / levelRange) * 100, 100);
  };

  return (
    <div className={`level-badge ${sizeClasses[size]}`}>
      <div 
        className="rounded-2xl border-2 p-6 bg-white shadow-xl relative overflow-hidden group hover:shadow-2xl transition-all duration-300"
        style={{ borderColor: levelInfo.color }}
      >
        {/* Background decoration */}
        <div 
          className="absolute top-0 right-0 w-24 h-24 opacity-10 rounded-full transform translate-x-12 -translate-y-12"
          style={{ backgroundColor: levelInfo.color }}
        ></div>
        
        <div className="relative z-10">
          <div className="flex items-center gap-4">
            <div 
              className={`badge ${badgeClasses[size]} flex-shrink-0 w-16 h-16 rounded-2xl flex items-center justify-center text-white font-bold shadow-lg transform group-hover:scale-110 transition-all duration-300`}
              style={{ backgroundColor: levelInfo.color }}
            >
              <span className="text-3xl">{levelInfo.badge}</span>
            </div>
            
            <div className="flex-1 min-w-0">
              <h4 className="font-bold text-gray-900 text-xl mb-2 group-hover:text-gray-800 transition-colors">
                {levelInfo.name}
              </h4>
              
              <div className="flex items-center gap-3 text-gray-600 mb-4">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">⭐</span>
                  <span className="font-bold text-lg text-gray-900">{levelInfo.points}</span>
                  <span className="font-medium">points</span>
                </div>
              </div>
              
              {showProgress && levelInfo.nextLevel && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600 font-medium">
                      Progress to {levelInfo.nextLevel.name}
                    </span>
                    <span className="font-semibold text-gray-800">
                      {levelInfo.nextLevel.pointsNeeded} points needed
                    </span>
                  </div>
                  
                  <div className="relative">
                    <div className="w-full bg-gray-200 rounded-full h-3 shadow-inner">
                      <div 
                        className="h-3 rounded-full transition-all duration-1000 ease-out relative overflow-hidden"
                        style={{ 
                          backgroundColor: levelInfo.color,
                          width: `${getProgressPercentage()}%`
                        }}
                      >
                        {/* Shine effect */}
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-pulse"></div>
                      </div>
                    </div>
                    <div 
                      className="absolute top-0 h-3 w-1 bg-white rounded-full shadow-md transition-all duration-1000"
                      style={{ left: `${getProgressPercentage()}%` }}
                    ></div>
                  </div>
                  
                  <div className="text-xs text-gray-500 font-medium">
                    {Math.round(getProgressPercentage())}% complete
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
        
        {/* Glow effect */}
        <div 
          className="absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity duration-300 rounded-2xl blur-xl"
          style={{ backgroundColor: levelInfo.color }}
        ></div>
      </div>
    </div>
  );
};

export default LevelBadge;
