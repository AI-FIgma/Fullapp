import { Bell, Bookmark, User } from 'lucide-react';

interface ForumHeaderProps {
  unreadNotifications?: number;
  onOpenNotifications: () => void;
  onOpenSaved: () => void;
  onOpenSettings: () => void;
}

export function ForumHeader({ 
  unreadNotifications = 0, 
  onOpenNotifications, 
  onOpenSaved, 
  onOpenSettings 
}: ForumHeaderProps) {
  return (
    <div className="flex items-center gap-2">
      {/* Notifications */}
      <button
        onClick={onOpenNotifications}
        className="relative p-2 hover:bg-teal-50 dark:hover:bg-gray-700 rounded-full transition-colors"
      >
        <Bell className="w-5 h-5 text-gray-600 dark:text-gray-300" />
        {unreadNotifications > 0 && (
          <span className="absolute top-0.5 right-0.5 bg-red-500 text-white text-[9px] rounded-full w-4 h-4 flex items-center justify-center font-medium">
            {unreadNotifications > 9 ? '9+' : unreadNotifications}
          </span>
        )}
      </button>

      {/* Saved Posts */}
      <button
        onClick={onOpenSaved}
        className="p-2 hover:bg-teal-50 dark:hover:bg-gray-700 rounded-full transition-colors"
      >
        <Bookmark className="w-5 h-5 text-gray-600 dark:text-gray-300" />
      </button>

      {/* User Settings */}
      <button
        onClick={onOpenSettings}
        className="p-2 hover:bg-teal-50 dark:hover:bg-gray-700 rounded-full transition-colors"
      >
        <User className="w-5 h-5 text-gray-600 dark:text-gray-300" />
      </button>
    </div>
  );
}