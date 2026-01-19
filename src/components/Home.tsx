import { 
  ShoppingCart, Store, Stethoscope, GraduationCap, Scissors, 
  Bell, ChevronDown, MapPin, Heart, PawPrint, Search, ArrowRight,
  Activity, X, Check
} from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { supabase } from '../utils/supabase/client';
import { projectId, publicAnonKey } from '../utils/supabase/info';
import { getAds, trackAdClick, trackAdImpression } from '../utils/adsApi';
import type { SponsoredAd } from './SponsoredBanner';

// Icon mapping for dynamic services
const iconMap: Record<string, any> = {
  'shopping-cart': ShoppingCart,
  'store': Store,
  'stethoscope': Stethoscope,
  'graduation-cap': GraduationCap,
  'scissors': Scissors,
  'activity': Activity
};

// Icons for gender
const MaleIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="10" cy="14" r="6" />
    <path d="M20 4l-6.5 6.5" />
    <path d="M20 4v5" />
    <path d="M20 4h-5" />
  </svg>
);

const FemaleIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="10" r="6" />
    <path d="M12 16v6" />
    <path d="M9 19h6" />
  </svg>
);

interface HomeProps {
  onViewPost: (postId: string) => void;
  onCreatePost: () => void;
  onViewProfile: (userId: string) => void;
  selectedCategory: string;
  selectedSubcategory: string | null;
  onCategoryChange: (categoryId: string, subcategoryId: string | null) => void;
  unreadNotifications: number;
  onNavigate: (view: any) => void;
  notifications?: any[];
}

