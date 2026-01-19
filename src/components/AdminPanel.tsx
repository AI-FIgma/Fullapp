import { useState } from 'react';
import { ArrowLeft, TrendingUp, MessageSquare, Users, BarChart3, Send, ShieldCheck, HeartHandshake } from 'lucide-react';
import { AdminDashboard } from './AdminDashboard';
import { AdminTickets } from './AdminTickets';
import { BroadcastNotifications, type BroadcastNotification } from './BroadcastNotifications';
import { VerificationQueue } from './VerificationQueue';
import { AdminAdoptions } from './AdminAdoptions';
import { ForumHeader } from './ForumHeader';
import { UserManagement } from './UserManagement';
import type { SponsoredAd } from './SponsoredBanner';

interface AdminPanelProps {
  ads: SponsoredAd[];
  onBack: () => void;
  onViewTicket: (ticketId: string, asAdmin?: boolean) => void; // Updated signature
  onNavigateAnalytics?: () => void;
  initialTab?: AdminTab;
  hideTabNavigation?: boolean;
  unreadNotifications?: number;
  onNavigate?: (view: 'notifications' | 'saved' | 'settings') => void;
  currentUserRole?: 'admin' | 'moderator';
  onSendBroadcast?: (notification: BroadcastNotification) => void;
}

type AdminTab = 'ads' | 'adoptions' | 'tickets' | 'verification' | 'broadcast' | 'users' | 'analytics';

export function AdminPanel({ 
  ads, 
  onBack, 
  onViewTicket, 
  onNavigateAnalytics, 
  initialTab = 'ads', 
  hideTabNavigation = false,
  unreadNotifications = 0,
  onNavigate,
  currentUserRole,
  onSendBroadcast
}: AdminPanelProps) {
  const [activeTab, setActiveTab] = useState<AdminTab>(initialTab);

  const tabs = [
    { id: 'ads' as AdminTab, label: 'Sponsored Ads', icon: TrendingUp },
    { id: 'adoptions' as AdminTab, label: 'Adoptions', icon: HeartHandshake },
    { id: 'tickets' as AdminTab, label: 'Support Tickets', icon: MessageSquare },
    { id: 'verification' as AdminTab, label: 'Verification', icon: ShieldCheck },
    // Future tabs
    { id: 'broadcast' as AdminTab, label: 'Broadcast Notifications', icon: Send },
    { id: 'users' as AdminTab, label: 'User Management', icon: Users },
    { id: 'analytics' as AdminTab, label: 'Analytics', icon: BarChart3 }
  ];

  // Dynamic title based on active tab
  const getTitle = () => {
    if (activeTab === 'ads') return 'Ad Manager';
    if (activeTab === 'adoptions') return 'Adoption Requests';
    if (activeTab === 'tickets') return 'Support Tickets';
    if (activeTab === 'verification') return 'Verification Requests';
    if (activeTab === 'broadcast') return 'Broadcast Notifications';
    if (activeTab === 'users') return 'User Management';
    if (activeTab === 'analytics') return 'Analytics Dashboard';
    return 'Admin Panel';
  };

  // Dynamic subtitle based on active tab
  const getSubtitle = () => {
    if (activeTab === 'ads') return 'Manage sponsored content';
    if (activeTab === 'adoptions') return 'Review adoption applications';
    if (activeTab === 'tickets') return 'User support requests';
    if (activeTab === 'verification') return 'Review vet/trainer applications';
    if (activeTab === 'broadcast') return 'Send notifications to users';
    if (activeTab === 'users') return 'Manage user accounts';
    if (activeTab === 'analytics') return 'View analytics data';
    return 'Admin tools';
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-16">
      {/* Header */}
      <div className="sticky top-0 z-20 bg-white/95 backdrop-blur-sm border-b border-gray-100 shadow-sm">
        <div className="flex items-center justify-between p-3">
          <div className="flex items-center gap-2">
            <button
              onClick={onBack}
              className="text-gray-600 hover:text-teal-500 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h2 className="text-base">{getTitle()}</h2>
              <p className="text-xs text-gray-500">{getSubtitle()}</p>
            </div>
          </div>
          {onNavigate ? (
            <ForumHeader
              unreadNotifications={unreadNotifications}
              onOpenNotifications={() => onNavigate('notifications')}
              onOpenSaved={() => onNavigate('saved')}
              onOpenSettings={() => onNavigate('settings')}
            />
          ) : (
            <div className="w-5" />
          )}
        </div>

        {/* Tabs - conditionally rendered */}
        {!hideTabNavigation && (
          <div className="flex gap-2 px-4 pb-3 overflow-x-auto">
            {tabs.map(tab => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-colors ${
                    activeTab === tab.id
                      ? 'bg-teal-500 text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {tab.label}
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto p-4">
        {activeTab === 'ads' && (
          <div className="-m-4">
            <AdminDashboard ads={ads} onBack={onBack} hideHeader={true} showCreateButton={true} />
          </div>
        )}
        
        {activeTab === 'adoptions' && (
          <AdminAdoptions />
        )}

        {activeTab === 'tickets' && (
          <AdminTickets onViewTicket={onViewTicket} hideHeader={true} />
        )}

        {activeTab === 'verification' && (
          <VerificationQueue />
        )}

        {activeTab === 'broadcast' && (
          <BroadcastNotifications
            onSendBroadcast={onSendBroadcast}
            currentUserRole={currentUserRole}
          />
        )}

        {activeTab === 'users' && (
          <UserManagement />
        )}

        {activeTab === 'analytics' && (
          <div className="bg-white border border-gray-200 rounded-2xl p-12 text-center">
            <BarChart3 className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <h3 className="font-semibold text-gray-900 mb-2">Analytics Dashboard</h3>
            <p className="text-gray-600 text-sm">Coming soon...</p>
          </div>
        )}
      </div>
    </div>
  );
}