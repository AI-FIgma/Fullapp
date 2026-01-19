import { useState } from 'react';
import { Camera, User, ChevronRight, Loader2, ArrowLeft } from 'lucide-react';
import { motion } from 'motion/react';
import { toast } from 'sonner@2.0.3';

interface CreateForumProfileProps {
  onComplete: (data: { username: string; bio: string; avatar: string }) => void;
  onCancel: () => void;
  initialUsername?: string;
}

export function CreateForumProfile({ onComplete, onCancel, initialUsername = '' }: CreateForumProfileProps) {
  const [username, setUsername] = useState(initialUsername);
  const [bio, setBio] = useState('');
  const [avatar, setAvatar] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim()) {
      toast.error('Username is required');
      return;
    }

    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      onComplete({
        username,
        bio,
        avatar: avatar || 'https://api.dicebear.com/7.x/avataaars/svg?seed=' + username
      });
      toast.success('Forum profile created!');
    }, 1500);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatar(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#F8F9FA] flex flex-col">
      <div className="flex-1 px-6 pt-8 pb-6 flex flex-col max-w-lg mx-auto w-full">
        {/* Back Button */}
        <button 
          onClick={onCancel}
          className="self-start p-2 -ml-2 mb-4 rounded-full text-slate-500 hover:bg-slate-100 transition-colors"
          aria-label="Go back"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="mb-8 text-center">
            <h1 className="text-2xl font-bold text-slate-900 mb-2">Create Forum Profile</h1>
            <p className="text-slate-500">
              Set up your public profile to engage with the community, share posts, and comment.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Avatar Upload */}
            <div className="flex justify-center">
              <div className="relative group">
                <div className="w-28 h-28 rounded-full bg-white border-2 border-dashed border-gray-300 flex items-center justify-center overflow-hidden shadow-sm group-hover:border-teal-500 transition-colors">
                  {avatar ? (
                    <img src={avatar} alt="Avatar preview" className="w-full h-full object-cover" />
                  ) : (
                    <User className="w-10 h-10 text-gray-300" />
                  )}
                </div>
                <label className="absolute bottom-0 right-0 w-8 h-8 bg-teal-500 rounded-full flex items-center justify-center text-white shadow-md cursor-pointer hover:bg-teal-600 transition-colors">
                  <Camera className="w-4 h-4" />
                  <input type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
                </label>
              </div>
            </div>

            {/* Form Fields */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Username
                </label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-white border border-gray-200 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all font-medium text-slate-900 placeholder-gray-400"
                  placeholder="e.g. DogLover99"
                />
                <p className="text-xs text-gray-400 mt-2 ml-1">
                  This will be visible to other members.
                </p>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Bio <span className="text-gray-400 font-normal">(Optional)</span>
                </label>
                <textarea
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  rows={4}
                  className="w-full px-4 py-3 rounded-xl bg-white border border-gray-200 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all text-slate-900 placeholder-gray-400 resize-none"
                  placeholder="Tell us a bit about yourself and your pets..."
                />
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-4">
              <button
                type="submit"
                disabled={isSubmitting || !username.trim()}
                className="w-full py-4 bg-gradient-to-r from-teal-500 to-teal-600 text-white rounded-xl font-bold text-lg shadow-lg shadow-teal-500/30 hover:shadow-teal-500/40 active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <Loader2 className="w-6 h-6 animate-spin" />
                ) : (
                  <>
                    Join Community
                    <ChevronRight className="w-5 h-5" />
                  </>
                )}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
}