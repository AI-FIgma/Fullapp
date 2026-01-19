import { useState } from 'react';
import { CheckCircle, XCircle, FileText, Calendar, Mail, Phone, Globe, Building2 } from 'lucide-react';
import { UserBadge } from './UserBadge';
import { mockUsers } from '../data/mockData';

interface VerificationApplication {
  id: string;
  userId: string;
  username: string;
  avatar: string;
  requestedRole: 'vet' | 'trainer';
  submittedAt: Date;
  status: 'pending' | 'approved' | 'rejected';
  // Form Data (Strictly matching VerificationRequest)
  fullName: string;
  licenseNumber: string;
  issueDate?: string;
  yearsOfExperience: number;
  specialization?: string;
  additionalInfo?: string;
  proofDocuments: string[];
}

const mockApplications: VerificationApplication[] = [
  {
    id: 'app-1',
    userId: 'user-pending-1',
    username: 'SarahVetMD',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=SarahVet',
    requestedRole: 'vet',
    submittedAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
    status: 'pending',
    fullName: 'Dr. Sarah Johnson',
    licenseNumber: 'VET-12345-NY',
    issueDate: '2015-06-15',
    yearsOfExperience: 8,
    specialization: 'Small animal surgery',
    additionalInfo: 'I run a small veterinary clinic and want to help pet owners with medical advice.',
    proofDocuments: ['license.pdf']
  },
  {
    id: 'app-2',
    userId: 'user-pending-2',
    username: 'DogTrainerMike',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=MikeTrainer',
    requestedRole: 'trainer',
    submittedAt: new Date(Date.now() - 5 * 60 * 60 * 1000),
    status: 'pending',
    fullName: 'Mike Patterson',
    licenseNumber: 'CPDT-KA-998877',
    issueDate: '2018-09-20',
    yearsOfExperience: 12,
    specialization: 'Behavioral modification, puppy training',
    additionalInfo: 'Specialized in positive reinforcement training.',
    proofDocuments: ['cpdt-certificate.pdf']
  },
  {
    id: 'app-3',
    userId: 'user-pending-3',
    username: 'CatBehavioristLisa',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=LisaCat',
    requestedRole: 'trainer',
    submittedAt: new Date(Date.now() - 24 * 60 * 60 * 1000),
    status: 'pending',
    fullName: 'Lisa Chen',
    licenseNumber: 'IAABC-CERT-2211',
    yearsOfExperience: 6,
    specialization: 'Cat behavior and training',
    proofDocuments: ['iaabc-cert.pdf']
  }
];

