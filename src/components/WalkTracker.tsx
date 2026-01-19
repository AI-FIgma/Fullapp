import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Play, Pause, Square, MapPin, AlertTriangle, Bug, Droplets, Trash2, ChevronDown, Check } from 'lucide-react';
import { toast } from 'sonner@2.0.3';
import { useTranslation } from '../utils/useTranslation';
import { mockPets } from '../data/mockPets';

// Define the icons configuration
const iconConfig = {
  danger: { color: '#ef4444', icon: AlertTriangle },
  ticks: { color: '#f59e0b', icon: Bug },
  water: { color: '#3b82f6', icon: Droplets },
  trash: { color: '#10b981', icon: Trash2 },
};

interface WalkTrackerProps {
  onClose: () => void;
  initialPetId?: string;
  onSave?: (data: { duration: number; distance: number; path: [number, number][]; participants: string[] }) => void;
}

declare global {
  interface Window {
    L: any;
  }
}

export function WalkTracker({ onClose, initialPetId }: WalkTrackerProps) {
  const { t } = useTranslation();
  const [isActive, setIsActive] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [position, setPosition] = useState<[number, number]>([54.6872, 25.2797]);
  const [path, setPath] = useState<[number, number][]>([]);
  const [distance, setDistance] = useState(0);
  const [duration, setDuration] = useState(0);
  const [showMarkerMenu, setShowMarkerMenu] = useState(false);
  const [selectedPetIds, setSelectedPetIds] = useState<string[]>(initialPetId ? [initialPetId] : []);
  
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const userMarkerRef = useRef<any>(null);
  const pathLineRef = useRef<any>(null);
  
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const watchIdRef = useRef<number | null>(null);

  // Load Leaflet from CDN
  useEffect(() => {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://unpkg.com/leaflet@1.7.1/dist/leaflet.css';
    document.head.appendChild(link);

    const script = document.createElement('script');
    script.src = 'https://unpkg.com/leaflet@1.7.1/dist/leaflet.js';
    script.async = true;
    
    script.onload = () => {
      initMap();
    };
    
    document.body.appendChild(script);

    return () => {
      document.head.removeChild(link);
      document.body.removeChild(script);
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
      }
    };
  }, []);

  const initMap = () => {
    if (!window.L || !mapContainerRef.current) return;

    // Initialize Map
    const map = window.L.map(mapContainerRef.current, {
      zoomControl: false,
      attributionControl: false
    }).setView(position, 16);

    // Add Tiles
    window.L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
      maxZoom: 20
    }).addTo(map);

    // Custom Icon for User
    const userIcon = window.L.divIcon({
      className: 'user-location-marker',
      html: `<div style="background-color: #0d9488; width: 16px; height: 16px; border-radius: 50%; border: 3px solid white; box-shadow: 0 0 0 10px rgba(13, 148, 136, 0.2);"></div>`,
      iconSize: [20, 20],
      iconAnchor: [10, 10]
    });

    // Add User Marker
    const marker = window.L.marker(position, { icon: userIcon }).addTo(map);
    userMarkerRef.current = marker;
    mapInstanceRef.current = map;

    // Initialize Polyline
    pathLineRef.current = window.L.polyline([], { color: '#0d9488', weight: 5 }).addTo(map);

    // Get initial real location
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const newPos: [number, number] = [pos.coords.latitude, pos.coords.longitude];
        setPosition(newPos);
        map.setView(newPos, 16);
        marker.setLatLng(newPos);
      },
      () => toast.error(t('walk.locationError'))
    );
  };

  // Timer
  useEffect(() => {
    if (isActive && !isPaused) {
      timerRef.current = setInterval(() => {
        setDuration(prev => prev + 1);
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isActive, isPaused]);

  // Movement Tracking & Simulation
  useEffect(() => {
    if (!isActive || isPaused || !mapInstanceRef.current) return;

    // Simulation Interval (for desktop testing)
    const simInterval = setInterval(() => {
      setPosition(prev => {
        const newLat = prev[0] + (Math.random() - 0.5) * 0.0003;
        const newLng = prev[1] + (Math.random() - 0.5) * 0.0003;
        const newPos: [number, number] = [newLat, newLng];
        
        // Update State
        setPath(curr => [...curr, newPos]);
        setDistance(d => d + (Math.random() * 5));

        // Update Map Visuals
        if (userMarkerRef.current) userMarkerRef.current.setLatLng(newPos);
        if (mapInstanceRef.current) mapInstanceRef.current.panTo(newPos);
        if (pathLineRef.current) pathLineRef.current.addLatLng(newPos);

        return newPos;
      });
    }, 2000);

    return () => clearInterval(simInterval);
  }, [isActive, isPaused]);

  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h > 0 ? h + ':' : ''}${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const formatDistance = (meters: number) => {
    if (meters < 1000) return `${Math.round(meters)} m`;
    return `${(meters / 1000).toFixed(2)} km`;
  };

  const handleStart = () => {
    if (selectedPetIds.length === 0) {
      toast.error('Select at least one pet');
      return;
    }
    setIsActive(true);
    setPath([position]);
    setDistance(0);
    setDuration(0);
    
    // Clear existing line
    if (pathLineRef.current) pathLineRef.current.setLatLngs([position]);
  };

  const togglePet = (id: string) => {
    setSelectedPetIds(prev => 
      prev.includes(id) 
        ? prev.filter(p => p !== id)
        : [...prev, id]
    );
  };

  const handleFinish = () => {
    if (window.confirm(t('walk.confirmFinish'))) {
      setIsActive(false);
      setIsPaused(false);
      
      if (onSave) {
        onSave({
          duration,
          distance,
          path,
          participants: selectedPetIds
        });
      }
      
      toast.success(t('walk.walkSaved'));
      onClose();
    }
  };

  const addMarker = (type: keyof typeof iconConfig) => {
    if (!mapInstanceRef.current || !window.L) return;

    const config = iconConfig[type];
    const icon = window.L.divIcon({
      className: 'custom-marker',
      html: `<div style="background-color: ${config.color}; width: 24px; height: 24px; border-radius: 50%; border: 2px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.3);"></div>`,
      iconSize: [24, 24],
      iconAnchor: [12, 12]
    });

    window.L.marker(position, { icon }).addTo(mapInstanceRef.current);
    
    setShowMarkerMenu(false);
    toast.success(`${t(`walk.${type}`)} added!`);
  };

  return (
    <div className="fixed inset-0 z-50 bg-white flex flex-col">
      {/* Map Layer */}
      <div className="flex-1 relative bg-gray-100">
        <div ref={mapContainerRef} className="w-full h-full z-0" />

        {/* Top Bar Overlay */}
        <div className="absolute top-0 left-0 right-0 p-4 pt-12 flex justify-between items-center bg-gradient-to-b from-white/90 to-transparent z-[1000] pointer-events-none">
          <button 
            onClick={onClose} 
            className="w-10 h-10 rounded-full bg-white shadow-md flex items-center justify-center text-gray-600 active:scale-95 transition-transform pointer-events-auto"
          >
            <ChevronDown className="w-6 h-6" />
          </button>
          
          <div className="bg-white/90 backdrop-blur px-4 py-2 rounded-full shadow-sm border border-gray-100 font-bold text-gray-800">
            {isActive ? (isPaused ? 'Paused' : 'Recording...') : 'Ready'}
          </div>

          <div className="w-10" />
        </div>
      </div>

      {/* Controls Overlay */}
      <div className="bg-white rounded-t-3xl shadow-[0_-5px_20px_rgba(0,0,0,0.1)] p-6 pb-10 relative z-50">
        
        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-4 mb-8">
          <div className="bg-gray-50 p-4 rounded-2xl text-center border border-gray-100">
            <div className="text-xs text-gray-500 font-bold uppercase tracking-wider mb-1">{t('walk.time')}</div>
            <div className="text-3xl font-black text-gray-900 font-mono tracking-tight">{formatTime(duration)}</div>
          </div>
          <div className="bg-gray-50 p-4 rounded-2xl text-center border border-gray-100">
            <div className="text-xs text-gray-500 font-bold uppercase tracking-wider mb-1">{t('walk.distance')}</div>
            <div className="text-3xl font-black text-gray-900 tracking-tight">{formatDistance(distance)}</div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col gap-6">
          
          {/* Pet Selection (Only when not active) */}
          {!isActive && (
            <div className="space-y-3">
              <div className="text-sm font-medium text-gray-500 ml-1">{t('walk.walkingWith')}</div>
              <div className="flex gap-4 overflow-x-auto pb-2 -mx-2 px-2">
                {mockPets.map(pet => {
                  const isSelected = selectedPetIds.includes(pet.id);
                  return (
                    <button
                      key={pet.id}
                      onClick={() => togglePet(pet.id)}
                      className={`relative flex-shrink-0 transition-all ${isSelected ? 'scale-100' : 'scale-95 opacity-60 grayscale'}`}
                    >
                      <div className={`w-14 h-14 rounded-full overflow-hidden border-2 ${isSelected ? 'border-teal-500 ring-2 ring-teal-200' : 'border-gray-200'}`}>
                        <img src={pet.image} alt={pet.name} className="w-full h-full object-cover" />
                      </div>
                      {isSelected && (
                        <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-teal-500 rounded-full flex items-center justify-center text-white border-2 border-white">
                          <Check className="w-3 h-3" />
                        </div>
                      )}
                      <div className="text-center text-xs font-semibold mt-1 text-gray-700 truncate w-14">{pet.name}</div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          <div className="flex items-center justify-between gap-4">
            {!isActive ? (
              <button
                onClick={handleStart}
                disabled={selectedPetIds.length === 0}
                className="w-full py-4 bg-teal-600 text-white rounded-2xl font-bold text-xl shadow-lg shadow-teal-500/30 flex items-center justify-center gap-3 active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Play className="w-6 h-6 fill-current" />
                {t('walk.startWalk')}
              </button>
            ) : (
            <>
              {/* Marker Button */}
              <div className="relative">
                 <button
                  onClick={() => setShowMarkerMenu(!showMarkerMenu)}
                  className="w-14 h-14 bg-gray-100 rounded-2xl flex items-center justify-center text-gray-600 active:scale-95 transition-all"
                >
                  <MapPin className="w-6 h-6" />
                </button>
                
                {/* Marker Menu Popover */}
                <AnimatePresence>
                  {showMarkerMenu && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.9 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.9 }}
                      className="absolute bottom-full left-0 mb-4 bg-white p-2 rounded-2xl shadow-xl border border-gray-100 flex flex-col gap-2 min-w-[160px]"
                    >
                      {(Object.keys(iconConfig) as Array<keyof typeof iconConfig>).map((key) => {
                        const { color, icon: Icon } = iconConfig[key];
                        return (
                          <button 
                            key={key}
                            onClick={() => addMarker(key)} 
                            className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded-xl transition-colors text-left"
                          >
                            <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ backgroundColor: `${color}20`, color: color }}>
                              <Icon className="w-4 h-4" />
                            </div>
                            <span className="font-bold text-sm text-gray-700">{t(`walk.${key}`)}</span>
                          </button>
                        );
                      })}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Pause / Resume */}
              <button
                onClick={() => setIsPaused(!isPaused)}
                className={`flex-1 py-4 rounded-2xl font-bold text-lg flex items-center justify-center gap-2 transition-all ${
                  isPaused 
                    ? 'bg-teal-100 text-teal-700' 
                    : 'bg-amber-100 text-amber-700'
                }`}
              >
                {isPaused ? <Play className="w-5 h-5 fill-current" /> : <Pause className="w-5 h-5 fill-current" />}
                {isPaused ? t('walk.resume') : t('walk.pause')}
              </button>

              {/* Stop */}
              <button
                onClick={handleFinish}
                onContextMenu={(e) => { e.preventDefault(); handleFinish(); }}
                className="w-14 h-14 bg-red-100 text-red-600 rounded-2xl flex items-center justify-center active:scale-95 transition-all"
              >
                <Square className="w-5 h-5 fill-current" />
              </button>
            </>
          )}
        </div>
        </div>
      </div>
    </div>
  );
}
