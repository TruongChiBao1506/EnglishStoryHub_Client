import React from 'react';
import { Achievement as AchievementType } from '../types';

interface AchievementProps {
  achievement: AchievementType;
  size?: 'small' | 'medium' | 'large';
  showDetails?: boolean;
}

const Achievement: React.FC<AchievementProps> = ({ 
  achievement, 
  size = 'medium', 
  showDetails = true 
}) => {
  const sizeClasses = {
    small: 'text-sm p-2',
    medium: 'text-base p-3',
    large: 'text-lg p-4'
  };

  const badgeClasses = {
    small: 'text-lg',
    medium: 'text-2xl',
    large: 'text-4xl'
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'writing': 
        return {
          border: 'border-green-300',
          bg: 'bg-gradient-to-br from-green-50 to-emerald-50',
          badge: 'bg-gradient-to-r from-green-400 to-emerald-500',
          glow: 'shadow-green-200'
        };
      case 'social': 
        return {
          border: 'border-blue-300',
          bg: 'bg-gradient-to-br from-blue-50 to-sky-50',
          badge: 'bg-gradient-to-r from-blue-400 to-sky-500',
          glow: 'shadow-blue-200'
        };
      case 'milestone': 
        return {
          border: 'border-purple-300',
          bg: 'bg-gradient-to-br from-purple-50 to-violet-50',
          badge: 'bg-gradient-to-r from-purple-400 to-violet-500',
          glow: 'shadow-purple-200'
        };
      case 'special': 
        return {
          border: 'border-yellow-300',
          bg: 'bg-gradient-to-br from-yellow-50 to-orange-50',
          badge: 'bg-gradient-to-r from-yellow-400 to-orange-500',
          glow: 'shadow-yellow-200'
        };
      default: 
        return {
          border: 'border-gray-300',
          bg: 'bg-gradient-to-br from-gray-50 to-slate-50',
          badge: 'bg-gradient-to-r from-gray-400 to-slate-500',
          glow: 'shadow-gray-200'
        };
    }
  };

  const colors = getCategoryColor(achievement.category);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <div className={`achievement-card border-2 rounded-2xl ${colors.border} ${colors.bg} ${sizeClasses[size]} transition-all duration-300 hover:scale-105 hover:shadow-xl ${colors.glow} relative overflow-hidden group`}>
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-20 h-20 opacity-10 transform translate-x-10 -translate-y-10">
        <div className={`w-full h-full ${colors.badge} rounded-full`}></div>
      </div>
      
      <div className="relative z-10">
        <div className="flex items-start gap-4">
          <div className={`badge ${badgeClasses[size]} flex-shrink-0 w-16 h-16 rounded-2xl ${colors.badge} text-white shadow-lg flex items-center justify-center font-bold transform group-hover:scale-110 transition-transform duration-300`}>
            <span className="text-2xl">{achievement.badge}</span>
          </div>
          
          <div className="flex-1 min-w-0">
            <h4 className="font-bold text-gray-900 text-lg mb-2 group-hover:text-gray-800 transition-colors">
              {achievement.title}
            </h4>
            
            {showDetails && (
              <>
                <p className="text-gray-600 text-sm mb-3 leading-relaxed">
                  {achievement.description}
                </p>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold ${colors.badge} text-white shadow-sm`}>
                      <span>⭐</span>
                      +{achievement.pointsAwarded} points
                    </span>
                    <span className="text-xs text-gray-500 font-medium">
                      {formatDate(achievement.unlockedAt)}
                    </span>
                  </div>
                  
                  {/* Category badge */}
                  <span className="text-xs font-medium px-2 py-1 bg-white/60 rounded-full text-gray-600 capitalize">
                    {achievement.category}
                  </span>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
      
      {/* Shine effect on hover */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
        <div className="absolute top-0 -left-4 w-8 h-full bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 group-hover:translate-x-full transition-transform duration-1000 ease-out"></div>
      </div>
    </div>
  );
};

export default Achievement;
