import { motion } from 'motion/react';
import { MapPin, Clock, Calendar, Navigation, ChevronRight, PawPrint } from 'lucide-react';
import { useTranslation } from '../utils/useTranslation';
import { Pet } from '../data/mockPets';

interface PetWalksProps {
  pet: Pet;
}

export function PetWalks({ pet }: PetWalksProps) {
  const { t } = useTranslation();
  
  const walks = pet.walkHistory || [];
  
  // Calculate stats
  const totalDistance = walks.reduce((acc, walk) => acc + walk.distance, 0);
  const totalTime = walks.reduce((acc, walk) => acc + walk.duration, 0);
  const totalWalks = walks.length;

  const formatDistance = (meters: number) => {
    if (meters < 1000) return `${Math.round(meters)} m`;
    return `${(meters / 1000).toFixed(2)} km`;
  };

  const formatDuration = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    if (h > 0) return `${h}h ${m}m`;
    return `${m}m`;
  };

  return (
    <div className="space-y-6">
      {/* Stats Overview */}
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-teal-600 text-white p-4 rounded-2xl flex flex-col items-center justify-center text-center shadow-lg shadow-teal-500/20">
          <Navigation className="w-6 h-6 mb-2 text-teal-200" />
          <div className="text-2xl font-black">{formatDistance(totalDistance)}</div>
          <div className="text-[10px] uppercase font-bold text-teal-100 tracking-wider opacity-80">{t('walk.totalDistance') || 'Viso'}</div>
        </div>
        <div className="bg-white p-4 rounded-2xl flex flex-col items-center justify-center text-center border border-gray-100 shadow-sm">
          <Clock className="w-6 h-6 mb-2 text-teal-500" />
          <div className="text-2xl font-black text-gray-900">{formatDuration(totalTime)}</div>
          <div className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">{t('walk.totalTime') || 'Laikas'}</div>
        </div>
        <div className="bg-white p-4 rounded-2xl flex flex-col items-center justify-center text-center border border-gray-100 shadow-sm">
          <PawPrint className="w-6 h-6 mb-2 text-purple-500" />
          <div className="text-2xl font-black text-gray-900">{totalWalks}</div>
          <div className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">{t('walk.totalWalks') || 'Kartai'}</div>
        </div>
      </div>

      {/* Walk List */}
      <div>
        <h3 className="text-lg font-bold text-gray-900 mb-4 px-1">{t('walk.history') || 'Istorija'}</h3>
        
        {walks.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-3xl border-2 border-dashed border-gray-100">
            <div className="w-16 h-16 rounded-full bg-gray-50 flex items-center justify-center mx-auto mb-4 text-gray-300">
              <MapPin className="w-8 h-8" />
            </div>
            <p className="text-gray-400 font-medium">{t('walk.noWalks') || 'Nėra pasivaikščiojimų'}</p>
          </div>
        ) : (
          <div className="space-y-3">
            {walks.map((walk) => (
              <motion.div
                key={walk.id}
                whileTap={{ scale: 0.98 }}
                className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between group cursor-pointer hover:border-teal-200 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-teal-50 flex items-center justify-center text-teal-600 font-bold text-sm">
                    {new Date(walk.date).getDate()}
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-bold text-gray-900">{formatDistance(walk.distance)}</h4>
                      <span className="text-gray-300">•</span>
                      <span className="text-sm font-medium text-gray-500">{formatDuration(walk.duration)}</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-gray-400">
                      <Calendar className="w-3 h-3" />
                      {new Date(walk.date).toLocaleDateString()}
                      {walk.participants.length > 1 && (
                         <span className="flex items-center gap-1 bg-gray-100 px-1.5 py-0.5 rounded ml-2">
                           <PawPrint className="w-3 h-3" />
                           {walk.participants.length}
                         </span>
                      )}
                    </div>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-300 group-hover:text-teal-500 transition-colors" />
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
