import { useState, useEffect } from 'react';
import { User, Shield, ShieldCheck, Ban, Search, MoreVertical, Check, X, Loader2, AlertTriangle } from 'lucide-react';
import { getAllUsers, updateUserProfile } from '../utils/userApi';
import type { User as UserType, UserRole } from '../App';
import { currentUser } from '../data/mockData';

export function UserManagement() {
  const [users, setUsers] = useState<UserType[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<UserRole | 'all'>('all');
  const [editingUser, setEditingUser] = useState<UserType | null>(null);
  const [showBanModal, setShowBanModal] = useState(false);
  const [userToBan, setUserToBan] = useState<UserType | null>(null);
  const [banDuration, setBanDuration] = useState<'1d' | '7d' | '30d' | 'permanent'>('7d');

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    setLoading(true);
    const data = await getAllUsers();
    // If no users found (e.g. first run), at least show the current mocked user if not present,
    // though in a real app we rely on the backend.
    // For now, let's just use what we get.
    setUsers(data);
    setLoading(false);
  };

  const handleUpdateRole = async (userId: string, newRole: UserRole) => {
    // Optimistic update
    setUsers(users.map(u => u.id === userId ? { ...u, role: newRole } : u));
    
    // API Call
    await updateUserProfile(userId, { role: newRole });
    
    // Close edit mode if open
    if (editingUser?.id === userId) {
      setEditingUser(null);
    }
  };

  const handleToggleBlock = async (user: UserType) => {
    if (user.isBlocked) {
      // Unblock
      if (confirm(`Unblock ${user.username}?`)) {
        setUsers(users.map(u => u.id === user.id ? { ...u, isBlocked: false } : u));
        await updateUserProfile(user.id, { isBlocked: false });
      }
    } else {
      // Open Ban Modal
      setUserToBan(user);
      setShowBanModal(true);
    }
  };
  
  const confirmBan = async () => {
    if (!userToBan) return;
    
    // Optimistic update
    setUsers(users.map(u => u.id === userToBan.id ? { ...u, isBlocked: true } : u));
    
    // API Call
    await updateUserProfile(userToBan.id, { isBlocked: true });
    
    setShowBanModal(false);
    setUserToBan(null);
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.username?.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          user.id?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = roleFilter === 'all' || user.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center p-12">
        <Loader2 className="w-8 h-8 text-teal-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header & Filters */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search users by name or ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-gray-50 border-0 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/20"
          />
        </div>
        <div className="flex items-center gap-2">
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value as any)}
            className="px-3 py-2 bg-gray-50 border-0 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/20 cursor-pointer"
          >
            <option value="all">All Roles</option>
            <option value="member">Members</option>
            <option value="vet">Vets</option>
            <option value="trainer">Trainers</option>
            <option value="moderator">Moderators</option>
            <option value="admin">Admins</option>
          </select>
        </div>
      </div>

      {/* Users List */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50/50 border-b border-gray-100">
              <tr>
                <th className="px-6 py-4 font-medium text-gray-500">User</th>
                <th className="px-6 py-4 font-medium text-gray-500">Role</th>
                <th className="px-6 py-4 font-medium text-gray-500">Status</th>
                <th className="px-6 py-4 font-medium text-gray-500">Joined</th>
                <th className="px-6 py-4 font-medium text-gray-500 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                    No users found matching your criteria
                  </td>
                </tr>
              ) : (
                filteredUsers.map(user => (
                  <tr key={user.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-3">
                      <div className="flex items-center gap-3">
                        <div className="relative">
                          {user.avatar ? (
                            <img src={user.avatar} alt="" className="w-10 h-10 rounded-full bg-gray-100 object-cover" />
                          ) : (
                            <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-400">
                              <User className="w-5 h-5" />
                            </div>
                          )}
                          {user.isOnline && (
                            <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 border-2 border-white rounded-full"></span>
                          )}
                        </div>
                        <div>
                          <div className="font-medium text-gray-900">{user.username || 'Unnamed User'}</div>
                          <div className="text-xs text-gray-500 truncate max-w-[150px]">{user.id}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-3">
                      {editingUser?.id === user.id ? (
                        <select
                          value={user.role}
                          onChange={(e) => handleUpdateRole(user.id, e.target.value as UserRole)}
                          className="px-2 py-1 bg-white border border-gray-200 rounded-lg text-xs"
                          autoFocus
                          onBlur={() => setEditingUser(null)}
                        >
                          <option value="member">Member</option>
                          <option value="vet">Vet</option>
                          <option value="trainer">Trainer</option>
                          <option value="moderator">Moderator</option>
                          <option value="admin">Admin</option>
                        </select>
                      ) : (
                        <button 
                          onClick={() => setEditingUser(user)}
                          className={`px-2.5 py-1 rounded-full text-xs font-medium inline-flex items-center gap-1 border ${
                            user.role === 'admin' ? 'bg-red-50 text-red-700 border-red-100' :
                            user.role === 'moderator' ? 'bg-purple-50 text-purple-700 border-purple-100' :
                            user.role === 'vet' ? 'bg-blue-50 text-blue-700 border-blue-100' :
                            user.role === 'trainer' ? 'bg-green-50 text-green-700 border-green-100' :
                            'bg-gray-100 text-gray-600 border-gray-200'
                          }`}
                        >
                          {user.role === 'admin' && <ShieldCheck className="w-3 h-3" />}
                          {user.role === 'moderator' && <Shield className="w-3 h-3" />}
                          <span className="capitalize">{user.role}</span>
                        </button>
                      )}
                    </td>
                    <td className="px-6 py-3">
                      {user.isBlocked ? (
                        <span className="inline-flex items-center gap-1 text-xs font-medium text-red-600 bg-red-50 px-2 py-1 rounded-full">
                          <Ban className="w-3 h-3" /> Blocked
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded-full">
                          <Check className="w-3 h-3" /> Active
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-3 text-gray-500">
                      {user.memberSince ? new Date(user.memberSince).toLocaleDateString() : '-'}
                    </td>
                    <td className="px-6 py-3 text-right">
                       <button
                          onClick={() => handleToggleBlock(user)}
                          className={`p-2 rounded-lg transition-colors ${
                            user.isBlocked 
                              ? 'text-gray-400 hover:text-green-600 hover:bg-green-50'
                              : 'text-gray-400 hover:text-red-600 hover:bg-red-50'
                          }`}
                          title={user.isBlocked ? "Unblock User" : "Block User"}
                        >
                          <Ban className="w-4 h-4" />
                        </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Ban Modal */}
      {showBanModal && userToBan && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-md overflow-hidden">
            <div className="p-4 border-b border-gray-100 flex items-center justify-between">
              <h3 className="font-semibold flex items-center gap-2 text-red-600">
                <Ban className="w-5 h-5" />
                Ban User
              </h3>
              <button onClick={() => setShowBanModal(false)} className="p-1 hover:bg-gray-100 rounded-full">
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            
            <div className="p-6">
              <div className="flex items-center gap-3 mb-6 p-3 bg-gray-50 rounded-xl">
                {userToBan.avatar && <img src={userToBan.avatar} className="w-10 h-10 rounded-full" />}
                <div>
                  <p className="font-medium">{userToBan.username}</p>
                  <p className="text-xs text-gray-500">{userToBan.id}</p>
                </div>
              </div>

              <div className="space-y-4">
                <label className="block text-sm font-medium text-gray-700">Ban Duration</label>
                <div className="grid grid-cols-4 gap-2">
                  {['1d', '7d', '30d', 'permanent'].map((d) => (
                    <button
                      key={d}
                      onClick={() => setBanDuration(d as any)}
                      className={`py-2 text-sm rounded-lg border transition-all ${
                        banDuration === d
                          ? 'bg-red-50 border-red-200 text-red-700 font-medium'
                          : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
                      }`}
                    >
                      {d}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex gap-3 mt-8">
                <button
                  onClick={() => setShowBanModal(false)}
                  className="flex-1 py-2.5 text-gray-600 font-medium hover:bg-gray-50 rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmBan}
                  className="flex-1 py-2.5 bg-red-600 text-white font-medium rounded-xl hover:bg-red-700 transition-colors shadow-lg shadow-red-200"
                >
                  Confirm Ban
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
