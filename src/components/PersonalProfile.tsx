import { 
  User, Settings, LogOut, ChevronRight, ChevronLeft
} from 'lucide-react';
import { motion } from 'motion/react';
import { useState, useEffect } from 'react';
import { supabase } from '../utils/supabase/client';
import { type Language } from '../utils/i18n';

interface PersonalProfileProps {
  onBack: () => void;
  onNavigate: (view: any) => void;
  onLanguageChange: (lang: Language) => void;
  onSignOut?: () => void;
}

export function PersonalProfile({ onBack, onNavigate, onLanguageChange, onSignOut }: PersonalProfileProps) {
  const [userProfile, setUserProfile] = useState<any>(null);

  useEffect(() => {
    async function fetchProfile() {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        let profileData = null;
        try {
          // Try to fetch profile from 'profiles' or 'users' table if exists
          const { data, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', user.id)
            .single();
          
          if (!error && data) {
            profileData = data;
          }
        } catch (e) {
          // Ignore table not found errors
          console.log('Using default profile data (no profiles table)');
        }
          
        if (profileData) {
          setUserProfile(profileData);
        } else {
          // Fallback to auth metadata
          setUserProfile({
            full_name: user.user_metadata?.full_name || user.email?.split('@')[0],
            avatar_url: user.user_metadata?.avatar_url,
            email: user.email
          });
        }
      }
    }
    fetchProfile();
  }, []);

  const menuItems = [
    { icon: User, label: 'Edit Profile', action: () => onNavigate('editMainProfile') },
    { icon: Settings, label: 'Settings', action: () => onNavigate('appSettings') },
  ];

  const handleSignOut = async () => {
    if (onSignOut) {
      onSignOut();
    } else {
      await supabase.auth.signOut();
      window.location.reload();
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      className="min-h-screen bg-[#F8F9FA] pb-10 font-sans text-slate-900"
    >
      {/* Header */}
      <div className="relative pt-6 pb-4 px-4 flex items-center justify-center">
        <button 
          onClick={onBack}
          className="absolute left-4 p-2 rounded-full hover:bg-gray-100 transition-colors"
        >
          <ChevronLeft className="w-6 h-6 text-slate-800" />
        </button>
        <h1 className="text-lg font-medium text-slate-800">Profile</h1>
      </div>

      {/* Avatar Section */}
      <div className="flex flex-col items-center mt-6 mb-12">
        <div className="w-24 h-24 rounded-full bg-[#D64B74] flex items-center justify-center text-white text-4xl font-normal shadow-sm mb-4 overflow-hidden relative">
          {userProfile?.avatar_url ? (
            <img src={userProfile.avatar_url} alt="Profile" className="w-full h-full object-cover" />
          ) : (
             <span>{userProfile?.full_name?.[0]?.toUpperCase() || 'U'}</span>
          )}
        </div>
        <h2 className="text-xl font-bold text-slate-800">{userProfile?.full_name || userProfile?.email || 'Guest User'}</h2>
        {userProfile?.email && <p className="text-sm text-gray-500">{userProfile.email}</p>}
      </div>

      {/* Menu List */}
      <div className="px-6 space-y-1">
        {menuItems.map((item, index) => (
          <button
            key={index}
            onClick={item.action}
            className="w-full flex items-center justify-between py-4 group"
          >
            <div className="flex items-center gap-4">
              <item.icon className="w-6 h-6 text-gray-500 group-hover:text-slate-800 transition-colors" strokeWidth={1.5} />
              <span className="text-base font-medium text-slate-600 group-hover:text-slate-900 transition-colors">
                {item.label}
              </span>
            </div>
            <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-gray-600 transition-colors" />
          </button>
        ))}

        {/* Sign Out - Special Style */}
        <button
          className="w-full flex items-center justify-between py-4 mt-2 group"
          onClick={handleSignOut}
        >
          <div className="flex items-center gap-4">
            <LogOut className="w-6 h-6 text-[#E55737] group-hover:text-red-600 transition-colors" strokeWidth={1.5} />
            <span className="text-base font-medium text-[#E55737] group-hover:text-red-600 transition-colors">
              Sign Out
            </span>
          </div>
          <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-gray-600 transition-colors" />
        </button>
      </div>
    </motion.div>
  );
}