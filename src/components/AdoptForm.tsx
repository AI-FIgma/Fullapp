import { useState } from 'react';
import { useForm } from 'react-hook-form@7.55.0';
import { motion } from 'motion/react';
import { ChevronLeft, Loader2 } from 'lucide-react';
import { toast } from 'sonner@2.0.3';
import headerImage from 'figma:asset/5bafb27cf07013f7a163070fb2e94982178108c3.png';
import { supabase } from '../utils/supabase/client';
import { projectId, publicAnonKey } from '../utils/supabase/info';

interface AdoptFormProps {
  onBack: () => void;
  onSubmit: () => void;
  petName: string;
  petId: string;
}

type FormData = {
  phone: string;
  socialLink: string;
  contactInfo: string;
};

export function AdoptForm({ onBack, onSubmit, petName, petId }: AdoptFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { register, handleSubmit, reset, formState: { errors } } = useForm<FormData>();

  const onFormSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    try {
      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      
      const payload = {
        petId,
        petName,
        userId: user?.id || 'anonymous',
        ...data
      };

      const baseUrl = `https://${projectId}.supabase.co/functions/v1/make-server-3d55d0fe`;
      const response = await fetch(`${baseUrl}/adopt`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${publicAnonKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        throw new Error('Failed to submit application');
      }

      toast.success('Application submitted successfully!');
      onSubmit(); // Call parent handler to close/navigate
    } catch (error) {
      console.error('Adoption error:', error);
      toast.error('Failed to submit application. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 50 }}
      className="min-h-screen bg-[#F8F9FA] pb-10"
    >
      {/* Header */}
      <div className="sticky top-0 z-10 bg-[#F8F9FA]/90 backdrop-blur-sm px-4 py-4 flex items-center justify-between">
        <button onClick={onBack} className="p-2 -ml-2 rounded-full hover:bg-gray-100 transition-colors">
          <ChevronLeft className="w-6 h-6 text-slate-800" />
        </button>
        <h1 className="text-lg font-medium text-slate-800">Adopt form</h1>
        <div className="w-10" /> {/* Spacer */}
      </div>

      <form onSubmit={handleSubmit(onFormSubmit)} className="px-5 space-y-6">
        {/* Hero Image */}
        <div className="rounded-3xl overflow-hidden shadow-sm h-48">
          <img src={headerImage} alt="Happy dog" className="w-full h-full object-cover" />
        </div>

        {/* Intro Card */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="h-1.5 bg-[#64A6A6] w-full" />
          <div className="p-5">
            <h2 className="text-lg font-bold text-slate-800 mb-2">Foster Applicant Form</h2>
            <p className="text-sm text-gray-500 mb-4 leading-relaxed">
              If you are ready to welcome <span className="font-bold text-teal-600">{petName}</span> into your home please fill out the questionnaire in detail.
            </p>
            <p className="text-sm text-gray-500 mb-4 leading-relaxed">
              We will contact the selected candidates within a few days and invite them to meet in person.
            </p>
            <p className="text-xs text-red-400 mt-4">* indicates required questions</p>
          </div>
        </div>

        {/* Question 1 */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="h-1.5 bg-[#64A6A6] w-full" />
          <div className="p-5">
            <label className="block text-base font-medium text-slate-800 mb-4">
              1. Asmeninis telefono numeris <span className="text-red-400">*</span>
            </label>
            <input 
              {...register('phone', { required: true })}
              type="tel" 
              placeholder="+370..." 
              className="w-full border-b border-gray-200 py-2 text-sm focus:outline-none focus:border-[#64A6A6] transition-colors placeholder-gray-300"
            />
            {errors.phone && <span className="text-xs text-red-400 mt-1 block">This field is required</span>}
          </div>
        </div>

        {/* Question 2 */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="h-1.5 bg-[#64A6A6] w-full" />
          <div className="p-5">
            <label className="block text-base font-medium text-slate-800 mb-4">
              2. Nuoroda į socialinius tinklus ir el.paštas <span className="text-red-400">*</span>
            </label>
            <input 
              {...register('socialLink', { required: true })}
              type="text" 
              placeholder="Facebook/Instagram URL or Email" 
              className="w-full border-b border-gray-200 py-2 text-sm focus:outline-none focus:border-[#64A6A6] transition-colors placeholder-gray-300"
            />
            {errors.socialLink && <span className="text-xs text-red-400 mt-1 block">This field is required</span>}
          </div>
        </div>

        {/* Question 3 */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="h-1.5 bg-[#64A6A6] w-full" />
          <div className="p-5">
            <label className="block text-base font-medium text-slate-800 mb-4">
              3. Jūsų kontaktinė informacija (Vardas ir pavardė, gimimo metai, miestas) <span className="text-red-400">*</span>
            </label>
            <textarea 
              {...register('contactInfo', { required: true })}
              placeholder="Vardas Pavardė, 1990, Vilnius..." 
              rows={3}
              className="w-full border-b border-gray-200 py-2 text-sm focus:outline-none focus:border-[#64A6A6] transition-colors placeholder-gray-300 resize-none"
            />
            {errors.contactInfo && <span className="text-xs text-red-400 mt-1 block">This field is required</span>}
          </div>
        </div>

        {/* Buttons */}
        <div className="flex gap-4 pt-4 pb-8">
          <button 
            type="button"
            onClick={() => reset()}
            className="flex-1 py-3.5 rounded-xl border border-slate-300 text-slate-600 font-medium hover:bg-gray-50 transition-colors"
          >
            Clear Form
          </button>
          <button 
            type="submit"
            disabled={isSubmitting}
            className="flex-1 py-3.5 rounded-xl bg-[#64A6A6] text-white font-medium shadow-md hover:bg-[#528d8d] transition-colors flex items-center justify-center gap-2 disabled:opacity-70"
          >
            {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Submit'}
          </button>
        </div>
      </form>
    </motion.div>
  );
}