import type { DocumentSpace, DocumentFilterOptions } from '@/types/document'

export const queryKeys = {
  profile: {
    all: ['profile'] as const,
    me: (userId: string) => ['profile', 'me', userId] as const,
  },

  preferences: {
    all: ['preferences'] as const,
    me: (userId: string) => ['preferences', 'me', userId] as const,
  },

  documents: {
    all: (userId: string) => ['documents', userId] as const,
    list: (userId: string, filters?: DocumentFilterOptions) =>
      ['documents', userId, 'list', filters || {}] as const,
    space: (userId: string, space: DocumentSpace) =>
      ['documents', userId, 'space', space] as const,
    detail: (userId: string, documentId: string) =>
      ['documents', userId, 'detail', documentId] as const,
    recent: (userId: string) => ['documents', userId, 'recent'] as const,
    expiring: (userId: string) => ['documents', userId, 'expiring'] as const,
  },

  vaultStats: {
    summary: (userId: string) => ['vault-stats', userId] as const,
  },

  dashboard: {
    summary: (userId: string) => ['dashboard', userId, 'summary'] as const,
  },

  tags: {
    all: (userId: string) => ['tags', userId] as const,
  },
} as const
