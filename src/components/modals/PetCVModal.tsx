import { motion, AnimatePresence } from 'motion/react';
import { X, Download, Share2, Phone, Mail, Shield, Heart, Award } from 'lucide-react';
import { Pet } from '../../data/mockPets';
import { useTranslation } from '../../utils/useTranslation';
import { toast } from 'sonner@2.0.3';

interface PetCVModalProps {
  isOpen: boolean;
  onClose: () => void;
  pet: Pet;
}

export function PetCVModal({ isOpen, onClose, pet }: PetCVModalProps) {
  const { t } = useTranslation();

  const handleDownload = () => {
    toast.success(t('documents.downloading'));
    // In a real app, we would use html2canvas here
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `${pet.name} - Pet Resume`,
        text: `Check out ${pet.name}'s profile!`,
        url: window.location.href,
      }).catch(() => {});
    } else {
      toast.success(t('pets.shareLink'));
    }
  };

  const calculateAge = (birthDate: string) => {
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const m = today.getMonth() - birth.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    return age;
  };

  const owner = pet.owners.find(o => o.role === 'admin') || pet.owners[0];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="fixed inset-x-4 top-[5%] md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:max-w-lg w-full z-50 overflow-hidden pointer-events-none"
          >
            <div className="pointer-events-auto bg-transparent relative">
              {/* Close Button */}
              <button 
                onClick={onClose} 
                className="absolute -top-12 right-0 p-2 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors"
              >
                <X className="w-6 h-6" />
              </button>

              {/* THE CV CARD */}
              <div className="bg-white rounded-3xl overflow-hidden shadow-2xl transform transition-transform">
                {/* Header Image */}
                <div className="h-48 relative">
                  <img src={pet.coverImage || pet.image} alt="Cover" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <div className="absolute -bottom-12 left-8">
                    <div className="w-24 h-24 rounded-2xl border-4 border-white shadow-lg overflow-hidden bg-white">
                      <img src={pet.image} alt={pet.name} className="w-full h-full object-cover" />
                    </div>
                  </div>
                </div>

                {/* Body */}
                <div className="pt-14 pb-8 px-8">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h2 className="text-3xl font-black text-gray-900">{pet.name}</h2>
                      <p className="text-gray-500 font-medium">{pet.breed} • {calculateAge(pet.birthDate)} {t('pets.years')}</p>
                    </div>
                    <div className="bg-teal-50 text-teal-700 px-3 py-1 rounded-full text-sm font-bold border border-teal-100">
                      {pet.weight} kg
                    </div>
                  </div>

                  {/* Traits/Tags */}
                  <div className="flex flex-wrap gap-2 mb-6">
                    {pet.traits?.map((trait, i) => (
                      <span key={i} className="px-3 py-1 bg-gray-100 text-gray-600 rounded-lg text-xs font-bold uppercase tracking-wide flex items-center gap-1.5">
                        <Heart className="w-3 h-3 text-pink-500" />
                        {trait}
                      </span>
                    ))}
                    {!pet.traits?.length && (
                      <span className="text-gray-400 text-sm italic">No specific traits listed</span>
                    )}
                  </div>

                  {/* Bio */}
                  {pet.bio && (
                    <div className="mb-6 p-4 bg-gray-50 rounded-2xl border border-gray-100 italic text-gray-600 text-sm leading-relaxed">
                      "{pet.bio}"
                    </div>
                  )}

                  {/* Key Info Grid */}
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="p-3 rounded-2xl border border-green-100 bg-green-50/50 flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                        <Shield className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-[10px] font-bold text-green-600 uppercase tracking-wide">Health</p>
                        <p className="text-sm font-bold text-gray-900">Vaccinated</p>
                      </div>
                    </div>
                    <div className="p-3 rounded-2xl border border-purple-100 bg-purple-50/50 flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center text-purple-600">
                        <Award className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-[10px] font-bold text-purple-600 uppercase tracking-wide">Behavior</p>
                        <p className="text-sm font-bold text-gray-900">Trained</p>
                      </div>
                    </div>
                  </div>

                  {/* Contact Footer */}
                  <div className="border-t border-gray-100 pt-6">
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-3">Emergency Contact / Owner</p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                         <img src={owner.avatar} alt={owner.username} className="w-10 h-10 rounded-full bg-gray-200" />
                         <div>
                           <p className="font-bold text-gray-900">{owner.username}</p>
                           <p className="text-xs text-gray-500">Primary Owner</p>
                         </div>
                      </div>
                      <div className="flex gap-2">
                        <button className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 hover:bg-teal-50 hover:text-teal-600 transition-colors">
                          <Phone className="w-5 h-5" />
                        </button>
                        <button className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 hover:bg-blue-50 hover:text-blue-600 transition-colors">
                          <Mail className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Action Bar (Not part of the "Card" visually for export, but part of UI) */}
                <div className="bg-gray-50 p-4 border-t border-gray-100 flex gap-3">
                  <button 
                    onClick={handleShare}
                    className="flex-1 py-3 bg-white border border-gray-200 rounded-xl font-bold text-gray-700 flex items-center justify-center gap-2 hover:bg-gray-50 transition-colors shadow-sm"
                  >
                    <Share2 className="w-4 h-4" />
                    Share
                  </button>
                  <button 
                    onClick={handleDownload}
                    className="flex-1 py-3 bg-teal-600 text-white rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-teal-700 transition-colors shadow-lg shadow-teal-500/30"
                  >
                    <Download className="w-4 h-4" />
                    Download
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
