import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, Heart, SlidersHorizontal, ChevronLeft, ChevronDown, Check, PawPrint, MapPin, Loader2 } from 'lucide-react';
import { ExplorePetDetail } from './ExplorePetDetail';
import { AdoptForm } from './AdoptForm';
import { supabase } from '../utils/supabase/client';
import { projectId, publicAnonKey } from '../utils/supabase/info';

// Icons for gender
const MaleIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="10" cy="14" r="6" />
    <path d="M20 4l-6.5 6.5" />
    <path d="M20 4v5" />
    <path d="M20 4h-5" />
  </svg>
);

const FemaleIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="10" r="6" />
    <path d="M12 16v6" />
    <path d="M9 19h6" />
  </svg>
);

interface Pet {
  id: string;
  name: string;
  status: 'available' | 'adopted' | 'deceased';
  gender: 'male' | 'female';
  age: string;
  image: string;
  isFavorite: boolean;
  breed: string; // for filtering
  type: 'dog' | 'cat';
  location: string;
}

interface ExploreProps {
  onNavigate: (view: any) => void;
}

export function Explore({ onNavigate }: ExploreProps) {
  const [currentView, setCurrentView] = useState<'list' | 'details' | 'form'>('list');
  const [selectedPet, setSelectedPet] = useState<Pet | null>(null);
  
  const [pets, setPets] = useState<Pet[]>([]);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);
  
  // Pagination State
  const [visibleCount, setVisibleCount] = useState(8);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const observerTarget = useRef<HTMLDivElement>(null);

  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [favoritesOnly, setFavoritesOnly] = useState(false);
  const [favoriteIds, setFavoriteIds] = useState<string[]>([]);

  // Filters
  const [petType, setPetType] = useState<'both' | 'cat' | 'dog'>('both');
  const [gender, setGender] = useState<'both' | 'male' | 'female'>('both');
  const [location, setLocation] = useState('');
  const [ageGroup, setAgeGroup] = useState<{
    upTo2: boolean;
    between2and7: boolean;
    over7: boolean;
  }>({
    upTo2: false,
    between2and7: false,
    over7: false
  });

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
      return `${months} months`;
    }
    return `${age} years`;
  };

  useEffect(() => {
    async function fetchData() {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        setUserId(user?.id || null);

        const baseUrl = `https://${projectId}.supabase.co/functions/v1/make-server-3d55d0fe`;
        const headers = { 'Authorization': `Bearer ${publicAnonKey}` };

        // Fetch Pets
        const petsRes = await fetch(`${baseUrl}/pets?explore=true&status=available`, { headers });
        const petsData = await petsRes.json();
        
        // Fetch Favorites
        let favs: string[] = [];
        if (user) {
          const favsRes = await fetch(`${baseUrl}/favorites/${user.id}`, { headers });
          favs = await favsRes.json();
          if (!Array.isArray(favs)) favs = [];
          setFavoriteIds(favs);
        }

        if (Array.isArray(petsData)) {
           const mapped = petsData.map((p: any) => ({
             id: p.id,
             name: p.name,
             status: p.status || 'available',
             gender: p.gender,
             age: calculateAge(p.birthDate || p.birth_date),
             image: p.image_url || p.image || 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=800&q=80',
             isFavorite: favs.includes(p.id),
             breed: p.breed,
             type: p.species || p.type || 'dog',
             location: p.location || 'Vilnius'
           }));
           setPets(mapped);
        }

      } catch (e) {
        console.error("Error loading explore data:", e);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const toggleFavorite = async (petId: string) => {
    if (!userId) return; // Prompt login?
    
    // Optimistic update
    const isFav = favoriteIds.includes(petId);
    let newFavs = isFav ? favoriteIds.filter(id => id !== petId) : [...favoriteIds, petId];
    setFavoriteIds(newFavs);
    
    setPets(current => current.map(p => 
      p.id === petId ? { ...p, isFavorite: !isFav } : p
    ));

    try {
      const baseUrl = `https://${projectId}.supabase.co/functions/v1/make-server-3d55d0fe`;
      const headers = { 
        'Authorization': `Bearer ${publicAnonKey}`,
        'Content-Type': 'application/json'
      };
      
      if (isFav) {
        await fetch(`${baseUrl}/favorites/${userId}/${petId}`, { method: 'DELETE', headers });
      } else {
        await fetch(`${baseUrl}/favorites/${userId}`, { 
          method: 'POST', 
          headers,
          body: JSON.stringify({ petId })
        });
      }
    } catch (e) {
      console.error("Error toggling favorite:", e);
      // Revert if error? For now, we trust.
    }
  };

  // Filter Logic
  const filteredPets = pets.filter(pet => {
    // Search
    if (searchQuery && !pet.name.toLowerCase().includes(searchQuery.toLowerCase()) && !pet.breed.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }

    // Favorites
    if (favoritesOnly && !pet.isFavorite) return false;

    // Type
    if (petType !== 'both' && pet.type !== petType) return false;

    // Gender
    if (gender !== 'both' && pet.gender !== gender) return false;

    // Location
    if (location && pet.location !== location) return false;

    // Age Group
    const isUpTo2 = pet.age.includes('month') || (pet.age.includes('year') && parseFloat(pet.age) < 2);
    const isOver7 = pet.age.includes('year') && parseFloat(pet.age) > 7;
    const isBetween2and7 = !isUpTo2 && !isOver7;

    const hasAgeFilter = ageGroup.upTo2 || ageGroup.between2and7 || ageGroup.over7;
    if (hasAgeFilter) {
      if (ageGroup.upTo2 && isUpTo2) return true;
      if (ageGroup.between2and7 && isBetween2and7) return true;
      if (ageGroup.over7 && isOver7) return true;
      return false;
    }

    return true;
  });

  // Visible pets slice
  const visiblePets = filteredPets.slice(0, visibleCount);
  const hasMore = visibleCount < filteredPets.length;

  const handleLoadMore = () => {
    if (isLoadingMore) return;
    setIsLoadingMore(true);
    // Simulate network delay
    setTimeout(() => {
        setVisibleCount(prev => prev + 10);
        setIsLoadingMore(false);
    }, 1000);
  };

  // Intersection Observer for Infinite Scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !isLoadingMore) {
          handleLoadMore();
        }
      },
      { threshold: 0.1 }
    );

    if (observerTarget.current) {
      observer.observe(observerTarget.current);
    }

    return () => {
      if (observerTarget.current) {
        observer.unobserve(observerTarget.current);
      }
    };
  }, [hasMore, isLoadingMore]);

  const handlePetClick = (pet: Pet) => {
    setSelectedPet(pet);
    setCurrentView('details');
  };

  if (currentView === 'form' && selectedPet) {
    return (
      <AdoptForm 
        petId={selectedPet.id}
        petName={selectedPet.name}
        onBack={() => setCurrentView('details')}
        onSubmit={() => {
          setCurrentView('list');
          setSelectedPet(null);
        }}
      />
    );
  }

  if (currentView === 'details' && selectedPet) {
    return (
      <ExplorePetDetail 
        pet={selectedPet}
        onBack={() => {
          setCurrentView('list');
          setSelectedPet(null);
        }}
        onAdopt={() => setCurrentView('form')}
      />
    );
  }

  return (
    <div className="min-h-screen bg-[#F8F9FA] pb-24 font-sans text-slate-900">
      {/* Header */}
      <div className="pt-6 pb-2 px-6">
        <h1 className="text-2xl font-bold text-slate-800 mb-4">Explore</h1>
        
        {/* Search & Actions Row */}
        <div className="flex gap-2 items-center">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-300" />
            <input 
              type="text" 
              placeholder="Search..." 
              className="w-full bg-white border border-gray-100 rounded-xl py-2.5 pl-11 pr-4 text-sm text-slate-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-500/20 shadow-sm"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <button 
            onClick={() => setFavoritesOnly(!favoritesOnly)}
            className={`w-10 h-10 flex-shrink-0 rounded-xl border flex items-center justify-center transition-colors shadow-sm ${
              favoritesOnly 
                ? 'bg-rose-50 border-rose-200 text-rose-500' 
                : 'bg-white border-gray-100 text-gray-400 hover:bg-gray-50'
            }`}
          >
            <Heart className={`w-5 h-5 ${favoritesOnly ? 'fill-current' : ''}`} />
          </button>
          
          <button 
            onClick={() => setShowFilters(true)}
            className="w-10 h-10 flex-shrink-0 rounded-xl bg-white border border-gray-100 text-teal-600 flex items-center justify-center hover:bg-gray-50 transition-colors shadow-sm"
          >
            <SlidersHorizontal className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Pet List - Vertical Scroll */}
      <div className="px-5 flex flex-col gap-6">
        <AnimatePresence mode='popLayout'>
          {visiblePets.map((pet) => (
            <motion.div
              key={pet.id}
              layout
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              onClick={() => handlePetClick(pet)}
              className="relative w-full aspect-[4/3.5] rounded-[2rem] overflow-hidden shadow-sm cursor-pointer group"
            >
              {/* Image */}
              <img 
                src={pet.image} 
                alt={pet.name} 
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
              />
              
              {/* Overlay Gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-90" />

              {/* Status Badge */}
              <div className="absolute top-4 left-4">
                 <div className={`px-3 py-1 rounded-full backdrop-blur-md border shadow-sm ${
                   pet.status === 'available' ? 'bg-emerald-500/80 border-emerald-400/50 text-white' :
                   pet.status === 'adopted' ? 'bg-blue-500/80 border-blue-400/50 text-white' :
                   'bg-slate-900/80 border-slate-700/50 text-slate-200'
                 }`}>
                   <span className="text-xs font-bold uppercase tracking-wide">
                     {pet.status}
                   </span>
                 </div>
              </div>

              {/* Like Button */}
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  toggleFavorite(pet.id);
                }}
                className={`absolute top-4 right-4 w-10 h-10 rounded-full backdrop-blur-md border flex items-center justify-center transition-all ${
                  pet.isFavorite 
                    ? 'bg-rose-500/20 border-rose-500/30 text-rose-500' 
                    : 'bg-white/20 border-white/20 text-white hover:bg-white/30'
                }`}
              >
                <Heart className={`w-5 h-5 ${pet.isFavorite ? 'fill-rose-500' : ''}`} />
              </button>

              {/* Info Overlay */}
              <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                <div className="mb-2">
                    <h2 className="text-3xl font-bold mb-1">{pet.name}</h2>
                    <p className="text-lg text-white/90 font-medium">{pet.breed}</p>
                </div>

                <div className="flex items-center gap-3 text-white/80 text-sm font-medium mt-4">
                    <div className="flex items-center gap-1.5">
                        <MapPin className="w-4 h-4" />
                        {pet.location}
                    </div>
                    <div className="w-1 h-1 rounded-full bg-white/40" />
                    <div className="flex items-center gap-1.5">
                        <PawPrint className="w-4 h-4" />
                        {pet.age}
                    </div>
                    <div className="w-1 h-1 rounded-full bg-white/40" />
                    <div className={`flex items-center gap-1.5 px-2 py-0.5 rounded-full backdrop-blur-sm border ${
                       pet.gender === 'male' 
                         ? 'bg-cyan-500/20 border-cyan-500/30 text-cyan-200' 
                         : 'bg-pink-500/20 border-pink-500/30 text-pink-200'
                    }`}>
                       {pet.gender === 'male' ? <MaleIcon /> : <FemaleIcon />}
                       <span className="text-xs font-bold uppercase">{pet.gender}</span>
                    </div>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Loading Indicator & Infinite Scroll Trigger */}
        <div ref={observerTarget} className="flex justify-center py-6 h-20">
            {isLoadingMore && (
                <div className="flex flex-col items-center gap-2 text-gray-400 text-sm">
                    <Loader2 className="w-6 h-6 animate-spin text-teal-600" />
                    <span>Loading more cuties...</span>
                </div>
            )}
        </div>

        {/* Empty State */}
        {filteredPets.length === 0 && (
          <div className="text-center py-20 px-10">
            <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4 text-gray-400">
                <Search className="w-8 h-8" />
            </div>
            <p className="text-gray-400">No pets found matching your criteria.</p>
            <button 
              onClick={() => {
                setSearchQuery('');
                setPetType('both');
                setGender('both');
                setLocation('');
                setAgeGroup({ upTo2: false, between2and7: false, over7: false });
              }}
              className="mt-4 text-teal-600 font-semibold"
            >
              Clear filters
            </button>
          </div>
        )}
      </div>

      {/* Filter Modal */}
      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed inset-0 z-50 bg-[#F8F9FA] overflow-y-auto"
          >
            {/* Header */}
            <div className="px-5 py-4 flex items-center relative bg-white border-b border-gray-100">
              <button 
                onClick={() => setShowFilters(false)}
                className="p-2 -ml-2 rounded-full hover:bg-gray-100"
              >
                <ChevronLeft className="w-6 h-6 text-slate-800" />
              </button>
              <h2 className="absolute left-1/2 -translate-x-1/2 text-lg font-semibold text-slate-800">Filter</h2>
            </div>

            <div className="p-6 pb-24 space-y-8">
              {/* Pet Type */}
              <section>
                <h3 className="text-slate-800 font-semibold mb-4">Pet Type</h3>
                <div className="bg-white p-1.5 rounded-2xl flex border border-gray-100 shadow-sm">
                  {['both', 'cat', 'dog'].map((type) => (
                    <button
                      key={type}
                      onClick={() => setPetType(type as any)}
                      className={`flex-1 py-3 rounded-xl text-sm font-semibold capitalize transition-all ${
                        petType === type 
                          ? 'bg-teal-50 text-teal-600 shadow-sm' 
                          : 'text-gray-400 hover:text-gray-600'
                      }`}
                    >
                      {type === 'both' ? 'Both' : type}
                    </button>
                  ))}
                </div>
              </section>

              {/* Breed */}
              <section>
                <h3 className="text-slate-800 font-semibold mb-4">Breed</h3>
                <div className="relative">
                  <select className="w-full bg-gray-100 rounded-2xl py-4 px-4 text-slate-600 appearance-none outline-none focus:ring-2 focus:ring-teal-500/20">
                    <option>Select Breed</option>
                    <option>Golden Retriever</option>
                    <option>German Shepherd</option>
                    <option>Tabby</option>
                  </select>
                  <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                </div>
              </section>

              {/* Gender */}
              <section>
                <h3 className="text-slate-800 font-semibold mb-4">Gender</h3>
                <div className="bg-white p-1.5 rounded-2xl flex border border-gray-100 shadow-sm">
                  {['both', 'male', 'female'].map((g) => (
                    <button
                      key={g}
                      onClick={() => setGender(g as any)}
                      className={`flex-1 py-3 rounded-xl text-sm font-semibold capitalize transition-all ${
                        gender === g 
                          ? 'bg-teal-50 text-teal-600 shadow-sm' 
                          : 'text-gray-400 hover:text-gray-600'
                      }`}
                    >
                      {g === 'both' ? 'Both' : g}
                    </button>
                  ))}
                </div>
              </section>

              {/* Age Group */}
              <section>
                <h3 className="text-slate-800 font-semibold mb-4">Age group</h3>
                <div className="space-y-4">
                  {[
                    { key: 'upTo2', label: 'Up to 2 years' },
                    { key: 'between2and7', label: '2 - 7 years' },
                    { key: 'over7', label: 'Over 7 years' },
                  ].map((item) => (
                    <label key={item.key} className="flex items-center justify-between p-1 cursor-pointer group">
                      <span className="text-gray-600 font-medium group-hover:text-teal-600 transition-colors">{item.label}</span>
                      <div className={`w-6 h-6 rounded-md border flex items-center justify-center transition-all ${
                        ageGroup[item.key as keyof typeof ageGroup]
                          ? 'bg-teal-600 border-teal-600'
                          : 'border-gray-300 bg-white'
                      }`}>
                         {ageGroup[item.key as keyof typeof ageGroup] && <Check className="w-4 h-4 text-white" />}
                      </div>
                      <input 
                        type="checkbox" 
                        className="hidden" 
                        checked={ageGroup[item.key as keyof typeof ageGroup]}
                        onChange={() => setAgeGroup(prev => ({ ...prev, [item.key]: !prev[item.key as keyof typeof ageGroup] }))}
                      />
                    </label>
                  ))}
                </div>
              </section>

              {/* Location */}
              <section>
                <h3 className="text-slate-800 font-semibold mb-4">Location</h3>
                <div className="relative">
                  <select 
                    className="w-full bg-gray-100 rounded-2xl py-4 px-4 text-slate-600 appearance-none outline-none focus:ring-2 focus:ring-teal-500/20"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                  >
                    <option value="">Select Location</option>
                    <option value="Vilnius">Vilnius</option>
                    <option value="Kaunas">Kaunas</option>
                    <option value="Klaipėda">Klaipėda</option>
                  </select>
                  <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                </div>
              </section>

              {/* Bottom Buttons */}
              <div className="fixed bottom-0 left-0 right-0 p-6 bg-white border-t border-gray-100 flex gap-4 z-10">
                <button 
                  onClick={() => {
                    setPetType('both');
                    setGender('both');
                    setLocation('');
                    setAgeGroup({ upTo2: false, between2and7: false, over7: false });
                  }}
                  className="flex-1 py-4 rounded-2xl border-2 border-gray-100 text-slate-800 font-bold hover:bg-gray-50 transition-colors"
                >
                  Reset All
                </button>
                <button 
                  onClick={() => setShowFilters(false)}
                  className="flex-1 py-4 rounded-2xl bg-gradient-to-r from-teal-500 to-teal-600 text-white font-bold shadow-lg shadow-teal-200 hover:shadow-teal-300 transition-all"
                >
                  Search
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
