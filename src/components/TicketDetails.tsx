import { useState, useRef, useEffect } from 'react';
import { ArrowLeft, Send, MoreVertical, CheckCircle, XCircle, Paperclip, Image as ImageIcon, X, Download, FileText } from 'lucide-react';
import { mockTickets, type SupportTicket, type TicketMessage, type TicketStatus } from './SupportTickets';
import { currentUser } from '../data/mockData';

interface TicketDetailsProps {
  ticketId: string;
  onBack: () => void;
  isAdmin?: boolean; // Admin/Support view vs User view
}

interface FilePreview {
  id: string;
  file: File;
  preview: string;
  type: 'image' | 'file';
}

export function TicketDetails({ ticketId, onBack, isAdmin }: TicketDetailsProps) {
  const ticket = mockTickets.find(t => t.id === ticketId);
  const [messages, setMessages] = useState<TicketMessage[]>(ticket?.messages || []);
  const [newMessage, setNewMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [showActions, setShowActions] = useState(false);
  const [filePreviews, setFilePreviews] = useState<FilePreview[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Debug: Check if isAdmin is correctly passed
  // (Debug logs removed for production)

  // Helper: Get display name for message sender
  const getDisplayName = (message: TicketMessage): string => {
    const displayName = message.sender === 'support' 
      ? message.senderName 
      : (isAdmin ? (ticket?.userName || 'User') : 'You');
    
    return displayName;
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  if (!ticket) {
    return (
      <div className="min-h-screen bg-gray-50 pb-16">
        <div className="sticky top-0 z-20 bg-white border-b border-gray-200">
          <div className="flex items-center justify-between p-4">
            <button
              onClick={onBack}
              className="p-2 -ml-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <h1 className="font-semibold">Ticket Not Found</h1>
            <div className="w-9" />
          </div>
        </div>
        <div className="text-center py-12">
          <p className="text-gray-600">This ticket could not be found.</p>
        </div>
      </div>
    );
  }

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if ((!newMessage.trim() && filePreviews.length === 0) || isSending) return;

    setIsSending(true);

    // Simulate sending message
    setTimeout(() => {
      const attachments = filePreviews.map(preview => ({
        id: `attach-${Date.now()}-${Math.random()}`,
        name: preview.file.name,
        type: preview.file.type,
        url: preview.preview,
        size: preview.file.size
      }));

      const message: TicketMessage = {
        id: `msg-${Date.now()}`,
        ticketId: ticket.id,
        sender: isAdmin ? 'support' : 'user',
        senderName: isAdmin ? 'You (Support)' : 'You',
        message: newMessage.trim() || '(Attachment)',
        timestamp: new Date(),
        attachments: attachments.length > 0 ? attachments : undefined
      };

      setMessages(prev => [...prev, message]);
      setNewMessage('');
      setFilePreviews([]);
      setIsSending(false);
    }, 1000);
  };

  const handleResolveTicket = () => {
    // Simulate marking as resolved
    alert('Ticket marked as resolved! You can reopen it anytime if needed.');
    setShowActions(false);
    
    // In real app, status change notification would come from backend
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

  const formatTime = (date: Date) => {
    const now = new Date();
    const messageDate = new Date(date);
    const isToday = now.toDateString() === messageDate.toDateString();
    const isYesterday = new Date(now.setDate(now.getDate() - 1)).toDateString() === messageDate.toDateString();

    const timeStr = messageDate.toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      minute: '2-digit',
      hour12: true 
    });

    if (isToday) return timeStr;
    if (isYesterday) return `Yesterday ${timeStr}`;
    return `${messageDate.toLocaleDateString()} ${timeStr}`;
  };

  const isResolved = ticket.status === 'resolved';

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const newPreviews: FilePreview[] = [];
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const reader = new FileReader();

      reader.onload = (event) => {
        const preview = event.target?.result as string;
        const type = file.type.startsWith('image') ? 'image' : 'file';
        newPreviews.push({ id: `preview-${Date.now()}-${i}`, file, preview, type });
        setFilePreviews(prev => [...prev, ...newPreviews]);
      };

      reader.readAsDataURL(file);
    }
  };

  const handleRemoveFile = (id: string) => {
    setFilePreviews(prev => prev.filter(preview => preview.id !== id));
  };

  const handleDownloadFile = (file: File) => {
    const url = URL.createObjectURL(file);
    const a = document.createElement('a');
    a.href = url;
    a.download = file.name;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  const handleAttachmentDownload = (url: string, name: string) => {
    const a = document.createElement('a');
    a.href = url;
    a.download = name;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-16 flex flex-col">
      {/* Header */}
      <div className="sticky top-0 z-20 bg-white border-b border-gray-200">
        <div className="flex items-center justify-between p-4">
          <button
            onClick={onBack}
            className="p-2 -ml-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="font-semibold flex-1 text-center truncate px-2">
            Ticket #{ticket.id.split('-')[1]}
          </h1>
          <div className="relative">
            <button
              onClick={() => setShowActions(!showActions)}
              className="p-2 -mr-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <MoreVertical className="w-5 h-5" />
            </button>

            {showActions && (
              <>
                <div 
                  className="fixed inset-0 z-30" 
                  onClick={() => setShowActions(false)}
                />
                <div className="absolute right-0 top-12 z-40 bg-white border border-gray-200 rounded-xl shadow-lg py-2 w-48">
                  {isAdmin ? (
                    // Admin/Moderator - Only show "Mark as Resolved"
                    !isResolved && (
                      <button
                        onClick={handleResolveTicket}
                        className="w-full px-4 py-2 text-left hover:bg-gray-50 transition-colors flex items-center gap-3"
                      >
                        <CheckCircle className="w-4 h-4 text-green-600" />
                        <span className="text-sm">Mark as Resolved</span>
                      </button>
                    )
                  ) : (
                    // User - Only show "Delete Ticket"
                    <button
                      onClick={() => {
                        alert('Ticket deleted from your view. Support team can still see it.');
                        setShowActions(false);
                        onBack();
                      }}
                      className="w-full px-4 py-2 text-left hover:bg-gray-50 transition-colors flex items-center gap-3"
                    >
                      <XCircle className="w-4 h-4 text-red-600" />
                      <span className="text-sm text-red-600">Delete Ticket</span>
                    </button>
                  )}
                </div>
              </>
            )}
          </div>
        </div>

        {/* Ticket Info */}
        <div className="px-4 pb-3 space-y-2">
          <div className="flex items-center gap-2">
            <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-medium ${getStatusColor(ticket.status)}`}>
              {getStatusLabel(ticket.status)}
            </span>
            <span className="text-xs text-gray-500 capitalize">{ticket.category}</span>
            <span className="text-xs text-gray-500">•</span>
            <span className="text-xs text-gray-500 capitalize">{ticket.priority} priority</span>
          </div>
          <h2 className="font-semibold text-gray-900">{ticket.subject}</h2>
          <p className="text-xs text-gray-500">
            Created {new Date(ticket.createdAt).toLocaleDateString()}
          </p>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message, index) => {
          const isUser = message.sender === 'user';
          const showAvatar = index === 0 || messages[index - 1].sender !== message.sender;
          const displayName = getDisplayName(message);

          return (
            <div
              key={message.id}
              className={`flex gap-3 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}
            >
              {/* Avatar */}
              {showAvatar ? (
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-medium flex-shrink-0 ${
                  isUser ? 'bg-teal-500' : 'bg-purple-500'
                }`}>
                  {displayName.charAt(0).toUpperCase()}
                </div>
              ) : (
                <div className="w-8" />
              )}

              {/* Message */}
              <div className={`flex-1 max-w-[75%] ${isUser ? 'items-end' : 'items-start'} flex flex-col`}>
                {showAvatar && (
                  <span className="text-xs text-gray-500 mb-1 px-1">
                    {displayName}
                  </span>
                )}
                <div className={`rounded-2xl px-4 py-2 ${
                  isUser 
                    ? 'bg-teal-500 text-white rounded-tr-sm' 
                    : 'bg-white border border-gray-200 text-gray-900 rounded-tl-sm'
                }`}>
                  <p className="text-sm whitespace-pre-wrap break-words">{message.message}</p>
                  
                  {/* Attachments */}
                  {message.attachments && message.attachments.length > 0 && (
                    <div className="mt-3 space-y-2">
                      {message.attachments.map(attachment => {
                        const isImage = attachment.type.startsWith('image');
                        
                        return (
                          <div
                            key={attachment.id}
                            className={`rounded-xl overflow-hidden ${
                              isUser ? 'bg-teal-600' : 'bg-gray-50'
                            }`}
                          >
                            {isImage ? (
                              <div className="relative">
                                <img
                                  src={attachment.url}
                                  alt={attachment.name}
                                  className="w-full h-auto max-h-64 object-cover cursor-pointer"
                                  onClick={() => window.open(attachment.url, '_blank')}
                                />
                                <button
                                  onClick={() => handleAttachmentDownload(attachment.url, attachment.name)}
                                  className={`absolute top-2 right-2 p-2 rounded-lg transition-colors ${
                                    isUser 
                                      ? 'bg-teal-700 hover:bg-teal-800 text-white' 
                                      : 'bg-white hover:bg-gray-100 text-gray-700'
                                  }`}
                                >
                                  <Download className="w-4 h-4" />
                                </button>
                              </div>
                            ) : (
                              <button
                                onClick={() => handleAttachmentDownload(attachment.url, attachment.name)}
                                className="w-full px-3 py-2 flex items-center gap-3 hover:opacity-80 transition-opacity"
                              >
                                <FileText className={`w-5 h-5 flex-shrink-0 ${isUser ? 'text-white' : 'text-gray-600'}`} />
                                <div className="flex-1 min-w-0 text-left">
                                  <p className={`text-sm truncate ${isUser ? 'text-white' : 'text-gray-900'}`}>
                                    {attachment.name}
                                  </p>
                                  <p className={`text-xs ${isUser ? 'text-teal-100' : 'text-gray-500'}`}>
                                    {formatFileSize(attachment.size)}
                                  </p>
                                </div>
                                <Download className={`w-4 h-4 flex-shrink-0 ${isUser ? 'text-white' : 'text-gray-600'}`} />
                              </button>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
                <span className="text-xs text-gray-400 mt-1 px-1">
                  {formatTime(message.timestamp)}
                </span>
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* Resolved Banner */}
      {isResolved && (
        <div className="px-4 py-3 bg-green-50 border-t border-green-200">
          <div className="flex items-center gap-2 text-green-700">
            <CheckCircle className="w-5 h-5" />
            <div className="flex-1">
              <p className="text-sm font-medium">This ticket has been resolved</p>
              <p className="text-xs text-green-600">Thank you for contacting support!</p>
            </div>
          </div>
        </div>
      )}

      {/* Input */}
      {!isResolved && (
        <div className="border-t border-gray-200 bg-white px-4 py-3">
          {/* File Previews */}
          {filePreviews.length > 0 && (
            <div className="mb-3 space-y-2">
              {filePreviews.map(preview => (
                <div
                  key={preview.id}
                  className="flex items-center gap-3 p-2.5 bg-gray-50 rounded-xl border border-gray-200"
                >
                  {preview.type === 'image' ? (
                    <div className="relative w-10 h-10 flex-shrink-0">
                      <img
                        src={preview.preview}
                        alt={preview.file.name}
                        className="w-full h-full object-cover rounded-lg"
                      />
                    </div>
                  ) : (
                    <div className="w-10 h-10 flex-shrink-0 bg-white rounded-lg flex items-center justify-center border border-gray-200">
                      <FileText className="w-5 h-5 text-gray-500" />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-900 truncate">{preview.file.name}</p>
                    <p className="text-xs text-gray-500">{formatFileSize(preview.file.size)}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRemoveFile(preview.id)}
                    className="p-1.5 hover:bg-gray-200 rounded-lg transition-colors flex-shrink-0"
                  >
                    <X className="w-4 h-4 text-gray-500" />
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Input Row */}
          <form onSubmit={handleSendMessage} className="flex items-end gap-2">
            <div className="flex-1 relative">
              <div className="flex items-center gap-2 px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl focus-within:ring-2 focus-within:ring-teal-500 focus-within:border-teal-500 transition-all">
                {/* Attachment Button */}
                <label
                  htmlFor="file-upload"
                  className="flex-shrink-0 p-1.5 hover:bg-gray-200 rounded-lg transition-colors cursor-pointer"
                  title="Add attachment"
                >
                  <Paperclip className="w-5 h-5 text-gray-500" />
                </label>
                <input
                  type="file"
                  id="file-upload"
                  ref={fileInputRef}
                  multiple
                  accept="image/*,.pdf,.doc,.docx,.txt"
                  onChange={handleFileChange}
                  className="hidden"
                />

                {/* Text Input */}
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Type your message..."
                  disabled={isSending}
                  className="flex-1 bg-transparent outline-none text-sm disabled:opacity-50"
                />
              </div>
            </div>

            {/* Send Button */}
            <button
              type="submit"
              disabled={(!newMessage.trim() && filePreviews.length === 0) || isSending}
              className="flex-shrink-0 w-12 h-12 bg-teal-500 hover:bg-teal-600 disabled:bg-gray-300 disabled:opacity-50 text-white rounded-full transition-all flex items-center justify-center shadow-lg hover:shadow-xl hover:scale-105 active:scale-95"
            >
              {isSending ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <Send className="w-5 h-5" />
              )}
            </button>
          </form>
        </div>
      )}
    </div>
  );
}