import { ArrowLeft, ChevronRight, BadgeCheck, User, Bell, Shield, LogOut, Eye, Lock, UserX, Users, Trophy, AlertOctagon, Briefcase, MapPin, Phone, Mail, Globe, Languages, Settings as SettingsIcon, BarChart3, Ticket, UserCog, Send, Camera, Upload, Loader2 } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { toast } from 'sonner@2.0.3';
import { ForumHeader } from './ForumHeader';
import { AdminPanel } from './AdminPanel';
import { currentUser, mockUsers, blockedUsers, followingUsers, sponsoredAds } from '../data/mockData';
import { AchievementsView } from './AchievementsView';
import { ChangePasswordModal } from './ChangePasswordModal';
import { getCurrentLanguage, type Language } from '../utils/i18n';
import { VALIDATION_LIMITS, validateUsername, getCharCountColor } from '../utils/validation';
import { projectId, publicAnonKey } from '../utils/supabase/info';

import { User as UserType } from '../App';

interface SettingsProps {
  onBack: () => void;
  onNavigate: (view: 'verification' | 'notifications' | 'saved' | 'settings' | 'reports' | 'moderation' | 'admin' | 'contact' | 'about' | 'terms' | 'privacy' | 'guidelines' | 'analytics') => void;
  onViewProfile: (userId: string) => void;
  unreadNotifications: number;
  onLanguageChange: (lang: Language) => void;
  onViewTicket?: (ticketId: string, asAdmin?: boolean) => void;
  currentUser?: UserType;
  onProfileUpdate?: (data: Partial<UserType>) => void;
}

type SettingsView = 'main' | 'account' | 'notifications-settings' | 'privacy' | 'admin' | 'blocked-users' | 'following-users' | 'achievements' | 'professional-info' | 'user-management';

