import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { FileText, Syringe, Shield, Plus, Download, Share2, MoreVertical, FileCheck, AlertCircle, Phone, Book, Siren } from 'lucide-react';
import { toast } from 'sonner@2.0.3';
import { useTranslation } from '../utils/useTranslation';
import { InsuranceClaimModal } from './documents/InsuranceClaimModal';

// Mock data types
export interface PetDocument {
  id: string;
  type: 'vaccine' | 'medical' | 'passport' | 'insurance' | 'other';
  title: string;
  date: string;
  expiryDate?: string;
  fileUrl: string;
  size: string;
  policyNumber?: string;
  insuranceContact?: string;
}

// Mock data
const mockDocuments: PetDocument[] = [
  {
    id: 'd0',
    type: 'insurance',
    title: 'Gyvūno Draudimas (If)',
    date: '2024-01-01',
    expiryDate: '2025-01-01',
    policyNumber: 'LT-IF-2024-8899',
    insuranceContact: '+370 5 222 3333',
    fileUrl: '#',
    size: '1.8 MB'
  },
  {
    id: 'd1',
    type: 'passport',
    title: 'ES Gyvūno Augintinio Pasas',
    date: '2020-05-20',
    fileUrl: '#',
    size: '2.4 MB'
  },
  {
    id: 'd2',
    type: 'vaccine',
    title: 'Pasiutligės Vakcinacija',
    date: '2023-06-15',
    expiryDate: '2026-06-15',
    fileUrl: '#',
    size: '1.1 MB'
  },
  {
    id: 'd3',
    type: 'medical',
    title: 'Kraujo Tyrimų Rezultatai',
    date: '2024-01-10',
    fileUrl: '#',
    size: '3.5 MB'
  },
  {
    id: 'd4',
    type: 'vaccine',
    title: 'Kompleksinė Vakcina',
    date: '2023-06-15',
    expiryDate: '2024-06-15',
    fileUrl: '#',
    size: '1.2 MB'
  }
];

interface PetDocumentsProps {
  petId: string;
}

