import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form@7.55.0';
import { ArrowLeft, Camera, Upload, Check, Dog, Cat, Rabbit, Loader2, Trash2, AlertCircle } from 'lucide-react';
import { motion } from 'motion/react';
import { toast } from 'sonner@2.0.3';
import { useTranslation } from '../utils/useTranslation';
import { mockPets } from '../data/mockPets';
import { supabase } from '../utils/supabase/client';
import { projectId, publicAnonKey } from '../utils/supabase/info';
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "./ui/alert-dialog";

interface EditPetProps {
  onBack: () => void;
  petId: string;
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

export function EditPet({ onBack, petId }: EditPetProps) {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [petData, setPetData] = useState<any>(null);

  const { register, handleSubmit, setValue, watch, reset, formState: { errors } } = useForm<FormData>({
    defaultValues: {
      species: 'dog',
      gender: 'male'
    }
  });

  const selectedSpecies = watch('species');
  const selectedGender = watch('gender');

  // 1. Load Data from Server
  useEffect(() => {
    const fetchPet = async () => {
      // First check if it's a mock pet (legacy)
      const mockPet = mockPets.find(p => p.id === petId);
      if (mockPet) {
        setPetData(mockPet);
        reset({
          name: mockPet.name,
          species: (mockPet.species as any) || 'dog',
          breed: mockPet.breed,
          gender: (mockPet.gender as any) || 'male',
          birthDate: mockPet.birthDate,
          weight: mockPet.weight,
          chipNumber: mockPet.chipNumber || ''
        });
        setImagePreview(mockPet.image);
        setLoading(false);
        return;
      }

      // Fetch from Server
      try {
        const baseUrl = `https://${projectId}.supabase.co/functions/v1/make-server-3d55d0fe`;
        const response = await fetch(`${baseUrl}/pets/${petId}`, {
          headers: { 'Authorization': `Bearer ${publicAnonKey}` }
        });

        if (!response.ok) throw new Error('Failed to fetch pet data');

        const data = await response.json();
        setPetData(data);
        
        // Populate form
        reset({
          name: data.name,
          species: data.species || 'dog',
          breed: data.breed,
          gender: data.gender || 'male',
          birthDate: data.birth_date || data.birthDate,
          weight: data.weight,
          chipNumber: data.chipNumber || ''
        });
        
        setImagePreview(data.image_url || data.image);
      } catch (err) {
        console.error(err);
        setError('Could not load pet details');
      } finally {
        setLoading(false);
      }
    };

    fetchPet();
  }, [petId, reset]);

  // 2. Submit Updates
  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    try {
      let imageUrl = imagePreview;
      const baseUrl = `https://${projectId}.supabase.co/functions/v1/make-server-3d55d0fe`;

      // Upload new image if selected
      if (selectedFile) {
        const formData = new FormData();
        formData.append('file', selectedFile);

        const uploadRes = await fetch(`${baseUrl}/upload`, {
          method: 'POST',
          headers: { 'Authorization': `Bearer ${publicAnonKey}` },
          body: formData
        });
        
        if (!uploadRes.ok) throw new Error("Image upload failed");
        const uploadData = await uploadRes.json();
        imageUrl = uploadData.url;
      }

      // Merge existing data with updates
      // Note: We use the same POST /pets endpoint which acts as Upsert/Overwrite in our KV store implementation
      const updatedPet = {
        ...petData,
        ...data,
        id: petId, // Ensure ID is preserved
        image_url: imageUrl,
        image: imageUrl, // Maintain compatibility
        birth_date: data.birthDate // Maintain snake_case preference for DB
      };

      const saveRes = await fetch(`${baseUrl}/pets`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${publicAnonKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(updatedPet)
      });

      if (!saveRes.ok) throw new Error("Failed to update pet");

      toast.success(t('pets.saveChanges') + ' ' + t('common.success'));
      onBack();
      
    } catch (e: any) {
      console.error(e);
      toast.error(e.message || "Failed to save changes");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-teal-600 animate-spin" />
      </div>
    );
  }

  if (error || !petData) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-6 text-center">
        <AlertCircle className="w-12 h-12 text-slate-300 mb-4" />
        <p className="text-gray-500 mb-4">{error || t('pets.petNotFound')}</p>
        <button onClick={onBack} className="text-teal-600 font-bold">{t('common.back')}</button>
      </div>
    );
  }

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
        <h1 className="text-lg font-bold text-gray-900">{t('pets.editPet')}</h1>
        <div className="w-10" />
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
                className={`flex flex-col items-center justify-center p-4 rounded-2xl border-2 cursor-pointer transition-all ${
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
            <label className="text-sm font-bold text-gray-900 uppercase tracking-wide">{t('pets.breed')}</label>
            <input 
              {...register('breed', { required: true })}
              className="w-full px-4 py-3 rounded-xl bg-gray-50 border-transparent focus:bg-white focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all outline-none font-medium"
              placeholder="e.g. Golden Retriever"
            />
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
        <div className="pt-4 space-y-3">
          <motion.button 
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-teal-600 text-white py-4 rounded-2xl font-bold text-lg shadow-lg shadow-teal-600/30 hover:bg-teal-700 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <Check className="w-5 h-5" />}
            {t('pets.saveChanges')}
          </motion.button>

          {/* Delete Option (Visual Only for now as endpoint isn't explicit, but good UI practice) */}
           <AlertDialog>
            <AlertDialogTrigger asChild>
              <button type="button" className="w-full py-4 text-red-500 font-bold text-sm hover:bg-red-50 rounded-2xl transition-colors flex items-center justify-center gap-2">
                <Trash2 className="w-4 h-4" />
                Ištrinti profilį
              </button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Ar tikrai norite ištrinti?</AlertDialogTitle>
                <AlertDialogDescription>
                  Šio veiksmo negalima atšaukti. Visi duomenys apie {petData.name} bus pašalinti.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Atšaukti</AlertDialogCancel>
                <AlertDialogAction className="bg-red-500 hover:bg-red-600">Ištrinti</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>

      </form>
    </div>
  );
}