export function Home({ 
  onViewProfile, 
  onNavigate,
  unreadNotifications,
  notifications = []
}: HomeProps) {

  const [showNotifications, setShowNotifications] = useState(false);
  const [servicesList, setServicesList] = useState<any[]>([]);
  const [petsList, setPetsList] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [userAvatar, setUserAvatar] = useState<string | null>(null);
  const [activeAds, setActiveAds] = useState<SponsoredAd[]>([]);
  const [currentAdIndex, setCurrentAdIndex] = useState(0);

  // Default fallback data (Mock)
  const defaultServices = [
    { name: 'E-Shop', icon: ShoppingCart, color: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-100', id: 'online' },
    { name: 'Stores', icon: Store, color: 'text-orange-600', bg: 'bg-orange-50', border: 'border-orange-100', id: 'physical' },
    { name: 'Vets', icon: Stethoscope, color: 'text-rose-600', bg: 'bg-rose-50', border: 'border-rose-100', id: 'vet' },
    { name: 'Training', icon: GraduationCap, color: 'text-indigo-600', bg: 'bg-indigo-50', border: 'border-indigo-100', id: 'training' },
    { name: 'Grooming', icon: Scissors, color: 'text-teal-600', bg: 'bg-teal-50', border: 'border-teal-100', id: 'grooming' },
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const baseUrl = `https://${projectId}.supabase.co/functions/v1/make-server-3d55d0fe`;
        const headers = {
          'Authorization': `Bearer ${publicAnonKey}`
        };

        // Fetch Ads
        try {
            const allAds = await getAds();
            const now = new Date();
            const validAds = allAds.filter(ad => {
                const isActive = ad.isActive;
                const started = !ad.startDate || new Date(ad.startDate) <= now;
                const notEnded = !ad.endDate || new Date(ad.endDate) >= now;
                return isActive && started && notEnded;
            });

            if (validAds.length > 0) {
                setActiveAds(validAds);
                // Track impression for the first one initially
                trackAdImpression(validAds[0].id);
            }
        } catch (e) {
            console.error('Failed to load ads', e);
        }

        // Fetch User Profile
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
            // Try profiles table first
            try {
                const { data: profile } = await supabase.from('profiles').select('avatar_url').eq('id', user.id).single();
                if (profile?.avatar_url) {
                    setUserAvatar(profile.avatar_url);
                } else {
                    setUserAvatar(user.user_metadata?.avatar_url);
                }
            } catch {
                setUserAvatar(user.user_metadata?.avatar_url);
            }
        }

        // Fetch Services
        const servicesResponse = await fetch(`${baseUrl}/services`, { headers });
        const servicesData = await servicesResponse.json();

        if (servicesData && Array.isArray(servicesData) && servicesData.length > 0) {
          const mappedServices = servicesData.map((s: any) => ({
            ...s,
            icon: iconMap[s.icon] || Activity // Map string to component
          }));
          setServicesList(mappedServices);
        } else {
          setServicesList(defaultServices);
        }

        // Fetch Pets (Newest / Available)
        const petsResponse = await fetch(`${baseUrl}/pets?explore=true&status=available`, { headers });
        const petsData = await petsResponse.json();
        
        // Filter and sort client-side for now since KV endpoint is simple
        const availablePets = Array.isArray(petsData) 
          ? petsData
              // .filter((p: any) => p.status === 'available') // Already filtered by server
              .sort((a: any, b: any) => new Date(b.created_at || b.date || 0).getTime() - new Date(a.created_at || a.date || 0).getTime())
              .slice(0, 4)
          : [];

        if (availablePets.length > 0) {
          const mappedPets = availablePets.map((p: any) => ({
            id: p.id,
            name: p.name,
            status: p.status,
            gender: p.gender,
            age: calculateAge(p.birth_date), // Helper needed
            image: p.image_url || p.image,
            breed: p.breed,
            type: p.species || p.type,
            location: p.location || 'Vilnius'
          }));
          setPetsList(mappedPets);
        } else {
          setPetsList([]);
        }

      } catch (error) {
        console.error('Error fetching data:', error);
        setServicesList(defaultServices);
        setPetsList([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  // Carousel Logic
  useEffect(() => {
    if (activeAds.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentAdIndex((prev) => {
        const nextIndex = (prev + 1) % activeAds.length;
        // Track impression for the new ad shown
        trackAdImpression(activeAds[nextIndex].id);
        return nextIndex;
      });
    }, 5000); // Change every 5 seconds

    return () => clearInterval(interval);
  }, [activeAds]);

  const calculateAge = (birthDate: string) => {
    if (!birthDate) return 'Unknown';
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const m = today.getMonth() - birth.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    if (age === 0) {
      const months = (today.getFullYear() - birth.getFullYear()) * 12 + (today.getMonth() - birth.getMonth());
      return `${months} mo`;
    }
    return `${age} y/o`;
  };
  
  // Close notifications when clicking outside
  const notificationRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const getTimeAgo = (date: Date | undefined) => {
    if (!date) return 'just now';
    const now = new Date();
    const timestamp = date instanceof Date ? date : new Date(date);
    const diffInSeconds = Math.floor((now.getTime() - timestamp.getTime()) / 1000);
    
    if (diffInSeconds < 60) return 'just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    return `${Math.floor(diffInSeconds / 86400)}d ago`;
  };

  const services = servicesList.length > 0 ? servicesList : defaultServices;
  const pets = petsList;



  return (
    <div className="min-h-screen bg-white pb-24 font-sans text-slate-900">
      
      {/* Header */}
      <div className="sticky top-0 z-20 bg-white/90 backdrop-blur-md border-b border-gray-50">
        <div className="flex items-center justify-between px-6 py-4">
          {/* Avatar */}
          <button 
            onClick={() => onNavigate('personalProfile')} 
            className="w-10 h-10 rounded-full p-0.5 border-2 border-slate-900 hover:scale-105 transition-transform overflow-hidden relative"
          >
            {userAvatar ? (
               <img src={userAvatar} alt="Profile" className="w-full h-full rounded-full object-cover" />
            ) : (
               <div className="w-full h-full rounded-full bg-slate-900 flex items-center justify-center text-white font-bold text-sm">
                  U
               </div>
            )}
          </button>

          {/* Location */}
          <div className="flex flex-col items-center">
             <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">Location</span>
             <div className="flex items-center gap-1 text-slate-900 font-bold">
                <MapPin className="w-3.5 h-3.5" />
                <span>Vilnius, LT</span>
                <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
             </div>
          </div>

          {/* Notification Bell */}
          <div className="relative" ref={notificationRef}>
            <button 
              onClick={() => setShowNotifications(!showNotifications)}
              className={`w-10 h-10 rounded-full border border-gray-100 flex items-center justify-center transition-colors relative ${showNotifications ? 'bg-gray-100' : 'hover:bg-gray-50'}`}
            >
              <Bell className="w-5 h-5 text-slate-800" />
              {unreadNotifications > 0 && (
                <span className="absolute top-2 right-2.5 w-2 h-2 rounded-full bg-rose-500 ring-2 ring-white" />
              )}
            </button>

            {/* Notification Popover */}
            {showNotifications && (
              <div className="absolute top-full right-0 mt-3 w-80 bg-white rounded-2xl shadow-xl border border-gray-100 z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                <div className="flex items-center justify-between px-4 py-3 border-b border-gray-50 bg-gray-50/50">
                  <h3 className="font-bold text-slate-900 text-sm">Notifications</h3>
                  <button 
                    onClick={() => onNavigate('notifications')}
                    className="text-xs font-semibold text-teal-600 hover:text-teal-700"
                  >
                    View All
                  </button>
                </div>
                
                <div className="max-h-[320px] overflow-y-auto">
                  {notifications && notifications.length > 0 ? (
                    <div className="divide-y divide-gray-50">
                      {notifications.slice(0, 5).map((notification) => (
                        <div 
                          key={notification.id}
                          className={`p-3 hover:bg-gray-50 transition-colors cursor-pointer ${!notification.read ? 'bg-teal-50/30' : ''}`}
                          onClick={() => {
                            // Mark as read logic would go here
                            setShowNotifications(false);
                            if (notification.type === 'report') {
                              onNavigate('reports');
                            } else {
                              onNavigate('notifications'); 
                            }
                          }}
                        >
                          <div className="flex gap-3">
                            <div className="flex-shrink-0 mt-0.5">
                              {notification.type === 'achievement' ? (
                                <span className="text-lg">🏆</span>
                              ) : notification.type === 'system' ? (
                                <span className="text-lg">🔔</span>
                              ) : notification.type === 'report' ? (
                                <span className="text-lg">🚨</span>
                              ) : (
                                <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
                                  <Bell className="w-4 h-4 text-gray-500" />
                                </div>
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className={`text-sm leading-snug ${!notification.read ? 'font-medium text-slate-900' : 'text-slate-600'}`}>
                                {notification.message}
                              </p>
                              <p className="text-[10px] text-gray-400 mt-1">
                                {getTimeAgo(notification.timestamp)}
                              </p>
                            </div>
                            {!notification.read && (
                              <div className="flex-shrink-0 mt-1.5">
                                <div className="w-2 h-2 rounded-full bg-teal-500"></div>
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="p-8 text-center">
                      <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-3">
                        <Bell className="w-5 h-5 text-gray-300" />
                      </div>
                      <p className="text-sm text-gray-500 font-medium">No notifications</p>
                    </div>
                  )}
                </div>
                
                <div className="p-2 border-t border-gray-50 bg-gray-50/30">
                  <button 
                    onClick={() => {
                      setShowNotifications(false);
                      onNavigate('notifications');
                    }}
                    className="w-full py-2 text-xs font-medium text-slate-600 hover:text-slate-900 transition-colors text-center"
                  >
                    Manage Notifications
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="px-6 space-y-8 pt-6">
        
        {/* Ad Banner (Hero) */}
        {activeAds.length > 0 && (() => {
          const ad = activeAds[currentAdIndex];
          return (
            <div className="relative group">
              <div 
                onClick={() => {
                    trackAdClick(ad.id);
                    if (ad.targetUrl) {
                        window.open(ad.targetUrl, '_blank');
                    }
                }}
                className="relative w-full aspect-[16/9] rounded-[2rem] overflow-hidden shadow-lg shadow-slate-200 cursor-pointer transition-all duration-500"
              >
                {ad.videoUrl ? (
                    <video 
                        key={ad.videoUrl} // Key ensures video reloads/changes properly
                        src={ad.videoUrl} 
                        autoPlay loop muted playsInline
                        className="w-full h-full object-cover"
                    />
                ) : (
                    <img 
                        key={ad.imageUrl} // Key ensures fade effect works if we add CSS animation
                        src={ad.imageUrl} 
                        alt={ad.title} 
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                )}
                
                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-90" />

                {/* Ad Content */}
                <div className="absolute bottom-6 left-6 right-6 text-white">
                   {ad.sponsor && (
                       <div className="flex items-center gap-2 mb-2 opacity-80">
                           {ad.sponsorLogo && <img src={ad.sponsorLogo} className="w-5 h-5 rounded-full bg-white" />}
                           <span className="text-xs font-bold uppercase tracking-wider">{ad.sponsor}</span>
                       </div>
                   )}
                   <h2 className="text-2xl font-bold leading-tight mb-2">{ad.title}</h2>
                   <p className="text-sm text-white/80 mb-3 line-clamp-2">{ad.description}</p>
                   <div className="flex items-center gap-2 text-sm font-medium text-white/90">
                      <span>{ad.ctaText || 'Learn More'}</span>
                      <ArrowRight className="w-4 h-4" />
                   </div>
                </div>
              </div>

              {/* Carousel Indicators */}
              {activeAds.length > 1 && (
                <div className="absolute bottom-4 right-6 flex gap-1.5 z-10">
                  {activeAds.map((_, idx) => (
                    <div 
                      key={idx}
                      className={`h-1.5 rounded-full transition-all duration-300 ${
                        idx === currentAdIndex ? 'w-6 bg-white' : 'w-1.5 bg-white/40'
                      }`}
                    />
                  ))}
                </div>
              )}
            </div>
          );
        })()}

        {/* Services Section */}
        <div>
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-lg font-bold text-slate-900">Services</h2>
            <button 
              onClick={() => onNavigate('services')}
              className="text-xs font-bold text-slate-400 hover:text-slate-900 transition-colors uppercase tracking-wider"
            >
              View All
            </button>
          </div>
          
          <div className="flex gap-4 overflow-x-auto no-scrollbar pb-2 -mx-6 px-6">
            {services.map((service) => (
              <button 
                key={service.id}
                onClick={() => onNavigate('services')}
                className="flex flex-col items-center gap-3 min-w-[76px] group"
              >
                <div className={`w-16 h-16 rounded-[1.25rem] flex items-center justify-center ${service.bg} ${service.color} ${service.border} border transition-all group-hover:scale-105 group-hover:shadow-md`}>
                  <service.icon className="w-7 h-7" strokeWidth={1.5} />
                </div>
                <span className="text-xs text-slate-600 font-bold text-center leading-tight truncate w-full group-hover:text-slate-900 transition-colors">
                  {service.name}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Categories Section */}
        <div>


          <div className="flex items-center justify-between mb-4">
             <h2 className="text-lg font-bold text-slate-900">
               Newest Pets
               <span className="text-slate-400 font-medium text-sm ml-2">8 new</span>
             </h2>
          </div>

          {/* Featured Pets Grid */}
          {pets.length > 0 ? (
            <div className="grid grid-cols-2 gap-4 pb-6">
              {pets.map((pet) => (
                <div 
                  key={pet.id} 
                  onClick={() => onNavigate('explore')}
                  className="group relative bg-white rounded-[1.75rem] border border-gray-100 shadow-sm hover:shadow-lg transition-all cursor-pointer overflow-hidden"
                >
                  {/* Image */}
                  <div className="aspect-[4/5] relative">
                    <img 
                      src={pet.image} 
                      alt={pet.name} 
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-80" />
                    
                    {/* Status Badge */}
                    <div className="absolute top-3 left-3">
                       {pet.status !== 'available' && (
                          <div className="bg-black/40 backdrop-blur-md border border-white/10 px-2.5 py-1 rounded-full">
                             <span className="text-[9px] font-bold text-white uppercase tracking-wider">{pet.status}</span>
                          </div>
                       )}
                    </div>

                    {/* Like Button */}
                    <button className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center hover:bg-white/40 transition-colors">
                       <Heart className="w-4 h-4 text-white" />
                    </button>

                    {/* Info Overlay */}
                    <div className="absolute bottom-3 left-3 right-3 text-white">
                       <h3 className="text-lg font-bold leading-tight mb-1">{pet.name}</h3>
                       <p className="text-xs font-medium text-white/80 opacity-90 mb-2">{pet.breed}</p>
                       
                       <div className="flex items-center justify-between">
                          <div className="flex items-center gap-1.5 bg-white/20 backdrop-blur-sm px-2 py-1 rounded-lg">
                             {pet.gender === 'male' ? <MaleIcon /> : <FemaleIcon />}
                             <span className="text-[10px] font-bold uppercase">{pet.gender === 'male' ? 'Boy' : 'Girl'}</span>
                          </div>
                          <span className="text-xs font-bold">{pet.age}</span>
                       </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 px-6 bg-gray-50 rounded-[2rem] border border-dashed border-gray-200">
               <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                 <Search className="w-5 h-5 text-gray-400" />
               </div>
               <p className="text-gray-500 font-medium text-sm">No new pets available right now.</p>
               <p className="text-gray-400 text-xs mt-1">Check back later for updates!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
