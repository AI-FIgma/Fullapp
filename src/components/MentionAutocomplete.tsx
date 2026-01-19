import { useState, useEffect, useRef } from 'react';
import type { User } from '../App';

interface MentionAutocompleteProps {
  users: User[]; // All available users
  searchQuery: string; // Current @ search query
  onSelect: (username: string) => void;
  position: { top: number; left: number };
}

export function MentionAutocomplete({ users, searchQuery, onSelect, position }: MentionAutocompleteProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const menuRef = useRef<HTMLDivElement>(null);

  // Filter users based on search query
  const filteredUsers = users.filter(user =>
    user.username.toLowerCase().includes(searchQuery.toLowerCase())
  ).slice(0, 5); // Limit to 5 results

  // Reset selected index when search changes
  useEffect(() => {
    setSelectedIndex(0);
  }, [searchQuery]);

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (filteredUsers.length === 0) return;

      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex(prev => (prev + 1) % filteredUsers.length);
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex(prev => (prev - 1 + filteredUsers.length) % filteredUsers.length);
      } else if (e.key === 'Enter') {
        e.preventDefault();
        onSelect(filteredUsers[selectedIndex].username);
      } else if (e.key === 'Escape') {
        // Close autocomplete
        onSelect('');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [filteredUsers, selectedIndex, onSelect]);

  if (filteredUsers.length === 0) return null;

  return (
    <div
      ref={menuRef}
      className="absolute z-50 bg-white border border-gray-200 rounded-xl shadow-lg max-h-60 overflow-y-auto"
      style={{
        top: `${position.top}px`,
        left: `${position.left}px`,
        minWidth: '200px'
      }}
    >
      {filteredUsers.map((user, index) => (
        <button
          key={user.id}
          onClick={() => onSelect(user.username)}
          className={`w-full flex items-center gap-3 px-4 py-2 text-left transition-colors ${
            index === selectedIndex ? 'bg-teal-50' : 'hover:bg-gray-50'
          }`}
          type="button"
        >
          <img
            src={user.avatar}
            alt={user.username}
            className="w-8 h-8 rounded-full"
          />
          <div className="flex-1 min-w-0">
            <p className="text-sm text-gray-900 truncate">@{user.username}</p>
            {user.role !== 'member' && (
              <p className="text-xs text-gray-500 capitalize">{user.role}</p>
            )}
          </div>
        </button>
      ))}
    </div>
  );
}