export function VerificationQueue() {
  const [applications, setApplications] = useState(mockApplications);
  const [selectedApp, setSelectedApp] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('pending');

  const filteredApps = applications.filter(app => 
    filter === 'all' || app.status === filter
  );

  const handleApprove = (appId: string) => {
    if (!confirm('Approve this verification request?')) return;
    
    // Update local application status
    setApplications(prev => prev.map(app => 
      app.id === appId 
        ? { ...app, status: 'approved' as const }
        : app
    ));

    // Update User Role in Mock Data
    const app = applications.find(a => a.id === appId);
    if (app) {
      const user = mockUsers.find(u => u.id === app.userId);
      if (user) {
        user.role = app.requestedRole;
        // Optionally add 'verified-professional' badge
        if (!user.displayedBadges.includes('verified-professional')) {
          user.displayedBadges.push('verified-professional');
        }
        console.log(`Updated user ${user.username} role to ${user.role}`);
      }
    }
    
    // In real app: update user role in database, send notification
    alert('Verification approved! User role updated.');
  };

  const handleReject = (appId: string) => {
    const reason = prompt('Reason for rejection (will be sent to user):');
    if (!reason) return;
    
    setApplications(prev => prev.map(app => 
      app.id === appId 
        ? { ...app, status: 'rejected' as const }
        : app
    ));
    
    console.log('Rejected application:', appId, 'Reason:', reason);
    // In real app: send rejection notification with reason
    alert('Verification rejected. User will be notified.');
  };

  const getTimeAgo = (date: Date) => {
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (diffInSeconds < 60) return 'just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    return `${Math.floor(diffInSeconds / 86400)}d ago`;
  };

  const pendingCount = applications.filter(a => a.status === 'pending').length;

  return (
    <div className="space-y-4">
      {/* Header */}
      <div>
        <div className="flex items-center justify-between">
          <h3 className="text-base text-gray-900">Verification Queue</h3>
          {pendingCount > 0 && (
            <span className="px-2.5 py-1 bg-yellow-100 text-yellow-700 text-xs rounded-full border border-yellow-300">
              {pendingCount} pending
            </span>
          )}
        </div>
        <p className="text-xs text-gray-600 mt-0.5">Review and approve professional verification requests</p>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-1">
        {(['all', 'pending', 'approved', 'rejected'] as const).map(status => (
          <button
            key={status}
            onClick={() => setFilter(status)}
            className={`px-3 py-1.5 text-xs rounded-full whitespace-nowrap transition-all ${
              filter === status
                ? 'bg-teal-500 text-white shadow-md'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {status.charAt(0).toUpperCase() + status.slice(1)}
            {status !== 'all' && (
              <span className="ml-1.5">({applications.filter(a => a.status === status).length})</span>
            )}
          </button>
        ))}
      </div>

      {/* Applications List */}
      <div className="space-y-2">
        {filteredApps.map(app => (
          <div key={app.id} className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
            <button
              onClick={() => setSelectedApp(selectedApp === app.id ? null : app.id)}
              className="w-full p-3 hover:bg-gray-50 transition-colors text-left"
            >
              <div className="flex items-center gap-3">
                <img
                  src={app.avatar}
                  alt={app.username}
                  className="w-10 h-10 rounded-full"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-900 truncate">{app.username}</span>
                    <span className={`px-2 py-0.5 text-[10px] rounded-full ${
                      app.requestedRole === 'vet'
                        ? 'bg-blue-100 text-blue-700'
                        : 'bg-purple-100 text-purple-700'
                    }`}>
                      {app.requestedRole === 'vet' ? '🏥 VET' : '🎓 TRAINER'}
                    </span>
                    {app.status === 'pending' && (
                      <span className="px-2 py-0.5 bg-yellow-100 text-yellow-700 text-[10px] rounded-full">
                        PENDING
                      </span>
                    )}
                    {app.status === 'approved' && (
                      <span className="px-2 py-0.5 bg-green-100 text-green-700 text-[10px] rounded-full">
                        ✓ APPROVED
                      </span>
                    )}
                    {app.status === 'rejected' && (
                      <span className="px-2 py-0.5 bg-red-100 text-red-700 text-[10px] rounded-full">
                        ✗ REJECTED
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-1 text-xs text-gray-500 mt-0.5">
                    <Calendar className="w-3 h-3" />
                    <span>Submitted {getTimeAgo(app.submittedAt)}</span>
                  </div>
                </div>
              </div>
            </button>

            {/* Expanded Details */}
            {selectedApp === app.id && (
              <div className="p-3 bg-gray-50 border-t border-gray-200 space-y-3">
                {/* Personal Info */}
                <div className="p-3 bg-white rounded-xl space-y-2">
                  <p className="text-xs text-gray-500 mb-1">Application Details:</p>
                  <div className="space-y-1.5">
                    <div className="flex items-start gap-2">
                      <span className="text-xs text-gray-600 min-w-[100px]">Full Name:</span>
                      <span className="text-xs text-gray-900">{app.fullName}</span>
                    </div>
                    {app.licenseNumber && (
                      <div className="flex items-start gap-2">
                        <span className="text-xs text-gray-600 min-w-[100px]">License #:</span>
                        <span className="text-xs text-gray-900">{app.licenseNumber}</span>
                      </div>
                    )}
                    {app.issueDate && (
                      <div className="flex items-start gap-2">
                        <span className="text-xs text-gray-600 min-w-[100px]">Date of Issue:</span>
                        <span className="text-xs text-gray-900">{app.issueDate}</span>
                      </div>
                    )}
                    <div className="flex items-start gap-2">
                      <span className="text-xs text-gray-600 min-w-[100px]">Experience:</span>
                      <span className="text-xs text-gray-900">{app.yearsOfExperience} years</span>
                    </div>
                    {app.specialization && (
                      <div className="flex items-start gap-2">
                        <span className="text-xs text-gray-600 min-w-[100px]">Specialization:</span>
                        <span className="text-xs text-gray-900">{app.specialization}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Documents */}
                <div className="p-3 bg-white rounded-xl space-y-2">
                  <p className="text-xs text-gray-500 mb-1">Proof Documents:</p>
                  <div className="space-y-1">
                    {app.proofDocuments.map((doc, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-xs text-blue-600">
                        <FileText className="w-3.5 h-3.5" />
                        <a href="#" className="hover:underline">{doc}</a>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Additional Info */}
                {app.additionalInfo && (
                  <div className="p-3 bg-white rounded-xl">
                    <p className="text-xs text-gray-500 mb-1">Additional Information:</p>
                    <p className="text-xs text-gray-700">{app.additionalInfo}</p>
                  </div>
                )}

                {/* Action Buttons */}
                {app.status === 'pending' && (
                  <div className="flex gap-2 pt-2">
                    <button
                      onClick={() => handleApprove(app.id)}
                      className="flex-1 flex items-center justify-center gap-1.5 px-4 py-2.5 bg-green-500 text-white text-sm rounded-xl hover:bg-green-600 transition-colors shadow-md"
                    >
                      <CheckCircle className="w-4 h-4" />
                      Approve
                    </button>
                    <button
                      onClick={() => handleReject(app.id)}
                      className="flex-1 flex items-center justify-center gap-1.5 px-4 py-2.5 bg-red-500 text-white text-sm rounded-xl hover:bg-red-600 transition-colors shadow-md"
                    >
                      <XCircle className="w-4 h-4" />
                      Reject
                    </button>
                  </div>
                )}

                {app.status === 'approved' && (
                  <div className="p-2 bg-green-50 border border-green-200 rounded-xl text-center">
                    <p className="text-xs text-green-700">✓ Approved and role updated</p>
                  </div>
                )}

                {app.status === 'rejected' && (
                  <div className="p-2 bg-red-50 border border-red-200 rounded-xl text-center">
                    <p className="text-xs text-red-700">✗ Rejected - user notified</p>
                  </div>
                )}
              </div>
            )}
          </div>
        ))}

        {filteredApps.length === 0 && (
          <div className="p-8 text-center text-gray-500">
            <FileText className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p className="text-sm">No {filter !== 'all' && filter} applications</p>
          </div>
        )}
      </div>
    </div>
  );
}
