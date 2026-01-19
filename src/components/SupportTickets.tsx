import { useState } from 'react';
import { ArrowLeft, Plus, MessageSquare, Clock, CheckCircle, AlertCircle } from 'lucide-react';
import { currentUser } from '../data/mockData';
import { ForumHeader } from './ForumHeader';

export type TicketStatus = 'open' | 'in_progress' | 'resolved';
export type TicketPriority = 'low' | 'medium' | 'high' | 'urgent';
export type TicketCategory = 'general' | 'technical' | 'account' | 'verification' | 'report' | 'feedback' | 'other';

export interface TicketMessage {
  id: string;
  ticketId: string;
  sender: 'user' | 'support';
  senderName: string;
  message: string;
  timestamp: Date;
  isInternal?: boolean; // Internal notes only visible to support
  attachments?: Array<{
    id: string;
    name: string;
    type: string;
    url: string;
    size: number;
  }>;
}

export interface SupportTicket {
  id: string;
  userId: string;
  userName: string; // Username of ticket creator
  userEmail?: string; // Contact email
  subject: string;
  category: TicketCategory;
  priority: TicketPriority;
  status: TicketStatus;
  createdAt: Date;
  updatedAt: Date;
  lastReplyAt?: Date;
  lastReplyBy?: 'user' | 'support';
  messages: TicketMessage[];
  assignedTo?: string; // Admin/support user ID
  unreadCount: number; // Unread messages for current user
}

interface SupportTicketsProps {
  onBack: () => void;
  onCreateTicket: () => void;
  onViewTicket: (ticketId: string) => void;
  unreadNotifications: number;
  onNavigate: (view: 'notifications' | 'saved' | 'settings') => void;
}

// Mock data
const mockTickets: SupportTicket[] = [
  {
    id: 'ticket-1',
    userId: 'user-1',
    userName: 'John Doe',
    userEmail: 'john@example.com',
    subject: 'Cannot upload profile picture',
    category: 'technical',
    priority: 'medium',
    status: 'in_progress',
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
    lastReplyAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
    lastReplyBy: 'support',
    assignedTo: 'admin-sarah',
    unreadCount: 1,
    messages: [
      {
        id: 'msg-1',
        ticketId: 'ticket-1',
        sender: 'user',
        senderName: 'You',
        message: 'I am trying to upload a new profile picture but it keeps failing. The error says "Upload failed, please try again".',
        timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000)
      },
      {
        id: 'msg-2',
        ticketId: 'ticket-1',
        sender: 'support',
        senderName: 'Sarah (Support)',
        message: 'Hi! Thank you for reaching out. Could you please tell me what file format and size you\'re trying to upload?',
        timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000)
      },
      {
        id: 'msg-3',
        ticketId: 'ticket-1',
        sender: 'user',
        senderName: 'You',
        message: 'It\'s a JPG file, about 3MB in size.',
        timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000)
      },
      {
        id: 'msg-4',
        ticketId: 'ticket-1',
        sender: 'support',
        senderName: 'Sarah (Support)',
        message: 'Thank you! I\'ve checked your account and found the issue. Could you please try again now? The upload should work. If you still have issues, please let me know!',
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000)
      }
    ]
  },
  {
    id: 'ticket-2',
    userId: 'admin-root', // AdminLT's ticket
    userName: 'AdminLT',
    userEmail: 'admin@petcommunity.app',
    subject: 'Testing support ticket system',
    category: 'technical',
    priority: 'low',
    status: 'resolved',
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    lastReplyAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    lastReplyBy: 'support',
    assignedTo: 'admin-michael',
    unreadCount: 0,
    messages: [
      {
        id: 'msg-5',
        ticketId: 'ticket-2',
        sender: 'user',
        senderName: 'You',
        message: 'Testing the support ticket functionality to ensure it works correctly for admins.',
        timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000)
      },
      {
        id: 'msg-6',
        ticketId: 'ticket-2',
        sender: 'support',
        senderName: 'Michael (Support)',
        message: 'Hi AdminLT! The system is working perfectly. Marking this as resolved.',
        timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000)
      }
    ]
  },
  {
    id: 'ticket-3',
    userId: 'user-1',
    userName: 'John Doe',
    userEmail: 'john@example.com',
    subject: 'Suggestion: Dark mode',
    category: 'feedback',
    priority: 'low',
    status: 'resolved',
    createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000),
    lastReplyAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000),
    lastReplyBy: 'support',
    unreadCount: 0,
    messages: [
      {
        id: 'msg-7',
        ticketId: 'ticket-3',
        sender: 'user',
        senderName: 'You',
        message: 'Would be great to have a dark mode option for the app!',
        timestamp: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000)
      },
      {
        id: 'msg-8',
        ticketId: 'ticket-3',
        sender: 'support',
        senderName: 'Emma (Support)',
        message: 'Thank you for your feedback! Dark mode is already on our roadmap and we\'re planning to release it in the next update. Stay tuned!',
        timestamp: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000)
      }
    ]
  },
  {
    id: 'ticket-admin-open',
    userId: 'admin-root', // AdminLT's open ticket
    userName: 'AdminLT',
    userEmail: 'admin@petcommunity.app',
    subject: 'Question about moderator permissions',
    category: 'general',
    priority: 'medium',
    status: 'open',
    createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 6 * 60 * 60 * 1000),
    lastReplyAt: new Date(Date.now() - 6 * 60 * 60 * 1000),
    lastReplyBy: 'user',
    unreadCount: 0,
    messages: [
      {
        id: 'msg-admin-1',
        ticketId: 'ticket-admin-open',
        sender: 'user',
        senderName: 'You',
        message: 'Can moderators permanently ban users? What are the exact permission differences between moderators and admins?',
        timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000)
      }
    ]
  },
  {
    id: 'ticket-4',
    userId: 'user-2',
    userName: 'John Smith',
    userEmail: 'john.smith@example.com',
    subject: 'Cannot login to my account',
    category: 'account',
    priority: 'urgent',
    status: 'open',
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
    lastReplyAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
    lastReplyBy: 'user',
    unreadCount: 0,
    messages: [
      {
        id: 'msg-9',
        ticketId: 'ticket-4',
        sender: 'user',
        senderName: 'John Smith',
        message: 'I keep getting "Invalid credentials" error even though I\'m using the correct password. Please help!',
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000)
      }
    ]
  }
];

