import React from 'react';
import type { User } from '../App';

interface OnlineStatusIndicatorProps {
  user: User;
  size?: 'sm' | 'md' | 'lg';
  position?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left';
}

/**
 * Online Status Indicator Component
 * Displays a green dot if user is online and has showOnlineStatus enabled
 */
export function OnlineStatusIndicator({ user, size = 'sm', position = 'bottom-right' }: OnlineStatusIndicatorProps) {
  // Don't show if user has disabled online status visibility
  if (!user.showOnlineStatus || !user.isOnline) {
    return null;
  }

  const sizeClasses = {
    sm: 'w-2.5 h-2.5',
    md: 'w-3 h-3',
    lg: 'w-3.5 h-3.5',
  };

  const positionClasses = {
    'bottom-right': 'bottom-0 right-0',
    'bottom-left': 'bottom-0 left-0',
    'top-right': 'top-0 right-0',
    'top-left': 'top-0 left-0',
  };

  return (
    <div 
      className={`absolute ${positionClasses[position]} ${sizeClasses[size]} bg-green-500 rounded-full border-2 border-white ring-1 ring-green-500/20`}
      title="Online"
    />
  );
}
