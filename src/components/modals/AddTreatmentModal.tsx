import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Calendar, Clock, Shield, Bug, Check, Loader2 } from 'lucide-react';
import { useTranslation } from '../../utils/useTranslation';
import { projectId, publicAnonKey } from '../../utils/supabase/info';
import { NotificationHelpers } from '../../utils/notificationGenerator';

interface AddTreatmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  defaultType?: 'fleaTick' | 'worming';
  petId: string;
}

export function AddTreatmentModal({ isOpen, onClose, onSuccess, defaultType = 'fleaTick', petId }: AddTreatmentModalProps) {
  const { t } = useTranslation();
  const [type, setType] = useState<'fleaTick' | 'worming'>(defaultType);
  const [product, setProduct] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [duration, setDuration] = useState<number>(4); // weeks
  const [durationUnit, setDurationUnit] = useState<'weeks' | 'months'>('weeks');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    setIsSubmitting(true);
    
    // Calculate total weeks for consistency
    const totalWeeks = durationUnit === 'months' ? duration * 4.345 : duration;
    
    try {
      const baseUrl = `https://${projectId}.supabase.co/functions/v1/make-server-3d55d0fe`;
      const response = await fetch(`${baseUrl}/treatments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${publicAnonKey}`
        },
        body: JSON.stringify({
          petId,
          type,
          product,
          date,
          duration: totalWeeks,
          createdAt: new Date().toISOString()
        })
      });

      if (!response.ok) {
        throw new Error('Failed to save treatment');
      }

      onSuccess();
      
      // Trigger notification
      NotificationHelpers.onTreatmentAdded(petId, type, product);
      
      onClose();
      
      // Reset form
      setProduct('');
      setDuration(4);
    } catch (error) {
      console.error('Error saving treatment:', error);
      alert('Failed to save treatment. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed inset-x-4 top-[10%] md:inset-auto md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 max-w-md w-full bg-white rounded-3xl shadow-2xl z-50 overflow-hidden"
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">{t('health.logTreatment')}</h2>
                <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Type Selection */}
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setType('fleaTick')}
                    className={`p-4 rounded-2xl border-2 flex flex-col items-center gap-2 transition-all ${
                      type === 'fleaTick'
                        ? 'border-teal-500 bg-teal-50 text-teal-700'
                        : 'border-gray-100 bg-white text-gray-500 hover:border-gray-200'
                    }`}
                  >
                    <Bug className="w-6 h-6" />
                    <span className="text-sm font-bold">{t('health.fleaTick')}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setType('worming')}
                    className={`p-4 rounded-2xl border-2 flex flex-col items-center gap-2 transition-all ${
                      type === 'worming'
                        ? 'border-teal-500 bg-teal-50 text-teal-700'
                        : 'border-gray-100 bg-white text-gray-500 hover:border-gray-200'
                    }`}
                  >
                    <Shield className="w-6 h-6" />
                    <span className="text-sm font-bold">{t('health.worming')}</span>
                  </button>
                </div>

                {/* Product Name */}
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700 ml-1">{t('health.productName')}</label>
                  <input
                    type="text"
                    required
                    value={product}
                    onChange={(e) => setProduct(e.target.value)}
                    placeholder="e.g. Simparica Trio, NexGard..."
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-teal-500 focus:ring-2 focus:ring-teal-200 transition-all outline-none"
                  />
                </div>

                {/* Date */}
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700 ml-1">{t('health.dateAdministered')}</label>
                  <div className="relative">
                    <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="date"
                      required
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:border-teal-500 focus:ring-2 focus:ring-teal-200 transition-all outline-none"
                    />
                  </div>
                </div>

                {/* Duration */}
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700 ml-1">{t('health.protectionDuration')}</label>
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <Clock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="number"
                        min="1"
                        required
                        value={duration}
                        onChange={(e) => setDuration(parseInt(e.target.value) || 0)}
                        className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:border-teal-500 focus:ring-2 focus:ring-teal-200 transition-all outline-none"
                      />
                    </div>
                    <select
                      value={durationUnit}
                      onChange={(e) => setDurationUnit(e.target.value as 'weeks' | 'months')}
                      className="px-4 py-3 rounded-xl border border-gray-200 bg-white focus:border-teal-500 focus:ring-2 focus:ring-teal-200 transition-all outline-none font-medium"
                    >
                      <option value="weeks">{t('health.weeks')}</option>
                      <option value="months">{t('health.months')}</option>
                    </select>
                  </div>
                  
                  {/* Quick selections */}
                  <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                    {[
                      { l: '4 Weeks', v: 4, u: 'weeks' },
                      { l: '3 Months', v: 3, u: 'months' },
                      { l: '6 Months', v: 6, u: 'months' },
                      { l: '8 Months', v: 8, u: 'months' } // Seresto collar usually
                    ].map((opt) => (
                      <button
                        key={opt.l}
                        type="button"
                        onClick={() => {
                          setDuration(opt.v);
                          setDurationUnit(opt.u as any);
                        }}
                        className="px-3 py-1.5 rounded-lg bg-gray-50 text-xs font-bold text-gray-600 hover:bg-teal-50 hover:text-teal-600 border border-gray-100 transition-colors whitespace-nowrap"
                      >
                        {opt.l}
                      </button>
                    ))}
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-4 bg-teal-600 text-white rounded-2xl font-bold text-lg hover:bg-teal-700 active:scale-[0.98] transition-all flex items-center justify-center gap-2 shadow-lg shadow-teal-500/30 disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <Check className="w-5 h-5" />}
                  {isSubmitting ? 'Saving...' : t('health.saveTreatment')}
                </button>
              </form>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
