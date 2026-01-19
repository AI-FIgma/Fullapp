// Notification store for real-time notifications
export type Notification = {
  id: string;
  type: 'like' | 'comment' | 'follow' | 'mention' | 'report' | 'achievement' | 'admin' | 'support';
  message: string;
  timestamp: Date;
  read: boolean;
  postId?: string;
  userId?: string;
  avatar?: string;
  ticketId?: string;
};

type NotificationListener = (notification: Notification) => void;

export class NotificationStore {
  private listeners: NotificationListener[] = [];

  subscribe(listener: NotificationListener): () => void {
    this.listeners.push(listener);
    
    // Return unsubscribe function
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  notify(notification: Notification) {
    this.listeners.forEach(listener => listener(notification));
  }

  // Helper method to create and send notification
  sendNotification(
    type: Notification['type'],
    message: string,
    options?: Partial<Omit<Notification, 'id' | 'type' | 'message' | 'timestamp' | 'read'>>
  ) {
    const notification: Notification = {
      id: `notif-${Date.now()}`,
      type,
      message,
      timestamp: new Date(),
      read: false,
      ...options
    };
    
    this.notify(notification);
  }
}

export const notificationStore = new NotificationStore();