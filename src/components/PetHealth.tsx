import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Shield, Bug, Pill, Syringe, Scissors, Stethoscope, Calendar, Plus, Check, AlertTriangle, Clock } from 'lucide-react';
import { useTranslation } from '../utils/useTranslation';
import { Pet } from '../data/mockPets';
import { toast } from 'sonner@2.0.3';

interface PetHealthProps {
  pet: Pet;
  onAddReminder: () => void;
  onLogTreatment: (type?: 'fleaTick' | 'worming') => void;
}

export function PetHealth({ pet, onAddReminder, onLogTreatment }: PetHealthProps) {
  const { t } = useTranslation();
  
  const getDaysRemaining = (expiresAt: string) => {
    const today = new Date();
    const expiry = new Date(expiresAt);
    const diffTime = expiry.getTime() - today.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const getStatusColor = (days: number) => {
    if (days < 0) return 'text-red-500 bg-red-50 border-red-200';
    if (days < 7) return 'text-amber-500 bg-amber-50 border-amber-200';
    return 'text-green-500 bg-green-50 border-green-200';
  };

  const getStatusText = (days: number) => {
    if (days < 0) return t('health.overdue');
    if (days < 30) return t('health.expiresIn', { days: days.toString() });
    return t('health.protected');
  };

  const getProgress = (lastDate: string, expiresAt: string) => {
    const start = new Date(lastDate).getTime();
    const end = new Date(expiresAt).getTime();
    const now = new Date().getTime();
    
    if (now > end) return 100;
    if (now < start) return 0;
    
    const total = end - start;
    const current = now - start;
    return (current / total) * 100;
  };

  const getReminderIcon = (type: string) => {
    switch (type) {
      case 'vaccination': return <Syringe className="w-5 h-5" />;
      case 'medication': return <Pill className="w-5 h-5" />;
      case 'grooming': return <Scissors className="w-5 h-5" />;
      case 'vet': return <Stethoscope className="w-5 h-5" />;
      default: return <Calendar className="w-5 h-5" />;
    }
  };

  const ParasiteCard = ({ type, data }: { type: 'fleaTick' | 'worming', data: any }) => {
    const isFlea = type === 'fleaTick';
    const icon = isFlea ? <Bug className="w-6 h-6" /> : <Shield className="w-6 h-6" />;
    const title = isFlea ? t('health.fleaTick') : t('health.worming');
    
    if (!data) {
      return (
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between group cursor-pointer hover:border-teal-200 transition-all" onClick={() => onLogTreatment(type)}>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-gray-50 flex items-center justify-center text-gray-400 group-hover:bg-teal-50 group-hover:text-teal-600 transition-colors">
              {icon}
            </div>
            <div>
              <h4 className="font-bold text-gray-900">{title}</h4>
              <p className="text-xs text-gray-500">{t('health.logTreatment')}</p>
            </div>
          </div>
          <button className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 group-hover:bg-teal-500 group-hover:text-white transition-all">
            <Plus className="w-5 h-5" />
          </button>
        </div>
      );
    }

    const daysRemaining = getDaysRemaining(data.expiresAt);
    const progress = getProgress(data.lastDate, data.expiresAt);
    const statusColor = getStatusColor(daysRemaining);

    return (
      <div 
        className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 relative overflow-hidden cursor-pointer hover:shadow-md transition-shadow"
        onClick={() => onLogTreatment(type)}
      >
        <div className="flex justify-between items-start mb-3">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${isFlea ? 'bg-indigo-50 text-indigo-600' : 'bg-emerald-50 text-emerald-600'}`}>
              {icon}
            </div>
            <div>
              <h4 className="font-bold text-gray-900 leading-tight">{title}</h4>
              <p className="text-xs text-gray-500 font-medium">{data.product}</p>
            </div>
          </div>
          <span className={`text-[10px] font-bold px-2 py-1 rounded-lg border ${statusColor}`}>
            {getStatusText(daysRemaining)}
          </span>
        </div>

        {/* Progress Bar */}
        <div className="relative h-2 bg-gray-100 rounded-full overflow-hidden mb-2">
          <div 
            className={`absolute top-0 left-0 h-full rounded-full transition-all duration-500 ${daysRemaining < 0 ? 'bg-red-500' : daysRemaining < 7 ? 'bg-amber-500' : 'bg-teal-500'}`}
            style={{ width: `${Math.min(100, progress)}%` }}
          />
        </div>

        <div className="flex justify-between items-center text-[10px] font-medium text-gray-400 uppercase tracking-wide">
          <span>{t('health.lastGiven', { date: new Date(data.lastDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }) })}</span>
          <span>{t('health.nextDue', { date: new Date(data.expiresAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }) })}</span>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-8">
      {/* Parasite Control Section */}
      <div>
        <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
          <Shield className="w-5 h-5 text-teal-600" />
          {t('health.parasiteControl')}
        </h3>
        <div className="grid gap-4">
          <ParasiteCard type="fleaTick" data={pet.parasiteControl?.fleaTick} />
          <ParasiteCard type="worming" data={pet.parasiteControl?.worming} />
        </div>
      </div>

      {/* Upcoming Care */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-gray-900">{t('pets.upcomingCare')}</h3>
          <button 
            onClick={onAddReminder}
            className="text-teal-600 text-sm font-semibold hover:bg-teal-50 px-3 py-1.5 rounded-full transition-colors flex items-center gap-1"
          >
            <Plus className="w-4 h-4" />
            {t('pets.addReminder')}
          </button>
        </div>
        
        <div className="space-y-3">
          {pet.reminders?.map(reminder => {
            const isOverdue = new Date(reminder.date) < new Date();
            return (
              <motion.div 
                key={reminder.id}
                whileHover={{ scale: 1.01 }}
                className={`bg-white p-4 rounded-2xl shadow-sm border flex items-center gap-4 group transition-colors ${
                  isOverdue ? 'border-red-100 bg-red-50/30' : 'border-gray-100'
                }`}
              >
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-sm ${
                  reminder.type === 'vaccination' ? 'bg-rose-50 text-rose-500' :
                  reminder.type === 'grooming' ? 'bg-purple-50 text-purple-500' :
                  'bg-blue-50 text-blue-500'
                }`}>
                  {getReminderIcon(reminder.type)}
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                     <h4 className={`font-bold ${isOverdue ? 'text-red-700' : 'text-gray-900'}`}>{reminder.title}</h4>
                     <span className={`text-xs font-bold px-2 py-0.5 rounded-md flex items-center gap-1 ${
                       isOverdue ? 'bg-red-100 text-red-600' : 'bg-green-50 text-green-600'
                     }`}>
                       {isOverdue && <AlertTriangle className="w-3 h-3" />}
                       {new Date(reminder.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                     </span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                     {reminder.recurring && (
                       <span className="bg-gray-100 px-1.5 py-0.5 rounded text-gray-600 capitalize">{reminder.recurring}</span>
                     )}
                     <span>• {t('pets.notCompleted')}</span>
                  </p>
                </div>
                <button 
                  className="w-8 h-8 rounded-full border-2 border-gray-200 cursor-pointer hover:border-teal-500 hover:bg-teal-50 transition-all flex items-center justify-center text-teal-600 opacity-0 group-hover:opacity-100"
                  onClick={() => toast.success('Reminder completed!')}
                >
                  <Check className="w-4 h-4" />
                </button>
              </motion.div>
            );
          })}
          
          {(pet.reminders?.length || 0) === 0 && (
            <div className="text-center py-8 bg-white/50 rounded-3xl border-2 border-dashed border-gray-200">
              <Clock className="w-8 h-8 text-gray-300 mx-auto mb-2" />
              <p className="text-gray-400 font-medium text-sm">{t('pets.noActiveReminders')}</p>
            </div>
          )}
        </div>
      </div>

      {/* Medical History Timeline */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-gray-900">{t('pets.history')}</h3>
          <button className="text-gray-400 hover:text-gray-600">
            <Clock className="w-5 h-5" />
          </button>
        </div>
        
        <div className="relative pl-4 space-y-6">
          <div className="absolute top-0 bottom-0 left-[27px] w-0.5 bg-gray-200" />
          
          {pet.medicalHistory?.map(record => (
            <div key={record.id} className="relative pl-8">
              <div className="absolute left-[21px] top-4 w-3.5 h-3.5 rounded-full bg-white border-[3px] border-teal-500 z-10" />
              
              <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow group">
                <div className="flex justify-between items-center mb-2">
                   <span className="text-xs font-bold text-teal-600 bg-teal-50 px-2 py-1 rounded-md uppercase tracking-wide">
                     {new Date(record.date).toLocaleDateString()}
                   </span>
                   {record.vetName && <span className="text-xs font-medium text-gray-400 flex items-center gap-1">
                     <Stethoscope className="w-3 h-3" />
                     {record.vetName}
                   </span>}
                </div>
                <h4 className="font-bold text-gray-900 mb-1">{record.title}</h4>
                <p className="text-sm text-gray-600 leading-relaxed">{record.description}</p>
                {record.attachments && (
                  <div className="mt-3 pt-3 border-t border-gray-50 flex gap-2">
                    {record.attachments.map((_, i) => (
                      <div key={i} className="w-16 h-16 rounded-lg bg-gray-100 animate-pulse" />
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
