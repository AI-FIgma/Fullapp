import type { Achievement, AchievementLevel } from '../App';

interface AchievementBadgeProps {
  achievement: Achievement;
  size?: 'xs' | 'sm' | 'md' | 'lg';
  showProgress?: boolean;
}

export function AchievementBadge({ achievement, size = 'md', showProgress = false }: AchievementBadgeProps) {
  const getLevelGradient = (level: AchievementLevel) => {
    switch (level) {
      case 'bronze':
        return 'from-orange-300 to-orange-400';
      case 'silver':
        return 'from-gray-200 to-gray-300';
      case 'gold':
        return 'from-yellow-300 to-amber-500';
      case 'platinum':
        return 'from-purple-400 to-pink-600';
    }
  };

  const getLevelBorder = (level: AchievementLevel) => {
    switch (level) {
      case 'bronze':
        return 'border-orange-300';
      case 'silver':
        return 'border-gray-300';
      case 'gold':
        return 'border-yellow-300';
      case 'platinum':
        return 'border-purple-300';
    }
  };

  const getLevelTextColor = (level: AchievementLevel) => {
    switch (level) {
      case 'bronze':
        return 'text-orange-800';
      case 'silver':
        return 'text-gray-700';
      case 'gold':
        return 'text-yellow-900';
      case 'platinum':
        return 'text-purple-900';
    }
  };

  const getLevelProgressColor = (level: AchievementLevel) => {
    switch (level) {
      case 'bronze':
        return 'from-orange-400 to-orange-500';
      case 'silver':
        return 'from-gray-300 to-gray-400';
      case 'gold':
        return 'from-yellow-400 to-amber-600';
      case 'platinum':
        return 'from-purple-400 to-pink-600';
    }
  };

  const getLevelStars = (level: AchievementLevel) => {
    switch (level) {
      case 'bronze':
        return '⭐';
      case 'silver':
        return '⭐⭐';
      case 'gold':
        return '⭐⭐⭐';
      case 'platinum':
        return '✨';
    }
  };

  const sizeClasses = {
    xs: 'px-2 py-0.5 text-xs gap-1',
    sm: 'px-2.5 py-1 text-xs gap-1',
    md: 'px-3 py-1.5 text-sm gap-1.5',
    lg: 'px-4 py-2 text-base gap-2'
  };

  const iconSizes = {
    xs: 'text-xs',
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg'
  };

  return (
    <div className="flex flex-col gap-1">
      <div className={`inline-flex items-center ${sizeClasses[size]} bg-gradient-to-r ${getLevelGradient(achievement.level)} border ${getLevelBorder(achievement.level)} rounded-full ${getLevelTextColor(achievement.level)} transition-all hover:scale-105`}>
        <span className={iconSizes[size]}>{getLevelStars(achievement.level)}</span>
        <span className={iconSizes[size]}>{achievement.icon}</span>
        <span className="font-medium whitespace-nowrap">{achievement.name}</span>
      </div>
      {showProgress && achievement.progress !== undefined && achievement.maxProgress !== undefined && (
        <div className="flex items-center gap-2">
          <div className="flex-1 h-1.5 bg-gray-200 rounded-full overflow-hidden">
            <div 
              className={`h-full bg-gradient-to-r ${getLevelProgressColor(achievement.level)} transition-all`}
              style={{ width: `${(achievement.progress / achievement.maxProgress) * 100}%` }}
            />
          </div>
          <span className="text-xs text-gray-500">
            {achievement.progress}/{achievement.maxProgress}
          </span>
        </div>
      )}
    </div>
  );
}