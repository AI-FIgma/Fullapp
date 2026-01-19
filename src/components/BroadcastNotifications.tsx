import { useState } from 'react';
import { Send, Users, Shield, Stethoscope, Dog, AlertTriangle, Info, Star, X, Bell, Clock, Calendar, Trash2 } from 'lucide-react';

interface BroadcastNotificationsProps {
  onSendBroadcast: (notification: BroadcastNotification) => void;
  currentUserRole: 'admin' | 'moderator';
}

export interface BroadcastNotification {
  id: string;
  targetAudience: TargetAudience;
  title: string;
  message: string;
  priority: 'info' | 'warning' | 'important';
  sender: string;
  sentAt: Date;
  scheduledFor?: Date;
  status: 'sent' | 'scheduled';
}

type TargetAudience = 
  | 'all' 
  | 'verified-vets' 
  | 'verified-trainers' 
  | 'moderators'
  | 'admins'
  | 'verified-professionals';

export function BroadcastNotifications({ onSendBroadcast, currentUserRole }: BroadcastNotificationsProps) {
  const [targetAudience, setTargetAudience] = useState<TargetAudience>('all');
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [priority, setPriority] = useState<'info' | 'warning' | 'important'>('info');
  const [showPreview, setShowPreview] = useState(false);
  const [sentNotifications, setSentNotifications] = useState<BroadcastNotification[]>([]);
  const [scheduledNotifications, setScheduledNotifications] = useState<BroadcastNotification[]>([]);
  const [sendType, setSendType] = useState<'now' | 'schedule'>('now');
  const [scheduleDate, setScheduleDate] = useState('');
  const [scheduleTime, setScheduleTime] = useState('');

  const audiences = [
    { 
      id: 'all' as TargetAudience, 
      label: 'All Users', 
      icon: Users, 
      description: 'Send to everyone',
      color: 'blue',
      adminOnly: false
    },
    { 
      id: 'verified-vets' as TargetAudience, 
      label: 'Verified Veterinarians', 
      icon: Stethoscope, 
      description: 'Users with vet verification',
      color: 'green',
      adminOnly: false
    },
    { 
      id: 'verified-trainers' as TargetAudience, 
      label: 'Verified Trainers', 
      icon: Dog, 
      description: 'Users with trainer verification',
      color: 'purple',
      adminOnly: false
    },
    { 
      id: 'verified-professionals' as TargetAudience, 
      label: 'All Professionals', 
      icon: Star, 
      description: 'Vets + Trainers',
      color: 'amber',
      adminOnly: false
    },
    { 
      id: 'moderators' as TargetAudience, 
      label: 'Moderators', 
      icon: Shield, 
      description: 'Moderators only',
      color: 'orange',
      adminOnly: true
    },
    { 
      id: 'admins' as TargetAudience, 
      label: 'Administrators', 
      icon: Shield, 
      description: 'Admins only',
      color: 'red',
      adminOnly: true
    },
  ];

  const handleSend = () => {
    if (!title.trim() || !message.trim()) return;

    const notification: BroadcastNotification = {
      id: Date.now().toString(),
      targetAudience,
      title: title.trim(),
      message: message.trim(),
      priority,
      sender: currentUserRole === 'admin' ? 'Admin' : 'Moderator',
      sentAt: new Date(),
      status: 'sent'
    };

    onSendBroadcast(notification);
    setSentNotifications([notification, ...sentNotifications]);
    
    // Reset form
    setTitle('');
    setMessage('');
    setTargetAudience('all');
    setPriority('info');
    setShowPreview(false);
  };

  const handleSchedule = () => {
    if (!title.trim() || !message.trim() || !scheduleDate || !scheduleTime) return;

    const notification: BroadcastNotification = {
      id: Date.now().toString(),
      targetAudience,
      title: title.trim(),
      message: message.trim(),
      priority,
      sender: currentUserRole === 'admin' ? 'Admin' : 'Moderator',
      sentAt: new Date(),
      scheduledFor: new Date(`${scheduleDate}T${scheduleTime}:00`),
      status: 'scheduled'
    };

    onSendBroadcast(notification);
    setScheduledNotifications([notification, ...scheduledNotifications]);
    
    // Reset form
    setTitle('');
    setMessage('');
    setTargetAudience('all');
    setPriority('info');
    setShowPreview(false);
    setSendType('now');
    setScheduleDate('');
    setScheduleTime('');
  };

  const handleDeleteScheduled = (id: string) => {
    setScheduledNotifications(scheduledNotifications.filter(n => n.id !== id));
  };

  const handleEditScheduled = (notification: BroadcastNotification) => {
    // Fill form with notification data
    setTitle(notification.title);
    setMessage(notification.message);
    setTargetAudience(notification.targetAudience);
    setPriority(notification.priority);
    setSendType('schedule');
    
    // Set date and time from scheduledFor
    if (notification.scheduledFor) {
      const date = new Date(notification.scheduledFor);
      const dateStr = date.toISOString().split('T')[0];
      const timeStr = date.toTimeString().slice(0, 5);
      setScheduleDate(dateStr);
      setScheduleTime(timeStr);
    }
    
    // Remove from scheduled list
    setScheduledNotifications(scheduledNotifications.filter(n => n.id !== notification.id));
    
    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const selectedAudience = audiences.find(a => a.id === targetAudience);
  const selectedPriority = priority;
  const AudienceIcon = selectedAudience?.icon || Users;
  const PriorityIcon = selectedPriority === 'info' ? Info : selectedPriority === 'warning' ? AlertTriangle : X;

  const getAudienceColor = (color: string) => {
    const colors: Record<string, string> = {
      blue: 'bg-blue-50 text-blue-700 border-blue-200',
      green: 'bg-green-50 text-green-700 border-green-200',
      purple: 'bg-purple-50 text-purple-700 border-purple-200',
      amber: 'bg-amber-50 text-amber-700 border-amber-200',
      orange: 'bg-orange-50 text-orange-700 border-orange-200',
      red: 'bg-red-50 text-red-700 border-red-200',
    };
    return colors[color] || colors.blue;
  };

  const canSend = title.trim() && message.trim();
  const canSchedule = canSend && scheduleDate && scheduleTime;

  return (
    <div className="space-y-4">
      {/* Composer Card */}
      <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden">
        <div className="p-4 space-y-4">
          {/* Target Audience */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Target Audience
            </label>
            <div className="grid grid-cols-2 gap-2">
              {audiences
                .filter(aud => currentUserRole === 'admin' || !aud.adminOnly)
                .map(aud => {
                  const Icon = aud.icon;
                  const isSelected = targetAudience === aud.id;
                  return (
                    <button
                      key={aud.id}
                      onClick={() => setTargetAudience(aud.id)}
                      className={`flex items-start gap-2 p-3 rounded-xl border-2 transition-all text-left ${
                        isSelected
                          ? `${getAudienceColor(aud.color)} border-current`
                          : 'bg-gray-50 text-gray-600 border-transparent hover:bg-gray-100'
                      }`}
                    >
                      <Icon className="w-5 h-5 mt-0.5 flex-shrink-0" />
                      <div className="min-w-0">
                        <div className="text-sm font-medium">{aud.label}</div>
                        <div className="text-xs opacity-75">{aud.description}</div>
                      </div>
                    </button>
                  );
                })}
            </div>
          </div>

          {/* Priority Level */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Priority Level
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={() => setPriority('info')}
                className={`flex items-center justify-center gap-1.5 p-2.5 rounded-xl border-2 transition-all ${
                  priority === 'info'
                    ? 'bg-blue-50 text-blue-700 border-blue-200 border-current'
                    : 'bg-gray-50 text-gray-600 border-transparent hover:bg-gray-100'
                }`}
              >
                <Info className="w-4 h-4 flex-shrink-0" />
                <span className="text-xs font-medium">Info</span>
              </button>
              
              <button
                onClick={() => setPriority('warning')}
                className={`flex items-center justify-center gap-1.5 p-2.5 rounded-xl border-2 transition-all ${
                  priority === 'warning'
                    ? 'bg-amber-50 text-amber-700 border-amber-200 border-current'
                    : 'bg-gray-50 text-gray-600 border-transparent hover:bg-gray-100'
                }`}
              >
                <AlertTriangle className="w-4 h-4 flex-shrink-0" />
                <span className="text-xs font-medium">Warning</span>
              </button>
              
              <button
                onClick={() => setPriority('important')}
                className={`flex items-center justify-center gap-1.5 p-2.5 rounded-xl border-2 transition-all ${
                  priority === 'important'
                    ? 'bg-red-50 text-red-700 border-red-200 border-current'
                    : 'bg-gray-50 text-gray-600 border-transparent hover:bg-gray-100'
                }`}
              >
                <Shield className="w-4 h-4 flex-shrink-0" />
                <span className="text-xs font-medium">Important</span>
              </button>
            </div>
          </div>

          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Notification Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., Platform Maintenance Scheduled"
              className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              maxLength={60}
            />
            <div className="text-xs text-gray-500 mt-1">{title.length}/60 characters</div>
          </div>

          {/* Message */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Message Content
            </label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Write your notification message here..."
              className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent resize-none"
              rows={4}
              maxLength={300}
            />
            <div className="text-xs text-gray-500 mt-1">{message.length}/300 characters</div>
          </div>

          {/* Send Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Send Type
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => setSendType('now')}
                className={`flex items-center justify-center gap-1.5 p-2.5 rounded-xl border-2 transition-all ${
                  sendType === 'now'
                    ? 'bg-blue-50 text-blue-700 border-blue-200 border-current'
                    : 'bg-gray-50 text-gray-600 border-transparent hover:bg-gray-100'
                }`}
              >
                <Send className="w-4 h-4 flex-shrink-0" />
                <span className="text-xs font-medium">Send Now</span>
              </button>
              
              <button
                onClick={() => setSendType('schedule')}
                className={`flex items-center justify-center gap-1.5 p-2.5 rounded-xl border-2 transition-all ${
                  sendType === 'schedule'
                    ? 'bg-amber-50 text-amber-700 border-amber-200 border-current'
                    : 'bg-gray-50 text-gray-600 border-transparent hover:bg-gray-100'
                }`}
              >
                <Calendar className="w-4 h-4 flex-shrink-0" />
                <span className="text-xs font-medium">Schedule</span>
              </button>
            </div>
          </div>

          {/* Schedule Date and Time */}
          {sendType === 'schedule' && (
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Date
                </label>
                <input
                  type="date"
                  value={scheduleDate}
                  onChange={(e) => setScheduleDate(e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Time
                </label>
                <input
                  type="time"
                  value={scheduleTime}
                  onChange={(e) => setScheduleTime(e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                />
              </div>
            </div>
          )}

          {/* Preview Toggle */}
          {canSend && (
            <button
              onClick={() => setShowPreview(!showPreview)}
              className="text-sm text-teal-600 hover:text-teal-700 font-medium"
            >
              {showPreview ? 'Hide Preview' : 'Show Preview'}
            </button>
          )}

          {/* Preview */}
          {showPreview && canSend && (
            <div className="p-4 bg-gray-50 rounded-xl border border-gray-200">
              <div className="text-xs text-gray-500 mb-2">Preview:</div>
              <div className={`p-3 rounded-lg border ${selectedPriority === 'info' ? 'bg-blue-50 border-blue-200' : selectedPriority === 'warning' ? 'bg-amber-50 border-amber-200' : 'bg-red-50 border-red-200'}`}>
                <div className="flex items-start gap-2 mb-1">
                  <PriorityIcon className={`w-4 h-4 ${selectedPriority === 'info' ? 'text-blue-700' : selectedPriority === 'warning' ? 'text-amber-700' : 'text-red-700'} flex-shrink-0 mt-0.5`} />
                  <div className="flex-1 min-w-0">
                    <div className={`text-sm font-semibold ${selectedPriority === 'info' ? 'text-blue-700' : selectedPriority === 'warning' ? 'text-amber-700' : 'text-red-700'}`}>{title}</div>
                    <div className={`text-sm ${selectedPriority === 'info' ? 'text-blue-700' : selectedPriority === 'warning' ? 'text-amber-700' : 'text-red-700'} opacity-90 mt-1`}>{message}</div>
                    <div className="flex items-center gap-2 mt-2">
                      <AudienceIcon className={`w-3 h-3 ${selectedPriority === 'info' ? 'text-blue-700' : selectedPriority === 'warning' ? 'text-amber-700' : 'text-red-700'} opacity-60`} />
                      <span className={`text-xs ${selectedPriority === 'info' ? 'text-blue-700' : selectedPriority === 'warning' ? 'text-amber-700' : 'text-red-700'} opacity-60`}>
                        {selectedAudience?.label}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Send Button */}
          <button
            onClick={sendType === 'now' ? handleSend : handleSchedule}
            disabled={sendType === 'now' ? !canSend : !canSchedule}
            className={`w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-medium transition-all ${
              (sendType === 'now' ? canSend : canSchedule)
                ? 'bg-teal-500 hover:bg-teal-600 text-white shadow-sm hover:shadow'
                : 'bg-gray-100 text-gray-400 cursor-not-allowed'
            }`}
          >
            <Send className="w-4 h-4" />
            {sendType === 'now' ? 'Send Notification' : 'Schedule Notification'}
          </button>
        </div>
      </div>

      {/* Sent Notifications History */}
      {sentNotifications.length > 0 && (
        <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden">
          <div className="p-4 border-b border-gray-100 bg-gray-50">
            <h3 className="font-semibold text-gray-900">Recently Sent</h3>
            <p className="text-sm text-gray-600 mt-0.5">Last {sentNotifications.length} notifications</p>
          </div>
          <div className="divide-y divide-gray-100">
            {sentNotifications.map(notif => {
              const aud = audiences.find(a => a.id === notif.targetAudience);
              const pri = priority;
              const NotifIcon = aud?.icon || Users;
              const PriIcon = pri === 'info' ? Info : pri === 'warning' ? AlertTriangle : X;
              
              return (
                <div key={notif.id} className="p-4 hover:bg-gray-50 transition-colors">
                  <div className="flex items-start gap-3">
                    <div className={`p-2 rounded-lg ${pri === 'info' ? 'bg-blue-50' : pri === 'warning' ? 'bg-amber-50' : 'bg-red-50'}`}>
                      <PriIcon className={`w-4 h-4 ${pri === 'info' ? 'text-blue-700' : pri === 'warning' ? 'text-amber-700' : 'text-red-700'}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-medium text-gray-900">{notif.title}</h4>
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getAudienceColor(aud?.color || 'blue')}`}>
                          {aud?.label}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{notif.message}</p>
                      <div className="flex items-center gap-4 text-xs text-gray-500">
                        <span>Sent by {notif.sender}</span>
                        <span>•</span>
                        <span>{notif.sentAt.toLocaleTimeString()}</span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Scheduled Notifications History */}
      {scheduledNotifications.length > 0 && (
        <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden">
          <div className="p-4 border-b border-gray-100 bg-gray-50">
            <h3 className="font-semibold text-gray-900">Scheduled Notifications</h3>
            <p className="text-sm text-gray-600 mt-0.5">Last {scheduledNotifications.length} notifications</p>
          </div>
          <div className="divide-y divide-gray-100">
            {scheduledNotifications.map(notif => {
              const aud = audiences.find(a => a.id === notif.targetAudience);
              const pri = priority;
              const NotifIcon = aud?.icon || Users;
              const PriIcon = pri === 'info' ? Info : pri === 'warning' ? AlertTriangle : X;
              
              return (
                <div key={notif.id} className="p-4 hover:bg-gray-50 transition-colors">
                  <div className="flex items-start gap-3">
                    <div className={`p-2 rounded-lg ${pri === 'info' ? 'bg-blue-50' : pri === 'warning' ? 'bg-amber-50' : 'bg-red-50'}`}>
                      <PriIcon className={`w-4 h-4 ${pri === 'info' ? 'text-blue-700' : pri === 'warning' ? 'text-amber-700' : 'text-red-700'}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-medium text-gray-900">{notif.title}</h4>
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getAudienceColor(aud?.color || 'blue')}`}>
                          {aud?.label}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{notif.message}</p>
                      <div className="flex items-center gap-4 text-xs text-gray-500">
                        <span>Scheduled by {notif.sender}</span>
                        <span>•</span>
                        <span>{notif.scheduledFor?.toLocaleString()}</span>
                      </div>
                      <div className="flex items-center gap-2 mt-2">
                        <button
                          onClick={() => handleEditScheduled(notif)}
                          className="text-sm text-teal-600 hover:text-teal-700 font-medium"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteScheduled(notif.id)}
                          className="text-sm text-red-600 hover:text-red-700 font-medium"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}