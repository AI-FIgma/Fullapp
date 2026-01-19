import { useState, useEffect } from 'react';
import { Search, AlertCircle, Clock, CheckCircle, MessageSquare, User, UserPlus, ChevronDown, ChevronUp } from 'lucide-react';
import { mockTickets, type SupportTicket, type TicketStatus, type TicketPriority } from './SupportTickets';
import { currentUser } from '../data/mockData';
import { NotificationHelpers } from '../utils/notificationGenerator';

interface AdminTicketsProps {
  onViewTicket: (ticketId: string, asAdmin?: boolean) => void;
  hideHeader?: boolean;
}

// Mock admin data - expanded to include IDs for simulation
const mockAdmins = [
  { id: 'admin-root', name: 'AdminLT (You)' }, // Assuming current user is AdminLT
  { id: 'mod-top-1', name: 'ModAlex' },
  { id: 'admin-sarah', name: 'Sarah (Support)' },
  { id: 'admin-michael', name: 'Michael (Support)' },
  { id: 'admin-emma', name: 'Emma (Support)' }
];

export function AdminTickets({ onViewTicket, hideHeader = false }: AdminTicketsProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | TicketStatus>('all');
  const [priorityFilter, setPriorityFilter] = useState<'all' | TicketPriority>('all');
  
  // Local state for tickets to handle assignment changes
  const [tickets, setTickets] = useState<SupportTicket[]>(mockTickets);
  
  // State for assignment dropdown
  const [openAssignDropdown, setOpenAssignDropdown] = useState<string | null>(null);

  const isAdmin = currentUser.role === 'admin';
  const currentUserId = currentUser.id;

  // Initialize tickets with proper assignment checks on mount if needed
  useEffect(() => {
    // Ensure mock tickets have valid assignments relative to our mock users
    // This is just for demo consistency
  }, []);

  const handleAssignTicket = (ticketId: string, assigneeId: string) => {
    const ticket = tickets.find(t => t.id === ticketId);
    if (!ticket) return;

    setTickets(prevTickets => prevTickets.map(t => {
      if (t.id === ticketId) {
        return {
          ...t,
          assignedTo: assigneeId,
          status: t.status === 'open' ? 'in_progress' : t.status
        };
      }
      return t;
    }));
    setOpenAssignDropdown(null);

    // TRIGGER NOTIFICATION LOGIC
    // In a real app, this would send a notification to the assignee via backend.
    // Here, we simulate it.
    
    // 1. If assigned to CURRENT USER (e.g. "Assign to me"), show a confirmation notification
    if (assigneeId === currentUserId) {
      // Don't spam notifications for self-actions usually, but user asked "so I don't forget"
      // NotificationHelpers.onTicketAssigned(ticket.id, ticket.subject, 'You');
      console.log('Ticket assigned to self');
    } 
    // 2. If assigned to SOMEONE ELSE (Admin assigning to Mod), simulate notification for them
    // We can't show it to them now, but we can log it or show a success toast for the admin
    else {
      const assigneeName = mockAdmins.find(a => a.id === assigneeId)?.name || 'User';
      // alert(`Ticket assigned to ${assigneeName}. They will receive a notification.`);
      
      // Simulate the notification generation (would happen on backend)
      // NotificationHelpers.onTicketAssigned(ticket.id, ticket.subject, currentUser.username);
    }

    // DEMO: For the purpose of showing the functionality to the user right now,
    // we will trigger a local notification regardless, so they can see "It works".
    // This simulates "You received a notification" even if you assigned it to yourself,
    // which aligns with "kad nepamirsciau veliau" (so I don't forget later).
    NotificationHelpers.onTicketAssigned(ticket.id, ticket.subject, currentUser.username);
  };

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
        return 'text-gray-500 bg-gray-100';
      case 'medium':
        return 'text-blue-500 bg-blue-100';
      case 'high':
        return 'text-orange-500 bg-orange-100';
      case 'urgent':
        return 'text-red-500 bg-red-100';
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

  // Filter tickets
  let filteredTickets = tickets;

  if (searchQuery) {
    filteredTickets = filteredTickets.filter(ticket => 
      ticket.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ticket.id.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }

  if (statusFilter !== 'all') {
    filteredTickets = filteredTickets.filter(ticket => ticket.status === statusFilter);
  }

  if (priorityFilter !== 'all') {
    filteredTickets = filteredTickets.filter(ticket => ticket.priority === priorityFilter);
  }

  // Stats
  const stats = {
    total: tickets.length,
    open: tickets.filter(t => t.status === 'open').length,
    inProgress: tickets.filter(t => t.status === 'in_progress').length,
    resolved: tickets.filter(t => t.status === 'resolved').length
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      {!hideHeader && (
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Support Tickets</h2>
          <p className="text-gray-600">Manage and respond to user support requests</p>
        </div>
      )}

      {/* Filters & Search */}
      <div className="space-y-2">
        {/* Filters Row */}
        <div className="flex items-center gap-2">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as typeof statusFilter)}
            className="flex-1 px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 cursor-pointer"
          >
            <option value="all">All Tickets ({stats.total})</option>
            <option value="open">🔵 Open ({stats.open})</option>
            <option value="in_progress">🟣 In Progress ({stats.inProgress})</option>
            <option value="resolved">🟢 Resolved ({stats.resolved})</option>
          </select>
          
          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value as typeof priorityFilter)}
            className="flex-1 px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 cursor-pointer"
          >
            <option value="all">All Priorities</option>
            <option value="urgent">🔴 Urgent</option>
            <option value="high">🟠 High</option>
            <option value="medium">🔵 Medium</option>
            <option value="low">⚪ Low</option>
          </select>
        </div>

        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by ticket ID or subject..."
            className="w-full pl-9 pr-4 py-2 text-sm bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Tickets List */}
      <div className="space-y-3">
        {filteredTickets.length === 0 ? (
          <div className="bg-white border border-gray-200 rounded-2xl p-12 text-center">
            <MessageSquare className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500">No tickets found</p>
          </div>
        ) : (
          filteredTickets.map(ticket => (
            <div
              key={ticket.id}
              onClick={() => onViewTicket(ticket.id, true)}
              className="w-full bg-white border border-gray-200 rounded-2xl p-4 hover:shadow-md transition-all text-left cursor-pointer relative"
            >
              {/* Header */}
              <div className="flex items-start justify-between gap-3 mb-3">
                <div className="flex items-center gap-2">
                  <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-medium ${getStatusColor(ticket.status)}`}>
                    {getStatusIcon(ticket.status)}
                    {getStatusLabel(ticket.status)}
                  </span>
                  <span className={`px-2 py-1 rounded-lg text-xs font-medium capitalize ${getPriorityColor(ticket.priority)}`}>
                    {ticket.priority}
                  </span>
                </div>
                <div className="text-right">
                  <p className="text-xs text-gray-500">#{ticket.id.split('-')[1]}</p>
                  <p className="text-xs text-gray-500">{getTimeAgo(ticket.updatedAt)}</p>
                </div>
              </div>

              {/* Subject */}
              <h3 className="font-semibold text-gray-900 mb-2">{ticket.subject}</h3>

              {/* User Info */}
              <div className="flex items-center gap-2 mb-3">
                <div className="w-6 h-6 bg-teal-500 rounded-full flex items-center justify-center text-white text-xs font-medium flex-shrink-0">
                  {ticket.userName?.charAt(0).toUpperCase() || 'U'}
                </div>
                <div className="flex flex-col">
                  <span className="text-sm text-gray-900 font-medium">{ticket.userName || `User #${ticket.userId.split('-')[1]}`}</span>
                  {ticket.userEmail && (
                    <span className="text-xs text-gray-500">{ticket.userEmail}</span>
                  )}
                </div>
              </div>

              {/* Last Message Preview */}
              {ticket.messages.length > 0 && (
                <div className="bg-gray-50 rounded-lg p-3 mb-3">
                  <p className="text-xs text-gray-500 mb-1">
                    Last message from {ticket.messages[ticket.messages.length - 1].senderName}
                  </p>
                  <p className="text-sm text-gray-700 line-clamp-2">
                    {ticket.messages[ticket.messages.length - 1].message}
                  </p>
                </div>
              )}

              {/* Meta & Actions */}
              <div className="flex items-center justify-between text-xs relative z-10">
                <div className="flex items-center gap-3 text-gray-500">
                  <span className="capitalize">{ticket.category}</span>
                  <span>•</span>
                  <span>{ticket.messages.length} message{ticket.messages.length !== 1 ? 's' : ''}</span>
                </div>
                
                {/* Assignment Controls */}
                <div className="relative">
                  {/* UNASSIGNED TICKET */}
                  {!ticket.assignedTo ? (
                    <div className="flex items-center gap-1">
                      {/* "Assign to me" - Available for Everyone */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleAssignTicket(ticket.id, currentUserId);
                        }}
                        className="flex items-center gap-1 text-teal-600 hover:text-teal-700 hover:bg-teal-50 px-2 py-1 rounded-lg transition-colors border border-transparent hover:border-teal-200"
                      >
                        <UserPlus className="w-3 h-3" />
                        <span className="font-medium">Assign to me</span>
                      </button>

                      {/* "Assign to..." Dropdown - ADMIN ONLY */}
                      {isAdmin && (
                        <div className="relative">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setOpenAssignDropdown(openAssignDropdown === ticket.id ? null : ticket.id);
                            }}
                            className="flex items-center justify-center w-6 h-6 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
                            title="Assign to another moderator"
                          >
                            <ChevronDown className="w-3 h-3" />
                          </button>
                        </div>
                      )}
                    </div>
                  ) : (
                    /* ASSIGNED TICKET */
                    <div className="flex items-center gap-2">
                      {ticket.assignedTo === currentUserId ? (
                        <div className="flex items-center gap-1 text-teal-600 bg-teal-50 px-2 py-1 rounded-lg border border-teal-100">
                          <User className="w-3 h-3" />
                          <span className="font-medium">You</span>
                          {/* Admins can reassign even if assigned to self */}
                          {isAdmin && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setOpenAssignDropdown(openAssignDropdown === ticket.id ? null : ticket.id);
                              }}
                              className="ml-1 p-0.5 hover:bg-teal-100 rounded text-teal-500"
                            >
                              <ChevronDown className="w-3 h-3" />
                            </button>
                          )}
                        </div>
                      ) : (
                        <div className="flex items-center gap-1 text-purple-600 bg-purple-50 px-2 py-1 rounded-lg border border-purple-100">
                          <User className="w-3 h-3" />
                          <span className="font-medium">
                            {mockAdmins.find(a => a.id === ticket.assignedTo)?.name.split(' ')[0] || 'Unknown'}
                          </span>
                          {/* Admins can reassign tickets assigned to others */}
                          {isAdmin && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setOpenAssignDropdown(openAssignDropdown === ticket.id ? null : ticket.id);
                              }}
                              className="ml-1 p-0.5 hover:bg-purple-100 rounded text-purple-500"
                            >
                              <ChevronDown className="w-3 h-3" />
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Dropdown Menu */}
                  {openAssignDropdown === ticket.id && (
                    <div className="absolute right-0 bottom-full mb-1 w-48 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden z-20 animate-in fade-in zoom-in-95 duration-200">
                      <div className="px-3 py-2 bg-gray-50 border-b border-gray-100 text-xs font-medium text-gray-500">
                        Assign Ticket To:
                      </div>
                      <div className="max-h-48 overflow-y-auto py-1">
                        {mockAdmins.map(admin => (
                          <button
                            key={admin.id}
                            onClick={(e) => {
                              e.stopPropagation();
                              handleAssignTicket(ticket.id, admin.id);
                            }}
                            className={`w-full text-left px-3 py-2 text-sm hover:bg-gray-50 transition-colors flex items-center justify-between ${
                              ticket.assignedTo === admin.id ? 'bg-teal-50 text-teal-700' : 'text-gray-700'
                            }`}
                          >
                            <span>{admin.name}</span>
                            {ticket.assignedTo === admin.id && <CheckCircle className="w-3 h-3 text-teal-500" />}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}