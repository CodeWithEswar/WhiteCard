export type ShareExpiryOption = 1 | 7 | 30

export type ShareLinkStatus = 'active' | 'expired' | 'revoked'

export interface ShareLinkInfo {
  token: string
  expiresAt: string
  createdAt: string
  viewCount?: number
  clickCount?: number
}
