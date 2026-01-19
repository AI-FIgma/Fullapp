import { 
  User, Settings, Info, Shield, FileText, Globe, LogOut, ChevronLeft, ChevronRight 
} from 'lucide-react';

interface UserProfileProps {
  onBack: () => void;
  onNavigate: (view: any) => void;
}

export function UserProfile({ onBack, onNavigate }: UserProfileProps) {
  const menuItems = [
    { icon: User, label: 'Edit Profile', action: () => {} },
    { icon: Settings, label: 'Settings', action: () => onNavigate('settings') },
    { icon: Info, label: 'About Us', action: () => onNavigate('about') },
    { icon: Shield, label: 'Privacy Policy', action: () => onNavigate('privacy') },
    { icon: FileText, label: 'Terms of Services', action: () => onNavigate('terms') },
    { icon: Globe, label: 'Change Language', action: () => {} },
  ];

  return (
    <div className="min-h-screen bg-[#F8F9FA] font-sans text-slate-900">
      {/* Header */}
      <div className="flex items-center px-4 py-4 relative bg-transparent">
        <button 
          onClick={onBack}
          className="p-2 -ml-2 rounded-full hover:bg-gray-100 transition-colors"
        >
          <ChevronLeft className="w-6 h-6 text-slate-800" />
        </button>
        <h1 className="absolute left-1/2 -translate-x-1/2 text-lg font-medium text-slate-800">Profile</h1>
      </div>

      <div className="px-5 pt-4 pb-8">
        {/* Profile Info */}
        <div className="flex flex-col items-center mb-10">
          <div className="w-24 h-24 rounded-full bg-[#D64B74] flex items-center justify-center text-white text-4xl font-normal shadow-sm mb-4">
            M
          </div>
          <h2 className="text-xl font-bold text-slate-800">Mantas Akienuk</h2>
        </div>

        {/* Menu Items */}
        <div className="space-y-1">
          {menuItems.map((item, index) => (
            <button
              key={index}
              onClick={item.action}
              className="w-full flex items-center justify-between p-4 hover:bg-white hover:shadow-sm rounded-2xl transition-all group"
            >
              <div className="flex items-center gap-4">
                <item.icon className="w-6 h-6 text-gray-500 group-hover:text-slate-800 transition-colors" strokeWidth={1.5} />
                <span className="text-base font-medium text-slate-700 group-hover:text-slate-900">{item.label}</span>
              </div>
              <ChevronRight className="w-5 h-5 text-gray-300 group-hover:text-gray-400" />
            </button>
          ))}

          {/* Sign Out - Special Style */}
          <button
            className="w-full flex items-center justify-between p-4 mt-4 hover:bg-red-50 rounded-2xl transition-all group"
          >
            <div className="flex items-center gap-4">
              <LogOut className="w-6 h-6 text-[#E45A33]" strokeWidth={1.5} />
              <span className="text-base font-medium text-[#E45A33]">Sign Out</span>
            </div>
            <ChevronRight className="w-5 h-5 text-gray-300 group-hover:text-red-200" />
          </button>
        </div>
      </div>
    </div>
  );
}