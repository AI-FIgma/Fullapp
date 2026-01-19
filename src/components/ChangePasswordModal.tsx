import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { X, Lock, Eye, EyeOff, CheckCircle2, AlertCircle } from 'lucide-react';
import { useTranslation } from '../utils/useTranslation';

interface ChangePasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ChangePasswordModal({ isOpen, onClose }: ChangePasswordModalProps) {
  const { t } = useTranslation();
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isSuccess, setIsSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const validatePassword = (password: string): boolean => {
    return password.length >= 8 && 
           /[A-Z]/.test(password) && 
           /[a-z]/.test(password) && 
           /[0-9]/.test(password);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    const newErrors: { [key: string]: string } = {};

    // Validation
    if (!currentPassword) {
      newErrors.currentPassword = t('settings.changePassword.errors.currentRequired');
    }

    if (!newPassword) {
      newErrors.newPassword = t('settings.changePassword.errors.newRequired');
    } else if (!validatePassword(newPassword)) {
      newErrors.newPassword = t('settings.changePassword.errors.passwordWeak');
    }

    if (!confirmPassword) {
      newErrors.confirmPassword = t('settings.changePassword.errors.confirmRequired');
    } else if (newPassword !== confirmPassword) {
      newErrors.confirmPassword = t('settings.changePassword.errors.passwordsNoMatch');
    }

    if (currentPassword === newPassword && currentPassword) {
      newErrors.newPassword = t('settings.changePassword.errors.passwordSameAsCurrent');
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // Simulate API call
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
      
      // Reset form and close after success
      setTimeout(() => {
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
        setErrors({});
        setIsSuccess(false);
        onClose();
      }, 2000);
    }, 1500);
  };

  const handleClose = () => {
    if (!isSubmitting) {
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setErrors({});
      setIsSuccess(false);
      onClose();
    }
  };

  const modalContent = (
    <div className="fixed inset-0 z-[9999] flex items-end sm:items-center justify-center">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={handleClose} />
      
      <div className="relative bg-white w-full sm:max-w-md sm:rounded-2xl rounded-t-2xl max-h-[90vh] overflow-y-auto shadow-xl">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-100 p-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Lock className="w-5 h-5 text-teal-500" />
            <h2 className="text-lg">{t('settings.changePassword.title')}</h2>
          </div>
          <button
            onClick={handleClose}
            disabled={isSubmitting}
            className="text-gray-400 hover:text-gray-600 transition-colors disabled:opacity-50"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Success Message */}
        {isSuccess && (
          <div className="mx-4 mt-4 p-4 bg-green-50 border border-green-200 rounded-xl flex items-start gap-3">
            <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
            <div>
              <div className="text-sm text-green-900">{t('settings.changePassword.success.title')}</div>
              <div className="text-xs text-green-600 mt-1">{t('settings.changePassword.success.message')}</div>
            </div>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          {/* Current Password */}
          <div>
            <label className="block text-sm text-gray-700 mb-1.5">
              {t('settings.changePassword.fields.currentPassword')}
            </label>
            <div className="relative">
              <input
                type={showCurrentPassword ? 'text' : 'password'}
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                disabled={isSubmitting || isSuccess}
                className={`w-full px-3 py-2.5 pr-10 border rounded-lg focus:outline-none focus:ring-2 transition-colors ${
                  errors.currentPassword 
                    ? 'border-red-300 focus:ring-red-200 bg-red-50' 
                    : 'border-gray-200 focus:ring-teal-200'
                } disabled:opacity-50 disabled:bg-gray-50`}
                placeholder={t('settings.changePassword.placeholders.currentPassword')}
              />
              <button
                type="button"
                onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                disabled={isSubmitting || isSuccess}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors disabled:opacity-50"
              >
                {showCurrentPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {errors.currentPassword && (
              <div className="mt-1.5 flex items-center gap-1 text-xs text-red-600">
                <AlertCircle className="w-3.5 h-3.5" />
                {errors.currentPassword}
              </div>
            )}
          </div>

          {/* New Password */}
          <div>
            <label className="block text-sm text-gray-700 mb-1.5">
              {t('settings.changePassword.fields.newPassword')}
            </label>
            <div className="relative">
              <input
                type={showNewPassword ? 'text' : 'password'}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                disabled={isSubmitting || isSuccess}
                className={`w-full px-3 py-2.5 pr-10 border rounded-lg focus:outline-none focus:ring-2 transition-colors ${
                  errors.newPassword 
                    ? 'border-red-300 focus:ring-red-200 bg-red-50' 
                    : 'border-gray-200 focus:ring-teal-200'
                } disabled:opacity-50 disabled:bg-gray-50`}
                placeholder={t('settings.changePassword.placeholders.newPassword')}
              />
              <button
                type="button"
                onClick={() => setShowNewPassword(!showNewPassword)}
                disabled={isSubmitting || isSuccess}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors disabled:opacity-50"
              >
                {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {errors.newPassword && (
              <div className="mt-1.5 flex items-center gap-1 text-xs text-red-600">
                <AlertCircle className="w-3.5 h-3.5" />
                {errors.newPassword}
              </div>
            )}
            
            {/* Password Requirements */}
            <div className="mt-2 p-2.5 bg-gray-50 rounded-lg">
              <div className="text-xs text-gray-600 mb-1.5">{t('settings.changePassword.requirements.title')}</div>
              <ul className="space-y-1 text-xs">
                <li className={`flex items-center gap-1.5 ${newPassword.length >= 8 ? 'text-green-600' : 'text-gray-500'}`}>
                  <div className={`w-1 h-1 rounded-full ${newPassword.length >= 8 ? 'bg-green-600' : 'bg-gray-400'}`} />
                  {t('settings.changePassword.requirements.minLength')}
                </li>
                <li className={`flex items-center gap-1.5 ${/[A-Z]/.test(newPassword) ? 'text-green-600' : 'text-gray-500'}`}>
                  <div className={`w-1 h-1 rounded-full ${/[A-Z]/.test(newPassword) ? 'bg-green-600' : 'bg-gray-400'}`} />
                  {t('settings.changePassword.requirements.uppercase')}
                </li>
                <li className={`flex items-center gap-1.5 ${/[a-z]/.test(newPassword) ? 'text-green-600' : 'text-gray-500'}`}>
                  <div className={`w-1 h-1 rounded-full ${/[a-z]/.test(newPassword) ? 'bg-green-600' : 'bg-gray-400'}`} />
                  {t('settings.changePassword.requirements.lowercase')}
                </li>
                <li className={`flex items-center gap-1.5 ${/[0-9]/.test(newPassword) ? 'text-green-600' : 'text-gray-500'}`}>
                  <div className={`w-1 h-1 rounded-full ${/[0-9]/.test(newPassword) ? 'bg-green-600' : 'bg-gray-400'}`} />
                  {t('settings.changePassword.requirements.number')}
                </li>
              </ul>
            </div>
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block text-sm text-gray-700 mb-1.5">
              {t('settings.changePassword.fields.confirmPassword')}
            </label>
            <div className="relative">
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                disabled={isSubmitting || isSuccess}
                className={`w-full px-3 py-2.5 pr-10 border rounded-lg focus:outline-none focus:ring-2 transition-colors ${
                  errors.confirmPassword 
                    ? 'border-red-300 focus:ring-red-200 bg-red-50' 
                    : 'border-gray-200 focus:ring-teal-200'
                } disabled:opacity-50 disabled:bg-gray-50`}
                placeholder={t('settings.changePassword.placeholders.confirmPassword')}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                disabled={isSubmitting || isSuccess}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors disabled:opacity-50"
              >
                {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {errors.confirmPassword && (
              <div className="mt-1.5 flex items-center gap-1 text-xs text-red-600">
                <AlertCircle className="w-3.5 h-3.5" />
                {errors.confirmPassword}
              </div>
            )}
          </div>

          {/* Submit Button */}
          <div className="pt-2 flex gap-2">
            <button
              type="button"
              onClick={handleClose}
              disabled={isSubmitting || isSuccess}
              className="flex-1 px-4 py-2.5 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {t('common.cancel')}
            </button>
            <button
              type="submit"
              disabled={isSubmitting || isSuccess}
              className="flex-1 px-4 py-2.5 bg-gradient-to-r from-teal-500 to-teal-600 text-white rounded-xl hover:from-teal-600 hover:to-teal-700 transition-all shadow-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  {t('settings.changePassword.submitting')}
                </>
              ) : (
                t('settings.changePassword.submit')
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
}