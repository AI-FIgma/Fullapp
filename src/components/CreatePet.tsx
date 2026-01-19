import { useState } from 'react';
import { useForm } from 'react-hook-form@7.55.0';
import { ArrowLeft, Camera, Upload, Check, Dog, Cat, Rabbit, Sparkles, Loader2, Wand2 } from 'lucide-react';
import { motion } from 'motion/react';
import { toast } from 'sonner@2.0.3';
import { useTranslation } from '../utils/useTranslation';
import { supabase } from '../utils/supabase/client';
import { projectId, publicAnonKey } from '../utils/supabase/info';

interface CreatePetProps {
  onBack: () => void;
  onNavigate: (view: string) => void;
}

type FormData = {
  name: string;
  species: 'dog' | 'cat' | 'other';
  breed: string;
  gender: 'male' | 'female';
  birthDate: string;
  weight: number;
  chipNumber: string;
};

export function CreatePet({ onBack, onNavigate }: CreatePetProps) {
  const { t } = useTranslation();
  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm<FormData>({
    defaultValues: {
      species: 'dog',
      gender: 'male'
    }
  });
  
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const selectedSpecies = watch('species');
  const selectedGender = watch('gender');

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error("You must be logged in to create a pet");
        return;
      }

      let imageUrl = null;
      const baseUrl = `https://${projectId}.supabase.co/functions/v1/make-server-3d55d0fe`;

      // 1. Upload Image if selected
      if (selectedFile) {
        const formData = new FormData();
        formData.append('file', selectedFile);

        const uploadRes = await fetch(`${baseUrl}/upload`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${publicAnonKey}`
            // Content-Type is auto-set with FormData
          },
          body: formData
        });
        
        if (!uploadRes.ok) {
           const err = await uploadRes.json();
           throw new Error(err.error || "Image upload failed");
        }
        const uploadData = await uploadRes.json();
        imageUrl = uploadData.url;
      }

      // 2. Create Pet
      const petData = {
        ...data,
        owner_id: user.id,
        image_url: imageUrl,
        status: 'owned', // Default
        created_at: new Date().toISOString()
      };

      const saveRes = await fetch(`${baseUrl}/pets`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${publicAnonKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(petData)
      });

      if (!saveRes.ok) throw new Error("Failed to save pet");

      toast.success(t('pets.petAdded'));
      onBack();
      
    } catch (e: any) {
      console.error(e);
      toast.error(e.message || "Something went wrong");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAIAnalysis = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setSelectedFile(file); // Store file
    setIsAnalyzing(true);
    // Simulate uploading
    const reader = new FileReader();
    reader.onload = (event) => {
       // If no main image is set, use this one
       if (!imagePreview && event.target?.result) {
           setImagePreview(event.target.result as string);
       }
    };
    reader.readAsDataURL(file);

    toast.info("AI is analyzing the photo...", {
        duration: 2000,
        icon: <Wand2 className="w-4 h-4 animate-pulse text-purple-500" />
    });

    // Simulate API delay
    setTimeout(() => {
        setIsAnalyzing(false);
        const mockBreeds = {
            dog: ['Golden Retriever', 'Labrador', 'German Shepherd', 'Poodle', 'French Bulldog', 'Husky'],
            cat: ['Siamese', 'Persian', 'Maine Coon', 'Bengal', 'British Shorthair'],
            other: ['Rabbit', 'Hamster', 'Parrot', 'Guinea Pig']
        };
        
        // Pick a random breed for the demo
        const list = mockBreeds[selectedSpecies] || mockBreeds.dog;
        const randomBreed = list[Math.floor(Math.random() * list.length)];
        
        setValue('breed', randomBreed);
        toast.success(`AI identified: ${randomBreed} (98% confidence)`, {
            icon: <Sparkles className="w-4 h-4 text-teal-500" />
        });
    }, 2500);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file); // Store file
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

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
        <h1 className="text-lg font-bold text-gray-900">{t('pets.addNewPet')}</h1>
        <div className="w-10" /> {/* Spacer */}
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="p-5 space-y-8">
        
        {/* Image Upload */}
        <div className="flex flex-col items-center">
          <div className="relative group cursor-pointer">
            <div className={`w-32 h-32 rounded-full overflow-hidden border-4 border-gray-100 shadow-sm flex items-center justify-center bg-gray-50 ${!imagePreview ? 'border-dashed border-gray-300' : ''}`}>
              {imagePreview ? (
                <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
              ) : (
                <Camera className="w-10 h-10 text-gray-400" />
              )}
              <input 
                type="file" 
                accept="image/*"
                className="absolute inset-0 opacity-0 cursor-pointer"
                onChange={handleImageUpload}
              />
            </div>
            <div className="absolute bottom-0 right-0 bg-teal-600 text-white p-2 rounded-full shadow-md border-2 border-white">
              <Upload className="w-4 h-4" />
            </div>
          </div>
          <p className="mt-3 text-sm font-medium text-teal-600">{t('pets.uploadPhoto')}</p>
        </div>

        {/* Species Selection */}
        <div className="space-y-3">
          <label className="text-sm font-bold text-gray-900 uppercase tracking-wide">{t('pets.species')}</label>
          <div className="grid grid-cols-3 gap-3">
            {[
              { id: 'dog', label: t('pets.dog'), icon: Dog },
              { id: 'cat', label: t('pets.cat'), icon: Cat },
              { id: 'other', label: t('pets.other'), icon: Rabbit },
            ].map((type) => (
              <div
                key={type.id}
                onClick={() => setValue('species', type.id as any)}
                className={`flex-1 py-3 rounded-xl border-2 cursor-pointer transition-all flex flex-col items-center justify-center ${
                  selectedSpecies === type.id 
                    ? 'border-teal-600 bg-teal-50 text-teal-700' 
                    : 'border-gray-100 bg-white text-gray-500 hover:border-gray-200'
                }`}
              >
                <type.icon className={`w-8 h-8 mb-2 ${selectedSpecies === type.id ? 'text-teal-600' : 'text-gray-400'}`} />
                <span className="font-semibold text-sm">{type.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Basic Info */}
        <div className="space-y-4">
          <div className="space-y-1">
            <label className="text-sm font-bold text-gray-900 uppercase tracking-wide">{t('pets.name')}</label>
            <input 
              {...register('name', { required: true })}
              className="w-full px-4 py-3 rounded-xl bg-gray-50 border-transparent focus:bg-white focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all outline-none font-medium"
              placeholder={t('pets.name')}
            />
            {errors.name && <span className="text-red-500 text-xs">{t('pets.nameRequired')}</span>}
          </div>

          <div className="space-y-1">
            <div className="flex justify-between items-end">
                <label className="text-sm font-bold text-gray-900 uppercase tracking-wide">{t('pets.breed')}</label>
                <button
                    type="button"
                    onClick={() => document.getElementById('breed-scan-input')?.click()}
                    disabled={isAnalyzing}
                    className="text-[10px] font-bold text-purple-600 bg-purple-50 px-2 py-1 rounded-full flex items-center gap-1.5 hover:bg-purple-100 transition-colors border border-purple-100"
                >
                    {isAnalyzing ? (
                        <Loader2 className="w-3 h-3 animate-spin" />
                    ) : (
                        <Wand2 className="w-3 h-3" />
                    )}
                    {isAnalyzing ? 'ANALYZING...' : 'AI SCAN'}
                </button>
            </div>
            <div className="relative">
                <input 
                  {...register('breed', { required: true })}
                  className="w-full px-4 py-3 rounded-xl bg-gray-50 border-transparent focus:bg-white focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all outline-none font-medium pr-12"
                  placeholder="e.g. Golden Retriever"
                />
                <button
                    type="button"
                    onClick={() => document.getElementById('breed-scan-input')?.click()}
                    className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center text-gray-400 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-all"
                    title="Scan from photo"
                >
                    <Camera className="w-5 h-5" />
                </button>
                <input 
                    id="breed-scan-input"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleAIAnalysis}
                />
            </div>
            {errors.breed && <span className="text-red-500 text-xs">{t('pets.breedRequired')}</span>}
          </div>
        </div>

        {/* Gender & Details */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-900 uppercase tracking-wide">{t('pets.gender')}</label>
            <div className="flex bg-gray-50 p-1 rounded-xl">
              <button
                type="button"
                onClick={() => setValue('gender', 'male')}
                className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-all ${
                  selectedGender === 'male' ? 'bg-white text-teal-700 shadow-sm' : 'text-gray-400'
                }`}
              >
                {t('pets.male')}
              </button>
              <button
                type="button"
                onClick={() => setValue('gender', 'female')}
                className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-all ${
                  selectedGender === 'female' ? 'bg-white text-teal-700 shadow-sm' : 'text-gray-400'
                }`}
              >
                {t('pets.female')}
              </button>
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-sm font-bold text-gray-900 uppercase tracking-wide">{t('pets.birthDate')}</label>
            <input 
              type="date"
              {...register('birthDate', { required: true })}
              className="w-full px-4 py-3 rounded-xl bg-gray-50 border-transparent focus:bg-white focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all outline-none font-medium text-gray-600"
            />
          </div>

           <div className="space-y-1">
            <label className="text-sm font-bold text-gray-900 uppercase tracking-wide">{t('pets.weight')} (kg)</label>
            <input 
              type="number"
              step="0.1"
              {...register('weight')}
              className="w-full px-4 py-3 rounded-xl bg-gray-50 border-transparent focus:bg-white focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all outline-none font-medium"
              placeholder="0.0"
            />
          </div>

          <div className="space-y-1">
            <label className="text-sm font-bold text-gray-900 uppercase tracking-wide">{t('pets.chipNumber')}</label>
            <input 
              {...register('chipNumber')}
              className="w-full px-4 py-3 rounded-xl bg-gray-50 border-transparent focus:bg-white focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all outline-none font-medium"
              placeholder={t('pets.optional')}
            />
          </div>
        </div>

        {/* Submit Button */}
        <div className="pt-4">
          <motion.button 
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-teal-600 text-white py-4 rounded-2xl font-bold text-lg shadow-lg shadow-teal-600/30 hover:bg-teal-700 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <Check className="w-5 h-5" />}
            {t('pets.savePet')}
          </motion.button>
        </div>

      </form>
    </div>
  );
}