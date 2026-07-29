import { useState, useEffect } from 'react';

export interface StudioNotification {
  id: string;
  title: string;
  body: string;
  category: 'build' | 'inquiry' | 'insight' | 'system';
  timestamp: string;
  read: boolean;
  link?: string;
}

const NOTIFICATIONS_KEY = 'byte_brothers_notifications';
const PUSH_ENABLED_KEY = 'byte_brothers_push_enabled';

const INITIAL_NOTIFICATIONS: StudioNotification[] = [
  {
    id: 'n1',
    title: 'v4.0.2 Architecture Deployed',
    body: 'Production deployment completed with sub-20ms V8 execution latency.',
    category: 'build',
    timestamp: '10 min ago',
    read: false
  },
  {
    id: 'n2',
    title: 'New Client Inquiry Received',
    body: 'Inquiry for custom logistics platform queued for Hamid & Syed review.',
    category: 'inquiry',
    timestamp: '1 hour ago',
    read: false
  },
  {
    id: 'n3',
    title: 'Offline Cache Engine Active',
    body: 'Studio assets and project blueprints cached for offline accessibility.',
    category: 'system',
    timestamp: '2 hours ago',
    read: true
  }
];

export function useNotifications() {
  const [notifications, setNotifications] = useState<StudioNotification[]>(() => {
    try {
      const raw = localStorage.getItem(NOTIFICATIONS_KEY);
      return raw ? JSON.parse(raw) : INITIAL_NOTIFICATIONS;
    } catch {
      return INITIAL_NOTIFICATIONS;
    }
  });

  const [pushEnabled, setPushEnabled] = useState<boolean>(() => {
    try {
      return localStorage.getItem(PUSH_ENABLED_KEY) === 'true';
    } catch {
      return false;
    }
  });

  const [permissionStatus, setPermissionStatus] = useState<NotificationPermission>(
    typeof window !== 'undefined' && 'Notification' in window ? Notification.permission : 'default'
  );

  useEffect(() => {
    localStorage.setItem(NOTIFICATIONS_KEY, JSON.stringify(notifications));
  }, [notifications]);

  useEffect(() => {
    localStorage.setItem(PUSH_ENABLED_KEY, String(pushEnabled));
  }, [pushEnabled]);

  const requestPermission = async (): Promise<boolean> => {
    if (typeof window === 'undefined' || !('Notification' in window)) {
      alert('Browser notifications are not supported in this environment.');
      return false;
    }

    try {
      const perm = await Notification.requestPermission();
      setPermissionStatus(perm);
      if (perm === 'granted') {
        setPushEnabled(true);
        triggerPushAlert(
          'Push Notifications Active',
          'You will now receive real-time studio build updates & project status alerts!'
        );
        return true;
      }
    } catch (e) {
      console.warn('Notification permission error:', e);
    }
    return false;
  };

  const togglePushNotifications = async () => {
    if (!pushEnabled) {
      if (permissionStatus === 'granted') {
        setPushEnabled(true);
      } else {
        await requestPermission();
      }
    } else {
      setPushEnabled(false);
    }
  };

  const addNotification = (item: Omit<StudioNotification, 'id' | 'timestamp' | 'read'>) => {
    const newNotif: StudioNotification = {
      ...item,
      id: `notif_${Date.now()}`,
      timestamp: 'Just now',
      read: false
    };

    setNotifications((prev) => [newNotif, ...prev]);

    if (pushEnabled && typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'granted') {
      try {
        new Notification(item.title, {
          body: item.body,
          icon: '/icon.png'
        });
      } catch (err) {
        console.warn('Native notification spawn failed:', err);
      }
    }
  };

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const clearNotification = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  const triggerPushAlert = (title: string, body: string, category: StudioNotification['category'] = 'system') => {
    addNotification({ title, body, category });
  };

  return {
    notifications,
    pushEnabled,
    permissionStatus,
    unreadCount: notifications.filter((n) => !n.read).length,
    requestPermission,
    togglePushNotifications,
    addNotification,
    markAllAsRead,
    clearNotification,
    triggerPushAlert
  };
}
