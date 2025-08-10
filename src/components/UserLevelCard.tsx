import React from 'react';

interface UserLevelCardProps {
  level: 'beginner' | 'intermediate' | 'advanced';
  points?: number;
  size?: 'small' | 'medium';
}

const UserLevelCard: React.FC<UserLevelCardProps> = ({ 
  level, 
  points, 
  size = 'small' 
}) => {
  const getLevelInfo = (level: string) => {
    switch (level) {
      case 'beginner':
        return {
          name: 'Newbie Writer',
          badge: '🌱',
          color: '#22c55e',
          textColor: 'text-green-600'
        };
      case 'intermediate':
        return {
          name: 'Rising Author',
          badge: '🌿',
          color: '#3b82f6',
          textColor: 'text-blue-600'
        };
      case 'advanced':
        return {
          name: 'Master Storyteller',
          badge: '🌳',
          color: '#8b5cf6',
          textColor: 'text-purple-600'
        };
      default:
        return {
          name: 'Writer',
          badge: '✍️',
          color: '#6b7280',
          textColor: 'text-gray-600'
        };
    }
  };

  const levelInfo = getLevelInfo(level);
  const isSmall = size === 'small';

  return (
    <div className={`inline-flex items-center gap-1 ${isSmall ? 'text-xs' : 'text-sm'}`}>
      <span className={isSmall ? 'text-sm' : 'text-base'}>
        {levelInfo.badge}
      </span>
      <span className={`font-medium ${levelInfo.textColor} capitalize`}>
        {level}
      </span>
      {points !== undefined && (
        <>
          <span className="text-gray-400">•</span>
          <span className="text-gray-600 font-medium">
            {points} pts
          </span>
        </>
      )}
    </div>
  );
};

export default UserLevelCard;
