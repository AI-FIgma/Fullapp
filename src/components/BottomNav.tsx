import { Home, Search, Bone, MessageCircle, Heart, PawPrint } from 'lucide-react';
import { useTranslation } from '../utils/useTranslation';

interface BottomNavProps {
  currentView: string;
  unreadNotifications?: number;
  onNavigateHome?: () => void;
  onNavigate?: (view: string) => void;
}

export function BottomNav({ currentView, unreadNotifications = 0, onNavigateHome, onNavigate }: BottomNavProps) {
  const { t } = useTranslation();

  const handleNav = (view: string) => {
    if (onNavigate) {
      onNavigate(view);
    } else if (view === 'home' && onNavigateHome) {
      onNavigateHome();
    }
  };

  const isActive = (view: string) => {
    // Mapping currentView to tabs
    if (view === 'home' && currentView === 'home') return true;
    if (view === 'forum' && currentView === 'forum') return true;
    if (view === 'myPets' && currentView === 'myPets') return true;
    // For other tabs, exact match
    return currentView === view;
  };
  
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-30 pb-safe">
      <div className="flex items-center justify-around h-14 max-w-md mx-auto px-2">
        {/* Home Tab */}
        <button 
          onClick={() => handleNav('home')}
          className={`flex flex-col items-center gap-0.5 px-2 py-0.5 transition-colors ${
            isActive('home') ? 'text-teal-600' : 'text-gray-400 hover:text-gray-600'
          }`}
        >
          <Home className="w-5 h-5" strokeWidth={1.5} />
          <span className="text-[10px] font-medium">Home</span>
        </button>

        {/* Explore Tab */}
        <button 
          onClick={() => handleNav('explore')}
          className={`flex flex-col items-center gap-0.5 px-2 py-0.5 transition-colors ${
            isActive('explore') ? 'text-teal-600' : 'text-gray-400 hover:text-gray-600'
          }`}
        >
          <PawPrint className="w-5 h-5" strokeWidth={1.5} />
          <span className="text-[10px] font-medium">Explore</span>
        </button>

        {/* Services Tab */}
        <button 
          onClick={() => handleNav('services')}
          className={`flex flex-col items-center gap-0.5 px-2 py-0.5 transition-colors ${
            isActive('services') ? 'text-teal-600' : 'text-gray-400 hover:text-gray-600'
          }`}
        >
          <Bone className="w-5 h-5" strokeWidth={1.5} />
          <span className="text-[10px] font-medium">Services</span>
        </button>

        {/* Forum Tab */}
        <button 
          onClick={() => handleNav('forum')}
          className={`flex flex-col items-center gap-0.5 px-2 py-0.5 transition-colors relative ${
            isActive('forum') ? 'text-teal-600' : 'text-gray-400 hover:text-gray-600'
          }`}
        >
          <div className="relative">
            <MessageCircle className="w-5 h-5" strokeWidth={1.5} />
            {unreadNotifications > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[9px] rounded-full w-3.5 h-3.5 flex items-center justify-center font-bold border border-white">
                {unreadNotifications > 9 ? '9+' : unreadNotifications}
              </span>
            )}
          </div>
          <span className="text-[10px] font-medium">Forum</span>
        </button>

        {/* My Pets Tab */}
        <button 
          onClick={() => handleNav('myPets')} // 'myPets' view
          className={`flex flex-col items-center gap-0.5 px-2 py-0.5 transition-colors ${
            isActive('myPets') ? 'text-teal-600' : 'text-gray-400 hover:text-gray-600'
          }`}
        >
          <Heart className="w-5 h-5" strokeWidth={1.5} />
          <span className="text-[10px] font-medium">My Pets</span>
        </button>
      </div>
    </div>
  );
}