export function SupportTickets({ onBack, onCreateTicket, onViewTicket, unreadNotifications, onNavigate }: SupportTicketsProps) {
  const [activeFilter, setActiveFilter] = useState<'all' | TicketStatus>('all');

  const getStatusColor = (status: TicketStatus) => {
    switch (status) {
      case 'open':
        return 'bg-blue-100 text-blue-700';
      case 'in_progress':
        return 'bg-purple-100 text-purple-700';
      case 'resolved':
        return 'bg-green-100 text-green-700';
    }
  };

  const getStatusIcon = (status: TicketStatus) => {
    switch (status) {
      case 'open':
        return <AlertCircle className="w-4 h-4" />;
      case 'in_progress':
        return <Clock className="w-4 h-4" />;
      case 'resolved':
        return <CheckCircle className="w-4 h-4" />;
    }
  };

  const getStatusLabel = (status: TicketStatus) => {
    switch (status) {
      case 'open':
        return 'Open';
      case 'in_progress':
        return 'In Progress';
      case 'resolved':
        return 'Resolved';
    }
  };

  const getPriorityColor = (priority: TicketPriority) => {
    switch (priority) {
      case 'low':
        return 'text-gray-500';
      case 'medium':
        return 'text-blue-500';
      case 'high':
        return 'text-orange-500';
      case 'urgent':
        return 'text-red-500';
    }
  };

  const getTimeAgo = (date: Date) => {
    const seconds = Math.floor((Date.now() - date.getTime()) / 1000);
    
    if (seconds < 60) return 'Just now';
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    if (seconds < 604800) return `${Math.floor(seconds / 86400)}d ago`;
    return date.toLocaleDateString();
  };

  // ✅ FILTER TICKETS: Show ONLY tickets created by current user (even for admins/moderators)
  // This is "My Support Tickets" - personal section, not admin panel
  const myTickets = mockTickets.filter(t => t.userId === currentUser.id);

  const filteredTickets = activeFilter === 'all' 
    ? myTickets 
    : myTickets.filter(t => t.status === activeFilter);

  return (
    <div className="min-h-screen bg-gray-50 pb-16 relative">
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
            <h2 className="text-base font-semibold">My Support Tickets</h2>
          </div>
          <ForumHeader
            unreadNotifications={unreadNotifications}
            onOpenNotifications={() => onNavigate('notifications')}
            onOpenSaved={() => onNavigate('saved')}
            onOpenSettings={() => onNavigate('settings')}
          />
        </div>
        
        {/* Filters - integrated into header bottom */}
        <div className="px-3 pb-3">
          <select
            value={activeFilter}
            onChange={(e) => setActiveFilter(e.target.value as typeof activeFilter)}
            className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent cursor-pointer"
          >
            <option value="all">All Tickets ({myTickets.length})</option>
            <option value="open">🔵 Open ({myTickets.filter(t => t.status === 'open').length})</option>
            <option value="in_progress">🟣 In Progress ({myTickets.filter(t => t.status === 'in_progress').length})</option>
            <option value="resolved">🟢 Resolved ({myTickets.filter(t => t.status === 'resolved').length})</option>
          </select>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-2xl mx-auto p-4">
        {/* Info banner for admins/moderators */}
        {(currentUser.role === 'admin' || currentUser.role === 'moderator') && (
          <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-xl">
            <div className="flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
              <div className="flex-1">
                <p className="text-xs text-blue-900">
                  <strong>Personal Tickets Only:</strong> This page shows only tickets created by you. 
                  {currentUser.role === 'admin' && ' To manage all support tickets, go to Settings → Admin Panel → Support Tickets.'}
                  {currentUser.role === 'moderator' && ' To manage all support tickets, go to Settings → Moderator Panel → Support Tickets.'}
                </p>
              </div>
            </div>
          </div>
        )}

        {filteredTickets.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <MessageSquare className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">No tickets found</h3>
            <p className="text-gray-600 text-sm mb-6">
              {activeFilter === 'all' 
                ? 'You haven\'t created any support tickets yet.'
                : `No ${activeFilter} tickets found.`}
            </p>
            {/* Empty state Create Button */}
            <button
              onClick={onCreateTicket}
              className="inline-flex items-center gap-2 px-6 py-3 bg-teal-500 hover:bg-teal-600 text-white rounded-xl transition-colors shadow-sm"
            >
              <Plus className="w-5 h-5" />
              Create New Ticket
            </button>
          </div>
        ) : (
          <div className="space-y-3 pb-20"> {/* Added padding bottom to avoid overlap with FAB */}
            {filteredTickets.map(ticket => (
              <button
                key={ticket.id}
                onClick={() => onViewTicket(ticket.id)}
                className="w-full bg-white border border-gray-200 rounded-2xl p-4 hover:border-teal-300 transition-all text-left shadow-sm active:scale-[0.99]"
              >
                {/* Header */}
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-medium ${getStatusColor(ticket.status)}`}>
                        {getStatusIcon(ticket.status)}
                        {getStatusLabel(ticket.status)}
                      </span>
                      {ticket.unreadCount > 0 && (
                        <span className="px-2 py-1 bg-red-500 text-white text-xs font-medium rounded-full animate-pulse">
                          {ticket.unreadCount} new
                        </span>
                      )}
                    </div>
                    <h3 className="font-semibold text-gray-900 truncate">{ticket.subject}</h3>
                  </div>
                  <span className="text-xs text-gray-500 whitespace-nowrap">
                    {getTimeAgo(ticket.updatedAt)}
                  </span>
                </div>

                {/* Last Message Preview */}
                {ticket.messages.length > 0 && (
                  <div className="flex items-start gap-2 mb-2">
                    <span className="text-sm text-gray-500 font-medium whitespace-nowrap">
                      {ticket.messages[ticket.messages.length - 1].senderName}:
                    </span>
                    <p className="text-sm text-gray-600 truncate flex-1">
                      {ticket.messages[ticket.messages.length - 1].message}
                    </p>
                  </div>
                )}

                {/* Meta */}
                <div className="flex items-center gap-3 text-xs text-gray-500">
                  <span className="capitalize px-2 py-0.5 bg-gray-100 rounded-md">{ticket.category}</span>
                  <span className={`capitalize font-medium ${getPriorityColor(ticket.priority)}`}>
                    {ticket.priority} priority
                  </span>
                  <span>•</span>
                  <span>{ticket.messages.length} message{ticket.messages.length !== 1 ? 's' : ''}</span>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Floating Action Button (FAB) for Creating Ticket */}
      {filteredTickets.length > 0 && (
        <button
          onClick={onCreateTicket}
          className="fixed bottom-24 right-4 w-12 h-12 bg-gradient-to-br from-teal-400 to-teal-500 text-white rounded-2xl shadow-lg flex items-center justify-center hover:from-teal-500 hover:to-teal-600 transition-all z-20"
        >
          <Plus className="w-5 h-5" />
        </button>
      )}
    </div>
  );
}

// Export mock data for use in other components
export { mockTickets };
