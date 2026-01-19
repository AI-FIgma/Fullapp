import { useState } from 'react';
import { Phone, Clock, AlertTriangle, CheckCircle, XCircle, Coffee, Moon, Sun, Utensils, Edit2, Save } from 'lucide-react';
import { motion } from 'motion/react';
import { toast } from 'sonner@2.0.3';
import { useTranslation } from '../utils/useTranslation';

interface PetSitterGuideProps {
  pet: any;
  isOwner: boolean;
}

export function PetSitterGuide({ pet, isOwner }: PetSitterGuideProps) {
  const { t } = useTranslation();
  const [isEditing, setIsEditing] = useState(false);
  
  // Local state for the "Guide" content (In a real app, this would be part of the pet object)
  const [guideData, setGuideData] = useState({
    morningRoutine: '7:00 pasivaikščiojimas (15 min), tada pusryčiai.',
    eveningRoutine: '19:00 ilgas pasivaikščiojimas, 21:00 vakarienė.',
    rules: [
      { id: 1, type: 'do', text: 'Galima duoti skanukų už komandas' },
      { id: 2, type: 'dont', text: 'Negalima leisti ant lovos' },
      { id: 3, type: 'alert', text: 'Bijo fejerverkų ir griaustinio' }
    ],
    accessCode: 'Laiptinės kodas: 159A'
  });

  const handleSave = () => {
    setIsEditing(false);
    toast.success('Gidas atnaujintas!');
    // Here you would save to backend
  };

  return (
    <div className="space-y-6 pb-10">
      {/* Header with Quick Actions */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            🐕 Priežiūros Gidas
          </h3>
          <p className="text-sm text-gray-500">Svarbiausia informacija auklei</p>
        </div>
        {isOwner && (
          <button
            onClick={() => isEditing ? handleSave() : setIsEditing(true)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all ${
              isEditing 
                ? 'bg-teal-600 text-white shadow-lg shadow-teal-600/20' 
                : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
            }`}
          >
            {isEditing ? <Save className="w-4 h-4" /> : <Edit2 className="w-4 h-4" />}
            {isEditing ? 'Išsaugoti' : 'Redaguoti'}
          </button>
        )}
      </div>

      {/* 1. Emergency Contacts Section */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-red-50 p-4 rounded-2xl border border-red-100 flex flex-col justify-between relative overflow-hidden">
          <div className="absolute top-0 right-0 p-3 opacity-10">
            <Phone className="w-12 h-12 text-red-500" />
          </div>
          <span className="text-xs font-bold text-red-400 uppercase tracking-wider">Veterinaras</span>
          <div>
            <p className="font-bold text-gray-900 text-lg leading-tight mt-1">Dr. Dolittle</p>
            <a href="tel:+37060000000" className="mt-2 inline-flex items-center gap-1.5 text-xs font-bold text-white bg-red-500 px-3 py-1.5 rounded-lg shadow-sm hover:bg-red-600 transition-colors">
              <Phone className="w-3 h-3" />
              Skambinti
            </a>
          </div>
        </div>

        <div className="bg-blue-50 p-4 rounded-2xl border border-blue-100 flex flex-col justify-between relative overflow-hidden">
          <div className="absolute top-0 right-0 p-3 opacity-10">
            <Phone className="w-12 h-12 text-blue-500" />
          </div>
          <span className="text-xs font-bold text-blue-400 uppercase tracking-wider">Savininkas</span>
          <div>
            <p className="font-bold text-gray-900 text-lg leading-tight mt-1">Jūs</p>
            <a href="#" className="mt-2 inline-flex items-center gap-1.5 text-xs font-bold text-white bg-blue-500 px-3 py-1.5 rounded-lg shadow-sm hover:bg-blue-600 transition-colors">
              <Phone className="w-3 h-3" />
              Skambinti
            </a>
          </div>
        </div>
      </div>

      {/* 2. Feeding Summary (Pulled from existing data + visual cues) */}
      <div className="bg-white p-5 rounded-3xl shadow-sm border border-gray-100">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center">
            <Utensils className="w-5 h-5" />
          </div>
          <h4 className="font-bold text-gray-900">Mityba</h4>
        </div>

        <div className="space-y-4">
           {pet.nutrition && pet.nutrition.length > 0 ? (
             pet.nutrition.filter((n: any) => n.type === 'food').map((food: any) => (
               <div key={food.id} className="flex items-center gap-4 bg-orange-50/50 p-3 rounded-2xl border border-orange-100">
                  <img src={food.image} alt={food.name} className="w-12 h-12 rounded-xl object-cover bg-white" />
                  <div>
                    <p className="font-bold text-gray-900 text-sm">{food.name}</p>
                    <p className="text-xs text-gray-500 mt-0.5 flex items-center gap-1">
                      <Clock className="w-3 h-3" /> {food.dailyAmount} per dieną
                    </p>
                  </div>
               </div>
             ))
           ) : (
             <p className="text-sm text-gray-400 italic">Mitybos informacija nenurodyta.</p>
           )}
           
           <div className="text-xs text-gray-500 bg-gray-50 p-3 rounded-xl border border-gray-100 italic">
              💡 Pastaba: Vanduo visada turi būti šviežias!
           </div>
        </div>
      </div>

      {/* 3. Routine & Schedule */}
      <div className="bg-white p-5 rounded-3xl shadow-sm border border-gray-100">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center">
            <Clock className="w-5 h-5" />
          </div>
          <h4 className="font-bold text-gray-900">Dienotvarkė</h4>
        </div>

        <div className="space-y-4 relative before:absolute before:left-[19px] before:top-2 before:bottom-2 before:w-0.5 before:bg-indigo-100">
          <div className="relative pl-10">
            <div className="absolute left-0 top-0 w-10 h-10 flex items-center justify-center">
               <div className="w-3 h-3 bg-yellow-400 rounded-full ring-4 ring-white shadow-sm" />
            </div>
            <div>
              <span className="text-xs font-bold text-gray-400 uppercase">Rytas</span>
              {isEditing ? (
                <textarea 
                  value={guideData.morningRoutine}
                  onChange={(e) => setGuideData({...guideData, morningRoutine: e.target.value})}
                  className="w-full mt-1 p-2 text-sm border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                  rows={2}
                />
              ) : (
                <p className="text-sm font-medium text-gray-700 mt-0.5">{guideData.morningRoutine}</p>
              )}
            </div>
          </div>

          <div className="relative pl-10">
            <div className="absolute left-0 top-0 w-10 h-10 flex items-center justify-center">
               <div className="w-3 h-3 bg-indigo-400 rounded-full ring-4 ring-white shadow-sm" />
            </div>
            <div>
              <span className="text-xs font-bold text-gray-400 uppercase">Vakaras</span>
              {isEditing ? (
                <textarea 
                  value={guideData.eveningRoutine}
                  onChange={(e) => setGuideData({...guideData, eveningRoutine: e.target.value})}
                  className="w-full mt-1 p-2 text-sm border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                  rows={2}
                />
              ) : (
                <p className="text-sm font-medium text-gray-700 mt-0.5">{guideData.eveningRoutine}</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* 4. Do's, Don'ts & Alerts */}
      <div className="space-y-3">
        <h4 className="font-bold text-gray-900 px-2">Svarbios taisyklės</h4>
        
        {guideData.rules.map((rule, index) => (
          <motion.div 
            key={rule.id}
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`p-4 rounded-2xl border flex items-start gap-3 ${
              rule.type === 'do' ? 'bg-green-50 border-green-100' :
              rule.type === 'dont' ? 'bg-red-50 border-red-100' :
              'bg-amber-50 border-amber-100'
            }`}
          >
            <div className={`mt-0.5 flex-shrink-0 ${
              rule.type === 'do' ? 'text-green-600' :
              rule.type === 'dont' ? 'text-red-500' :
              'text-amber-500'
            }`}>
              {rule.type === 'do' && <CheckCircle className="w-5 h-5" />}
              {rule.type === 'dont' && <XCircle className="w-5 h-5" />}
              {rule.type === 'alert' && <AlertTriangle className="w-5 h-5" />}
            </div>
            <p className={`text-sm font-medium leading-relaxed ${
              rule.type === 'do' ? 'text-green-800' :
              rule.type === 'dont' ? 'text-red-800' :
              'text-amber-800'
            }`}>
              {rule.text}
            </p>
          </motion.div>
        ))}

        {isEditing && (
            <button className="w-full py-3 border-2 border-dashed border-gray-200 rounded-2xl text-sm font-bold text-gray-400 hover:border-gray-300 hover:bg-gray-50 transition-colors">
                + Pridėti taisyklę
            </button>
        )}
      </div>

      {/* 5. Access Info (Private) */}
      <div className="bg-gray-900 text-gray-200 p-5 rounded-3xl relative overflow-hidden">
         <div className="relative z-10">
            <h4 className="font-bold text-white mb-2 flex items-center gap-2">
                <Shield className="w-4 h-4" />
                Privati Info
            </h4>
            {isEditing ? (
                <input 
                  type="text" 
                  value={guideData.accessCode}
                  onChange={(e) => setGuideData({...guideData, accessCode: e.target.value})}
                  className="w-full bg-gray-800 border border-gray-700 text-white rounded-lg px-3 py-2 text-sm"
                />
            ) : (
                <p className="font-mono text-lg text-emerald-400">{guideData.accessCode}</p>
            )}
            <p className="text-[10px] text-gray-500 mt-2">
                Šią informaciją mato tik patvirtinti prižiūrėtojai (Sitters).
            </p>
         </div>
         
         {/* Decoration */}
         <div className="absolute right-0 bottom-0 opacity-10">
             <Shield className="w-24 h-24" />
         </div>
      </div>
    </div>
  );
}

// Icon helper for the lock decoration
function Shield({ className }: { className?: string }) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
        </svg>
    )
}