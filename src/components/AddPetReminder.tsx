import { useState } from 'react';
import { useForm } from 'react-hook-form@7.55.0';
import { ArrowLeft, Calendar, Clock, Bell, Check, Syringe, Pill, Scissors, Stethoscope, Star } from 'lucide-react';
import { motion } from 'motion/react';
import { toast } from 'sonner@2.0.3';
import { useTranslation } from '../utils/useTranslation';

interface AddPetReminderProps {
  onBack: () => void;
  petId: string;
}

type FormData = {
  title: string;
  type: 'vaccination' | 'medication' | 'grooming' | 'vet' | 'other';
  date: string;
  time: string;
  recurring: boolean;
  frequency: 'none' | 'daily' | 'weekly' | 'monthly' | 'yearly';
};

export function AddPetReminder({ onBack, petId }: AddPetReminderProps) {
  const { t } = useTranslation();
  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm<FormData>({
    defaultValues: {
      type: 'vet',
      recurring: false,
      frequency: 'none'
    }
  });

  const selectedType = watch('type');
  const isRecurring = watch('recurring');

  const onSubmit = (data: FormData) => {
    console.log(data);
    toast.success(t('pets.addReminderBtn') + ' ' + t('common.success'));
    onBack();
  };

  const types = [
    { id: 'vaccination', label: t('pets.types.vaccination'), icon: Syringe, color: 'text-rose-500 bg-rose-50' },
    { id: 'medication', label: t('pets.types.medication'), icon: Pill, color: 'text-blue-500 bg-blue-50' },
    { id: 'grooming', label: t('pets.types.grooming'), icon: Scissors, color: 'text-purple-500 bg-purple-50' },
    { id: 'vet', label: t('pets.types.vet'), icon: Stethoscope, color: 'text-teal-500 bg-teal-50' },
    { id: 'other', label: t('pets.types.other'), icon: Star, color: 'text-amber-500 bg-amber-50' },
  ];

  return (
    <div className="min-h-screen bg-white pb-20">
      {/* Header */}
      <div className="px-4 py-4 sticky top-0 bg-white z-10 flex items-center justify-between border-b border-gray-100">
        <button 
          onClick={onBack}
          className="p-2 -ml-2 hover:bg-gray-50 rounded-full transition-colors"
        >
          <ArrowLeft className="w-6 h-6 text-gray-700" />
        </button>
        <h1 className="text-lg font-bold text-gray-900">{t('pets.addReminder')}</h1>
        <div className="w-10" />
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="p-5 space-y-6">
        
        {/* Type Selection */}
        <div className="space-y-3">
          <label className="text-sm font-bold text-gray-900 uppercase tracking-wide">{t('pets.reminderType')}</label>
          <div className="grid grid-cols-3 gap-3">
            {types.map((type) => (
              <div
                key={type.id}
                onClick={() => setValue('type', type.id as any)}
                className={`flex flex-col items-center justify-center p-3 rounded-2xl border-2 cursor-pointer transition-all ${
                  selectedType === type.id 
                    ? 'border-teal-600 bg-teal-50' 
                    : 'border-gray-100 bg-white hover:border-gray-200'
                }`}
              >
                <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 ${type.color}`}>
                  <type.icon className="w-5 h-5" />
                </div>
                <span className={`font-semibold text-xs text-center ${selectedType === type.id ? 'text-teal-700' : 'text-gray-500'}`}>
                  {type.label}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Title */}
        <div className="space-y-1">
          <label className="text-sm font-bold text-gray-900 uppercase tracking-wide">{t('pets.reminderTitle')}</label>
          <input 
            {...register('title', { required: true })}
            className="w-full px-4 py-3 rounded-xl bg-gray-50 border-transparent focus:bg-white focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all outline-none font-medium"
            placeholder="e.g. Rabies Vaccine"
          />
          {errors.title && <span className="text-red-500 text-xs">{t('pets.nameRequired')}</span>}
        </div>

        {/* Date & Time */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-sm font-bold text-gray-900 uppercase tracking-wide">{t('pets.reminderDate')}</label>
            <div className="relative">
              <input 
                type="date"
                {...register('date', { required: true })}
                className="w-full px-4 py-3 rounded-xl bg-gray-50 border-transparent focus:bg-white focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all outline-none font-medium text-gray-600"
              />
            </div>
          </div>
          <div className="space-y-1">
            <label className="text-sm font-bold text-gray-900 uppercase tracking-wide">{t('pets.reminderTime')}</label>
            <div className="relative">
              <input 
                type="time"
                {...register('time', { required: true })}
                className="w-full px-4 py-3 rounded-xl bg-gray-50 border-transparent focus:bg-white focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all outline-none font-medium text-gray-600"
              />
            </div>
          </div>
        </div>

        {/* Recurring */}
        <div className="bg-gray-50 p-4 rounded-2xl flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <p className="font-bold text-gray-900 text-sm">{t('pets.repeat')}</p>
              <p className="text-xs text-gray-500">{isRecurring ? t(`pets.frequencies.${watch('frequency')}`) : t('pets.frequencies.none')}</p>
            </div>
          </div>
          <div className="flex items-center">
             <input 
               type="checkbox" 
               className="w-5 h-5 accent-teal-600"
               {...register('recurring')}
             />
          </div>
        </div>

        {isRecurring && (
           <motion.div 
             initial={{ opacity: 0, height: 0 }}
             animate={{ opacity: 1, height: 'auto' }}
             className="space-y-2"
           >
             <label className="text-sm font-bold text-gray-900 uppercase tracking-wide">{t('pets.recurring')}</label>
             <div className="flex flex-wrap gap-2">
               {['daily', 'weekly', 'monthly', 'yearly'].map((freq) => (
                 <button
                   key={freq}
                   type="button"
                   onClick={() => setValue('frequency', freq as any)}
                   className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                     watch('frequency') === freq 
                       ? 'bg-teal-600 text-white shadow-md' 
                       : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                   }`}
                 >
                   {t(`pets.frequencies.${freq}`)}
                 </button>
               ))}
             </div>
           </motion.div>
        )}

        {/* Submit Button */}
        <div className="pt-4">
          <motion.button 
            whileTap={{ scale: 0.98 }}
            type="submit"
            className="w-full bg-teal-600 text-white py-4 rounded-2xl font-bold text-lg shadow-lg shadow-teal-600/30 hover:bg-teal-700 transition-all flex items-center justify-center gap-2"
          >
            <Check className="w-5 h-5" />
            {t('pets.addReminderBtn')}
          </motion.button>
        </div>

      </form>
    </div>
  );
}