import type { Notification } from '@/types';

// TODO: Replace with API notifications endpoint when available
export const mockNotifications: Notification[] = [
  {
    id: 'n1',
    type: 'like',
    fromUser: {
      id: 'u2',
      name: 'Maria Silva',
      avatarUrl: 'https://i.pravatar.cc/100?u=maria',
    },
    postId: '1',
    message: 'curtiu sua publicação',
    createdAt: '2026-02-16T10:30:00Z',
    isRead: false,
  },
  {
    id: 'n2',
    type: 'comment',
    fromUser: {
      id: 'u3',
      name: 'João Pedro',
      avatarUrl: 'https://i.pravatar.cc/100?u=joao',
    },
    postId: '2',
    message: 'comentou: "Artigo incrível!"',
    createdAt: '2026-02-16T09:15:00Z',
    isRead: false,
  },
  {
    id: 'n3',
    type: 'follow',
    fromUser: {
      id: 'u4',
      name: 'Ana Costa',
      avatarUrl: 'https://i.pravatar.cc/100?u=ana',
    },
    message: 'começou a seguir você',
    createdAt: '2026-02-16T08:00:00Z',
    isRead: true,
  },
  {
    id: 'n4',
    type: 'like',
    fromUser: {
      id: 'u5',
      name: 'Carlos Mendes',
      avatarUrl: 'https://i.pravatar.cc/100?u=carlos',
    },
    postId: '6',
    message: 'curtiu sua publicação',
    createdAt: '2026-02-15T22:00:00Z',
    isRead: true,
  },
  {
    id: 'n5',
    type: 'mention',
    fromUser: {
      id: 'u6',
      name: 'Beatriz Lima',
      avatarUrl: 'https://i.pravatar.cc/100?u=beatriz',
    },
    postId: '4',
    message: 'mencionou você em um comentário',
    createdAt: '2026-02-15T18:30:00Z',
    isRead: true,
  },
];
