import { ArrowLeft, Bell, Globe, Trash2, ChevronRight, Moon, Shield, FileText, Info, LogOut } from 'lucide-react';
import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { getAvailableLanguages, getCurrentLanguage, type Language } from '../utils/i18n';
import { supabase } from '../utils/supabase/client';

interface AppSettingsProps {
  onBack: () => void;
  onNavigate: (view: any) => void;
  onLanguageChange: (lang: Language) => void;
}

export function AppSettings({ onBack, onNavigate, onLanguageChange }: AppSettingsProps) {
  const [pushEnabled, setPushEnabled] = useState(true);
  const [emailEnabled, setEmailEnabled] = useState(true);
  const [currentLang, setCurrentLang] = useState<Language>(getCurrentLanguage());
  
  const languages = getAvailableLanguages();

  const handleLanguageSelect = (code: Language) => {
    setCurrentLang(code);
    onLanguageChange(code);
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    window.location.reload();
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA] pb-10 font-sans text-slate-900">
      {/* Header */}
      <div className="relative pt-6 pb-4 px-4 flex items-center justify-center bg-white shadow-sm">
        <button 
          onClick={onBack}
          className="absolute left-4 p-2 rounded-full hover:bg-gray-100 transition-colors"
        >
          <ArrowLeft className="w-6 h-6 text-slate-800" />
        </button>
        <h1 className="text-lg font-medium text-slate-800">Settings</h1>
      </div>

      <div className="p-6 space-y-8">
        
        {/* Preferences Section */}
        <section>
          <h2 className="text-sm font-semibold text-gray-500 mb-4 uppercase tracking-wider">Preferences</h2>
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            
            {/* Language */}
            <div className="p-4 border-b border-gray-50">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                    <Globe className="w-5 h-5" />
                  </div>
                  <span className="font-medium text-slate-900">Language</span>
                </div>
              </div>
              <div className="flex gap-2">
                {languages.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => handleLanguageSelect(lang.code)}
                    className={`flex-1 py-2 px-3 rounded-xl text-sm font-medium transition-all border ${
                      currentLang === lang.code
                        ? 'bg-slate-900 text-white border-slate-900 shadow-md'
                        : 'bg-gray-50 text-slate-600 border-transparent hover:bg-gray-100'
                    }`}
                  >
                    {lang.flag} {lang.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Notifications */}
            <div className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-50 text-purple-600 rounded-lg">
                  <Bell className="w-5 h-5" />
                </div>
                <div>
                  <span className="block font-medium text-slate-900">Push Notifications</span>
                  <span className="text-xs text-gray-500">Receive alerts on your device</span>
                </div>
              </div>
              <label className="relative inline-block w-11 h-6">
                <input 
                  type="checkbox" 
                  checked={pushEnabled}
                  onChange={(e) => setPushEnabled(e.target.checked)}
                  className="sr-only peer" 
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-slate-900"></div>
              </label>
            </div>

          </div>
        </section>

        {/* Legal & Info Section */}
        <section>
          <h2 className="text-sm font-semibold text-gray-500 mb-4 uppercase tracking-wider">Information</h2>
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <button 
              onClick={() => onNavigate('about')}
              className="w-full flex items-center justify-between p-4 border-b border-gray-50 hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 bg-teal-50 text-teal-600 rounded-lg">
                  <Info className="w-5 h-5" />
                </div>
                <span className="font-medium text-slate-900">About Us</span>
              </div>
              <ChevronRight className="w-5 h-5 text-gray-400" />
            </button>
            
            <button 
              onClick={() => onNavigate('privacy')}
              className="w-full flex items-center justify-between p-4 border-b border-gray-50 hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
                  <Shield className="w-5 h-5" />
                </div>
                <span className="font-medium text-slate-900">Privacy Policy</span>
              </div>
              <ChevronRight className="w-5 h-5 text-gray-400" />
            </button>

            <button 
              onClick={() => onNavigate('terms')}
              className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 bg-orange-50 text-orange-600 rounded-lg">
                  <FileText className="w-5 h-5" />
                </div>
                <span className="font-medium text-slate-900">Terms of Service</span>
              </div>
              <ChevronRight className="w-5 h-5 text-gray-400" />
            </button>
          </div>
        </section>

        {/* Account Actions */}
        <section>
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <button 
              onClick={handleSignOut}
              className="w-full flex items-center gap-3 p-4 hover:bg-red-50 transition-colors group"
            >
              <div className="p-2 bg-red-50 text-red-600 rounded-lg group-hover:bg-red-100">
                <LogOut className="w-5 h-5" />
              </div>
              <span className="font-medium text-red-600">Sign Out</span>
            </button>
          </div>

          <div className="mt-6 text-center">
            <button className="text-sm text-gray-400 hover:text-red-500 flex items-center justify-center gap-2 mx-auto transition-colors">
              <Trash2 className="w-4 h-4" />
              Delete Account
            </button>
            <p className="text-xs text-gray-400 mt-2">Version 1.0.2 (Build 2024)</p>
          </div>
        </section>

      </div>
    </div>
  );
}