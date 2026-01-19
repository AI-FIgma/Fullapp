import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Heart, Share2, Settings, ChevronLeft, Calendar, 
  MapPin, Phone, Shield, Activity, Users, FileText, 
  Navigation, Syringe, MoreVertical, PawPrint, Clock,
  Utensils, AlertTriangle, QrCode, Stethoscope, Home, User,
  ArrowRight, Droplets, Thermometer, Weight, X, Check,
  AlertCircle, Loader2
} from 'lucide-react';
import { useTranslation } from '../utils/useTranslation';
import { mockPets } from '../data/mockPets';
import { projectId, publicAnonKey } from '../utils/supabase/info';

// Components
import { PetHealth } from './PetHealth';
import { PetDocuments } from './PetDocuments';
import { PetWeightChart } from './PetWeightChart';
import { PetSitterGuide } from './PetSitterGuide';
import { PetWalks } from './PetWalks';
import { AddTreatmentModal } from './modals/AddTreatmentModal';
import { WalkTracker } from './WalkTracker';
import { PetSOS } from './PetSOS';
import { PetQRCodeModal } from './PetQRCodeModal';
import { SymptomLog } from './health/SymptomLog';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';

interface PetProfileProps {
  pet?: any;
  petId?: string;
  onBack: () => void;
  onAddReminder: (reminder: any) => void;
  onInviteMember: () => void;
}

