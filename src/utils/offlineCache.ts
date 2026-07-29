import { useState, useEffect } from 'react';

export interface PendingInquiry {
  id: string;
  fullName: string;
  email: string;
  whatsapp: string;
  projectType: string;
  budget: string;
  referral: string;
  details: string;
  timestamp: number;
}

const INQUIRY_QUEUE_KEY = 'byte_brothers_pending_inquiries';
const BOOKMARKS_KEY = 'byte_brothers_bookmarked_projects';

export function registerServiceWorker() {
  if ('serviceWorker' in navigator && process.env.NODE_ENV === 'production') {
    window.addEventListener('load', () => {
      navigator.serviceWorker
        .register('/sw.js')
        .then((reg) => {
          console.log('[SW] Registered successfully:', reg.scope);
        })
        .catch((err) => {
          console.warn('[SW] Registration failed:', err);
        });
    });
  }
}

export function useOnlineStatus() {
  const [isOnline, setIsOnline] = useState<boolean>(
    typeof navigator !== 'undefined' ? navigator.onLine : true
  );

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return isOnline;
}

export function savePendingInquiry(inquiry: Omit<PendingInquiry, 'id' | 'timestamp'>): PendingInquiry {
  const pending: PendingInquiry = {
    ...inquiry,
    id: `inq_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
    timestamp: Date.now()
  };

  const existing = getPendingInquiries();
  existing.push(pending);
  localStorage.setItem(INQUIRY_QUEUE_KEY, JSON.stringify(existing));
  return pending;
}

export function getPendingInquiries(): PendingInquiry[] {
  try {
    const raw = localStorage.getItem(INQUIRY_QUEUE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function clearPendingInquiry(id: string) {
  const existing = getPendingInquiries().filter((i) => i.id !== id);
  localStorage.setItem(INQUIRY_QUEUE_KEY, JSON.stringify(existing));
}

export async function syncPendingInquiries(): Promise<number> {
  const pending = getPendingInquiries();
  if (pending.length === 0) return 0;

  let syncedCount = 0;
  for (const inquiry of pending) {
    try {
      const res = await fetch('/api/inquiry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(inquiry)
      });
      if (res.ok) {
        clearPendingInquiry(inquiry.id);
        syncedCount++;
      }
    } catch (e) {
      console.warn('Failed to sync offline inquiry:', e);
    }
  }
  return syncedCount;
}

export function toggleBookmarkProject(projectId: string): string[] {
  try {
    const raw = localStorage.getItem(BOOKMARKS_KEY);
    const bookmarks: string[] = raw ? JSON.parse(raw) : [];
    const index = bookmarks.indexOf(projectId);
    if (index >= 0) {
      bookmarks.splice(index, 1);
    } else {
      bookmarks.push(projectId);
    }
    localStorage.setItem(BOOKMARKS_KEY, JSON.stringify(bookmarks));
    return bookmarks;
  } catch {
    return [];
  }
}

export function getBookmarkedProjects(): string[] {
  try {
    const raw = localStorage.getItem(BOOKMARKS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}
