import { ArrowLeft, Camera, User, Mail, Save, Loader2 } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { supabase } from '../utils/supabase/client';
import { projectId, publicAnonKey } from '../utils/supabase/info';

interface MainProfileEditProps {
  onBack: () => void;
}

export function MainProfileEdit({ onBack }: MainProfileEditProps) {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  useEffect(() => {
    async function loadProfile() {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setEmail(user.email || '');
        // Check profiles table or metadata
        try {
            const { data } = await supabase.from('profiles').select('*').eq('id', user.id).single();
            if (data) {
                setFullName(data.full_name || user.user_metadata?.full_name || '');
                setAvatarUrl(data.avatar_url || user.user_metadata?.avatar_url || '');
            } else {
                setFullName(user.user_metadata?.full_name || '');
                setAvatarUrl(user.user_metadata?.avatar_url || '');
            }
        } catch {
            setFullName(user.user_metadata?.full_name || '');
            setAvatarUrl(user.user_metadata?.avatar_url || '');
        }
      }
      setLoading(false);
    }
    loadProfile();
  }, []);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('File is too large. Max size is 5MB.');
      return;
    }

    setUploading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-3d55d0fe/upload`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${publicAnonKey}`
        },
        body: formData
      });

      if (!response.ok) {
        throw new Error('Upload failed');
      }

      const data = await response.json();
      if (data.url) {
        setAvatarUrl(data.url);
      }
    } catch (error) {
      console.error('Upload error:', error);
      alert('Failed to upload image. Please try again.');
    } finally {
      setUploading(false);
      // Reset input value to allow selecting same file again
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error('No user');

        // Update auth metadata
        const { error: authError } = await supabase.auth.updateUser({
            data: { full_name: fullName, avatar_url: avatarUrl }
        });
        
        if (authError) throw authError;

        // Try to update profiles table if it exists
        try {
            await supabase.from('profiles').upsert({
                id: user.id,
                full_name: fullName,
                avatar_url: avatarUrl,
                updated_at: new Date().toISOString(),
            });
        } catch (e) {
            console.log('Profiles table update failed (optional)', e);
        }

        onBack(); // Go back on success
    } catch (e) {
        alert('Failed to update profile: ' + (e as Error).message);
    } finally {
        setSaving(false);
    }
  };

  if (loading) {
    return (
        <div className="min-h-screen bg-white flex items-center justify-center">
            <Loader2 className="w-8 h-8 text-slate-900 animate-spin" />
        </div>
    );
  }

  return (
    <div className="min-h-screen bg-white pb-10 font-sans text-slate-900">
      {/* Header */}
      <div className="relative pt-6 pb-4 px-4 flex items-center justify-between bg-white border-b border-gray-50">
        <button 
          onClick={onBack}
          className="p-2 -ml-2 rounded-full hover:bg-gray-100 transition-colors"
        >
          <ArrowLeft className="w-6 h-6 text-slate-800" />
        </button>
        <h1 className="text-lg font-bold text-slate-800">Edit Profile</h1>
        <button 
            onClick={handleSave}
            disabled={saving}
            className="text-sm font-bold text-teal-600 disabled:opacity-50"
        >
            {saving ? 'Saving...' : 'Save'}
        </button>
      </div>

      <div className="p-6">
        {/* Hidden File Input */}
        <input 
          type="file" 
          ref={fileInputRef}
          onChange={handleFileChange}
          accept="image/*"
          className="hidden"
        />

        {/* Avatar */}
        <div className="flex justify-center mb-8">
            <div className="relative">
                <div className="w-28 h-28 rounded-full bg-slate-100 overflow-hidden border-4 border-white shadow-lg relative group">
                    {uploading && (
                      <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-10">
                        <Loader2 className="w-8 h-8 text-white animate-spin" />
                      </div>
                    )}
                    {avatarUrl ? (
                        <img src={avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center bg-slate-200 text-slate-400">
                            <User className="w-12 h-12" />
                        </div>
                    )}
                </div>
                <button 
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploading}
                  className="absolute bottom-0 right-0 p-2 bg-slate-900 text-white rounded-full shadow-md hover:bg-slate-800 transition-colors disabled:opacity-70"
                >
                    <Camera className="w-4 h-4" />
                </button>
            </div>
        </div>

        {/* Form */}
        <div className="space-y-5">
            <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Full Name</label>
                <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input 
                        type="text" 
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        className="w-full pl-12 pr-4 py-3 bg-gray-50 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:bg-white transition-all border border-gray-100"
                        placeholder="Your Name"
                    />
                </div>
            </div>

            <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Email</label>
                <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input 
                        type="email" 
                        value={email}
                        disabled
                        className="w-full pl-12 pr-4 py-3 bg-gray-50/50 rounded-xl text-gray-500 border border-transparent"
                    />
                </div>
                <p className="text-xs text-gray-400 mt-2 ml-1">Email cannot be changed via mobile app.</p>
            </div>
            
            {/* Avatar URL Input (Temporary solution until file upload) */}
             <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Avatar URL</label>
                <div className="relative">
                    <Camera className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input 
                        type="text" 
                        value={avatarUrl}
                        onChange={(e) => setAvatarUrl(e.target.value)}
                        className="w-full pl-12 pr-4 py-3 bg-gray-50 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:bg-white transition-all border border-gray-100"
                        placeholder="https://..."
                    />
                </div>
            </div>
        </div>
      </div>
    </div>
  );
}