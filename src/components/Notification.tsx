import React, { useEffect, useState } from 'react';

interface NotificationProps {
  type: 'achievement' | 'levelUp' | 'points';
  data: {
    title: string;
    message: string;
    badge?: string;
    points?: number;
  };
  onClose: () => void;
  duration?: number;
}

const Notification: React.FC<NotificationProps> = ({ 
  type, 
  data, 
  onClose, 
  duration = 5000 
}) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Trigger animation
    const timer = setTimeout(() => setIsVisible(true), 100);
    
    // Auto close
    const closeTimer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onClose, 300); // Wait for exit animation
    }, duration);

    return () => {
      clearTimeout(timer);
      clearTimeout(closeTimer);
    };
  }, [duration, onClose]);

  const getTypeStyles = () => {
    switch (type) {
      case 'achievement':
        return {
          bg: 'bg-gradient-to-br from-yellow-400 via-yellow-500 to-orange-500',
          border: 'border-yellow-300',
          shadow: 'shadow-yellow-500/25'
        };
      case 'levelUp':
        return {
          bg: 'bg-gradient-to-br from-purple-500 via-purple-600 to-indigo-600',
          border: 'border-purple-300',
          shadow: 'shadow-purple-500/25'
        };
      case 'points':
        return {
          bg: 'bg-gradient-to-br from-green-400 via-green-500 to-emerald-600',
          border: 'border-green-300',
          shadow: 'shadow-green-500/25'
        };
      default:
        return {
          bg: 'bg-gradient-to-br from-blue-500 via-blue-600 to-indigo-600',
          border: 'border-blue-300',
          shadow: 'shadow-blue-500/25'
        };
    }
  };

  const getIcon = () => {
    switch (type) {
      case 'achievement':
        return '🏆';
      case 'levelUp':
        return '⬆️';
      case 'points':
        return '⭐';
      default:
        return '🎉';
    }
  };

  return (
    <div className="fixed top-4 right-4 z-50 max-w-sm">
      <div
        className={`notification transform transition-all duration-500 ease-out ${
          isVisible 
            ? 'translate-x-0 opacity-100 scale-100' 
            : 'translate-x-full opacity-0 scale-95'
        }`}
      >
        <div className={`relative overflow-hidden rounded-2xl p-6 text-white border-2 ${getTypeStyles().bg} ${getTypeStyles().border} shadow-2xl ${getTypeStyles().shadow} backdrop-blur-sm`}>
          {/* Background decoration */}
          <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full transform translate-x-10 -translate-y-10"></div>
          <div className="absolute bottom-0 left-0 w-16 h-16 bg-white/5 rounded-full transform -translate-x-8 translate-y-8"></div>
          
          {/* Shine effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-pulse"></div>
          
          <div className="relative z-10">
            <div className="flex items-start gap-4">
              <div className="text-4xl flex-shrink-0 animate-bounce">
                {data.badge || getIcon()}
              </div>
              
              <div className="flex-1 min-w-0">
                <h4 className="font-black text-xl leading-tight mb-2 drop-shadow-sm">
                  {data.title}
                </h4>
                <p className="text-white/95 text-sm leading-relaxed font-medium">
                  {data.message}
                </p>
                {data.points && (
                  <div className="mt-3">
                    <span className="inline-flex items-center gap-2 bg-white/20 backdrop-blur px-3 py-2 rounded-xl text-sm font-bold border border-white/20 hover:bg-white/30 transition-colors">
                      <span className="text-yellow-200">⭐</span>
                      <span>+{data.points} points</span>
                    </span>
                  </div>
                )}
              </div>

              <button
                onClick={() => {
                  setIsVisible(false);
                  setTimeout(onClose, 300);
                }}
                className="text-white/70 hover:text-white hover:bg-white/20 text-xl leading-none flex-shrink-0 ml-2 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110"
              >
                ×
              </button>
            </div>
            
            {/* Progress bar */}
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/20">
              <div 
                className="h-full bg-white/40 transition-all duration-5000 ease-linear"
                style={{
                  width: isVisible ? '0%' : '100%',
                  transition: `width ${duration}ms linear`
                }}
              ></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Hook để quản lý notifications
export const useNotifications = () => {
  const [notifications, setNotifications] = useState<Array<{
    id: string;
    type: 'achievement' | 'levelUp' | 'points';
    data: {
      title: string;
      message: string;
      badge?: string;
      points?: number;
    };
  }>>([]);

  const addNotification = (
    type: 'achievement' | 'levelUp' | 'points',
    data: {
      title: string;
      message: string;
      badge?: string;
      points?: number;
    }
  ) => {
    const id = Date.now().toString();
    setNotifications(prev => [...prev, { id, type, data }]);
  };

  const removeNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const showAchievement = (achievement: { title: string; badge: string; points: number }) => {
    addNotification('achievement', {
      title: 'Achievement Unlocked!',
      message: achievement.title,
      badge: achievement.badge,
      points: achievement.points
    });
  };

  const showLevelUp = (levelUp: { from: string; to: string; badge: string; name: string }) => {
    addNotification('levelUp', {
      title: 'Level Up!',
      message: `You've reached ${levelUp.name}!`,
      badge: levelUp.badge
    });
  };

  const showPoints = (points: number, message: string = 'Points earned!') => {
    addNotification('points', {
      title: 'Points Earned!',
      message,
      points
    });
  };

  const NotificationContainer: React.FC = () => (
    <>
      {notifications.map((notification) => (
        <Notification
          key={notification.id}
          type={notification.type}
          data={notification.data}
          onClose={() => removeNotification(notification.id)}
        />
      ))}
    </>
  );

  return {
    showAchievement,
    showLevelUp,
    showPoints,
    NotificationContainer
  };
};

export default Notification;
