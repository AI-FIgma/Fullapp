import { useState } from 'react';
import { Shield, UserPlus, UserMinus, Search, Award, Calendar, AlertOctagon } from 'lucide-react';
import { mockUsers } from '../data/mockData';
import { UserBadge } from './UserBadge';

export function ModeratorTeam() {
  const [searchQuery, setSearchQuery] = useState('');

  // Get current moderators and admins
  const moderators = mockUsers.filter(u => u.role === 'moderator' || u.role === 'admin');

  // Mock moderation stats
  const modStats = {
    'admin-1': { reportsResolved: 234, usersWarned: 45, usersBlocked: 12 },
    'mod-top-1': { reportsResolved: 189, usersWarned: 38, usersBlocked: 8 },
    'mod-2': { reportsResolved: 156, usersWarned: 29, usersBlocked: 6 },
  };

  const filteredMods = moderators.filter(mod =>
    mod.username.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAddModerator = () => {
    const username = prompt('Enter username to promote to moderator:');
    if (username) {
      console.log('Add moderator:', username);
      alert(`Promoted ${username} to moderator`);
    }
  };

  const handleRemoveModerator = (userId: string, username: string) => {
    if (!confirm(`Remove ${username} from moderator team?`)) return;
    console.log('Remove moderator:', userId);
    alert(`${username} removed from moderator team`);
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-base text-gray-900">Moderator Team</h3>
          <p className="text-xs text-gray-600 mt-0.5">Manage moderators and view their activity</p>
        </div>
        <button
          onClick={handleAddModerator}
          className="flex items-center gap-1.5 px-3 py-2 bg-gradient-to-r from-teal-400 to-teal-500 text-white text-xs rounded-xl hover:from-teal-500 hover:to-teal-600 transition-all shadow-md"
        >
          <UserPlus className="w-3.5 h-3.5" />
          Add Mod
        </button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          type="text"
          placeholder="Search moderators..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-400"
        />
      </div>

      {/* Team Stats */}
      <div className="grid grid-cols-3 gap-2">
        <div className="bg-gradient-to-br from-teal-50 to-teal-100 rounded-xl p-2.5 border border-teal-200">
          <div className="text-xs text-teal-700 mb-1">Team Size</div>
          <div className="text-xl text-teal-900">{moderators.length}</div>
        </div>
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-2.5 border border-blue-200">
          <div className="text-xs text-blue-700 mb-1">Reports Resolved</div>
          <div className="text-xl text-blue-900">579</div>
        </div>
        <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-2.5 border border-purple-200">
          <div className="text-xs text-purple-700 mb-1">Actions Taken</div>
          <div className="text-xl text-purple-900">138</div>
        </div>
      </div>

      {/* Moderators List */}
      <div className="space-y-2">
        {filteredMods.map(mod => {
          const stats = modStats[mod.id as keyof typeof modStats] || { reportsResolved: 0, usersWarned: 0, usersBlocked: 0 };
          
          return (
            <div key={mod.id} className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
              <div className="p-3">
                {/* Moderator Header */}
                <div className="flex items-start gap-3 mb-3">
                  <img
                    src={mod.avatar}
                    alt={mod.username}
                    className="w-12 h-12 rounded-full"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm text-gray-900">{mod.username}</span>
                      <UserBadge role={mod.role} />
                    </div>
                    {mod.bio && (
                      <p className="text-xs text-gray-600 mb-2">{mod.bio}</p>
                    )}
                    <div className="flex items-center gap-1 text-[10px] text-gray-500">
                      <Calendar className="w-3 h-3" />
                      Member since {mod.memberSince?.toLocaleDateString()}
                    </div>
                  </div>
                </div>

                {/* Moderation Stats */}
                <div className="grid grid-cols-3 gap-2 mb-3">
                  <div className="bg-green-50 rounded-lg p-2 text-center">
                    <div className="text-xs text-green-600 mb-0.5">Resolved</div>
                    <div className="text-lg text-green-900">{stats.reportsResolved}</div>
                  </div>
                  <div className="bg-yellow-50 rounded-lg p-2 text-center">
                    <div className="text-xs text-yellow-600 mb-0.5">Warned</div>
                    <div className="text-lg text-yellow-900">{stats.usersWarned}</div>
                  </div>
                  <div className="bg-red-50 rounded-lg p-2 text-center">
                    <div className="text-xs text-red-600 mb-0.5">Blocked</div>
                    <div className="text-lg text-red-900">{stats.usersBlocked}</div>
                  </div>
                </div>

                {/* Performance Badge */}
                {stats.reportsResolved > 200 && (
                  <div className="flex items-center gap-1.5 p-2 bg-gradient-to-r from-yellow-50 to-yellow-100 border border-yellow-200 rounded-xl mb-2">
                    <Award className="w-3.5 h-3.5 text-yellow-600" />
                    <span className="text-xs text-yellow-800">⭐ Top Performer</span>
                  </div>
                )}

                {/* Actions */}
                {mod.role === 'moderator' && (
                  <button
                    onClick={() => handleRemoveModerator(mod.id, mod.username)}
                    className="w-full flex items-center justify-center gap-1.5 px-3 py-2 bg-red-50 text-red-700 text-xs rounded-xl hover:bg-red-100 transition-colors border border-red-200"
                  >
                    <UserMinus className="w-3.5 h-3.5" />
                    Remove from Team
                  </button>
                )}
                {mod.role === 'admin' && (
                  <div className="flex items-center justify-center gap-1.5 p-2 bg-gray-50 text-gray-500 text-xs rounded-xl border border-gray-200">
                    <Shield className="w-3.5 h-3.5" />
                    Administrator - Cannot be removed
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {filteredMods.length === 0 && (
          <div className="p-8 text-center text-gray-500">
            <Shield className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p className="text-sm">No moderators found</p>
          </div>
        )}
      </div>
    </div>
  );
}
