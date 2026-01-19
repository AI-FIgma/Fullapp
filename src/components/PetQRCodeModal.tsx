import { motion, AnimatePresence } from 'motion/react';
import { X, Download, Printer, Share2, ShieldCheck, Eye, MapPin, Phone, AlertTriangle } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner@2.0.3';

interface PetQRCodeModalProps {
  isOpen: boolean;
  onClose: () => void;
  pet: any;
}

export function PetQRCodeModal({ isOpen, onClose, pet }: PetQRCodeModalProps) {
  // Toggle between "Print Mode" (Owner view) and "Preview Public View" (Finder view)
  const [viewMode, setViewMode] = useState<'generate' | 'preview'>('generate');

  // Using a public API for QR code generation for this demo
  // In production, you might generate this server-side or use a library
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=https://yourapp.com/pet/${pet.id}/public&color=0d9488`;

  const handleDownload = () => {
    toast.success('QR Kodas išsaugotas į galeriją!');
  };

  const handlePrint = () => {
    toast.success('Spausdinimas paleistas...');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center px-4">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
      />
      
      <motion.div 
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 20 }}
        className="relative w-full max-w-md bg-white rounded-3xl overflow-hidden shadow-2xl max-h-[90vh] overflow-y-auto"
      >
        {/* Toggle Header */}
        <div className="flex border-b border-gray-100">
          <button 
            onClick={() => setViewMode('generate')}
            className={`flex-1 py-4 text-sm font-bold transition-colors ${
              viewMode === 'generate' ? 'bg-white text-teal-600 border-b-2 border-teal-600' : 'bg-gray-50 text-gray-500 hover:bg-gray-100'
            }`}
          >
            Mano Kodas
          </button>
          <button 
            onClick={() => setViewMode('preview')}
            className={`flex-1 py-4 text-sm font-bold transition-colors ${
              viewMode === 'preview' ? 'bg-white text-teal-600 border-b-2 border-teal-600' : 'bg-gray-50 text-gray-500 hover:bg-gray-100'
            }`}
          >
            <div className="flex items-center justify-center gap-2">
              <Eye className="w-4 h-4" />
              Ką mato radėjas?
            </div>
          </button>
        </div>

        <button 
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 hover:bg-gray-200 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {viewMode === 'generate' ? (
          <div className="p-8 flex flex-col items-center text-center space-y-6">
            <div className="space-y-2">
              <h2 className="text-2xl font-black text-gray-900">Išmanusis Pakabukas</h2>
              <p className="text-gray-500 text-sm px-4">
                Atsispausdinkite šį QR kodą arba išgraviruokite jį ant pakabuko. 
              </p>
            </div>

            {/* QR Card Preview */}
            <div className="bg-white p-4 rounded-3xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.1)] border border-gray-100 w-full max-w-[280px]">
               <div className="aspect-square bg-teal-50 rounded-2xl flex items-center justify-center relative overflow-hidden group">
                  <img src={qrUrl} alt="QR Code" className="w-48 h-48 mix-blend-multiply" />
                  <div className="absolute inset-0 border-[6px] border-teal-500/10 rounded-2xl" />
               </div>
               <div className="mt-4 flex items-center justify-center gap-2 text-teal-700 font-bold">
                  <ShieldCheck className="w-5 h-5" />
                  <span>Saugus Profilis</span>
               </div>
            </div>

            <div className="grid grid-cols-2 gap-3 w-full">
              <button 
                onClick={handleDownload}
                className="flex flex-col items-center justify-center gap-2 p-4 rounded-2xl bg-gray-50 hover:bg-teal-50 hover:text-teal-600 transition-colors border border-gray-100 group"
              >
                <div className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Download className="w-5 h-5" />
                </div>
                <span className="text-xs font-bold">Atsisiųsti</span>
              </button>
              <button 
                onClick={handlePrint}
                className="flex flex-col items-center justify-center gap-2 p-4 rounded-2xl bg-gray-50 hover:bg-teal-50 hover:text-teal-600 transition-colors border border-gray-100 group"
              >
                 <div className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Printer className="w-5 h-5" />
                </div>
                <span className="text-xs font-bold">Spausdinti</span>
              </button>
            </div>

            <div className="text-xs text-gray-400 bg-gray-50 px-4 py-2 rounded-lg">
              <span className="font-bold">Kaip tai veikia?</span> Radusiam žmogui nuskenavus šį kodą, jis pamatys tik jūsų kontaktus ir svarbiausią informaciją. Jūsų namų adresas liks privatus.
            </div>
          </div>
        ) : (
          /* PREVIEW MODE - What the finder sees */
          <div className="relative bg-gray-50 min-h-[500px]">
            {/* Header Red Warning */}
            <div className="bg-red-500 text-white p-4 text-center pb-12 rounded-b-[2.5rem] relative overflow-hidden">
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/diagonal-stripes.png')] opacity-10" />
                <div className="relative z-10 flex flex-col items-center animate-pulse">
                    <AlertTriangle className="w-10 h-10 mb-2" />
                    <h2 className="text-xl font-black uppercase tracking-widest">Aš pasiklydau!</h2>
                    <p className="text-red-100 text-sm">Prašau, padėkite man grįžti namo.</p>
                </div>
            </div>

            {/* Content Card */}
            <div className="px-6 -mt-8 relative z-20">
                <div className="bg-white rounded-3xl p-6 shadow-xl space-y-6">
                    {/* Pet Identity */}
                    <div className="text-center">
                        <div className="w-24 h-24 rounded-full border-4 border-white shadow-lg mx-auto -mt-16 overflow-hidden bg-gray-200">
                             <img src={pet.image} alt={pet.name} className="w-full h-full object-cover" />
                        </div>
                        <h3 className="text-2xl font-black text-gray-900 mt-3">{pet.name}</h3>
                        <p className="text-gray-500 font-medium">{pet.breed} • {pet.gender === 'male' ? 'Patinas' : 'Patelė'}</p>
                    </div>

                    {/* Owner Contact Buttons (Big & Urgent) */}
                    <div className="space-y-3">
                        <a href="tel:+37060000000" className="w-full py-4 bg-green-500 hover:bg-green-600 text-white rounded-2xl flex items-center justify-center gap-3 font-bold text-lg shadow-lg shadow-green-500/30 transition-all transform hover:scale-[1.02] active:scale-95">
                            <Phone className="w-6 h-6 animate-bounce" />
                            Skambinti Šeimininkui
                        </a>
                        <button 
                            onClick={() => toast.success("Lokacija išsiųsta šeimininkui!")}
                            className="w-full py-4 bg-white border-2 border-blue-500 text-blue-600 hover:bg-blue-50 rounded-2xl flex items-center justify-center gap-3 font-bold transition-all"
                        >
                            <MapPin className="w-5 h-5" />
                            Siųsti mano lokaciją
                        </button>
                    </div>

                    {/* Important Info */}
                    <div className="bg-red-50 rounded-2xl p-4 border border-red-100">
                         <h4 className="font-bold text-red-800 mb-2 flex items-center gap-2">
                            <ShieldCheck className="w-4 h-4" />
                            Svarbu žinoti
                         </h4>
                         <ul className="space-y-2 text-sm text-red-700 font-medium">
                            <li className="flex items-start gap-2">
                                <span className="mt-1 w-1.5 h-1.5 rounded-full bg-red-400" />
                                Draugiškas su žmonėmis
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="mt-1 w-1.5 h-1.5 rounded-full bg-red-400" />
                                Turi mikroschemą
                            </li>
                            {pet.medicalAlert && (
                                <li className="flex items-start gap-2 font-bold">
                                    <span className="mt-1 w-1.5 h-1.5 rounded-full bg-red-600" />
                                    Vartoja vaistus!
                                </li>
                            )}
                         </ul>
                    </div>
                </div>
                
                <p className="text-center text-xs text-gray-400 mt-6 mb-4">
                    Šis profilis yra viešas saugumo sumetimais.
                </p>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
}