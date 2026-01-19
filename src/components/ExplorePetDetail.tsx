import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ChevronLeft, ChevronRight, Heart, MapPin, Syringe, Scale, 
  Calendar, Info, Phone, Mail, Globe, Share2, ShieldCheck, X, 
  Palette, Scissors, Check, Zap, Activity, Home, Building, Dog, User, MessageCircle, FileText
} from 'lucide-react';

// Reusing Icons
const MaleIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="10" cy="14" r="6" />
    <path d="M20 4l-6.5 6.5" />
    <path d="M20 4v5" />
    <path d="M20 4h-5" />
  </svg>
);

const FemaleIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="10" r="6" />
    <path d="M12 16v6" />
    <path d="M9 19h6" />
  </svg>
);

interface Question {
  id: string;
  type: 'text' | 'textarea' | 'boolean' | 'select';
  label: string;
  options?: string[];
  placeholder?: string;
}

interface ExplorePetDetailProps {
  pet: any;
  onBack: () => void;
  // onAdopt prop is no longer used for navigation, as the form is internal
}

export function ExplorePetDetail({ pet, onBack }: ExplorePetDetailProps) {
  const [showShelter, setShowShelter] = useState(false);
  const [showAdoptForm, setShowAdoptForm] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Mock Questionnaire Data (Would come from Shelter Dashboard API)
  const shelterQuestions: Question[] = [
    { 
      id: 'q1', 
      type: 'boolean', 
      label: 'Have you owned a dog before?' 
    },
    { 
      id: 'q2', 
      type: 'select', 
      label: 'What is your current living situation?',
      options: ['Apartment (Own)', 'Apartment (Rent)', 'House (Own)', 'House (Rent)']
    },
    { 
      id: 'q3', 
      type: 'boolean', 
      label: 'Do you currently have other pets?' 
    },
    { 
      id: 'q4', 
      type: 'text', 
      label: 'How many hours will the pet be alone daily?',
      placeholder: 'e.g. 4-5 hours'
    },
    { 
      id: 'q5', 
      type: 'textarea', 
      label: 'Describe your daily routine and activity level',
      placeholder: 'Morning walks, weekend trips...'
    }
  ];

  // Form State
  const [answers, setAnswers] = useState<Record<string, any>>({});
  
  // Mock multiple images if not present
  const images = pet.images && pet.images.length > 0 
    ? pet.images 
    : [pet.image, pet.image, pet.image];

  const handleImageScroll = (e: any) => {
    const scrollLeft = e.target.scrollLeft;
    const width = e.target.offsetWidth;
    const index = Math.round(scrollLeft / width);
    setCurrentImageIndex(index);
  };

  const scrollNext = () => {
    if (scrollContainerRef.current) {
      const width = scrollContainerRef.current.offsetWidth;
      scrollContainerRef.current.scrollBy({ left: width, behavior: 'smooth' });
    }
  };

  const scrollPrev = () => {
    if (scrollContainerRef.current) {
      const width = scrollContainerRef.current.offsetWidth;
      scrollContainerRef.current.scrollBy({ left: -width, behavior: 'smooth' });
    }
  };

  const handleAnswerChange = (id: string, value: any) => {
    setAnswers(prev => ({ ...prev, [id]: value }));
  };

  const handleAdoptSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setTimeout(() => {
      setSubmitSuccess(true);
    }, 1500);
  };

  // Health data
  const healthItems = [
    { label: 'Vaccinated', value: true },
    { label: 'Neutered', value: true },
    { label: 'Microchipped', value: false },
  ];

  return (
    <motion.div 
      initial={{ opacity: 0, x: '100%' }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: '100%' }}
      transition={{ type: 'spring', damping: 25, stiffness: 200 }}
      className="fixed inset-0 z-50 bg-white overflow-hidden flex flex-col"
    >
      <div className="flex-1 overflow-y-auto pb-32">
        {/* Hero Image Section - Reduced Height & Gallery Support */}
        <div className="relative w-full h-[40vh] group">
          {/* Image Gallery */}
          <div 
            ref={scrollContainerRef}
            className="w-full h-full overflow-x-auto flex snap-x snap-mandatory scrollbar-hide touch-pan-x"
            onScroll={handleImageScroll}
          >
            {images.map((img: string, idx: number) => (
              <div key={idx} className="w-full h-full flex-shrink-0 snap-center relative">
                <img 
                  src={img} 
                  alt={`${pet.name} - ${idx + 1}`} 
                  className="w-full h-full object-cover" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60 pointer-events-none" />
              </div>
            ))}
          </div>

          {/* Navigation Arrows (Visible on Desktop/Hover) */}
          {images.length > 1 && (
            <>
              <button 
                onClick={scrollPrev}
                className={`absolute left-4 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/20 backdrop-blur-md border border-white/20 flex items-center justify-center text-white transition-opacity z-20 ${currentImageIndex === 0 ? 'opacity-0 pointer-events-none' : 'opacity-100 hover:bg-white/30'}`}
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button 
                onClick={scrollNext}
                className={`absolute right-4 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/20 backdrop-blur-md border border-white/20 flex items-center justify-center text-white transition-opacity z-20 ${currentImageIndex === images.length - 1 ? 'opacity-0 pointer-events-none' : 'opacity-100 hover:bg-white/30'}`}
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </>
          )}
          
          {/* Image Pagination Dots */}
          <div className="absolute bottom-6 left-0 right-0 flex justify-center gap-1.5 z-20 pointer-events-none">
             {images.map((_: any, idx: number) => (
                <div 
                  key={idx} 
                  className={`w-1.5 h-1.5 rounded-full transition-all ${
                    idx === currentImageIndex ? 'bg-white w-4' : 'bg-white/50'
                  }`} 
                />
             ))}
          </div>

          {/* Navigation Header */}
          <div className="absolute top-0 left-0 right-0 p-6 pt-8 flex items-center justify-between z-10 pointer-events-none">
            <button 
              onClick={onBack}
              className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md border border-white/20 flex items-center justify-center text-white hover:bg-white/30 transition-colors pointer-events-auto"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            
            <div className="flex gap-3 pointer-events-auto">
              <button className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md border border-white/20 flex items-center justify-center text-white hover:bg-white/30 transition-colors">
                <Share2 className="w-5 h-5" />
              </button>
              <button 
                className={`w-10 h-10 rounded-full backdrop-blur-md border flex items-center justify-center transition-colors ${
                  pet.isFavorite 
                    ? 'bg-rose-500/20 border-rose-500/30 text-rose-500' 
                    : 'bg-white/20 border-white/20 text-white hover:bg-white/30'
                }`}
              >
                <Heart className={`w-5 h-5 ${pet.isFavorite ? 'fill-current' : ''}`} />
              </button>
            </div>
          </div>
        </div>

        {/* Content Section */}
        <div className="relative -mt-6 bg-white rounded-t-[2rem] px-6 pt-8 z-10">
          
          <div className="flex justify-between items-start mb-6">
             <div>
                <h1 className="text-3xl font-bold text-slate-900 mb-1">{pet.name}</h1>
                <div className="flex items-center gap-2 text-slate-500 font-medium">
                   <MapPin className="w-4 h-4 text-teal-600" />
                   {pet.location}, Lithuania
                </div>
             </div>
             <div className={`px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wide ${
                 pet.status === 'available' ? 'bg-emerald-100 text-emerald-700' :
                 pet.status === 'adopted' ? 'bg-blue-100 text-blue-700' :
                 'bg-slate-100 text-slate-700'
             }`}>
                {pet.status}
             </div>
          </div>

          {/* Key Stats Bar - Minimalist */}
          <div className="flex justify-between items-center py-4 border-b border-gray-100">
             <div className="flex flex-col items-center flex-1">
                <span className="text-xl font-bold text-slate-800">{pet.age}</span>
                <span className="text-xs text-slate-400 font-medium uppercase tracking-wide mt-1">Age</span>
             </div>
             <div className="w-px h-10 bg-gray-100" />
             <div className="flex flex-col items-center flex-1">
                <span className="text-xl font-bold text-slate-800 capitalize">{pet.gender}</span>
                <span className="text-xs text-slate-400 font-medium uppercase tracking-wide mt-1">Sex</span>
             </div>
             <div className="w-px h-10 bg-gray-100" />
             <div className="flex flex-col items-center flex-1">
                <span className="text-xl font-bold text-slate-800">5.2 kg</span>
                <span className="text-xs text-slate-400 font-medium uppercase tracking-wide mt-1">Weight</span>
             </div>
          </div>

          {/* Combined Compact Info */}
          <div className="py-6 space-y-6">
             {/* Appearance Compact */}
             <div className="flex items-center justify-between px-2">
                <div className="flex items-center gap-4">
                   <div className="w-10 h-10 rounded-full bg-orange-50 text-orange-500 flex items-center justify-center shrink-0">
                      <Palette size={20}/>
                   </div>
                   <div>
                      <div className="text-[10px] text-gray-400 uppercase font-bold tracking-wider">Color</div>
                      <div className="text-sm font-bold text-gray-800">Golden/White</div>
                   </div>
                </div>
                <div className="w-px h-8 bg-gray-100 mx-4" />
                <div className="flex items-center gap-4">
                   <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-500 flex items-center justify-center shrink-0">
                      <Scissors size={20}/>
                   </div>
                   <div>
                      <div className="text-[10px] text-gray-400 uppercase font-bold tracking-wider">Fur</div>
                      <div className="text-sm font-bold text-gray-800">Medium</div>
                   </div>
                </div>
             </div>

             <div className="border-t border-gray-100" />

             {/* Health Compact Chips */}
             <div>
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 px-2">Health Status</h3>
                <div className="flex flex-wrap gap-2.5 px-1">
                   {healthItems.map((item, idx) => (
                      <div 
                        key={idx} 
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-bold transition-colors ${
                          item.value 
                            ? 'bg-teal-50 border-teal-100 text-teal-700' 
                            : 'bg-rose-50 border-rose-100 text-rose-700 opacity-80'
                        }`}
                      >
                         {item.value ? <Check size={12} strokeWidth={3} /> : <X size={12} strokeWidth={3} />}
                         {item.label}
                      </div>
                   ))}
                </div>
             </div>
             
             <div className="border-t border-gray-100" />

             {/* Description */}
             <div className="px-1">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">About {pet.name}</h3>
                <p className="text-slate-500 leading-relaxed text-sm">
                  {pet.name} is a sweet and energetic {pet.breed} looking for a forever home. 
                  Very playful and loves to be around people. Has been well socialized with other pets and children. 
                  Needs a loving family who can provide plenty of exercise and cuddles. 
                  Currently located at the shelter in {pet.location} and ready for immediate adoption.
                </p>
             </div>

          </div>
        </div>
      </div>

      {/* Sticky Bottom Bar */}
      <div className="fixed bottom-0 left-0 right-0 p-5 bg-white border-t border-gray-100 z-40 pb-8">
        <div className="flex gap-3">
           <button 
             onClick={() => setShowShelter(true)}
             className="p-4 rounded-2xl border-2 border-slate-100 text-slate-600 hover:bg-slate-50 transition-colors flex items-center justify-center"
           >
              <Info className="w-6 h-6" />
           </button>
           <button 
             onClick={() => setShowAdoptForm(true)}
             className="flex-1 bg-slate-900 text-white font-bold text-lg rounded-2xl shadow-lg shadow-slate-200 hover:bg-slate-800 transition-colors"
           >
             Adopt {pet.name}
           </button>
        </div>
      </div>

      {/* Shelter Info Modal */}
      <AnimatePresence>
        {showShelter && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowShelter(false)}
              className="fixed inset-0 bg-black/50 z-[60] backdrop-blur-sm"
            />
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed bottom-0 left-0 right-0 z-[70] bg-white rounded-t-[2rem] p-6 pb-10 max-h-[80vh] overflow-y-auto"
            >
               <div className="flex justify-between items-center mb-6 sticky top-0 bg-white z-10 pb-2">
                  <h3 className="text-xl font-bold text-slate-800">Shelter Information</h3>
                  <button 
                    onClick={() => setShowShelter(false)}
                    className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 hover:bg-gray-200"
                  >
                    <X className="w-5 h-5" />
                  </button>
               </div>
               
               <div className="bg-slate-900 rounded-3xl p-5 text-white mb-6">
                  <div className="flex items-center gap-4 mb-4">
                     <div className="w-12 h-12 rounded-full bg-teal-500 flex items-center justify-center font-bold text-xl">
                        SOS
                     </div>
                     <div>
                        <h4 className="font-bold text-lg">SOS Gyvūnai Shelter</h4>
                        <p className="text-slate-400 text-sm">Official Partner</p>
                     </div>
                  </div>
                  
                  <div className="space-y-4">
                     <div className="flex items-center gap-3 text-sm p-3 rounded-xl bg-white/5">
                        <Phone className="w-5 h-5 text-teal-400" />
                        <span>+370 600 00000</span>
                     </div>
                     <div className="flex items-center gap-3 text-sm p-3 rounded-xl bg-white/5">
                        <Mail className="w-5 h-5 text-teal-400" />
                        <span>info@sos-gyvunai.lt</span>
                     </div>
                     <div className="flex items-center gap-3 text-sm p-3 rounded-xl bg-white/5">
                        <MapPin className="w-5 h-5 text-teal-400" />
                        <span>Taikos pr. 43, Kaunas</span>
                     </div>
                  </div>
               </div>
               
               <button 
                 onClick={() => setShowShelter(false)}
                 className="w-full py-4 rounded-2xl bg-gray-100 text-slate-700 font-bold hover:bg-gray-200 transition-colors"
               >
                 Close
               </button>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Adoption Questionnaire Modal */}
      <AnimatePresence>
        {showAdoptForm && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => !submitSuccess && setShowAdoptForm(false)}
              className="fixed inset-0 bg-slate-900/60 z-[60] backdrop-blur-sm"
            />
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed inset-x-0 bottom-0 z-[70] bg-white rounded-t-[2rem] flex flex-col max-h-[92vh]"
            >
               {/* Modal Header */}
               <div className="flex items-center justify-between p-6 border-b border-gray-100 shrink-0">
                  <div className="flex items-center gap-3">
                     <div className="w-10 h-10 rounded-full bg-teal-50 text-teal-600 flex items-center justify-center border border-teal-100">
                        <FileText className="w-5 h-5" />
                     </div>
                     <div>
                        <h2 className="text-lg font-bold text-slate-900">Adoption Questionnaire</h2>
                        <p className="text-xs text-slate-500 font-medium">Step 1 of 2</p>
                     </div>
                  </div>
                  <button 
                    onClick={() => setShowAdoptForm(false)}
                    className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 hover:bg-gray-200 transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
               </div>

               {/* Success Message */}
               {submitSuccess ? (
                  <div className="flex-1 flex flex-col items-center justify-center p-8 text-center space-y-6">
                      <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mb-2">
                         <Check className="w-10 h-10 stroke-[3]" />
                      </div>
                      <div>
                        <h3 className="text-2xl font-bold text-slate-900 mb-2">Questionnaire Sent!</h3>
                        <p className="text-slate-500 max-w-xs mx-auto">
                           Your answers have been submitted to <strong>SOS Gyvūnai Shelter</strong>. They will review your application and contact you soon.
                        </p>
                      </div>
                      <button 
                        onClick={() => {
                           setSubmitSuccess(false);
                           setShowAdoptForm(false);
                           // Removed onAdopt() call to prevent navigation to old form
                        }}
                        className="w-full py-4 bg-slate-900 text-white font-bold rounded-2xl hover:bg-slate-800 transition-colors mt-8"
                      >
                         Return to Profile
                      </button>
                  </div>
               ) : (
                  /* Dynamic Questionnaire Form */
                  <div className="flex-1 overflow-y-auto p-6 space-y-8">
                     
                     <div className="bg-blue-50 border border-blue-100 rounded-2xl p-4 flex gap-3">
                        <Info className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
                        <p className="text-sm text-blue-800 font-medium leading-relaxed">
                           Please answer these questions truthfully. This helps the shelter ensure a perfect match for both you and {pet.name}.
                        </p>
                     </div>

                     <div className="space-y-6">
                        {shelterQuestions.map((q) => (
                           <div key={q.id} className="space-y-3">
                              <label className="text-sm font-bold text-slate-800 block">
                                 {q.label}
                              </label>

                              {/* Text Input */}
                              {q.type === 'text' && (
                                 <input 
                                   type="text"
                                   placeholder={q.placeholder}
                                   className="w-full bg-gray-50 border-2 border-transparent focus:bg-white focus:border-teal-500 focus:outline-none rounded-xl px-4 py-3 text-slate-800 font-medium transition-all"
                                   onChange={(e) => handleAnswerChange(q.id, e.target.value)}
                                 />
                              )}

                              {/* Text Area */}
                              {q.type === 'textarea' && (
                                 <textarea 
                                   rows={3}
                                   placeholder={q.placeholder}
                                   className="w-full bg-gray-50 border-2 border-transparent focus:bg-white focus:border-teal-500 focus:outline-none rounded-xl px-4 py-3 text-slate-800 font-medium transition-all resize-none"
                                   onChange={(e) => handleAnswerChange(q.id, e.target.value)}
                                 />
                              )}

                              {/* Select/Dropdown */}
                              {q.type === 'select' && (
                                 <div className="relative">
                                    <select 
                                      className="w-full appearance-none bg-gray-50 border-2 border-transparent focus:bg-white focus:border-teal-500 focus:outline-none rounded-xl px-4 py-3 text-slate-800 font-medium transition-all"
                                      onChange={(e) => handleAnswerChange(q.id, e.target.value)}
                                      defaultValue=""
                                    >
                                       <option value="" disabled>Select an option</option>
                                       {q.options?.map(opt => (
                                          <option key={opt} value={opt}>{opt}</option>
                                       ))}
                                    </select>
                                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500">
                                       <ChevronRight className="w-4 h-4 rotate-90" />
                                    </div>
                                 </div>
                              )}

                              {/* Boolean (Yes/No) */}
                              {q.type === 'boolean' && (
                                 <div className="flex gap-3">
                                    <button 
                                      type="button"
                                      onClick={() => handleAnswerChange(q.id, true)}
                                      className={`flex-1 py-3 px-4 rounded-xl font-bold border-2 transition-all ${
                                         answers[q.id] === true 
                                            ? 'border-teal-500 bg-teal-50 text-teal-700' 
                                            : 'border-gray-100 bg-white text-slate-500 hover:border-gray-200'
                                      }`}
                                    >
                                       Yes
                                    </button>
                                    <button 
                                      type="button"
                                      onClick={() => handleAnswerChange(q.id, false)}
                                      className={`flex-1 py-3 px-4 rounded-xl font-bold border-2 transition-all ${
                                         answers[q.id] === false 
                                            ? 'border-teal-500 bg-teal-50 text-teal-700' 
                                            : 'border-gray-100 bg-white text-slate-500 hover:border-gray-200'
                                      }`}
                                    >
                                       No
                                    </button>
                                 </div>
                              )}
                           </div>
                        ))}
                     </div>
                     
                     {/* Space for bottom bar */}
                     <div className="h-20" />
                  </div>
               )}

               {/* Sticky Submit Button */}
               {!submitSuccess && (
                  <div className="p-5 border-t border-gray-100 bg-white">
                     <button 
                       onClick={handleAdoptSubmit}
                       className="w-full py-4 bg-slate-900 text-white font-bold text-lg rounded-2xl shadow-lg shadow-slate-200 hover:bg-slate-800 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
                     >
                        <span>Submit Questionnaire</span>
                        <ChevronRight className="w-5 h-5 opacity-50" />
                     </button>
                  </div>
               )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
