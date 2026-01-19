import { useState } from 'react';
import { ArrowLeft, Upload, BadgeCheck, Award, FileText, CheckCircle } from 'lucide-react';
import { ForumHeader } from './ForumHeader';

interface VerificationRequestProps {
  onBack: () => void;
  unreadNotifications: number;
  onNavigate: (view: 'notifications' | 'saved' | 'settings') => void;
}

export function VerificationRequest({ onBack, unreadNotifications, onNavigate }: VerificationRequestProps) {
  const [selectedType, setSelectedType] = useState<'vet' | 'trainer' | null>(null);
  
  // Form State
  const [fullName, setFullName] = useState('');
  const [licenseNumber, setLicenseNumber] = useState('');
  const [issueDate, setIssueDate] = useState('');
  const [yearsExperience, setYearsExperience] = useState('');
  const [specialization, setSpecialization] = useState('');
  const [additionalInfo, setAdditionalInfo] = useState('');
  const [fileName, setFileName] = useState<string | null>(null);
  
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  const handleFileChange = () => {
    // Mock file upload
    setFileName('license_document.pdf');
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex items-center justify-center p-4">
        <div className="text-center max-w-sm">
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-3" />
          <h3 className="text-base mb-2">Application Submitted!</h3>
          <p className="text-sm text-gray-600 mb-4">
            Your verification request has been submitted. Our team will review your credentials and get back to you within 3-5 business days.
          </p>
          <button
            onClick={onBack}
            className="px-6 py-2.5 bg-gradient-to-r from-teal-400 to-teal-500 text-white text-sm rounded-2xl hover:from-teal-500 hover:to-teal-600 transition-all shadow-md"
          >
            Back to Settings
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-white/95 backdrop-blur-sm border-b border-gray-100 shadow-sm">
        <div className="flex items-center justify-between p-3">
          <div className="flex items-center gap-2">
            <button onClick={onBack} className="text-gray-600 hover:text-teal-500 transition-colors">
              <ArrowLeft className="w-5 h-5" />
            </button>
            <h2 className="text-base">Verification</h2>
          </div>
          <ForumHeader
            unreadNotifications={unreadNotifications}
            onOpenNotifications={() => onNavigate('notifications')}
            onOpenSaved={() => onNavigate('saved')}
            onOpenSettings={() => onNavigate('settings')}
          />
        </div>
      </div>

      <div className="p-3">
        {/* Info Banner */}
        <div className="bg-teal-50 border border-teal-200 rounded-2xl p-3 mb-4">
          <h4 className="text-sm text-teal-900 mb-1">Professional Verification</h4>
          <p className="text-xs text-teal-700">
            Get verified to show your expertise and help pet owners with trusted advice. Verified professionals get a special badge on their profile and posts.
          </p>
        </div>

        {!selectedType ? (
          /* Select Verification Type */
          <div>
            <h4 className="text-sm mb-3">Select Your Professional Type</h4>
            
            <button
              onClick={() => setSelectedType('vet')}
              className="w-full flex items-center gap-3 p-4 border-2 border-gray-200 rounded-2xl hover:border-teal-400 hover:bg-teal-50 transition-all mb-3"
            >
              <BadgeCheck className="w-10 h-10 text-teal-500 flex-shrink-0" />
              <div className="flex-1 text-left">
                <div className="text-sm mb-0.5">Veterinarian</div>
                <div className="text-xs text-gray-600">Licensed veterinary professional</div>
              </div>
            </button>

            <button
              onClick={() => setSelectedType('trainer')}
              className="w-full flex items-center gap-3 p-4 border-2 border-gray-200 rounded-2xl hover:border-orange-400 hover:bg-orange-50 transition-all"
            >
              <Award className="w-10 h-10 text-orange-500 flex-shrink-0" />
              <div className="flex-1 text-left">
                <div className="text-sm mb-0.5">Pet Trainer</div>
                <div className="text-xs text-gray-600">Certified pet training professional</div>
              </div>
            </button>
          </div>
        ) : (
          /* Verification Form */
          <form onSubmit={handleSubmit}>
            <div className="flex items-center gap-2 mb-4 pb-3 border-b border-gray-200">
              {selectedType === 'vet' ? (
                <BadgeCheck className="w-6 h-6 text-teal-500" />
              ) : (
                <Award className="w-6 h-6 text-orange-500" />
              )}
              <div className="flex-1">
                <h4 className="text-sm">
                  {selectedType === 'vet' ? 'Veterinarian' : 'Pet Trainer'} Verification
                </h4>
                <button
                  type="button"
                  onClick={() => setSelectedType(null)}
                  className="text-xs text-teal-600 hover:underline"
                >
                  Change type
                </button>
              </div>
            </div>

            {/* Full Name - MANDATORY */}
            <div className="mb-3">
              <label htmlFor="fullName" className="block text-sm text-gray-700 mb-1.5">
                Full Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="fullName"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="First and Last Name"
                className="w-full px-3 py-2.5 text-sm bg-gray-50 border-0 rounded-2xl focus:outline-none focus:ring-2 focus:ring-teal-400"
                required
              />
            </div>

            {/* License Number - MANDATORY */}
            <div className="mb-3">
              <label htmlFor="license" className="block text-sm text-gray-700 mb-1.5">
                License/Certification Number <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="license"
                value={licenseNumber}
                onChange={(e) => setLicenseNumber(e.target.value)}
                placeholder={selectedType === 'vet' ? 'Veterinary license number' : 'Certification number'}
                className="w-full px-3 py-2.5 text-sm bg-gray-50 border-0 rounded-2xl focus:outline-none focus:ring-2 focus:ring-teal-400"
                required
              />
            </div>

            {/* Issue Date - RECOMMENDED */}
            <div className="mb-3">
              <label htmlFor="issueDate" className="block text-sm text-gray-700 mb-1.5">
                Date of Issue <span className="text-gray-400 font-normal">(Recommended)</span>
              </label>
              <input
                type="date"
                id="issueDate"
                value={issueDate}
                onChange={(e) => setIssueDate(e.target.value)}
                className="w-full px-3 py-2.5 text-sm bg-gray-50 border-0 rounded-2xl focus:outline-none focus:ring-2 focus:ring-teal-400"
              />
            </div>

            {/* Years of Experience - MANDATORY */}
            <div className="mb-3">
              <label htmlFor="experience" className="block text-sm text-gray-700 mb-1.5">
                Years of Experience <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                id="experience"
                value={yearsExperience}
                onChange={(e) => setYearsExperience(e.target.value)}
                placeholder="e.g., 5"
                className="w-full px-3 py-2.5 text-sm bg-gray-50 border-0 rounded-2xl focus:outline-none focus:ring-2 focus:ring-teal-400"
                required
                min="0"
              />
            </div>

            {/* Specialization - OPTIONAL */}
            <div className="mb-3">
              <label htmlFor="specialization" className="block text-sm text-gray-700 mb-1.5">
                Specialization <span className="text-gray-400 font-normal">(Optional)</span>
              </label>
              <input
                type="text"
                id="specialization"
                value={specialization}
                onChange={(e) => setSpecialization(e.target.value)}
                placeholder={
                  selectedType === 'vet' 
                    ? 'e.g., Small animals' 
                    : 'e.g., Dog behavior'
                }
                className="w-full px-3 py-2.5 text-sm bg-gray-50 border-0 rounded-2xl focus:outline-none focus:ring-2 focus:ring-teal-400"
              />
            </div>

            {/* Document Upload - RECOMMENDED */}
            <div className="mb-3">
              <label className="block text-sm text-gray-700 mb-1.5">
                Attach License Copy <span className="text-gray-400 font-normal">(Recommended)</span>
              </label>
              <div 
                onClick={handleFileChange}
                className={`border-2 border-dashed rounded-2xl p-6 text-center transition-colors cursor-pointer ${
                  fileName ? 'border-teal-400 bg-teal-50' : 'border-gray-300 hover:border-teal-400 hover:bg-teal-50'
                }`}
              >
                {fileName ? (
                  <>
                    <FileText className="w-8 h-8 text-teal-500 mx-auto mb-2" />
                    <p className="text-sm text-teal-900 font-medium">{fileName}</p>
                    <p className="text-xs text-teal-600">Click to change</p>
                  </>
                ) : (
                  <>
                    <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-700 mb-0.5">Click to upload documents</p>
                    <p className="text-xs text-gray-500">PDF, JPG, PNG (max 10MB)</p>
                  </>
                )}
              </div>
            </div>

            {/* Additional Info - OPTIONAL */}
            <div className="mb-3">
              <label htmlFor="additional" className="block text-sm text-gray-700 mb-1.5">
                Additional Information <span className="text-gray-400 font-normal">(Optional)</span>
              </label>
              <textarea
                id="additional"
                value={additionalInfo}
                onChange={(e) => setAdditionalInfo(e.target.value)}
                placeholder="Tell us more about your qualifications..."
                rows={3}
                className="w-full px-3 py-2.5 text-sm bg-gray-50 border-0 rounded-2xl focus:outline-none focus:ring-2 focus:ring-teal-400 resize-none"
              />
            </div>

            {/* Disclaimer */}
            <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-3 mb-3">
              <h5 className="text-xs text-yellow-900 mb-1">⚠️ Important</h5>
              <p className="text-[10px] text-yellow-800">
                By submitting this form, you confirm that all information provided is accurate and that you hold valid credentials. False claims may result in account suspension.
              </p>
            </div>

            {/* Submit */}
            <div className="flex gap-2">
              <button
                type="button"
                onClick={onBack}
                className="flex-1 px-4 py-2.5 border border-gray-300 text-gray-700 text-sm rounded-2xl hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={!fullName || !licenseNumber || !yearsExperience}
                className="flex-1 px-4 py-2.5 bg-gradient-to-r from-teal-400 to-teal-500 text-white text-sm rounded-2xl hover:from-teal-500 hover:to-teal-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
              >
                Submit Request
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}