export function PetDocuments({ petId }: PetDocumentsProps) {
  const { t } = useTranslation();
  const [filter, setFilter] = useState<'all' | 'vaccine' | 'medical' | 'passport' | 'insurance'>('all');
  const [documents, setDocuments] = useState<PetDocument[]>(mockDocuments);
  const [showClaimModal, setShowClaimModal] = useState(false);

  // Mock pet data for the claim modal (in a real app, you'd fetch this or pass it as props)
  const mockPet = {
    name: 'Bella',
    breed: 'Vokiečių aviganis',
    chipNumber: 'LT-9988776655',
    owners: [{ username: 'Jonas Petraitis' }]
  };
  
  const insuranceDoc = documents.find(d => d.type === 'insurance');

  const filteredDocs = documents.filter(doc => filter === 'all' || doc.type === filter);

  const getIcon = (type: string) => {
    switch (type) {
      case 'vaccine': return <Syringe className="w-5 h-5" />;
      case 'passport': return <Book className="w-5 h-5" />;
      case 'medical': return <FileCheck className="w-5 h-5" />;
      case 'insurance': return <Shield className="w-5 h-5" />;
      default: return <FileText className="w-5 h-5" />;
    }
  };

  const getColor = (type: string) => {
    switch (type) {
      case 'vaccine': return 'bg-rose-50 text-rose-500';
      case 'passport': return 'bg-blue-50 text-blue-500';
      case 'medical': return 'bg-teal-50 text-teal-500';
      case 'insurance': return 'bg-indigo-50 text-indigo-500';
      default: return 'bg-gray-50 text-gray-500';
    }
  };

  const isExpired = (date?: string) => {
    if (!date) return false;
    return new Date(date) < new Date();
  };

  const handleDownload = (doc: PetDocument) => {
    toast.success(`${t('documents.downloading')} ${doc.title}`);
  };

  const handleShare = (doc: PetDocument) => {
    toast.success(t('documents.shareSuccess'));
  };

  return (
    <div className="space-y-6">
      {/* Header & Filter */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-gray-900">{t('documents.title') || 'Dokumentai'}</h3>
          <motion.button 
            whileTap={{ scale: 0.95 }}
            onClick={() => toast.info(t('documents.uploadComingSoon'))}
            className="w-8 h-8 rounded-full bg-teal-50 text-teal-600 flex items-center justify-center hover:bg-teal-100 transition-colors"
          >
            <Plus className="w-5 h-5" />
          </motion.button>
        </div>

        <div className="flex gap-2 overflow-x-auto pb-2 -mx-6 px-6 scrollbar-hide">
          {['all', 'vaccine', 'medical', 'passport', 'insurance'].map((type) => (
            <button
              key={type}
              onClick={() => setFilter(type as any)}
              className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-colors ${
                filter === type 
                  ? 'bg-gray-900 text-white shadow-md' 
                  : 'bg-white text-gray-500 border border-gray-100'
              }`}
            >
              {t(`documents.filter.${type}`) || type.charAt(0).toUpperCase() + type.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Documents List */}
      <div className="space-y-3">
        <AnimatePresence mode="popLayout">
          {filteredDocs.map((doc) => (
            <motion.div
              key={doc.id}
              layout
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 relative group overflow-hidden"
            >
              <div className="flex items-start gap-4">
                {/* Icon Box */}
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 ${getColor(doc.type)}`}>
                  {getIcon(doc.type)}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start">
                    <h4 className="font-bold text-gray-900 truncate pr-2">{doc.title}</h4>
                    <button className="text-gray-300 hover:text-gray-500 transition-colors">
                      <MoreVertical className="w-5 h-5" />
                    </button>
                  </div>
                  
                  <div className="flex flex-col gap-1 mt-1">
                    <span className="text-xs font-medium text-gray-400">
                      {new Date(doc.date).toLocaleDateString()} • {doc.size}
                    </span>
                    
                    {doc.type === 'insurance' && (
                      <div className="mt-1 space-y-2">
                        {doc.policyNumber && (
                          <div className="text-xs font-mono font-medium text-indigo-600 bg-indigo-50 px-2 py-1 rounded w-fit">
                            Poliso nr: {doc.policyNumber}
                          </div>
                        )}
                        {doc.insuranceContact && (
                           <a href={`tel:${doc.insuranceContact}`} className="flex items-center gap-1.5 text-xs font-bold text-gray-600 hover:text-teal-600 w-fit">
                             <Phone className="w-3 h-3" />
                             {doc.insuranceContact}
                           </a>
                        )}
                        
                        <button 
                          onClick={() => setShowClaimModal(true)}
                          className="w-full mt-2 py-2 bg-rose-50 border border-rose-100 rounded-xl text-rose-600 text-xs font-bold flex items-center justify-center gap-2 hover:bg-rose-100 transition-colors"
                        >
                          <Siren className="w-4 h-4" />
                          Registruoti Žalą
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Expiry Badge */}
                  {doc.expiryDate && (
                    <div className={`mt-2 inline-flex items-center gap-1.5 px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wide border ${
                      isExpired(doc.expiryDate)
                        ? 'bg-red-50 text-red-600 border-red-100'
                        : 'bg-green-50 text-green-600 border-green-100'
                    }`}>
                      {isExpired(doc.expiryDate) ? (
                        <AlertCircle className="w-3 h-3" />
                      ) : (
                        <FileCheck className="w-3 h-3" />
                      )}
                      {isExpired(doc.expiryDate) ? t('documents.expired') : `${t('documents.expires')} ${new Date(doc.expiryDate).toLocaleDateString()}`}
                    </div>
                  )}
                </div>
              </div>

              {/* Actions Overlay (visible on hover/tap) */}
              <div className="absolute top-0 right-0 bottom-0 bg-gradient-to-l from-white via-white/80 to-transparent w-32 flex items-center justify-end px-4 opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="flex gap-2">
                   <motion.button 
                     whileTap={{ scale: 0.9 }}
                     onClick={() => handleDownload(doc)}
                     className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 hover:bg-teal-50 hover:text-teal-600 transition-colors"
                   >
                     <Download className="w-4 h-4" />
                   </motion.button>
                   <motion.button 
                     whileTap={{ scale: 0.9 }}
                     onClick={() => handleShare(doc)}
                     className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                   >
                     <Share2 className="w-4 h-4" />
                   </motion.button>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {filteredDocs.length === 0 && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <div className="w-16 h-16 rounded-full bg-gray-50 flex items-center justify-center mx-auto mb-4 text-gray-300">
              <FileText className="w-8 h-8" />
            </div>
            <p className="text-gray-400 font-medium">{t('documents.noDocuments')}</p>
            <button 
               onClick={() => setFilter('all')}
               className="mt-2 text-teal-600 text-sm font-bold hover:underline"
            >
              {t('documents.showAll')}
            </button>
          </motion.div>
        )}
      </div>
      {/* Claim Modal */}
      <AnimatePresence>
        {showClaimModal && (
          <InsuranceClaimModal
            isOpen={showClaimModal}
            onClose={() => setShowClaimModal(false)}
            pet={mockPet}
            documents={documents}
            policyNumber={insuranceDoc?.policyNumber || ''}
          />
        )}
      </AnimatePresence>
    </div>
  );
}