export function PetProfile({ pet, petId, onBack, onAddReminder, onInviteMember }: PetProfileProps) {
  const { t } = useTranslation();
  
  const [fetchedPet, setFetchedPet] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // If pet is provided via props, or found in mockPets, we don't need to fetch
    if (pet || mockPets.find(p => p.id === petId)) {
      return;
    }

    if (!petId) return;

    const fetchPet = async () => {
      setLoading(true);
      try {
        const baseUrl = `https://${projectId}.supabase.co/functions/v1/make-server-3d55d0fe`;
        const response = await fetch(`${baseUrl}/pets/${petId}`, {
          headers: {
            'Authorization': `Bearer ${publicAnonKey}`
          }
        });
        
        if (!response.ok) throw new Error('Failed to fetch pet');
        
        const data = await response.json();
        
        // Normalize data
        const normalizedPet = {
          ...data,
          birthDate: data.birth_date || data.birthDate,
          reminders: data.reminders || [],
          image: data.image_url || data.image || 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=800&q=80',
          owners: data.owners || [], // Ensure owners array exists
          medicalHistory: data.medicalHistory || [],
          nutrition: data.nutrition || [],
          parasiteControl: data.parasiteControl || {}
        };
        
        setFetchedPet(normalizedPet);
      } catch (err) {
        console.error('Error fetching pet:', err);
        setError('Could not load pet profile');
      } finally {
        setLoading(false);
      }
    };

    fetchPet();
  }, [petId, pet]);

  const petData = pet || fetchedPet || mockPets.find(p => p.id === petId);

  const [activeTab, setActiveTab] = useState<'home' | 'health' | 'family'>('home');
  
  // Modals
  const [showSOS, setShowSOS] = useState(false);
  const [showWalkTracker, setShowWalkTracker] = useState(false);
  const [showQRCode, setShowQRCode] = useState(false);
  const [showTreatmentModal, setShowTreatmentModal] = useState(false);
  const [showWeightHistory, setShowWeightHistory] = useState(false);
  
  const [viewAsRole, setViewAsRole] = useState<'admin' | 'sitter'>('admin');
  const isSitter = viewAsRole === 'sitter';

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F8F9FA] flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-teal-600 animate-spin" />
      </div>
    );
  }

  if (!petData) {
    return (
       <div className="min-h-screen bg-[#F8F9FA] flex flex-col items-center justify-center p-5 text-center">
          <AlertCircle className="w-10 h-10 text-slate-300 mb-2" />
          <h2 className="text-lg font-bold text-slate-700">Profilis nerastas</h2>
          <button onClick={onBack} className="mt-4 text-teal-600 font-bold text-sm">Grįžti atgal</button>
       </div>
    );
  }

  const calculateAge = (birthDate: string) => {
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const m = today.getMonth() - birth.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--;
    return age;
  };

  // --- DYNAMIC TIMELINE DATA ---
  const getUpcomingEvents = () => {
    const events = [];

    // 1. Reminders
    if (petData.reminders) {
      petData.reminders.forEach((r: any) => {
        events.push({
          id: r.id,
          title: r.title,
          time: new Date(r.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          date: new Date(r.date),
          type: 'reminder',
          icon: Clock,
          color: 'text-blue-500 bg-blue-50',
          completed: false
        });
      });
    }

    // 2. Add static "Dinner" for demo purposes (to show functionality)
    events.push({
      id: 'dinner',
      title: 'Vakarienė',
      time: '18:00',
      date: new Date(), // Today
      type: 'food',
      icon: Utensils,
      color: 'text-orange-500 bg-orange-50',
      description: 'Sausas maistas (150g)',
      completed: false
    });

    // 3. Sort by time
    return events.sort((a, b) => a.date.getTime() - b.date.getTime());
  };

  const timelineEvents = getUpcomingEvents();

  const tabs = [
    { id: 'home', label: 'Diena', icon: Home },
    { id: 'health', label: 'Sveikata', icon: Activity },
    { id: 'family', label: 'Profilis', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-[#F8F9FA] pb-24 font-sans text-slate-900">
      
      {/* --- CLEAN HEADER --- */}
      <div className="sticky top-0 z-40 bg-white/80 backdrop-blur-xl border-b border-gray-100/50">
        <div className="px-5 pt-12 pb-4 flex items-center justify-between">
          <button onClick={onBack} className="w-10 h-10 rounded-full bg-white shadow-sm border border-gray-100 flex items-center justify-center text-slate-600 active:scale-95 transition-transform">
            <ChevronLeft className="w-5 h-5" />
          </button>
          
          <div className="flex flex-col items-center">
            <h1 className="text-lg font-bold text-slate-800">{petData.name}</h1>
            <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest">{petData.breed}</span>
          </div>

          <button onClick={() => setShowSOS(true)} className="w-10 h-10 rounded-full bg-rose-50 text-rose-500 border border-rose-100 flex items-center justify-center active:scale-95 transition-transform">
            <AlertTriangle className="w-5 h-5" />
          </button>
        </div>

        {/* Minimal Tabs */}
        <div className="px-6 flex justify-between gap-4 pb-0">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex-1 py-3 flex flex-col items-center gap-1.5 relative ${isActive ? 'text-slate-900' : 'text-slate-400'}`}
              >
                <Icon className={`w-6 h-6 ${isActive ? 'stroke-[2.5px]' : 'stroke-2'}`} />
                <span className="text-[10px] font-bold uppercase tracking-wider">{tab.label}</span>
                {isActive && <motion.div layoutId="activeTab" className="absolute bottom-0 w-8 h-1 bg-slate-900 rounded-full" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* --- CONTENT --- */}
      <div className="p-5">
        <AnimatePresence mode="wait">
          
          {/* === HOME TAB: DASHBOARD STYLE === */}
          {activeTab === 'home' && (
            <motion.div 
              key="home"
              initial={{ opacity: 0, y: 10 }} 
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-8"
            >
              {/* Pet Status Header */}
              <div className="flex items-center gap-5">
                <div className="relative">
                  <div className="w-20 h-20 rounded-full p-1 bg-white shadow-lg shadow-slate-200">
                    <img src={petData.image} alt={petData.name} className="w-full h-full object-cover rounded-full" />
                  </div>
                  <div className="absolute bottom-0 right-0 w-6 h-6 bg-green-500 border-4 border-white rounded-full"></div>
                </div>
                <div>
                  <p className="text-sm text-slate-500 font-medium">Labas, aš {petData.name}!</p>
                  <h2 className="text-2xl font-black text-slate-800 leading-tight">Pasiruošęs<br/>nuotykiams 🐾</h2>
                </div>
              </div>

              {/* Primary Actions - Quick Row */}
              <div>
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">Greitieji veiksmai</h3>
                <div className="grid grid-cols-4 gap-3">
                  <button onClick={() => setShowWalkTracker(true)} className="flex flex-col items-center gap-2 group">
                    <div className="w-16 h-16 rounded-2xl bg-teal-500 text-white flex items-center justify-center shadow-lg shadow-teal-500/30 group-active:scale-95 transition-all">
                      <PawPrint className="w-7 h-7" />
                    </div>
                    <span className="text-xs font-bold text-slate-600">Eiti</span>
                  </button>

                  <div className="flex flex-col items-center gap-2 group">
                    <div className="w-16 h-16 rounded-2xl bg-orange-500 text-white flex items-center justify-center shadow-lg shadow-orange-500/30 group-active:scale-95 transition-all">
                      <Utensils className="w-7 h-7" />
                    </div>
                    <span className="text-xs font-bold text-slate-600">Maistas</span>
                  </div>

                  <button onClick={() => setShowTreatmentModal(true)} className="flex flex-col items-center gap-2 group">
                    <div className="w-16 h-16 rounded-2xl bg-blue-500 text-white flex items-center justify-center shadow-lg shadow-blue-500/30 group-active:scale-95 transition-all">
                      <Syringe className="w-7 h-7" />
                    </div>
                    <span className="text-xs font-bold text-slate-600">Vaistai</span>
                  </button>

                  <button onClick={() => setShowQRCode(true)} className="flex flex-col items-center gap-2 group">
                    <div className="w-16 h-16 rounded-2xl bg-slate-800 text-white flex items-center justify-center shadow-lg shadow-slate-500/30 group-active:scale-95 transition-all">
                      <QrCode className="w-7 h-7" />
                    </div>
                    <span className="text-xs font-bold text-slate-600">QR</span>
                  </button>
                </div>
              </div>

              {/* Timeline / Up Next */}
              <div>
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">Dienotvarkė</h3>
                
                {timelineEvents.length > 0 ? (
                  <div className="bg-white rounded-3xl p-1 shadow-sm border border-slate-100 space-y-1">
                    {timelineEvents.map((event, idx) => {
                      const Icon = event.icon;
                      return (
                        <div key={idx} className="p-4 rounded-2xl bg-white flex items-center gap-4 hover:bg-slate-50 transition-colors">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-xs ${event.color}`}>
                            <Icon className="w-4 h-4" />
                          </div>
                          <div className="flex-1">
                            <h4 className="font-bold text-slate-800">{event.title}</h4>
                            <p className="text-xs text-slate-500">
                               {event.time} {event.description ? `• ${event.description}` : ''}
                            </p>
                          </div>
                          <button className="w-8 h-8 rounded-full border-2 border-slate-100 flex items-center justify-center text-slate-300 hover:border-green-500 hover:text-green-500 hover:bg-green-50 transition-all">
                             <Check className="w-4 h-4" />
                          </button>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="bg-white rounded-3xl p-6 text-center border border-slate-100">
                     <p className="text-slate-400 font-medium text-sm">Šiandien ramu...</p>
                     <button onClick={onAddReminder} className="mt-2 text-teal-600 text-xs font-bold uppercase tracking-wide">
                        + Pridėti priminimą
                     </button>
                  </div>
                )}
              </div>
              
              {/* Recent History Preview */}
              <div>
                <div className="flex justify-between items-end mb-4">
                   <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Aktyvumas</h3>
                   <button className="text-xs font-bold text-teal-600">Viskas</button>
                </div>
                <PetWalks pet={petData} limit={1} />
              </div>

              {isSitter && (
                 <div className="mt-4">
                    <PetSitterGuide pet={petData} isOwner={false} />
                 </div>
              )}
            </motion.div>
          )}

          {/* === HEALTH TAB: MEDICAL CARD STYLE === */}
          {activeTab === 'health' && (
            <motion.div 
              key="health"
              initial={{ opacity: 0, x: 20 }} 
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-8"
            >
              {/* Vitals Cards */}
              <div className="grid grid-cols-2 gap-4">
                
                {/* Weight Card - Clickable */}
                <button 
                  onClick={() => setShowWeightHistory(true)}
                  className="bg-white p-4 rounded-3xl shadow-sm border border-slate-100 flex flex-col justify-between h-32 relative active:scale-95 transition-transform text-left group"
                >
                  <div className="flex justify-between items-start w-full">
                    <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-500 flex items-center justify-center group-hover:bg-blue-100 transition-colors">
                      <Weight className="w-4 h-4" />
                    </div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase group-hover:text-blue-500 transition-colors">Istorija &gt;</span>
                  </div>
                  <div>
                    <span className="text-3xl font-black text-slate-800 tracking-tight">{petData.weight}</span>
                    <span className="text-sm font-medium text-slate-400 ml-1">kg</span>
                  </div>
                  <div className="text-xs text-slate-400 font-medium bg-slate-50 rounded-lg p-1 px-2 w-fit mt-1">
                     Dabartinis svoris
                  </div>
                </button>

                {/* Age Card */}
                <div className="bg-white p-4 rounded-3xl shadow-sm border border-slate-100 flex flex-col justify-between h-32">
                   <div className="flex justify-between items-start">
                    <div className="w-8 h-8 rounded-full bg-rose-50 text-rose-500 flex items-center justify-center">
                      <Activity className="w-4 h-4" />
                    </div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase">Amžius</span>
                  </div>
                  <div>
                    <span className="text-3xl font-black text-slate-800 tracking-tight">{calculateAge(petData.birthDate)}</span>
                    <span className="text-sm font-medium text-slate-400 ml-1">m.</span>
                  </div>
                  <div className="text-xs text-slate-400 font-medium bg-slate-50 rounded-lg p-1 text-center mt-1">
                    Gim.: {new Date(petData.birthDate).toLocaleDateString()}
                  </div>
                </div>
              </div>

              {/* Symptom Log */}
              <div className="relative z-0">
                <h3 className="text-lg font-bold text-slate-900 mb-3 px-1">Sveikatos žurnalas</h3>
                <SymptomLog />
              </div>

              {/* Medical Sections */}
              <div className="bg-white rounded-[2rem] shadow-sm border border-slate-100 overflow-hidden divide-y divide-slate-100 relative z-0">
                 
                 {/* Nutrition */}
                 <div className="p-5">
                    <div className="flex items-center gap-3 mb-4">
                       <div className="w-8 h-8 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center">
                          <Utensils className="w-4 h-4" />
                       </div>
                       <h4 className="font-bold text-slate-800">Mityba</h4>
                    </div>
                    {petData.nutrition?.map((item: any, i: number) => (
                      <div key={i} className="flex justify-between items-center text-sm mb-2 last:mb-0">
                         <span className="text-slate-600 font-medium">{item.foodName}</span>
                         <span className="font-bold text-slate-900">{item.dailyAmount}</span>
                      </div>
                    ))}
                 </div>

                 {/* Vaccines */}
                 <div className="p-5">
                    <PetHealth pet={petData} onAddReminder={onAddReminder} onLogTreatment={() => setShowTreatmentModal(true)} />
                 </div>
              </div>

            </motion.div>
          )}

          {/* === FAMILY TAB === */}
          {activeTab === 'family' && (
            <motion.div 
               key="family"
               initial={{ opacity: 0, x: -20 }} 
               animate={{ opacity: 1, x: 0 }}
               exit={{ opacity: 0, x: 20 }}
               className="space-y-6"
            >
               {/* Owners Section */}
               <div className="bg-white rounded-[2rem] p-6 shadow-sm border border-slate-100">
                  <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
                    <Users className="w-5 h-5 text-indigo-500" />
                    Šeima
                  </h3>
                  <div className="space-y-4">
                     {petData.owners.map((owner: any) => (
                        <div key={owner.id} className="flex items-center gap-4">
                           <img src={owner.avatar} alt={owner.username} className="w-12 h-12 rounded-full border-2 border-white shadow-sm" />
                           <div className="flex-1">
                              <p className="font-bold text-slate-900">{owner.username}</p>
                              <span className="text-xs text-slate-400 font-medium uppercase tracking-wide">
                                 {t(`pets.roles.${owner.role || 'user'}`)}
                              </span>
                           </div>
                           <button className="w-8 h-8 rounded-full bg-slate-50 text-slate-400 flex items-center justify-center hover:bg-slate-100">
                             <Settings className="w-4 h-4" />
                           </button>
                        </div>
                     ))}
                     
                     <button onClick={onInviteMember} className="w-full py-3 rounded-xl border border-dashed border-slate-300 text-slate-400 font-bold text-sm hover:border-indigo-400 hover:text-indigo-500 transition-colors mt-2">
                        + Pridėti narį
                     </button>
                  </div>
               </div>

               {/* Documents Section (Moved here) */}
               <div>
                  <h3 className="text-lg font-bold text-slate-900 mb-3 px-1">Dokumentai</h3>
                  <PetDocuments petId={petData.id} />
               </div>

               {/* Quick Actions */}
               <div className="grid grid-cols-2 gap-3">
                   <button className="bg-white p-5 rounded-[2rem] shadow-sm border border-slate-100 flex flex-col items-center gap-2 hover:bg-slate-50 transition-colors">
                      <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-500 flex items-center justify-center">
                        <Share2 className="w-5 h-5" />
                      </div>
                      <span className="font-bold text-slate-700 text-sm">Dalintis</span>
                   </button>
                   <button onClick={() => setShowQRCode(true)} className="bg-white p-5 rounded-[2rem] shadow-sm border border-slate-100 flex flex-col items-center gap-2 hover:bg-slate-50 transition-colors">
                      <div className="w-10 h-10 rounded-full bg-slate-100 text-slate-700 flex items-center justify-center">
                        <QrCode className="w-5 h-5" />
                      </div>
                      <span className="font-bold text-slate-700 text-sm">QR Kodas</span>
                   </button>
               </div>
               
               {/* Danger Zone */}
               <div className="bg-red-50 rounded-[2rem] p-6 text-center">
                  <h4 className="font-bold text-red-900 mb-2">Redaguoti profilį</h4>
                  <p className="text-red-700/60 text-xs mb-4">Pakeisti vardą, veislę ar ištrinti profilį.</p>
                  <button className="bg-white text-red-500 px-6 py-2 rounded-xl text-sm font-bold shadow-sm border border-red-100">
                     Nustatymai
                  </button>
               </div>
            </motion.div>
          )}

        </AnimatePresence>
      </div>

      {/* --- OVERLAYS --- */}
      <PetSOS pet={petData} isOpen={showSOS} onClose={() => setShowSOS(false)} />
      <AnimatePresence>{showQRCode && <PetQRCodeModal isOpen={showQRCode} onClose={() => setShowQRCode(false)} pet={petData} />}</AnimatePresence>
      <AnimatePresence>{showWalkTracker && <WalkTracker onClose={() => setShowWalkTracker(false)} petName={petData.name} />}</AnimatePresence>
      <AddTreatmentModal 
        isOpen={showTreatmentModal} 
        onClose={() => setShowTreatmentModal(false)} 
        onSuccess={() => {
          setShowTreatmentModal(false);
          // Optional: trigger data refresh here
          // setFetchedPet(prev => ({ ...prev })); 
        }} 
        petId={petData.id}
      />

      {/* Weight History Modal */}
      <Dialog open={showWeightHistory} onOpenChange={setShowWeightHistory}>
        <DialogContent aria-describedby={undefined} className="sm:max-w-md bg-[#F8F9FA] p-0 overflow-hidden border-none rounded-3xl">
          <div className="p-6 bg-white">
            <DialogHeader className="mb-4 flex flex-row items-center justify-between">
              <DialogTitle className="text-xl font-bold text-slate-900 flex items-center gap-2">
                 <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-500 flex items-center justify-center">
                    <Weight className="w-4 h-4" />
                 </div>
                 Svorio istorija
              </DialogTitle>
            </DialogHeader>
            
            <div className="flex items-end gap-2 mb-6">
               <span className="text-4xl font-black text-slate-900">{petData.weight}</span>
               <span className="text-lg font-medium text-slate-400 mb-1">kg</span>
               <span className="ml-auto text-xs font-bold text-green-500 bg-green-50 px-2 py-1 rounded-lg">
                 Normos ribose
               </span>
            </div>

            <div className="h-64 w-full">
              <PetWeightChart weightHistory={petData.weightHistory || []} />
            </div>
          </div>
          
          <div className="p-4 bg-slate-50 border-t border-slate-100">
             <button className="w-full py-3 bg-slate-900 text-white font-bold rounded-xl active:scale-95 transition-transform" onClick={() => setShowWeightHistory(false)}>
                Uždaryti
             </button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Role Switcher */}
      <div className="fixed bottom-24 right-4 z-40 opacity-50 hover:opacity-100 transition-opacity">
         <button onClick={() => setViewAsRole(viewAsRole === 'admin' ? 'sitter' : 'admin')} className="w-8 h-8 rounded-full bg-black/20 text-white flex items-center justify-center text-[10px] font-bold backdrop-blur-md">
            {viewAsRole === 'admin' ? 'A' : 'S'}
         </button>
      </div>
    </div>
  );
}