export function Settings({ onBack, onNavigate, onViewProfile, unreadNotifications, onLanguageChange, onViewTicket, currentUser: appUser, onProfileUpdate }: SettingsProps) {
  const activeUser = appUser || currentUser;
  const [currentView, setCurrentView] = useState<SettingsView>('main');
  const [adminInitialTab, setAdminInitialTab] = useState<'ads' | 'tickets' | 'broadcast' | 'verification'>('ads');
  const [blockedUsersList, setBlockedUsersList] = useState<string[]>(Array.from(blockedUsers));
  const [followingUsersList, setFollowingUsersList] = useState<string[]>(Array.from(followingUsers));
  const [showChangePasswordModal, setShowChangePasswordModal] = useState(false);
  const [showOnlineStatus, setShowOnlineStatus] = useState(activeUser.showOnlineStatus ?? true);
  const [currentLanguage, setCurrentLanguage] = useState<Language>(getCurrentLanguage());
  
  // Account Information state with character limits
  const [username, setUsername] = useState(activeUser.username);
  const [bio, setBio] = useState(activeUser.bio || ''); // Default to empty string if undefined/null
  const [avatarUrl, setAvatarUrl] = useState(activeUser.avatar);
  const [showAvatarInput, setShowAvatarInput] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Update state when activeUser changes
  useEffect(() => {
    setUsername(activeUser.username);
    setBio(activeUser.bio || '');
    setAvatarUrl(activeUser.avatar);
  }, [activeUser]);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-3d55d0fe/upload`, {
        method: 'POST',
        headers: {
           'Authorization': `Bearer ${publicAnonKey}`,
        },
        body: formData,
      });

      if (!response.ok) {
        let errorMsg = 'Upload failed';
        try {
           const errData = await response.json();
           errorMsg = errData.error || errorMsg;
        } catch (e) {
           // ignore json parse error
        }
        throw new Error(errorMsg);
      }

      const data = await response.json();
      setAvatarUrl(data.url);
      setShowAvatarInput(false);
    } catch (error: any) {
      console.error('Upload error:', error);
      alert(`Failed to upload image: ${error.message}`);
    } finally {
      setIsUploading(false);
    }
  };
  
  // Professional Info state
  const [professionalInfo, setProfessionalInfo] = useState({
    businessName: activeUser.professionalInfo?.businessName || '',
    address: activeUser.professionalInfo?.address || '',
    phone: activeUser.professionalInfo?.phone || '',
    email: activeUser.professionalInfo?.email || '',
    website: activeUser.professionalInfo?.website || ''
  });
  
  // Address autocomplete state
  const [showAddressSuggestions, setShowAddressSuggestions] = useState(false);
  const [addressSuggestions, setAddressSuggestions] = useState<string[]>([]);
  
  const isAdmin = activeUser.role === 'admin';
  const isModerator = activeUser.role === 'moderator';
  const isAdminOrModerator = isAdmin || isModerator;
  const isProfessional = activeUser.role === 'vet' || activeUser.role === 'trainer';
  
  // Reset to main view when Settings component mounts (fixes Settings icon not working from sub-views)
  useEffect(() => {
    setCurrentView('main');
  }, []); // Empty dependency array = run only on mount

  // Mock address autocomplete - simulates Google Places API
  // TODO: Replace with real Google Places API in production
  // See: https://developers.google.com/maps/documentation/javascript/place-autocomplete
  const handleAddressChange = (value: string) => {
    setProfessionalInfo({ ...professionalInfo, address: value });
    
    if (value.length >= 3) {
      // Mock suggestions - in production, use Google Places API
      const mockAddresses = [
        'Gedimino pr. 45, Vilnius',
        'Gedimino pr. 20, Vilnius',
        'Gedimino pr. 9, Vilnius',
        'Konstitucijos pr. 12, Vilnius',
        'Konstitucijos pr. 26, Vilnius',
        'Savanorių pr. 28, Vilnius',
        'Laisvės al. 60, Kaunas',
        'Laisvės al. 48, Kaunas',
        'Laisvės al. 32, Kaunas',
        'Kauno g. 31, Vilnius',
        'Žirmūnų g. 68, Vilnius',
        'Ateities g. 10, Vilnius',
        'S. Daukanto a. 8, Vilnius',
        'Tilto g. 1, Vilnius',
        'Verkių g. 29, Vilnius',
      ];
      
      const filtered = mockAddresses.filter(addr => 
        addr.toLowerCase().includes(value.toLowerCase())
      );
      
      setAddressSuggestions(filtered.slice(0, 5));
      setShowAddressSuggestions(filtered.length > 0);
    } else {
      setShowAddressSuggestions(false);
    }
  };

  const selectAddress = (address: string) => {
    setProfessionalInfo({ ...professionalInfo, address });
    setShowAddressSuggestions(false);
  };

  const handleBackClick = () => {
    if (currentView === 'main') {
      onBack();
    } else {
      window.scrollTo(0, 0);
      setCurrentView('main');
    }
  };

  // Admin Panel View - Admin/Moderator
  if (currentView === 'admin' && isAdminOrModerator) {
    return (
      <AdminPanel 
        ads={sponsoredAds}
        onBack={() => setCurrentView('main')}
        onViewTicket={(ticketId) => {
          if (onViewTicket) {
            onViewTicket(ticketId, true); // Pass asAdmin=true when viewing from Admin Panel
          }
        }}
        onNavigateAnalytics={() => onNavigate('analytics')}
        initialTab={adminInitialTab}
        hideTabNavigation={true}
        unreadNotifications={unreadNotifications}
        onNavigate={onNavigate}
        currentUserRole={isAdmin ? 'admin' : 'moderator'}
        onSendBroadcast={(notification) => {
          console.log('Broadcasting notification:', notification);
          // TODO: Implement real notification broadcast logic
        }}
      />
    );
  }

  // User Management View - ADMIN ONLY
  if (currentView === 'user-management' && isAdmin) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white pb-20">
        <div className="sticky top-0 z-10 bg-white/95 backdrop-blur-sm border-b border-gray-100 shadow-sm">
          <div className="flex items-center justify-between p-3">
            <div className="flex items-center gap-2">
              <button onClick={handleBackClick} className="text-gray-600 hover:text-teal-500 transition-colors">
                <ArrowLeft className="w-5 h-5" />
              </button>
              <h2 className="text-base">User Management</h2>
            </div>
            <ForumHeader
              unreadNotifications={unreadNotifications}
              onOpenNotifications={() => onNavigate('notifications')}
              onOpenSaved={() => onNavigate('saved')}
              onOpenSettings={() => onNavigate('settings')}
            />
          </div>
        </div>

        <div className="p-4">
          {/* Info Card */}
          <div className="mb-4 p-4 bg-gradient-to-br from-indigo-50 to-purple-50 border-2 border-indigo-200 rounded-2xl">
            <div className="flex items-start gap-3">
              <UserCog className="w-6 h-6 text-indigo-600 flex-shrink-0 mt-0.5" />
              <div>
                <div className="text-sm font-medium text-indigo-900 mb-1">Admin Tools</div>
                <div className="text-xs text-indigo-700">
                  Manage user roles and permissions. Changes are immediate.
                </div>
              </div>
            </div>
          </div>

          {/* Stats Summary */}
          <div className="grid grid-cols-3 gap-3 mb-4">
            <div className="bg-white rounded-xl p-3 border border-gray-200 text-center">
              <div className="text-xs text-gray-500 mb-1">Total Users</div>
              <div className="text-lg text-gray-900">{mockUsers.length}</div>
            </div>
            <div className="bg-white rounded-xl p-3 border border-gray-200 text-center">
              <div className="text-xs text-gray-500 mb-1">Verified</div>
              <div className="text-lg text-teal-600">
                {mockUsers.filter(u => u.role === 'vet' || u.role === 'trainer').length}
              </div>
            </div>
            <div className="bg-white rounded-xl p-3 border border-gray-200 text-center">
              <div className="text-xs text-gray-500 mb-1">Staff</div>
              <div className="text-lg text-red-600">
                {mockUsers.filter(u => u.role === 'admin' || u.role === 'moderator').length}
              </div>
            </div>
          </div>

          {/* Search Bar */}
          <div className="mb-4">
            <input
              type="text"
              placeholder="Search users..."
              className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>

          {/* Users List */}
          <div className="space-y-3">
            {mockUsers.map(user => (
              <div 
                key={user.id}
                className="bg-white rounded-2xl p-4 border border-gray-200 hover:border-indigo-300 transition-all"
              >
                <div className="flex items-start gap-3 mb-3">
                  <img
                    src={user.avatar}
                    alt={user.username}
                    className="w-12 h-12 rounded-full flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-sm font-medium text-gray-900 truncate">{user.username}</h3>
                      {user.verified && <BadgeCheck className="w-4 h-4 text-teal-500 flex-shrink-0" />}
                    </div>
                    <p className="text-xs text-gray-500 truncate">{user.bio || 'No bio'}</p>
                  </div>
                </div>

                {/* Role Selector */}
                <div className="flex items-center gap-2">
                  <div className="text-xs text-gray-500 flex-shrink-0">Role:</div>
                  <select
                    defaultValue={user.role}
                    onChange={(e) => {
                      // In production, this would call an API
                      user.role = e.target.value as any;
                      alert(`Role changed to: ${e.target.value}`);
                    }}
                    className="flex-1 px-3 py-2 text-sm bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="user">User</option>
                    <option value="vet">Veterinarian (Verified)</option>
                    <option value="trainer">Trainer (Verified)</option>
                    <option value="moderator">Moderator</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>

                {/* Current Role Badge */}
                <div className="mt-3 flex items-center gap-2">
                  <div className="text-xs text-gray-500">Current:</div>
                  <div className={`px-2 py-1 rounded-lg text-xs font-medium ${
                    user.role === 'admin' ? 'bg-red-100 text-red-700' :
                    user.role === 'moderator' ? 'bg-purple-100 text-purple-700' :
                    user.role === 'vet' || user.role === 'trainer' ? 'bg-teal-100 text-teal-700' :
                    'bg-gray-100 text-gray-700'
                  }`}>
                    {user.role === 'admin' ? '🔴 Admin' :
                     user.role === 'moderator' ? '🟣 Moderator' :
                     user.role === 'vet' ? '✅ Veterinarian' :
                     user.role === 'trainer' ? '✅ Trainer' :
                     '👤 User'}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Account Information View
  if (currentView === 'account') {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
        <div className="sticky top-0 z-10 bg-white/95 backdrop-blur-sm border-b border-gray-100 shadow-sm">
          <div className="flex items-center justify-between p-3">
            <div className="flex items-center gap-2">
              <button onClick={handleBackClick} className="text-gray-600 hover:text-teal-500 transition-colors">
                <ArrowLeft className="w-5 h-5" />
              </button>
              <h2 className="text-base">Account Information</h2>
            </div>
            <ForumHeader
              unreadNotifications={unreadNotifications}
              onOpenNotifications={() => onNavigate('notifications')}
              onOpenSaved={() => onNavigate('saved')}
              onOpenSettings={() => onNavigate('settings')}
            />
          </div>
        </div>

        <div className="p-4">
          {/* Profile Picture */}
          <div className="mb-6 text-center">
            <div className="relative inline-block">
              <img
                src={avatarUrl}
                alt={username}
                className="w-24 h-24 rounded-full ring-4 ring-teal-100 mx-auto mb-3 object-cover"
              />
              {isUploading && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/30 rounded-full">
                  <Loader2 className="w-8 h-8 text-white animate-spin" />
                </div>
              )}
            </div>
            
            <div className="flex flex-col items-center gap-2">
              <button 
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center gap-2 px-4 py-2 bg-teal-50 text-teal-600 rounded-xl text-sm font-medium hover:bg-teal-100 transition-colors"
                disabled={isUploading}
              >
                <Upload className="w-4 h-4" />
                Upload Photo
              </button>
              <input 
                type="file" 
                ref={fileInputRef}
                className="hidden" 
                accept="image/*"
                onChange={handleFileUpload}
              />
              
              <button 
                onClick={() => setShowAvatarInput(!showAvatarInput)}
                className="text-xs text-gray-400 hover:text-gray-600 underline decoration-dotted underline-offset-4"
              >
                {showAvatarInput ? 'Cancel URL' : 'or paste URL'}
              </button>
            </div>
            
            {/* Avatar URL Input */}
            {showAvatarInput && (
              <div className="mt-4 max-w-xs mx-auto animate-in fade-in slide-in-from-top-2">
                 <div className="relative">
                   <input 
                     type="text"
                     value={avatarUrl}
                     onChange={(e) => setAvatarUrl(e.target.value)}
                     placeholder="https://example.com/image.png"
                     className="w-full px-3 py-2 text-xs border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 pr-8"
                   />
                   <button 
                     onClick={() => setShowAvatarInput(false)}
                     className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                   >
                     <LogOut className="w-3 h-3 rotate-180" />
                   </button>
                 </div>
                 <p className="text-[10px] text-gray-400 mt-1">Paste an image link from the web</p>
              </div>
            )}
          </div>

          {/* Form Fields */}
          <div className="space-y-4">
            {/* Username */}
            <div>
              <div className="flex items-center justify-between mb-1.5 px-1">
                <label className="text-xs text-gray-500">Username</label>
                <span className={`text-xs ${getCharCountColor(username.length, VALIDATION_LIMITS.USERNAME_MAX)}`}>
                  {username.length}/{VALIDATION_LIMITS.USERNAME_MAX}
                </span>
              </div>
              <input
                type="text"
                value={username}
                onChange={(e) => {
                  const value = e.target.value.replace(/[^a-zA-Z0-9_-]/g, ''); // Only allow valid chars
                  setUsername(value.slice(0, VALIDATION_LIMITS.USERNAME_MAX));
                }}
                className={`w-full px-4 py-2.5 bg-gray-50 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:border-transparent ${
                  !validateUsername(username).valid
                    ? 'border-red-300 focus:ring-red-500'
                    : 'border-gray-200 focus:ring-teal-500'
                }`}
                placeholder="Enter username"
              />
              {!validateUsername(username).valid && (
                <p className="text-xs text-red-500 mt-1 px-1">{validateUsername(username).error}</p>
              )}
              <p className="text-xs text-gray-500 mt-1 px-1">Only letters, numbers, underscores, and hyphens allowed</p>
            </div>

            {/* Bio */}
            <div>
              <div className="flex items-center justify-between mb-1.5 px-1">
                <label className="text-xs text-gray-500">Bio</label>
                <span className={`text-xs ${getCharCountColor(bio.length, VALIDATION_LIMITS.BIO_MAX)}`}>
                  {bio.length}/{VALIDATION_LIMITS.BIO_MAX}
                </span>
              </div>
              <textarea
                placeholder="Tell us about yourself and your pets..."
                rows={4}
                value={bio}
                onChange={(e) => setBio(e.target.value.slice(0, VALIDATION_LIMITS.BIO_MAX))}
                className={`w-full px-4 py-2.5 bg-gray-50 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:border-transparent resize-none ${
                  bio.length > VALIDATION_LIMITS.BIO_MAX
                    ? 'border-red-300 focus:ring-red-500'
                    : 'border-gray-200 focus:ring-teal-500'
                }`}
              />
            </div>
          </div>

          {/* Save Button */}
          <button 
            onClick={() => {
              const usernameValidation = validateUsername(username);
              if (!usernameValidation.valid) {
                alert(usernameValidation.error);
                return;
              }
              
              if (onProfileUpdate) {
                const newData = { username, bio, avatar: avatarUrl };
                onProfileUpdate(newData);
                
                // Also update localStorage for persistence
                const profileKey = `forum_profile_${activeUser.id}`;
                const stored = localStorage.getItem(profileKey);
                const currentData = stored ? JSON.parse(stored) : {};
                localStorage.setItem(profileKey, JSON.stringify({
                  ...currentData,
                  ...newData
                }));
              }
              
              toast.success('Profile updated successfully!');
            }}
            disabled={!validateUsername(username).valid}
            className={`w-full mt-6 px-4 py-3 text-white text-sm rounded-2xl transition-all shadow-md ${
              !validateUsername(username).valid
                ? 'bg-gray-300 cursor-not-allowed'
                : 'bg-gradient-to-r from-teal-400 to-teal-500 hover:from-teal-500 hover:to-teal-600'
            }`}
          >
            Save Changes
          </button>

          {/* Danger Zone */}
          <div className="mt-8 p-4 bg-red-50 rounded-xl border border-red-100">
            <h4 className="text-sm text-red-900 mb-2">Danger Zone</h4>
            <button className="text-sm text-red-600 hover:text-red-700">Delete Account</button>
          </div>
        </div>
      </div>
    );
  }

  // Professional Info View
  if (currentView === 'professional-info') {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
        <div className="sticky top-0 z-10 bg-white/95 backdrop-blur-sm border-b border-gray-100 shadow-sm">
          <div className="flex items-center justify-between p-3">
            <div className="flex items-center gap-2">
              <button onClick={handleBackClick} className="text-gray-600 hover:text-teal-500 transition-colors">
                <ArrowLeft className="w-5 h-5" />
              </button>
              <h2 className="text-base">Professional Information</h2>
            </div>
            <ForumHeader
              unreadNotifications={unreadNotifications}
              onOpenNotifications={() => onNavigate('notifications')}
              onOpenSaved={() => onNavigate('saved')}
              onOpenSettings={() => onNavigate('settings')}
            />
          </div>
        </div>

        <div className="p-4">
          {/* Verification Badge */}
          <div className="mb-6 p-4 bg-gradient-to-br from-teal-50 via-blue-50 to-teal-50 border-2 border-teal-200 rounded-2xl">
            <div className="flex items-center gap-3">
              <BadgeCheck className="w-10 h-10 text-teal-600" />
              <div>
                <div className="text-sm font-medium text-teal-900">Verified {activeUser.role === 'vet' ? 'Veterinarian' : 'Trainer'}</div>
                <div className="text-xs text-teal-700">Your professional profile is visible to all users</div>
              </div>
            </div>
          </div>

          {/* Info Message */}
          <div className="mb-6 p-3 bg-blue-50 rounded-xl border border-blue-100">
            <p className="text-xs text-blue-900">
              📞 This information will be displayed on your profile to help pet owners contact you.
            </p>
          </div>

          {/* Form Fields */}
          <div className="space-y-4">
            {/* Address with Autocomplete */}
            <div className="relative">
              <label className="block text-xs text-gray-500 mb-1.5 px-1 flex items-center gap-1">
                <MapPin className="w-3 h-3" />
                Address <span className="text-gray-400">(optional)</span>
              </label>
              <input
                type="text"
                value={professionalInfo.address}
                onChange={(e) => handleAddressChange(e.target.value)}
                onFocus={() => professionalInfo.address.length >= 3 && setShowAddressSuggestions(true)}
                onBlur={() => setTimeout(() => setShowAddressSuggestions(false), 200)}
                className="w-full px-3 py-2.5 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent text-sm"
                placeholder="Start typing address..."
                autoComplete="off"
              />
              <p className="text-xs text-gray-500 mt-1 px-1">Users can open this in maps</p>
              
              {/* Address Suggestions Dropdown */}
              {showAddressSuggestions && addressSuggestions.length > 0 && (
                <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden">
                  {addressSuggestions.map((suggestion, index) => (
                    <button
                      key={index}
                      type="button"
                      onClick={() => selectAddress(suggestion)}
                      className="w-full px-3 py-2.5 text-left text-sm hover:bg-teal-50 transition-colors flex items-start gap-2 border-b border-gray-100 last:border-b-0"
                    >
                      <MapPin className="w-4 h-4 text-teal-500 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700">{suggestion}</span>
                    </button>
                  ))}
                  <div className="px-3 py-2 bg-gray-50 border-t border-gray-200">
                    <p className="text-xs text-gray-500 flex items-center gap-1">
                      <span className="text-gray-400">💡</span>
                      Powered by Google Maps (demo mode)
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Phone */}
            <div>
              <label className="block text-xs text-gray-500 mb-1.5 px-1 flex items-center gap-1">
                <Phone className="w-3 h-3" />
                Phone Number <span className="text-gray-400">(optional)</span>
              </label>
              <input
                type="tel"
                value={professionalInfo.phone}
                onChange={(e) => setProfessionalInfo({ ...professionalInfo, phone: e.target.value })}
                className="w-full px-3 py-2.5 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent text-sm"
                placeholder="e.g. +370 612 34567"
              />
              <p className="text-xs text-gray-500 mt-1 px-1">Users can tap to call</p>
            </div>

            {/* Email */}
            <div>
              <label className="block text-xs text-gray-500 mb-1.5 px-1 flex items-center gap-1">
                <Mail className="w-3 h-3" />
                Email Address <span className="text-gray-400">(optional)</span>
              </label>
              <input
                type="email"
                value={professionalInfo.email}
                onChange={(e) => setProfessionalInfo({ ...professionalInfo, email: e.target.value })}
                className="w-full px-3 py-2.5 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent text-sm"
                placeholder="e.g. dr.sullivan@centralvet.lt"
              />
              <p className="text-xs text-gray-500 mt-1 px-1">Users can tap to email</p>
            </div>

            {/* Website */}
            <div>
              <label className="block text-xs text-gray-500 mb-1.5 px-1 flex items-center gap-1">
                <Globe className="w-3 h-3" />
                Website <span className="text-gray-400">(optional)</span>
              </label>
              <input
                type="url"
                value={professionalInfo.website}
                onChange={(e) => setProfessionalInfo({ ...professionalInfo, website: e.target.value })}
                className="w-full px-3 py-2.5 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent text-sm"
                placeholder="e.g. www.centralvet.lt"
              />
              <p className="text-xs text-gray-500 mt-1 px-1">Optional: Your business website</p>
            </div>
          </div>

          {/* Save Button */}
          <div className="mt-8 flex gap-3">
            <button
              onClick={() => {
                // Save professional info
                if (onProfileUpdate) {
                  const newData = { professionalInfo };
                  onProfileUpdate(newData);
                  
                  // Also update localStorage for persistence (complex object needs special handling if we were persisting it all)
                  // For now, assume professional info changes don't need to sync with forum_profile local storage key logic 
                  // or handle it if needed. The forum profile mainly stores username/avatar/bio.
                  // If we want to persist professional info, we might need a separate key or extend the object.
                } else {
                  // Fallback to updating the mock object directly if no updater provided
                  currentUser.professionalInfo = { ...professionalInfo };
                }
                
                window.scrollTo(0, 0);
                setCurrentView('main');
              }}
              className="flex-1 py-3 bg-teal-500 text-white rounded-xl hover:bg-teal-600 transition-colors active:scale-[0.98]"
            >
              Save Changes
            </button>
          </div>

          {/* Preview Section */}
          <div className="mt-6 p-4 bg-gray-50 rounded-xl border border-gray-200">
            <div className="text-xs text-gray-500 mb-3 flex items-center gap-1.5">
              <Eye className="w-3.5 h-3.5" />
              Preview (how it appears on your profile)
            </div>
            
            {professionalInfo.address || professionalInfo.phone || professionalInfo.email || professionalInfo.website ? (
              <div className="space-y-2">
                {professionalInfo.address && (
                  <div className="flex items-start gap-2 text-xs">
                    <MapPin className="w-3 h-3 text-gray-500 mt-0.5" />
                    <span className="text-teal-700">{professionalInfo.address}</span>
                  </div>
                )}
                {professionalInfo.phone && (
                  <div className="flex items-start gap-2 text-xs">
                    <Phone className="w-3 h-3 text-gray-500 mt-0.5" />
                    <span className="text-teal-700">{professionalInfo.phone}</span>
                  </div>
                )}
                {professionalInfo.email && (
                  <div className="flex items-start gap-2 text-xs">
                    <Mail className="w-3 h-3 text-gray-500 mt-0.5" />
                    <span className="text-teal-700 break-all">{professionalInfo.email}</span>
                  </div>
                )}
                {professionalInfo.website && (
                  <div className="flex items-start gap-2 text-xs">
                    <Globe className="w-3 h-3 text-gray-500 mt-0.5" />
                    <span className="text-teal-700 break-all">{professionalInfo.website}</span>
                  </div>
                )}
              </div>
            ) : (
              <p className="text-xs text-gray-400 italic">No information added yet</p>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Notification Settings View
  if (currentView === 'notifications-settings') {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white pb-16">
        <div className="sticky top-0 z-10 bg-white/95 backdrop-blur-sm border-b border-gray-100 shadow-sm">
          <div className="flex items-center justify-between p-3">
            <div className="flex items-center gap-2">
              <button onClick={handleBackClick} className="text-gray-600 hover:text-teal-500 transition-colors">
                <ArrowLeft className="w-5 h-5" />
              </button>
              <h2 className="text-base">Notification Settings</h2>
            </div>
            <ForumHeader
              unreadNotifications={unreadNotifications}
              onOpenNotifications={() => onNavigate('notifications')}
              onOpenSaved={() => onNavigate('saved')}
              onOpenSettings={() => onNavigate('settings')}
            />
          </div>
        </div>

        <div className="divide-y divide-gray-100">
          {/* Push Notifications */}
          <div className="p-4">
            <h3 className="text-xs text-gray-500 mb-3 px-1">PUSH NOTIFICATIONS</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm text-gray-900">Comments</div>
                  <div className="text-xs text-gray-500">Get notified when someone comments</div>
                </div>
                <label className="relative inline-block w-11 h-6">
                  <input type="checkbox" defaultChecked className="sr-only peer" />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-teal-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-teal-500"></div>
                </label>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm text-gray-900">Mentions</div>
                  <div className="text-xs text-gray-500">Get notified when someone mentions you</div>
                </div>
                <label className="relative inline-block w-11 h-6">
                  <input type="checkbox" defaultChecked className="sr-only peer" />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-teal-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-teal-500"></div>
                </label>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm text-gray-900">Upvotes</div>
                  <div className="text-xs text-gray-500">Get notified when someone upvotes your post</div>
                </div>
                <label className="relative inline-block w-11 h-6">
                  <input type="checkbox" defaultChecked className="sr-only peer" />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-teal-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-teal-500"></div>
                </label>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm text-gray-900">New Followers</div>
                  <div className="text-xs text-gray-500">Get notified when someone follows you</div>
                </div>
                <label className="relative inline-block w-11 h-6">
                  <input type="checkbox" defaultChecked className="sr-only peer" />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-teal-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-teal-500"></div>
                </label>
              </div>
            </div>
          </div>

          {/* ADMIN NOTIFICATIONS - Only shown to admins/moderators */}
          {isAdminOrModerator && (
            <>
              {/* Reports & Moderation */}
              <div className="p-4 bg-red-50/30">
                <h3 className="text-xs text-red-600 mb-3 px-1 flex items-center gap-1">
                  🚨 ADMIN: REPORTS & MODERATION
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="text-sm text-gray-900">New Content Reports</div>
                      <div className="text-xs text-gray-500">Notify when posts/comments are reported</div>
                    </div>
                    <select className="px-2 py-1 text-xs bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-400 flex-shrink-0">
                      <option>All</option>
                      <option>High Priority</option>
                      <option>Off</option>
                    </select>
                  </div>

                  <div className="flex items-center justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="text-sm text-gray-900">New User Reports</div>
                      <div className="text-xs text-gray-500">Notify when users are reported</div>
                    </div>
                    <select className="px-2 py-1 text-xs bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-400 flex-shrink-0">
                      <option>All</option>
                      <option>High Priority</option>
                      <option>Off</option>
                    </select>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="text-sm text-gray-900">Ban Appeal Submissions</div>
                      <div className="text-xs text-gray-500">Notify when users submit appeals</div>
                    </div>
                    <label className="relative inline-block w-11 h-6 flex-shrink-0">
                      <input type="checkbox" defaultChecked className="sr-only peer" />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-red-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-500"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="text-sm text-gray-900">Spam Detection Alerts</div>
                      <div className="text-xs text-gray-500">Notify when spam is auto-detected</div>
                    </div>
                    <label className="relative inline-block w-11 h-6 flex-shrink-0">
                      <input type="checkbox" defaultChecked className="sr-only peer" />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-red-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-500"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="text-sm text-gray-900">Critical Reports (5+ on same content)</div>
                      <div className="text-xs text-gray-500">Urgent: Multiple reports on same item</div>
                    </div>
                    <label className="relative inline-block w-11 h-6 flex-shrink-0">
                      <input type="checkbox" defaultChecked className="sr-only peer" />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-red-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-500"></div>
                    </label>
                  </div>
                </div>
              </div>

              {/* Community Management */}
              <div className="p-4 bg-purple-50/30">
                <h3 className="text-xs text-purple-600 mb-3 px-1 flex items-center gap-1">
                  👥 ADMIN: COMMUNITY MANAGEMENT
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="text-sm text-gray-900">New User Registrations</div>
                      <div className="text-xs text-gray-500">Notify when new users join</div>
                    </div>
                    <label className="relative inline-block w-11 h-6 flex-shrink-0">
                      <input type="checkbox" className="sr-only peer" />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-500"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="text-sm text-gray-900">Verification Requests</div>
                      <div className="text-xs text-gray-500">Vet/Trainer verification submissions</div>
                    </div>
                    <label className="relative inline-block w-11 h-6 flex-shrink-0">
                      <input type="checkbox" defaultChecked className="sr-only peer" />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-500"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="text-sm text-gray-900">Ban/Suspension Activities</div>
                      <div className="text-xs text-gray-500">Track all ban and suspension actions</div>
                    </div>
                    <label className="relative inline-block w-11 h-6 flex-shrink-0">
                      <input type="checkbox" defaultChecked className="sr-only peer" />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-500"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="text-sm text-gray-900">Keyword Blacklist Triggers</div>
                      <div className="text-xs text-gray-500">Notify when blacklisted words are detected</div>
                    </div>
                    <label className="relative inline-block w-11 h-6 flex-shrink-0">
                      <input type="checkbox" defaultChecked className="sr-only peer" />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-500"></div>
                    </label>
                  </div>
                </div>
              </div>

              {/* Support & Tickets */}
              <div className="p-4 bg-teal-50/30">
                <h3 className="text-xs text-teal-600 mb-3 px-1 flex items-center gap-1">
                  🎫 ADMIN: SUPPORT & TICKETS
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="text-sm text-gray-900">New Support Tickets</div>
                      <div className="text-xs text-gray-500">Notify when users submit new tickets</div>
                    </div>
                    <select className="px-2 py-1 text-xs bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-400 flex-shrink-0">
                      <option>All</option>
                      <option>High Priority</option>
                      <option>Off</option>
                    </select>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="text-sm text-gray-900">New Ticket Replies</div>
                      <div className="text-xs text-gray-500">Notify when users reply to tickets</div>
                    </div>
                    <label className="relative inline-block w-11 h-6 flex-shrink-0">
                      <input type="checkbox" defaultChecked className="sr-only peer" />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-teal-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-teal-500"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="text-sm text-gray-900">Ticket Assignments</div>
                      <div className="text-xs text-gray-500">Notify when a ticket is assigned to you</div>
                    </div>
                    <label className="relative inline-block w-11 h-6 flex-shrink-0">
                      <input type="checkbox" defaultChecked className="sr-only peer" />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-teal-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-teal-500"></div>
                    </label>
                  </div>
                </div>
              </div>

              {/* Content Moderation */}
              <div className="p-4 bg-orange-50/30">
                <h3 className="text-xs text-orange-600 mb-3 px-1 flex items-center gap-1">
                  🔍 ADMIN: CONTENT MODERATION
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="text-sm text-gray-900">AI Moderation Flags</div>
                      <div className="text-xs text-gray-500">Image/video content flagged by AI</div>
                    </div>
                    <select className="px-2 py-1 text-xs bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 flex-shrink-0">
                      <option>All</option>
                      <option>High Priority</option>
                      <option>Off</option>
                    </select>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="text-sm text-gray-900">Profanity Filter Triggers</div>
                      <div className="text-xs text-gray-500">Notify when profanity is detected</div>
                    </div>
                    <label className="relative inline-block w-11 h-6 flex-shrink-0">
                      <input type="checkbox" defaultChecked className="sr-only peer" />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-orange-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-500"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="text-sm text-gray-900">Auto-Moderated Content</div>
                      <div className="text-xs text-gray-500">Content auto-removed by system</div>
                    </div>
                    <label className="relative inline-block w-11 h-6 flex-shrink-0">
                      <input type="checkbox" defaultChecked className="sr-only peer" />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-orange-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-500"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="text-sm text-gray-900">Mass Edit Detection</div>
                      <div className="text-xs text-gray-500">User editing 5+ posts within 1 hour</div>
                    </div>
                    <label className="relative inline-block w-11 h-6 flex-shrink-0">
                      <input type="checkbox" className="sr-only peer" />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-orange-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-500"></div>
                    </label>
                  </div>
                </div>
              </div>

              {/* Monetization & Ads */}
              <div className="p-4 bg-green-50/30">
                <h3 className="text-xs text-green-600 mb-3 px-1 flex items-center gap-1">
                  💰 ADMIN: MONETIZATION & ADS
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="text-sm text-gray-900">Ad Performance Drops</div>
                      <div className="text-xs text-gray-500">Alert when CTR drops below 1% (requires analytics)</div>
                    </div>
                    <label className="relative inline-block w-11 h-6 flex-shrink-0">
                      <input type="checkbox" defaultChecked className="sr-only peer" />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-green-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-500"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="text-sm text-gray-900">Payment Issues</div>
                      <div className="text-xs text-gray-500">Billing and payment failures</div>
                    </div>
                    <label className="relative inline-block w-11 h-6 flex-shrink-0">
                      <input type="checkbox" defaultChecked className="sr-only peer" />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-green-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-500"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="text-sm text-gray-900">Premium Subscription Changes</div>
                      <div className="text-xs text-gray-500">Track premium upgrades/cancellations</div>
                    </div>
                    <label className="relative inline-block w-11 h-6 flex-shrink-0">
                      <input type="checkbox" className="sr-only peer" />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-green-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-500"></div>
                    </label>
                  </div>
                </div>
              </div>

              {/* Technical & System */}
              <div className="p-4 bg-blue-50/30">
                <h3 className="text-xs text-blue-600 mb-3 px-1 flex items-center gap-1">
                  ⚙️ ADMIN: TECHNICAL & SYSTEM
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="text-sm text-gray-900">System Errors</div>
                      <div className="text-xs text-gray-500">Critical errors and API failures</div>
                    </div>
                    <select className="px-2 py-1 text-xs bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 flex-shrink-0">
                      <option>Critical Only</option>
                      <option>All</option>
                      <option>Off</option>
                    </select>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="text-sm text-gray-900">Performance Degradation</div>
                      <div className="text-xs text-gray-500">Slow response times detected</div>
                    </div>
                    <label className="relative inline-block w-11 h-6 flex-shrink-0">
                      <input type="checkbox" defaultChecked className="sr-only peer" />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-500"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="text-sm text-gray-900">Security Alerts</div>
                      <div className="text-xs text-gray-500">Suspicious activity and breach attempts</div>
                    </div>
                    <label className="relative inline-block w-11 h-6 flex-shrink-0">
                      <input type="checkbox" defaultChecked className="sr-only peer" />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-500"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="text-sm text-gray-900">Database Backup Status</div>
                      <div className="text-xs text-gray-500">Daily backup success/failure</div>
                    </div>
                    <label className="relative inline-block w-11 h-6 flex-shrink-0">
                      <input type="checkbox" className="sr-only peer" />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-500"></div>
                    </label>
                  </div>
                </div>
              </div>

              {/* Analytics & Growth */}
              <div className="p-4 bg-indigo-50/30">
                <h3 className="text-xs text-indigo-600 mb-3 px-1 flex items-center gap-1">
                  📊 ADMIN: ANALYTICS & GROWTH
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="text-sm text-gray-900">Statistics Digest</div>
                      <div className="text-xs text-gray-500">Frequency of stats summary</div>
                    </div>
                    <select className="px-2 py-1 text-xs bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 flex-shrink-0">
                      <option>Daily</option>
                      <option>Weekly</option>
                      <option>Monthly</option>
                      <option>Off</option>
                    </select>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="text-sm text-gray-900">Engagement Drop Alerts</div>
                      <div className="text-xs text-gray-500">Alert when activity drops 20%+</div>
                    </div>
                    <label className="relative inline-block w-11 h-6 flex-shrink-0">
                      <input type="checkbox" defaultChecked className="sr-only peer" />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-500"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="text-sm text-gray-900">Trending Content</div>
                      <div className="text-xs text-gray-500">Notify about viral posts</div>
                    </div>
                    <label className="relative inline-block w-11 h-6 flex-shrink-0">
                      <input type="checkbox" className="sr-only peer" />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-500"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="text-sm text-gray-900">Community Milestones</div>
                      <div className="text-xs text-gray-500">1000 users, 10k posts, etc.</div>
                    </div>
                    <label className="relative inline-block w-11 h-6 flex-shrink-0">
                      <input type="checkbox" defaultChecked className="sr-only peer" />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-500"></div>
                    </label>
                  </div>
                </div>
              </div>

              {/* Notification Preferences */}
              <div className="p-4 bg-gray-50">
                <h3 className="text-xs text-gray-500 mb-3 px-1">NOTIFICATION PREFERENCES</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="text-sm text-gray-900">Quiet Hours</div>
                      <div className="text-xs text-gray-500">Mute notifications 22:00 - 08:00</div>
                    </div>
                    <label className="relative inline-block w-11 h-6 flex-shrink-0">
                      <input type="checkbox" defaultChecked className="sr-only peer" />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-teal-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-teal-500"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="text-sm text-gray-900">Batch Notifications</div>
                      <div className="text-xs text-gray-500">Group similar notifications together</div>
                    </div>
                    <label className="relative inline-block w-11 h-6 flex-shrink-0">
                      <input type="checkbox" defaultChecked className="sr-only peer" />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-teal-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-teal-500"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="text-sm text-gray-900">Critical Only Mode</div>
                      <div className="text-xs text-gray-500">Only show urgent admin alerts</div>
                    </div>
                    <label className="relative inline-block w-11 h-6 flex-shrink-0">
                      <input type="checkbox" className="sr-only peer" />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-teal-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-teal-500"></div>
                    </label>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    );
  }

  // Privacy & Safety View
  if (currentView === 'privacy') {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
        <div className="sticky top-0 z-10 bg-white/95 backdrop-blur-sm border-b border-gray-100 shadow-sm">
          <div className="flex items-center justify-between p-3">
            <div className="flex items-center gap-2">
              <button onClick={handleBackClick} className="text-gray-600 hover:text-teal-500 transition-colors">
                <ArrowLeft className="w-5 h-5" />
              </button>
              <h2 className="text-base">Privacy & Safety</h2>
            </div>
            <ForumHeader
              unreadNotifications={unreadNotifications}
              onOpenNotifications={() => onNavigate('notifications')}
              onOpenSaved={() => onNavigate('saved')}
              onOpenSettings={() => onNavigate('settings')}
            />
          </div>
        </div>

        <div className="divide-y divide-gray-100">
          {/* Profile Visibility */}
          <div className="p-4">
            <h3 className="text-xs text-gray-500 mb-3 px-1">PROFILE VISIBILITY</h3>
            
            {/* Info about public profiles */}
            <div className="mb-4 p-3 bg-teal-50 border border-teal-100 rounded-xl">
              <p className="text-xs text-teal-800">
                All profiles are public to maintain trust and transparency in our community. This helps others verify expertise and post history.
              </p>
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-gray-900">Show online status</div>
                <div className="text-xs text-gray-500">
                  {showOnlineStatus ? 'Others can see when you\'re active' : 'Your online status is hidden'}
                </div>
              </div>
              <label className="relative inline-block w-11 h-6">
                <input 
                  type="checkbox" 
                  checked={showOnlineStatus}
                  onChange={(e) => {
                    setShowOnlineStatus(e.target.checked);
                    // In real app: update backend
                    currentUser.showOnlineStatus = e.target.checked;
                  }}
                  className="sr-only peer" 
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-teal-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-teal-500"></div>
              </label>
            </div>
          </div>

          {/* Data & Privacy */}
          <div className="p-4">
            <h3 className="text-xs text-gray-500 mb-3 px-1">DATA & PRIVACY</h3>
            <button 
              onClick={() => setShowChangePasswordModal(true)}
              className="w-full flex items-center gap-2 px-3 py-2.5 hover:bg-gray-50 rounded-xl transition-colors text-sm"
            >
              <Lock className="w-4 h-4 text-gray-600" />
              <span className="flex-1 text-left">Change password</span>
              <ChevronRight className="w-4 h-4 text-gray-400" />
            </button>
          </div>

          {/* Blocked Users */}
          <div className="p-4">
            <h3 className="text-xs text-gray-500 mb-3 px-1">SOCIAL</h3>
            <button 
              onClick={() => {
                window.scrollTo(0, 0);
                setCurrentView('following-users');
              }}
              className="w-full flex items-center gap-2 px-3 py-2.5 hover:bg-gray-50 rounded-xl transition-colors text-sm"
            >
              <Users className="w-4 h-4 text-gray-600" />
              <span className="flex-1 text-left">Manage following</span>
              <div className="px-2 py-0.5 bg-gray-100 rounded-full text-xs text-gray-600">{followingUsersList.length}</div>
              <ChevronRight className="w-4 h-4 text-gray-400" />
            </button>
            <button 
              onClick={() => {
                window.scrollTo(0, 0);
                setCurrentView('blocked-users');
              }}
              className="w-full flex items-center gap-2 px-3 py-2.5 hover:bg-gray-50 rounded-xl transition-colors text-sm mt-1"
            >
              <UserX className="w-4 h-4 text-gray-600" />
              <span className="flex-1 text-left">Manage blocked users</span>
              <div className="px-2 py-0.5 bg-gray-100 rounded-full text-xs text-gray-600">{blockedUsersList.length}</div>
              <ChevronRight className="w-4 h-4 text-gray-400" />
            </button>
          </div>
        </div>

        {/* Change Password Modal */}
        <ChangePasswordModal 
          isOpen={showChangePasswordModal}
          onClose={() => setShowChangePasswordModal(false)}
        />
      </div>
    );
  }

  // Blocked Users Management View
  if (currentView === 'blocked-users') {
    const handleUnblock = (userId: string) => {
      blockedUsers.delete(userId);
      setBlockedUsersList(Array.from(blockedUsers));
    };

    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
        <div className="sticky top-0 z-10 bg-white/95 backdrop-blur-sm border-b border-gray-100 shadow-sm">
          <div className="flex items-center justify-between p-3">
            <div className="flex items-center gap-2">
              <button onClick={handleBackClick} className="text-gray-600 hover:text-teal-500 transition-colors">
                <ArrowLeft className="w-5 h-5" />
              </button>
              <h2 className="text-base">Blocked Users</h2>
            </div>
            <ForumHeader
              unreadNotifications={unreadNotifications}
              onOpenNotifications={() => onNavigate('notifications')}
              onOpenSaved={() => onNavigate('saved')}
              onOpenSettings={() => onNavigate('settings')}
            />
          </div>
        </div>

        <div className="p-4">
          {blockedUsersList.length === 0 ? (
            <div className="text-center py-12">
              <UserX className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-sm text-gray-500">No blocked users</p>
              <p className="text-xs text-gray-400 mt-1">You haven't blocked anyone yet</p>
            </div>
          ) : (
            <div className="space-y-2">
              {blockedUsersList.map(userId => {
                const user = mockUsers.find(u => u.id === userId);
                if (!user) return null;

                return (
                  <div key={userId} className="flex items-center gap-3 p-3 bg-white rounded-xl border border-gray-100">
                    <div 
                      onClick={() => onViewProfile(userId)}
                      className="flex items-center gap-3 flex-1 min-w-0 cursor-pointer hover:opacity-70 transition-opacity"
                    >
                      <img
                        src={user.avatar}
                        alt={user.username}
                        className="w-12 h-12 rounded-full"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="text-sm text-gray-900 truncate">{user.username}</div>
                        <div className="text-xs text-gray-500 truncate">{user.bio || 'No bio'}</div>
                      </div>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleUnblock(userId);
                      }}
                      className="px-3 py-1.5 text-xs text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors flex-shrink-0"
                    >
                      Unblock
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    );
  }

  // Following Users Management View
  if (currentView === 'following-users') {
    const handleUnfollow = (userId: string) => {
      followingUsers.delete(userId);
      setFollowingUsersList(Array.from(followingUsers));
    };

    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
        <div className="sticky top-0 z-10 bg-white/95 backdrop-blur-sm border-b border-gray-100 shadow-sm">
          <div className="flex items-center justify-between p-3">
            <div className="flex items-center gap-2">
              <button onClick={handleBackClick} className="text-gray-600 hover:text-teal-500 transition-colors">
                <ArrowLeft className="w-5 h-5" />
              </button>
              <h2 className="text-base">Following Users</h2>
            </div>
            <ForumHeader
              unreadNotifications={unreadNotifications}
              onOpenNotifications={() => onNavigate('notifications')}
              onOpenSaved={() => onNavigate('saved')}
              onOpenSettings={() => onNavigate('settings')}
            />
          </div>
        </div>

        <div className="p-4">
          {followingUsersList.length === 0 ? (
            <div className="text-center py-12">
              <Users className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-sm text-gray-500">No following users</p>
              <p className="text-xs text-gray-400 mt-1">You haven't followed anyone yet</p>
            </div>
          ) : (
            <div className="space-y-2">
              {followingUsersList.map(userId => {
                const user = mockUsers.find(u => u.id === userId);
                if (!user) return null;

                return (
                  <div key={userId} className="flex items-center gap-3 p-3 bg-white rounded-xl border border-gray-100">
                    <div 
                      onClick={() => onViewProfile(userId)}
                      className="flex items-center gap-3 flex-1 min-w-0 cursor-pointer hover:opacity-70 transition-opacity"
                    >
                      <img
                        src={user.avatar}
                        alt={user.username}
                        className="w-12 h-12 rounded-full"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="text-sm text-gray-900 truncate">{user.username}</div>
                        <div className="text-xs text-gray-500 truncate">{user.bio || 'No bio'}</div>
                      </div>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleUnfollow(userId);
                      }}
                      className="px-3 py-1.5 text-xs text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors flex-shrink-0"
                    >
                      Unfollow
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    );
  }

  // Achievements View
  if (currentView === 'achievements') {
    return <AchievementsView onBack={() => {
      window.scrollTo(0, 0);
      setCurrentView('main');
    }} />;
  }

  // Main Settings Menu
  return (
    <>
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-white/95 backdrop-blur-sm border-b border-gray-100 shadow-sm">
        <div className="flex items-center justify-between p-3">
          <div className="flex items-center gap-2">
            <button onClick={onBack} className="text-gray-600 hover:text-teal-500 transition-colors">
              <ArrowLeft className="w-5 h-5" />
            </button>
            <h2 className="text-base">Settings</h2>
          </div>
          <ForumHeader
            unreadNotifications={unreadNotifications}
            onOpenNotifications={() => onNavigate('notifications')}
            onOpenSaved={() => onNavigate('saved')}
            onOpenSettings={() => onNavigate('settings')}
          />
        </div>
      </div>

      {/* Profile Section */}
      <div className="p-4 border-b border-gray-100">
        <div className="flex items-center gap-3 mb-3">
          <img
            src={activeUser.avatar}
            alt={activeUser.username}
            className="w-16 h-16 rounded-full ring-4 ring-teal-100"
          />
          <div className="flex-1 min-w-0">
            <h3 className="text-base mb-0.5 truncate">{activeUser.username}</h3>
            <p className="text-sm text-gray-600">{activeUser.role === 'admin' ? 'Administrator' : activeUser.role === 'moderator' ? 'Moderator' : 'Member since Dec 2024'}</p>
          </div>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={() => onViewProfile(activeUser.id)}
            className="flex-1 px-4 py-2.5 bg-white border-2 border-teal-400 text-teal-600 text-sm rounded-2xl hover:bg-teal-50 transition-all shadow-sm"
          >
            View Profile
          </button>
          <button 
            onClick={() => {
              window.scrollTo(0, 0);
              setCurrentView('account');
            }}
            className="flex-1 px-4 py-2.5 bg-gradient-to-r from-teal-400 to-teal-500 text-white text-sm rounded-2xl hover:from-teal-500 hover:to-teal-600 transition-all shadow-md"
          >
            Edit Profile
          </button>
        </div>
      </div>

      {/* Settings Options */}
      <div className="divide-y divide-gray-200">
        {/* Admin/Moderator Section - AT THE TOP! */}
        {isAdminOrModerator && (
          <div className="p-3">
            <h3 className="text-gray-500 text-xs mb-2 px-2">
              {isAdmin ? '🔴 ADMIN PANEL' : '🟡 MODERATOR PANEL'}
            </h3>
            
            {/* Report Center */}
            <button
              onClick={() => onNavigate('reports')}
              className="w-full flex items-center gap-2 px-3 py-2.5 bg-red-50 hover:bg-red-100 rounded-xl transition-colors mb-2"
            >
              <AlertOctagon className="w-4 h-4 text-red-600" />
              <div className="flex-1 text-left">
                <div className="text-sm text-red-900">Report Center</div>
                <div className="text-xs text-red-700">Review community reports</div>
              </div>
              <div className="px-2 py-0.5 bg-red-500 text-white rounded-full text-xs">3</div>
              <ChevronRight className="w-4 h-4 text-red-600" />
            </button>

            {/* Moderation Queue */}
            <button
              onClick={() => onNavigate('moderation')}
              className="w-full flex items-center gap-2 px-3 py-2.5 bg-purple-50 hover:bg-purple-100 rounded-xl transition-colors mb-2"
            >
              <Shield className="w-4 h-4 text-purple-600" />
              <div className="flex-1 text-left">
                <div className="text-sm text-purple-900">Moderation Queue</div>
                <div className="text-xs text-purple-700">Review auto-blocked content</div>
              </div>
              <ChevronRight className="w-4 h-4 text-purple-600" />
            </button>

            {/* Support Tickets - Admin/Moderator */}
            <button
              onClick={() => {
                window.scrollTo(0, 0);
                setAdminInitialTab('tickets');
                setCurrentView('admin');
              }}
              className="w-full flex items-center gap-2 px-3 py-2.5 bg-blue-50 hover:bg-blue-100 rounded-xl transition-colors mb-2"
            >
              <Ticket className="w-4 h-4 text-blue-600" />
              <div className="flex-1 text-left">
                <div className="text-sm text-blue-900">Support Tickets</div>
                <div className="text-xs text-blue-700">Manage user support requests</div>
              </div>
              <div className="px-2 py-0.5 bg-blue-500 text-white rounded-full text-xs">2</div>
              <ChevronRight className="w-4 h-4 text-blue-600" />
            </button>

            {/* Broadcast Notifications - Admin/Moderator */}
            <button
              onClick={() => {
                window.scrollTo(0, 0);
                setAdminInitialTab('broadcast');
                setCurrentView('admin');
              }}
              className="w-full flex items-center gap-2 px-3 py-2.5 bg-indigo-50 hover:bg-indigo-100 rounded-xl transition-colors mb-2"
            >
              <Send className="w-4 h-4 text-indigo-600" />
              <div className="flex-1 text-left">
                <div className="text-sm text-indigo-900">Broadcast Notifications</div>
                <div className="text-xs text-indigo-700">Send notifications to user groups</div>
              </div>
              <ChevronRight className="w-4 h-4 text-indigo-600" />
            </button>

            {/* Verification Requests - Admin/Moderator */}
            <button
              onClick={() => {
                window.scrollTo(0, 0);
                setAdminInitialTab('verification' as any); // Cast as any because 'verification' might not be in the initial state type yet
                setCurrentView('admin');
              }}
              className="w-full flex items-center gap-2 px-3 py-2.5 bg-teal-50 hover:bg-teal-100 rounded-xl transition-colors mb-2"
            >
              <Shield className="w-4 h-4 text-teal-600" />
              <div className="flex-1 text-left">
                <div className="text-sm text-teal-900">Verification Requests</div>
                <div className="text-xs text-teal-700">Review vet/trainer applications</div>
              </div>
              {/* Mock count of pending verifications */}
              <div className="px-2 py-0.5 bg-teal-500 text-white rounded-full text-xs">3</div>
              <ChevronRight className="w-4 h-4 text-teal-600" />
            </button>

            {/* Analytics - Admin/Moderator */}
            <button
              onClick={() => onNavigate('analytics')}
              className="w-full flex items-center gap-2 px-3 py-2.5 bg-teal-50 hover:bg-teal-100 rounded-xl transition-colors mb-2"
            >
              <BarChart3 className="w-4 h-4 text-teal-600" />
              <div className="flex-1 text-left">
                <div className="text-sm text-teal-900">Forum Analytics</div>
                <div className="text-xs text-teal-700">View statistics & insights</div>
              </div>
              <ChevronRight className="w-4 h-4 text-teal-600" />
            </button>

            {/* Admin Dashboard - ONLY FOR ADMINS */}
            {isAdmin && (
              <>
                <button
                  onClick={() => {
                    window.scrollTo(0, 0);
                    setAdminInitialTab('ads');
                    setCurrentView('admin');
                  }}
                  className="w-full flex items-center gap-2 px-3 py-2.5 bg-orange-50 hover:bg-orange-100 rounded-xl transition-colors mb-2"
                >
                  <SettingsIcon className="w-4 h-4 text-orange-600" />
                  <div className="flex-1 text-left">
                    <div className="text-sm text-orange-900">Ad Manager</div>
                    <div className="text-xs text-orange-700">Manage sponsored ads & monetization</div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-orange-600" />
                </button>

                <button
                  onClick={() => {
                    window.scrollTo(0, 0);
                    setCurrentView('user-management');
                  }}
                  className="w-full flex items-center gap-2 px-3 py-2.5 bg-indigo-50 hover:bg-indigo-100 rounded-xl transition-colors mb-2"
                >
                  <UserCog className="w-4 h-4 text-indigo-600" />
                  <div className="flex-1 text-left">
                    <div className="text-sm text-indigo-900">User Management</div>
                    <div className="text-xs text-indigo-700">Manage roles & permissions</div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-indigo-600" />
                </button>
              </>
            )}
          </div>
        )}
        
        {/* Account Settings */}
        <div className="p-3">
          <h3 className="text-gray-500 text-xs mb-2 px-2">ACCOUNT</h3>
          
          <button
            onClick={() => {
              window.scrollTo(0, 0);
              setCurrentView('account');
            }}
            className="w-full flex items-center gap-2 px-3 py-2.5 hover:bg-gray-50 rounded-xl transition-colors text-sm"
          >
            <User className="w-4 h-4 text-gray-600" />
            <span className="flex-1 text-left">Account Information</span>
            <ChevronRight className="w-4 h-4 text-gray-400" />
          </button>

          <button
            onClick={() => {
              window.scrollTo(0, 0);
              setCurrentView('achievements');
            }}
            className="w-full flex items-center gap-2 px-3 py-2.5 bg-purple-50 hover:bg-purple-100 rounded-xl transition-colors"
          >
            <Trophy className="w-4 h-4 text-purple-600" />
            <div className="flex-1 text-left">
              <div className="text-sm text-purple-900">Achievements</div>
              <div className="text-xs text-purple-700">View & manage your badges</div>
            </div>
            <ChevronRight className="w-4 h-4 text-purple-600" />
          </button>

          <button
            onClick={() => {
              window.scrollTo(0, 0);
              setCurrentView('notifications-settings');
            }}
            className="w-full flex items-center gap-2 px-3 py-2.5 hover:bg-gray-50 rounded-xl transition-colors text-sm"
          >
            <Bell className="w-4 h-4 text-gray-600" />
            <span className="flex-1 text-left">Notifications</span>
            <ChevronRight className="w-4 h-4 text-gray-400" />
          </button>

          <button
            onClick={() => {
              window.scrollTo(0, 0);
              setCurrentView('privacy');
            }}
            className="w-full flex items-center gap-2 px-3 py-2.5 hover:bg-gray-50 rounded-xl transition-colors text-sm"
          >
            <Shield className="w-4 h-4 text-gray-600" />
            <span className="flex-1 text-left">Privacy & Safety</span>
            <ChevronRight className="w-4 h-4 text-gray-400" />
          </button>
        </div>

        {/* Language Settings */}
        <div className="p-3">
          <h3 className="text-gray-500 text-xs mb-2 px-2">LANGUAGE</h3>
          
          <button
            onClick={() => {
              const newLang = currentLanguage === 'en' ? 'lt' : 'en';
              setCurrentLanguage(newLang);
              onLanguageChange(newLang);
            }}
            className="w-full flex items-center gap-2 px-3 py-2.5 hover:bg-gray-50 rounded-xl transition-colors text-sm"
          >
            <Languages className="w-4 h-4 text-gray-600" />
            <div className="flex-1 text-left">
              <div className="text-sm">Language</div>
              <div className="text-xs text-gray-500">
                {currentLanguage === 'en' ? 'ENG - English' : 'LT - Lietuvių'}
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-gray-400" />
          </button>
        </div>

        {/* Professional Section */}
        <div className="p-3">
          <h3 className="text-gray-500 text-xs mb-2 px-2">PROFESSIONAL</h3>
          
          {isProfessional ? (
            // Already Verified - Show Professional Info button
            <button 
              onClick={() => {
                window.scrollTo(0, 0);
                setCurrentView('professional-info');
              }}
              className="w-full flex items-center gap-2 px-3 py-2.5 bg-gradient-to-br from-teal-50 via-blue-50 to-teal-50 hover:from-teal-100 hover:via-blue-100 hover:to-teal-100 border border-teal-200 rounded-xl transition-colors"
            >
              <BadgeCheck className="w-4 h-4 text-teal-600" />
              <div className="flex-1 text-left">
                <div className="text-sm text-teal-900 flex items-center gap-1.5">
                  Professional Information
                  {(currentUser.professionalInfo?.address || currentUser.professionalInfo?.phone || currentUser.professionalInfo?.email || currentUser.professionalInfo?.website) && (
                    <span className="text-xs px-1.5 py-0.5 bg-teal-200 text-teal-800 rounded">✓</span>
                  )}
                </div>
                <div className="text-xs text-teal-700">
                  {(currentUser.professionalInfo?.address || currentUser.professionalInfo?.phone || currentUser.professionalInfo?.email || currentUser.professionalInfo?.website) ? 'Edit your contact details' : 'Add your contact details'}
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-teal-600" />
            </button>
          ) : (
            // Not Verified - Show Get Verified button
            <button 
              onClick={() => onNavigate('verification')}
              className="w-full flex items-center gap-2 px-3 py-2.5 bg-teal-50 hover:bg-teal-100 rounded-xl transition-colors"
            >
              <BadgeCheck className="w-4 h-4 text-teal-600" />
              <div className="flex-1 text-left">
                <div className="text-sm text-teal-900">Get Verified</div>
                <div className="text-xs text-teal-700">Verify as Vet or Trainer</div>
              </div>
              <ChevronRight className="w-4 h-4 text-teal-600" />
            </button>
          )}
        </div>

        {/* About */}
        <div className="p-3">
          <h3 className="text-gray-500 text-xs mb-2 px-2">ABOUT</h3>
          
          <button 
            onClick={() => onNavigate('terms')}
            className="w-full flex items-center gap-2 px-3 py-2.5 hover:bg-gray-50 rounded-xl transition-colors text-sm"
          >
            <span className="flex-1 text-left">Terms of Service</span>
            <ChevronRight className="w-4 h-4 text-gray-400" />
          </button>

          <button 
            onClick={() => onNavigate('privacy')}
            className="w-full flex items-center gap-2 px-3 py-2.5 hover:bg-gray-50 rounded-xl transition-colors text-sm"
          >
            <span className="flex-1 text-left">Privacy Policy</span>
            <ChevronRight className="w-4 h-4 text-gray-400" />
          </button>

          <button 
            onClick={() => onNavigate('guidelines')}
            className="w-full flex items-center gap-2 px-3 py-2.5 hover:bg-gray-50 rounded-xl transition-colors text-sm"
          >
            <span className="flex-1 text-left">Community Guidelines</span>
            <ChevronRight className="w-4 h-4 text-gray-400" />
          </button>

          <button 
            onClick={() => onNavigate('contact')}
            className="w-full flex items-center gap-2 px-3 py-2.5 hover:bg-gray-50 rounded-xl transition-colors text-sm"
          >
            <span className="flex-1 text-left">Contact Support</span>
            <ChevronRight className="w-4 h-4 text-gray-400" />
          </button>

          <button 
            onClick={() => onNavigate('supportTickets')}
            className="w-full flex items-center gap-2 px-3 py-2.5 hover:bg-gray-50 rounded-xl transition-colors text-sm"
          >
            <span className="flex-1 text-left">My Support Tickets</span>
            <ChevronRight className="w-4 h-4 text-gray-400" />
          </button>

          <button 
            onClick={() => onNavigate('about')}
            className="w-full flex items-center gap-2 px-3 py-2.5 hover:bg-gray-50 rounded-xl transition-colors text-sm"
          >
            <span className="flex-1 text-left">About</span>
            <ChevronRight className="w-4 h-4 text-gray-400" />
          </button>
        </div>

        {/* Logout */}
        <div className="p-3">
          <button className="w-full flex items-center gap-2 px-3 py-2.5 text-red-600 hover:bg-red-50 rounded-xl transition-colors text-sm">
            <LogOut className="w-4 h-4" />
            <span className="flex-1 text-left">Log Out</span>
          </button>
        </div>
      </div>
      </div>
      
      {/* Change Password Modal - Moved to Privacy view */}
    </>
  );
}