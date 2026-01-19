import { Plus, Calendar, Activity, ChevronRight, Sparkles, Bell, Clock, Settings, Heart, Weight } from 'lucide-react';
import { mockPets } from '../data/mockPets';
import { motion } from 'motion/react';
import { useTranslation } from '../utils/useTranslation';
import { useState, useEffect } from 'react';
import { supabase } from '../utils/supabase/client';
import { projectId, publicAnonKey } from '../utils/supabase/info';

interface MyPetsProps {
  onNavigate: (view: string) => void;
  onViewPet: (petId: string) => void;
}

export function MyPets({ onNavigate, onViewPet }: MyPetsProps) {
  const { t } = useTranslation();
  const [pets, setPets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    async function fetchPets() {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        
        if (!user) {
          setPets(mockPets);
          return;
        }

        const baseUrl = `https://${projectId}.supabase.co/functions/v1/make-server-3d55d0fe`;
        const headers = {
          'Authorization': `Bearer ${publicAnonKey}`
        };

        const response = await fetch(`${baseUrl}/pets?ownerId=${user.id}`, { headers });
        const data = await response.json();

        if (data && Array.isArray(data)) {
          // Map DB structure to UI structure
          const mappedPets = data.map((p: any) => ({
            ...p,
            birthDate: p.birth_date || p.birthDate,
            reminders: p.reminders || [],
            image: p.image_url || p.image || 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=800&q=80',
          }));
          setPets(mappedPets);
        } else {
          setPets([]);
        }
      } catch (err: any) {
        console.error("Error fetching pets:", err);
        setPets(mockPets);
      } finally {
        setLoading(false);
      }
    }

    fetchPets();
  }, []);

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
      return `${months} ${t('pets.months')}`;
    }
    return `${age} ${t('pets.years')}`;
  };

  const getNextReminder = (pet: any) => {
    if (!pet.reminders || !Array.isArray(pet.reminders)) return null;
    
    const upcoming = pet.reminders
      .filter((r: any) => !r.isCompleted && new Date(r.date) > new Date())
      .sort((a: any, b: any) => new Date(a.date).getTime() - new Date(b.date).getTime())[0];
    return upcoming;
  };

  return (
    <div className="min-h-screen bg-gray-50/50 pb-20">
      {/* Header */}
      <div className="px-5 pt-14 pb-6 sticky top-0 z-20 bg-gray-50/90 backdrop-blur-md">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 tracking-tight">{t('pets.title')}</h1>
            <p className="text-gray-500 text-sm">{t('pets.subtitle')}</p>
          </div>
          <motion.button 
            whileTap={{ scale: 0.95 }}
            className="w-10 h-10 bg-teal-600 text-white rounded-xl flex items-center justify-center shadow-lg shadow-teal-600/20 hover:bg-teal-700 transition-colors"
            onClick={() => onNavigate('createPet')}
          >
            <Plus className="w-5 h-5" />
          </motion.button>
        </div>
      </div>

      <div className="px-5 space-y-5">
        {loading ? (
           <div className="text-center py-10 text-gray-400">Loading pets...</div>
        ) : pets.length === 0 ? (
           <div className="text-center py-10 text-gray-500">
             <p>No pets found. Add your first pet!</p>
           </div>
        ) : (
          pets.map((pet, index) => {
          const nextReminder = getNextReminder(pet);
          
          return (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              key={pet.id}
              onClick={() => onViewPet(pet.id)}
              className="bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl hover:shadow-gray-200/50 border border-gray-100 cursor-pointer group h-52 flex transition-all duration-300"
            >
              {/* Image Section - Left 40% */}
              <div className="w-[40%] relative h-full overflow-hidden">
                <img 
                  src={pet.image} 
                  alt={pet.name} 
                  className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-black/10 to-transparent" />
              </div>

              {/* Content Section - Right 60% */}
              <div className="flex-1 p-4 flex flex-col h-full relative">
                
                {/* Header: Name & Breed */}
                <div className="mb-3 pr-6">
                  <h2 className="text-xl font-bold text-gray-900 leading-none mb-1">{pet.name}</h2>
                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wide truncate">{pet.breed}</p>
                </div>

                {/* Metrics Grid */}
                <div className="grid grid-cols-3 gap-2 mb-auto">
                  <div className="flex flex-col">
                    <span className="text-[10px] font-semibold text-gray-400 uppercase">{t('pets.gender')}</span>
                    <span className="text-sm font-semibold text-gray-700 capitalize">{t(`pets.${pet.gender}`) || pet.gender}</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[10px] font-semibold text-gray-400 uppercase">{t('pets.age')}</span>
                    <span className="text-sm font-semibold text-gray-700">{calculateAge(pet.birthDate)}</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[10px] font-semibold text-gray-400 uppercase">{t('pets.weight')}</span>
                    <span className="text-sm font-semibold text-gray-700">{pet.weight}kg</span>
                  </div>
                </div>

                {/* Divider */}
                <div className="h-px bg-gray-100 my-2" />

                {/* Reminder / Status Area - Anchored Bottom */}
                <div className="mt-1">
                  {nextReminder ? (
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center flex-shrink-0">
                        <Calendar className="w-4 h-4" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-[10px] font-bold text-amber-600 uppercase">{t('pets.nextUp')}</p>
                        <div className="flex items-center gap-1">
                          <p className="text-xs font-semibold text-gray-900 truncate max-w-[100px]">{nextReminder.title}</p>
                          <span className="text-[10px] text-gray-400">• {new Date(nextReminder.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}</span>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 text-gray-400">
                       <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center">
                          <Sparkles className="w-4 h-4 text-teal-400" />
                       </div>
                       <span className="text-xs font-medium">{t('pets.allCaughtUp')}</span>
                    </div>
                  )}
                </div>
                
                {/* Chevron */}
                <div className="absolute top-4 right-4 text-gray-300 group-hover:text-teal-500 group-hover:translate-x-1 transition-all">
                  <ChevronRight className="w-5 h-5" />
                </div>
              </div>
            </motion.div>
          );
        }))}
      </div>
    </div>
  );
}