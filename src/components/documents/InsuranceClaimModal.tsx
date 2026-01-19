import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Shield, FileText, CheckCircle, ArrowRight, Mail, Copy, AlertCircle } from 'lucide-react';
import { toast } from 'sonner@2.0.3';

interface Document {
  id: string;
  name: string;
  type: string;
  date: string;
}

interface InsuranceClaimModalProps {
  isOpen: boolean;
  onClose: () => void;
  pet: any;
  documents: Document[];
  policyNumber: string; // Assuming we pass this or user enters it
}

export function InsuranceClaimModal({ isOpen, onClose, pet, documents, policyNumber }: InsuranceClaimModalProps) {
  const [step, setStep] = useState(1);
  const [incidentDate, setIncidentDate] = useState(new Date().toISOString().split('T')[0]);
  const [description, setDescription] = useState('');
  const [selectedDocs, setSelectedDocs] = useState<string[]>([]);
  const [selectedProvider, setSelectedProvider] = useState('generic');

  const providers = {
    'generic': { name: 'Kita / Bendra', email: '' },
    'if': { name: 'If Draudimas', email: 'zalos@if.lt' },
    'balcia': { name: 'Balcia Insurance', email: 'claims.lt@balcia.com' },
    'ergo': { name: 'Ergo', email: 'zalos@ergo.lt' }
  };

  const handleToggleDoc = (id: string) => {
    if (selectedDocs.includes(id)) {
      setSelectedDocs(selectedDocs.filter(d => d !== id));
    } else {
      setSelectedDocs([...selectedDocs, id]);
    }
  };

  // Generate the email body
  const generateEmailBody = () => {
    const docList = documents
      .filter(d => selectedDocs.includes(d.id))
      .map(d => `- ${d.name} (${d.type})`)
      .join('\n');

    return `Sveiki,

Norėčiau užregistruoti draudiminį įvykį.

DRAUDIMO INFORMACIJA:
Poliso numeris: ${policyNumber || '[ĮRAŠYTI POLISO NR]'}
Draudėjas: ${pet.owners[0]?.username || '[VARDAS PAVARDĖ]'}

AUGINTINIO DUOMENYS:
Vardas: ${pet.name}
Veislė: ${pet.breed}
Mikroschema: ${pet.chipNumber || '[NĖRA]'}

ĮVYKIO INFORMACIJA:
Data: ${incidentDate}
Aprašymas: ${description}

PRISEGAMI DOKUMENTAI (Sąskaitos/Išrašai):
${docList}

Laukiu informacijos dėl tolimesnių veiksmų.

Pagarbiai,
${pet.owners[0]?.username || ''}`;
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generateEmailBody());
    toast.success('Tekstas nukopijuotas! Galite klijuoti į el. laišką ar savitarną.');
  };

  const handleOpenMail = () => {
    const providerEmail = providers[selectedProvider as keyof typeof providers].email;
    const subject = `Žalos registravimas - Polisas ${policyNumber} - ${pet.name}`;
    const body = encodeURIComponent(generateEmailBody());
    window.open(`mailto:${providerEmail}?subject=${subject}&body=${body}`);
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
        initial={{ scale: 0.95, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.95, opacity: 0, y: 20 }}
        className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
      >
        {/* Header */}
        <div className="bg-slate-900 p-6 text-white flex justify-between items-start">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Shield className="w-5 h-5 text-teal-400" />
              <h2 className="text-xl font-bold">Žalos Vedlys</h2>
            </div>
            <p className="text-slate-400 text-xs">Paruoškite duomenis draudimui per 30 sek.</p>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto flex-1">
          {step === 1 && (
            <motion.div initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Kas ir kada nutiko?</label>
                <input 
                  type="date" 
                  value={incidentDate}
                  onChange={(e) => setIncidentDate(e.target.value)}
                  className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl mb-3"
                />
                <textarea 
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Trumpai aprašykite situaciją (pvz., šuo susipjovė koją, buvome klinikoje X...)"
                  className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl h-24 focus:ring-2 focus:ring-teal-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Draudimo bendrovė</label>
                <div className="grid grid-cols-2 gap-2">
                  {Object.entries(providers).map(([key, data]) => (
                    <button
                      key={key}
                      onClick={() => setSelectedProvider(key)}
                      className={`p-3 rounded-xl border text-left text-sm font-medium transition-all ${
                        selectedProvider === key 
                          ? 'border-teal-500 bg-teal-50 text-teal-700 ring-1 ring-teal-500' 
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      {data.name}
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {step === 2 && (
             <motion.div initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} className="space-y-4">
               <div className="flex items-center gap-3 bg-blue-50 p-3 rounded-xl text-blue-700 text-sm mb-4">
                 <AlertCircle className="w-5 h-5 flex-shrink-0" />
                 <p>Pažymėkite dokumentus, kuriuos norite prisegti (sąskaitas, išrašus).</p>
               </div>

               <div className="space-y-2 max-h-60 overflow-y-auto pr-2">
                 {documents.filter(d => d.type !== 'policy').map(doc => (
                   <div 
                    key={doc.id}
                    onClick={() => handleToggleDoc(doc.id)}
                    className={`p-3 rounded-xl border flex items-center gap-3 cursor-pointer transition-all ${
                      selectedDocs.includes(doc.id) 
                        ? 'border-teal-500 bg-teal-50' 
                        : 'border-gray-100 hover:bg-gray-50'
                    }`}
                   >
                     <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                       selectedDocs.includes(doc.id) ? 'bg-teal-500 border-teal-500' : 'border-gray-300'
                     }`}>
                       {selectedDocs.includes(doc.id) && <CheckCircle className="w-3.5 h-3.5 text-white" />}
                     </div>
                     <div className="flex-1">
                        <p className="font-bold text-gray-800 text-sm">{doc.name}</p>
                        <p className="text-xs text-gray-500">{doc.date} • {doc.type}</p>
                     </div>
                   </div>
                 ))}
                 {documents.filter(d => d.type !== 'policy').length === 0 && (
                   <p className="text-center text-gray-400 text-sm py-4">Papildomų dokumentų nerasta.</p>
                 )}
               </div>
             </motion.div>
          )}

          {step === 3 && (
            <motion.div initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} className="space-y-4">
              <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 font-mono text-xs text-gray-600 h-64 overflow-y-auto whitespace-pre-wrap">
                {generateEmailBody()}
              </div>
              <p className="text-xs text-center text-gray-400">
                Tai yra paruoštukas. Nepamirškite prisegti pasirinktų failų siųsdami laišką!
              </p>
            </motion.div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-gray-100 bg-gray-50 flex justify-between items-center">
          {step > 1 ? (
             <button 
               onClick={() => setStep(step - 1)}
               className="px-4 py-2 text-gray-500 font-bold text-sm hover:text-gray-800"
             >
               Atgal
             </button>
          ) : (
            <div /> 
          )}

          {step < 3 ? (
            <button 
              onClick={() => setStep(step + 1)}
              className="px-6 py-3 bg-slate-900 text-white rounded-xl font-bold text-sm flex items-center gap-2 hover:bg-slate-800 transition-colors shadow-lg shadow-slate-200"
            >
              Toliau <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <div className="flex gap-2">
               <button 
                onClick={handleCopy}
                className="px-4 py-3 bg-white border border-gray-200 text-gray-700 rounded-xl font-bold text-sm flex items-center gap-2 hover:bg-gray-50"
              >
                <Copy className="w-4 h-4" /> Kopijuoti
              </button>
              <button 
                onClick={handleOpenMail}
                className="px-6 py-3 bg-teal-600 text-white rounded-xl font-bold text-sm flex items-center gap-2 hover:bg-teal-700 shadow-lg shadow-teal-200"
              >
                <Mail className="w-4 h-4" /> Atidaryti Paštą
              </button>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}