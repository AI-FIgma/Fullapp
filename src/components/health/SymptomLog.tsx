import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Calendar, Clock, Plus, X, ChevronDown, ChevronUp, FileText, Activity } from 'lucide-react';
import { format } from 'date-fns';
import { lt } from 'date-fns/locale';

interface Symptom {
  id: string;
  type: 'stomach' | 'injury' | 'skin' | 'general' | 'meds';
  icon: string;
  label: string;
  date: Date;
  note: string;
  severity: 'mild' | 'moderate' | 'severe';
}

const SYMPTOM_TYPES = [
  { type: 'stomach', icon: '🤮', label: 'Vėmimas/Vidur.' },
  { type: 'injury', icon: '🤕', label: 'Trauma/Skausmas' },
  { type: 'skin', icon: '🦟', label: 'Oda/Niežulys' },
  { type: 'general', icon: '🤒', label: 'Bendras silpnumas' },
  { type: 'meds', icon: '💊', label: 'Vaistai' },
];

export function SymptomLog() {
  const [isAdding, setIsAdding] = useState(false);
  const [selectedType, setSelectedType] = useState<typeof SYMPTOM_TYPES[0] | null>(null);
  const [note, setNote] = useState('');
  
  // Mock Data
  const [logs, setLogs] = useState<Symptom[]>([
    {
      id: '1',
      type: 'stomach',
      icon: '🤮',
      label: 'Vėmimas',
      date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2), // 2 days ago
      note: 'Po pasivaikščiojimo miške. Galimai kažką suėdė.',
      severity: 'moderate'
    },
    {
      id: '2',
      type: 'skin',
      icon: '🦟',
      label: 'Niežulys',
      date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5), // 5 days ago
      note: 'Kasosi dešinę ausį.',
      severity: 'mild'
    }
  ]);

  const handleAdd = () => {
    if (!selectedType) return;
    
    const newLog: Symptom = {
      id: Date.now().toString(),
      type: selectedType.type as any,
      icon: selectedType.icon,
      label: selectedType.label,
      date: new Date(),
      note: note,
      severity: 'mild' // Default
    };

    setLogs([newLog, ...logs]);
    
    // Reset
    setIsAdding(false);
    setSelectedType(null);
    setNote('');
  };

  return (
    <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden mb-4">
      {/* Header */}
      <div className="p-5 border-b border-gray-100 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center">
            <Activity className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-gray-900">Sveikatos Žurnalas</h3>
            <p className="text-xs text-gray-500">Simptomų istorija veterinarui</p>
          </div>
        </div>
        
        <button 
          onClick={() => setIsAdding(!isAdding)}
          className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${
            isAdding ? 'bg-gray-100 text-gray-500' : 'bg-rose-500 text-white shadow-lg shadow-rose-200'
          }`}
        >
          {isAdding ? <X className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
        </button>
      </div>

      {/* Add New Section */}
      <AnimatePresence>
        {isAdding && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="border-b border-gray-100 bg-gray-50/50"
          >
            <div className="p-5">
              <p className="text-sm font-bold text-gray-700 mb-3">Kas nutiko?</p>
              
              {/* Type Grid */}
              <div className="grid grid-cols-5 gap-2 mb-4">
                {SYMPTOM_TYPES.map((t) => (
                  <button
                    key={t.type}
                    onClick={() => setSelectedType(t)}
                    className={`flex flex-col items-center gap-1 p-2 rounded-xl border transition-all ${
                      selectedType?.type === t.type 
                        ? 'bg-rose-50 border-rose-200 shadow-sm scale-105' 
                        : 'bg-white border-gray-200 hover:border-gray-300 opacity-70 hover:opacity-100'
                    }`}
                  >
                    <span className="text-2xl">{t.icon}</span>
                  </button>
                ))}
              </div>

              {selectedType && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-3"
                >
                  <textarea
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    placeholder={`Aprašykite detaliau... (pvz. ${selectedType.type === 'stomach' ? 'Kada prasidėjo? Kiek kartų?' : 'Kur skauda?'})`}
                    className="w-full p-3 text-sm border border-gray-200 rounded-xl focus:ring-2 focus:ring-rose-500 focus:border-transparent outline-none bg-white"
                    rows={2}
                  />
                  
                  <button 
                    onClick={handleAdd}
                    className="w-full py-3 bg-rose-500 text-white rounded-xl font-bold text-sm shadow-lg shadow-rose-200 active:scale-95 transition-all"
                  >
                    Išsaugoti Įrašą
                  </button>
                </motion.div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Timeline List */}
      <div className="p-5 max-h-[300px] overflow-y-auto">
        {logs.length === 0 ? (
          <div className="text-center py-8 text-gray-400">
            <p>Įrašų kol kas nėra.</p>
          </div>
        ) : (
          <div className="space-y-6 relative before:absolute before:left-[19px] before:top-2 before:bottom-0 before:w-0.5 before:bg-gray-100">
            {logs.map((log) => (
              <div key={log.id} className="relative pl-10">
                {/* Timeline Dot */}
                <div className="absolute left-0 top-0 w-10 h-10 flex items-center justify-center bg-white">
                   <div className="w-8 h-8 rounded-full bg-gray-50 border border-gray-100 flex items-center justify-center text-lg shadow-sm z-10">
                     {log.icon}
                   </div>
                </div>

                {/* Content */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-gray-900 text-sm">{log.label}</span>
                    <span className="text-[10px] text-gray-400 font-medium">
                      {format(log.date, 'MMM d, HH:mm', { locale: lt })}
                    </span>
                  </div>
                  {log.note && (
                    <div className="bg-gray-50 p-3 rounded-xl rounded-tl-none border border-gray-100 text-sm text-gray-600">
                      {log.note}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}