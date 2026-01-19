import { AlertCircle, X } from 'lucide-react';

interface HealthDisclaimerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAccept: () => void;
}

export function HealthDisclaimerModal({ isOpen, onClose, onAccept }: HealthDisclaimerModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-amber-100 rounded-full flex items-center justify-center">
              <AlertCircle className="w-5 h-5 text-amber-600" />
            </div>
            <h3 className="text-base">Important Health Notice</h3>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="mb-6 p-4 bg-amber-50 border-2 border-amber-200 rounded-xl">
            <h4 className="text-sm mb-3 text-amber-900 flex items-center gap-2">
              <span className="text-xl">⚕️</span>
              This forum does not replace professional veterinary care
            </h4>
            <div className="space-y-2 text-xs text-amber-800">
              <p>• Community advice is based on personal experiences, not medical training</p>
              <p>• Only verified veterinarians have professional credentials</p>
              <p>• For emergencies or serious health concerns, contact a vet immediately</p>
              <p>• Never delay professional care based on forum advice</p>
            </div>
          </div>

          <div className="mb-6 p-4 bg-red-50 border-2 border-red-200 rounded-xl">
            <h4 className="text-sm mb-2 text-red-900 flex items-center gap-2">
              <span className="text-xl">🚨</span>
              When to seek immediate veterinary care:
            </h4>
            <div className="space-y-1 text-xs text-red-800">
              <p>• Difficulty breathing or choking</p>
              <p>• Severe bleeding or injuries</p>
              <p>• Seizures or loss of consciousness</p>
              <p>• Ingestion of toxic substances</p>
              <p>• Extreme lethargy or inability to stand</p>
              <p>• Severe vomiting or diarrhea</p>
            </div>
          </div>

          <p className="text-xs text-gray-600 text-center mb-6">
            By posting in health categories, you acknowledge that community advice should supplement, not replace, professional veterinary consultation.
          </p>

          <div className="flex gap-2">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2.5 text-sm bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={onAccept}
              className="flex-1 px-4 py-2.5 text-sm bg-gradient-to-br from-teal-400 to-teal-500 text-white rounded-xl hover:from-teal-500 hover:to-teal-600 transition-all shadow-md"
            >
              I Understand
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
