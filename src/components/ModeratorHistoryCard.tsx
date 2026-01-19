import { Shield, AlertTriangle } from 'lucide-react';
import type { User } from '../App';

interface ModeratorHistoryCardProps {
  user: User;
  getTimeAgo: (date: Date) => string;
}

export function ModeratorHistoryCard({ user, getTimeAgo }: ModeratorHistoryCardProps) {
  const warningCount = user.warningCount || 0;
  
  // Calculate warning styles
  const warningBg = warningCount === 0 ? 'bg-green-50' : warningCount >= 2 ? 'bg-red-50' : 'bg-orange-50';
  const warningBorder = warningCount === 0 ? 'border-green-200' : warningCount >= 2 ? 'border-red-300' : 'border-orange-300';
  const warningIconColor = warningCount === 0 ? 'text-green-600' : warningCount >= 2 ? 'text-red-600' : 'text-orange-600';
  const warningTextColor = warningCount === 0 ? 'text-green-700' : warningCount >= 2 ? 'text-red-700' : 'text-orange-700';
  const warningDescColor = warningCount >= 2 ? 'text-red-900' : 'text-orange-900';

  return (
    <div className="p-4 bg-gradient-to-br from-purple-50 to-blue-50 border-2 border-purple-200 rounded-2xl">
      <h5 className="text-sm mb-3 flex items-center gap-2">
        <Shield className="w-4 h-4 text-purple-600" />
        <span className="text-purple-900">Moderation History</span>
        <span className="ml-auto text-xs text-purple-600 bg-purple-100 px-2 py-0.5 rounded-full">Mod Only</span>
      </h5>
      
      <div className="space-y-3">
        {/* Warning Count */}
        <div className={`p-3 rounded-xl border ${warningBg} ${warningBorder}`}>
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <AlertTriangle className={`w-4 h-4 ${warningIconColor}`} />
              <span className="text-xs">Warnings</span>
            </div>
            <span className={`text-lg ${warningTextColor}`}>
              {warningCount}/3
            </span>
          </div>
          {warningCount > 0 ? (
            <div className="mt-2 pt-2 border-t border-current/20">
              <p className={`text-xs ${warningDescColor}`}>
                {warningCount === 2 
                  ? '⚠️ One more warning will result in automatic block'
                  : warningCount === 1
                  ? 'User has received one warning'
                  : '🚫 Critical: User is at risk of being blocked'}
              </p>
            </div>
          ) : (
            <p className="text-xs text-green-700 mt-1">✓ Clean record</p>
          )}
        </div>

        {/* Block Status */}
        <div className={`p-3 rounded-xl border ${user.isBlocked ? 'bg-red-50 border-red-300' : 'bg-gray-50 border-gray-200'}`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Shield className={`w-4 h-4 ${user.isBlocked ? 'text-red-600' : 'text-gray-600'}`} />
              <span className="text-xs">Account Status</span>
            </div>
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
              user.isBlocked ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
            }`}>
              {user.isBlocked ? '🚫 Blocked' : '✓ Active'}
            </span>
          </div>
          {user.isBlocked && (
            <p className="text-xs text-red-700 mt-2">
              User cannot post or comment
            </p>
          )}
        </div>

        {/* Reports Filed */}
        <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl">
          <div className="flex items-center justify-between">
            <span className="text-xs text-blue-700">Reports Filed</span>
            <span className="text-sm text-blue-900">0</span>
          </div>
          <p className="text-xs text-blue-600 mt-1">Times this user was reported</p>
        </div>

        {/* Last Action */}
        {user.lastActive && (
          <div className="p-3 bg-gray-50 border border-gray-200 rounded-xl">
            <span className="text-xs text-gray-600">Last Active</span>
            <p className="text-sm text-gray-900 mt-1">
              {getTimeAgo(user.lastActive)}
            </p>
          </div>
        )}
      </div>

      <div className="mt-3 p-2 bg-purple-100 rounded-lg">
        <p className="text-xs text-purple-800 text-center">
          This information is only visible to moderators and administrators
        </p>
      </div>
    </div>
  );
}
