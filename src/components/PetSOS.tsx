import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { AlertTriangle, MapPin, Phone, Share2, FileText, X, Siren, Bell, CheckCircle2, Navigation } from 'lucide-react';
import { useTranslation } from '../utils/useTranslation';
import { toast } from 'sonner@2.0.3';
import { Pet } from '../data/mockPets';

interface PetSOSProps {
  pet: Pet;
  isOpen: boolean;
  onClose: () => void;
}

export function PetSOS({ pet, isOpen, onClose }: PetSOSProps) {
  const { t } = useTranslation();
  const [step, setStep] = useState<'menu' | 'lost' | 'medical' | 'poster'>('menu');
  const [isBroadcasting, setIsBroadcasting] = useState(false);
  const [broadcastSent, setBroadcastSent] = useState(false);

  // Reset state when opening
  useEffect(() => {
    if (isOpen) {
      setStep('menu');
      setBroadcastSent(false);
    }
  }, [isOpen]);

  const handleBroadcast = () => {
    setIsBroadcasting(true);
    // Simulate API call
    setTimeout(() => {
      setIsBroadcasting(false);
      setBroadcastSent(true);
      toast.error(t('sos.broadcastSent'), {
        description: t('sos.broadcastDesc'),
        duration: 5000,
      });
    }, 2000);
  };

  const menuItems = [
    {
      id: 'lost',
      title: t('sos.reportLost'),
      desc: t('sos.reportLostDesc'),
      icon: <AlertTriangle className="w-8 h-8 text-white" />,
      color: 'bg-red-500',
      action: () => setStep('lost')
    },
    {
      id: 'medical',
      title: t('sos.medicalEmergency'),
      desc: t('sos.medicalEmergencyDesc'),
      icon: <Siren className="w-8 h-8 text-white" />,
      color: 'bg-blue-600',
      action: () => setStep('medical')
    }
  ];

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center pointer-events-none">
          {/* Backdrop */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-gray-900/90 backdrop-blur-sm pointer-events-auto"
          />

          {/* Modal */}
          <motion.div 
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="relative w-full max-w-md bg-white rounded-t-3xl sm:rounded-3xl overflow-hidden pointer-events-auto shadow-2xl"
            style={{ maxHeight: '90vh' }}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-100">
              <div className="flex items-center gap-2 text-red-600">
                <Siren className="w-6 h-6 animate-pulse" />
                <span className="font-black text-lg tracking-tight uppercase">SOS MODE</span>
              </div>
              <button 
                onClick={onClose}
                className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 hover:bg-gray-200 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto" style={{ maxHeight: 'calc(90vh - 70px)' }}>
              
              {/* MENU STEP */}
              {step === 'menu' && (
                <div className="space-y-4">
                  <div className="text-center mb-6">
                    <div className="w-20 h-20 rounded-full mx-auto mb-4 border-4 border-white shadow-lg overflow-hidden">
                      <img src={pet.image} alt={pet.name} className="w-full h-full object-cover" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900">{t('sos.whatHappened', { name: pet.name })}</h2>
                    <p className="text-gray-500">{t('sos.selectEmergency')}</p>
                  </div>

                  <div className="grid gap-4">
                    {menuItems.map((item) => (
                      <motion.button
                        key={item.id}
                        whileTap={{ scale: 0.98 }}
                        onClick={item.action}
                        className={`${item.color} relative overflow-hidden rounded-2xl p-6 text-left shadow-lg group`}
                      >
                        <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-white/20 rounded-full blur-2xl group-hover:bg-white/30 transition-colors" />
                        <div className="relative flex items-center gap-4">
                          <div className="w-16 h-16 rounded-2xl bg-white/20 flex items-center justify-center backdrop-blur-sm">
                            {item.icon}
                          </div>
                          <div>
                            <h3 className="text-xl font-bold text-white">{item.title}</h3>
                            <p className="text-white/80 text-sm font-medium">{item.desc}</p>
                          </div>
                        </div>
                      </motion.button>
                    ))}
                  </div>
                </div>
              )}

              {/* LOST PET STEP */}
              {step === 'lost' && (
                <div className="space-y-6">
                  {!broadcastSent ? (
                    <>
                      <div className="text-center">
                         <div className="w-16 h-16 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto mb-4">
                           <AlertTriangle className="w-8 h-8" />
                         </div>
                         <h3 className="text-2xl font-bold text-gray-900">{t('sos.alertCommunity')}</h3>
                         <p className="text-gray-500 mt-2 text-sm">{t('sos.alertCommunityDesc')}</p>
                      </div>

                      <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 space-y-3">
                        <div className="flex items-center gap-3 text-sm text-gray-700">
                          <Navigation className="w-5 h-5 text-teal-600" />
                          <span className="font-semibold">{t('sos.currentLocation')}:</span>
                          <span>Vilnius, Senamiestis (GPS)</span>
                        </div>
                        <div className="flex items-center gap-3 text-sm text-gray-700">
                          <Bell className="w-5 h-5 text-amber-500" />
                          <span className="font-semibold">{t('sos.notifyRadius')}:</span>
                          <span>5 km</span>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <button 
                          onClick={handleBroadcast}
                          disabled={isBroadcasting}
                          className="w-full py-4 bg-red-600 text-white rounded-xl font-bold text-lg shadow-lg shadow-red-500/30 flex items-center justify-center gap-2 hover:bg-red-700 transition-colors disabled:opacity-50"
                        >
                          {isBroadcasting ? (
                             <>
                               <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                               {t('sos.broadcasting')}
                             </>
                          ) : (
                             <>
                               <Siren className="w-5 h-5" />
                               {t('sos.sendAlert')}
                             </>
                          )}
                        </button>
                        <button 
                          onClick={() => setStep('menu')}
                          className="w-full py-3 bg-gray-100 text-gray-700 rounded-xl font-bold hover:bg-gray-200 transition-colors"
                        >
                          {t('common.cancel')}
                        </button>
                      </div>
                    </>
                  ) : (
                    <div className="text-center py-8">
                       <motion.div 
                         initial={{ scale: 0 }}
                         animate={{ scale: 1 }}
                         className="w-24 h-24 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6"
                       >
                         <CheckCircle2 className="w-12 h-12" />
                       </motion.div>
                       <h3 className="text-2xl font-bold text-gray-900 mb-2">{t('sos.alertSent')}</h3>
                       <p className="text-gray-500 mb-8">{t('sos.alertSentDesc')}</p>
                       
                       <div className="grid grid-cols-2 gap-3">
                         <button className="flex flex-col items-center justify-center gap-2 p-4 bg-gray-50 rounded-xl border border-gray-100 hover:bg-gray-100">
                           <FileText className="w-6 h-6 text-gray-600" />
                           <span className="text-xs font-bold text-gray-700">{t('sos.downloadPoster')}</span>
                         </button>
                         <button className="flex flex-col items-center justify-center gap-2 p-4 bg-gray-50 rounded-xl border border-gray-100 hover:bg-gray-100">
                           <Share2 className="w-6 h-6 text-gray-600" />
                           <span className="text-xs font-bold text-gray-700">{t('sos.shareLink')}</span>
                         </button>
                       </div>

                       <button 
                         onClick={onClose}
                         className="mt-8 text-gray-400 font-medium hover:text-gray-600"
                       >
                         {t('common.close')}
                       </button>
                    </div>
                  )}
                </div>
              )}

              {/* MEDICAL STEP */}
              {step === 'medical' && (
                <div className="space-y-6">
                  <div className="text-center">
                    <div className="w-16 h-16 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center mx-auto mb-4">
                      <Phone className="w-8 h-8" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900">{t('sos.emergencyContacts')}</h3>
                    <p className="text-gray-500 mt-2 text-sm">{t('sos.emergencyContactsDesc')}</p>
                  </div>

                  <div className="space-y-3">
                    {/* Vet Contact */}
                    <div className="flex items-center justify-between p-4 bg-white border border-gray-100 rounded-2xl shadow-sm">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-teal-50 rounded-full flex items-center justify-center text-teal-600">
                          <Phone className="w-5 h-5" />
                        </div>
                        <div>
                          <p className="text-xs font-bold text-gray-400 uppercase">{t('sos.primaryVet')}</p>
                          <p className="font-bold text-gray-900">Dr. Petkus</p>
                        </div>
                      </div>
                      <a href="tel:112" className="bg-teal-600 text-white px-4 py-2 rounded-xl text-sm font-bold shadow-lg shadow-teal-500/20 hover:bg-teal-700">
                        {t('sos.call')}
                      </a>
                    </div>

                    {/* 24/7 Clinic */}
                    <div className="flex items-center justify-between p-4 bg-red-50 border border-red-100 rounded-2xl shadow-sm">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-red-600">
                          <Siren className="w-5 h-5" />
                        </div>
                        <div>
                          <p className="text-xs font-bold text-red-400 uppercase">{t('sos.clinic247')}</p>
                          <p className="font-bold text-red-900">VetPagalba 24/7</p>
                        </div>
                      </div>
                      <a href="tel:112" className="bg-red-600 text-white px-4 py-2 rounded-xl text-sm font-bold shadow-lg shadow-red-500/20 hover:bg-red-700">
                        {t('sos.call')}
                      </a>
                    </div>
                  </div>

                  <div className="mt-4 p-4 bg-gray-50 rounded-2xl text-sm text-gray-600">
                    <p className="font-bold text-gray-900 mb-1">{t('sos.firstAidTips')}:</p>
                    <ul className="list-disc pl-4 space-y-1">
                      <li>{t('sos.tip1')}</li>
                      <li>{t('sos.tip2')}</li>
                      <li>{t('sos.tip3')}</li>
                    </ul>
                  </div>
                  
                  <button 
                    onClick={() => setStep('menu')}
                    className="w-full py-3 text-gray-500 font-bold hover:text-gray-700"
                  >
                    {t('common.back')}
                  </button>
                </div>
              )}

            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
