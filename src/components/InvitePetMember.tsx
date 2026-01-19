import { useState } from 'react';
import { useForm } from 'react-hook-form@7.55.0';
import { ArrowLeft, Mail, Copy, Send, Check } from 'lucide-react';
import { motion } from 'motion/react';
import { toast } from 'sonner@2.0.3';
import { useTranslation } from '../utils/useTranslation';
import { copyToClipboard } from '../utils/clipboard';

interface InvitePetMemberProps {
  onBack: () => void;
  petId: string;
}

export function InvitePetMember({ onBack, petId }: InvitePetMemberProps) {
  const { t } = useTranslation();
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<'user' | 'sitter'>('user');

  const handleCopyLink = async () => {
    const success = await copyToClipboard(`https://app.example.com/pet/${petId}/invite?role=${role}`);
    if (success) {
      toast.success(t('pets.inviteSent'));
    } else {
      toast.error(t('errors.generic'));
    }
  };

  const handleSendInvite = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    
    // API call mock
    console.log('Inviting:', email);
    toast.success(t('pets.invitationSent'));
    onBack();
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
        <h1 className="text-lg font-bold text-gray-900">{t('pets.inviteMember')}</h1>
        <div className="w-10" />
      </div>

      <div className="p-6 space-y-8">
        
        {/* Illustration/Icon */}
        <div className="flex flex-col items-center text-center space-y-4 py-6">
          <div className="w-24 h-24 bg-teal-50 rounded-full flex items-center justify-center relative">
            <Mail className="w-10 h-10 text-teal-600" />
            <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-md border border-gray-100">
               <span className="text-lg">👋</span>
            </div>
          </div>
          <div className="space-y-2">
            <h2 className="text-xl font-bold text-gray-900">{t('pets.familyAndCaretakers')}</h2>
            <p className="text-gray-500 text-sm max-w-xs mx-auto">
              Share access to this pet profile so everyone can contribute to health logs and reminders.
            </p>
          </div>
        </div>

        {/* Copy Link Section */}
        <div className="space-y-3">
           <label className="text-sm font-bold text-gray-900 uppercase tracking-wide">{t('pets.shareLink')}</label>
           <div 
             onClick={handleCopyLink}
             className="bg-gray-50 p-4 rounded-xl flex items-center justify-between cursor-pointer hover:bg-gray-100 transition-colors border border-gray-100 active:scale-[0.99]"
           >
             <div className="flex items-center gap-3 overflow-hidden">
               <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm text-teal-600">
                 <Copy className="w-5 h-5" />
               </div>
               <div className="flex-1 min-w-0">
                 <p className="text-sm font-medium text-gray-900 truncate">https://app.example.com/...</p>
                 <p className="text-xs text-gray-400">Tap to copy</p>
               </div>
             </div>
           </div>
        </div>

        <div className="relative flex items-center gap-4">
          <div className="h-px bg-gray-100 flex-1" />
          <span className="text-gray-400 text-xs font-medium uppercase">OR</span>
          <div className="h-px bg-gray-100 flex-1" />
        </div>

        {/* Email Form */}
        <form onSubmit={handleSendInvite} className="space-y-6">
           <div className="space-y-1">
            <label className="text-sm font-bold text-gray-900 uppercase tracking-wide">{t('pets.emailAddress')}</label>
            <input 
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-3 rounded-xl bg-gray-50 border-transparent focus:bg-white focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all outline-none font-medium"
              placeholder={t('pets.emailPlaceholder')}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-900 uppercase tracking-wide">{t('pets.inviteAs')}</label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setRole('user')}
                className={`p-4 rounded-xl border-2 text-left transition-all ${
                  role === 'user' 
                    ? 'border-teal-500 bg-teal-50 ring-1 ring-teal-500' 
                    : 'border-gray-100 bg-white hover:border-gray-200'
                }`}
              >
                <span className="block font-bold text-gray-900 mb-0.5">{t('pets.coOwner')}</span>
                <span className="text-[10px] text-gray-500 leading-tight block">Full access to edit profile and add records.</span>
              </button>

              <button
                type="button"
                onClick={() => setRole('sitter')}
                className={`p-4 rounded-xl border-2 text-left transition-all ${
                  role === 'sitter' 
                    ? 'border-purple-500 bg-purple-50 ring-1 ring-purple-500' 
                    : 'border-gray-100 bg-white hover:border-gray-200'
                }`}
              >
                <span className="block font-bold text-gray-900 mb-0.5">{t('pets.roles.sitter')}</span>
                <span className="text-[10px] text-gray-500 leading-tight block">{t('pets.sitterDesc')}</span>
              </button>
            </div>
          </div>

          <motion.button 
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={!email}
            className={`w-full py-4 rounded-2xl font-bold text-lg shadow-lg transition-all flex items-center justify-center gap-2 ${
              email 
                ? 'bg-teal-600 text-white shadow-teal-600/30 hover:bg-teal-700' 
                : 'bg-gray-100 text-gray-400 cursor-not-allowed shadow-none'
            }`}
          >
            <Send className="w-5 h-5" />
            {t('pets.sendInvitation')}
          </motion.button>
        </form>

      </div>
    </div>
  );
}