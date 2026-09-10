import {
  Home01Icon,
  Passport01Icon,
  Certificate01Icon,
  Search01Icon,
  Alert02Icon,
  Clock01Icon,
  Settings02Icon,
  File01Icon,
} from '@hugeicons/core-free-icons'
import type { IconSvgElement } from '@hugeicons/react'

export interface RouteMetadata {
  id: string
  eyebrow: string
  title: string
  description: string
  href: string
  icon?: IconSvgElement
  maxWidth?: 'wide' | 'default' | 'reading'
  fallbackParent?: string
}

export const ROUTE_CONFIG: Record<string, RouteMetadata> = {
  dashboard: {
    id: 'dashboard',
    eyebrow: 'WHITE CARD',
    title: 'Vault Home',
    description: 'Your recent documents, spaces, and important records in one place.',
    href: '/app',
    icon: Home01Icon,
    maxWidth: 'wide',
    fallbackParent: '/app',
  },
  government: {
    id: 'government',
    eyebrow: 'VAULT SPACE',
    title: 'Government Documents',
    description: 'Keep official records, identity documents, licences, insurance, and other government-related files organized.',
    href: '/app/government',
    icon: Passport01Icon,
    maxWidth: 'wide',
    fallbackParent: '/app',
  },
  'government-passport': {
    id: 'government-passport',
    eyebrow: 'VAULT SPACE',
    title: 'Passports & IDs',
    description: 'Passports, national identification cards, visas, and verified identity records.',
    href: '/app/government?category=passport',
    icon: Passport01Icon,
    maxWidth: 'wide',
    fallbackParent: '/app/government',
  },
  'government-vehicle': {
    id: 'government-vehicle',
    eyebrow: 'VAULT SPACE',
    title: 'Vehicle Licences',
    description: 'Driving licences, registrations, insurance policies, and vehicular documentation.',
    href: '/app/government?category=vehicle',
    icon: Passport01Icon,
    maxWidth: 'wide',
    fallbackParent: '/app/government',
  },
  student: {
    id: 'student',
    eyebrow: 'VAULT SPACE',
    title: 'Student Certificates',
    description: 'Keep marksheets, certificates, transcripts, degrees, and academic records together.',
    href: '/app/student',
    icon: Certificate01Icon,
    maxWidth: 'wide',
    fallbackParent: '/app',
  },
  'student-degree': {
    id: 'student-degree',
    eyebrow: 'VAULT SPACE',
    title: 'Degree Certificates',
    description: 'Official degree awards, diplomas, and university graduation credentials.',
    href: '/app/student?category=degree',
    icon: Certificate01Icon,
    maxWidth: 'wide',
    fallbackParent: '/app/student',
  },
  'student-transcript': {
    id: 'student-transcript',
    eyebrow: 'VAULT SPACE',
    title: 'Transcripts & Marks',
    description: 'Semester marksheets, consolidated transcripts, and grade reports.',
    href: '/app/student?category=transcript',
    icon: Certificate01Icon,
    maxWidth: 'wide',
    fallbackParent: '/app/student',
  },
  search: {
    id: 'search',
    eyebrow: 'SEARCH',
    title: 'Search Vault',
    description: 'Find documents across Government and Student spaces instantaneously.',
    href: '/app/search',
    icon: Search01Icon,
    maxWidth: 'wide',
    fallbackParent: '/app',
  },
  recent: {
    id: 'recent',
    eyebrow: 'COLLECTION',
    title: 'Recent Documents',
    description: 'All documents recently added or updated in your personal vault.',
    href: '/app/recent',
    icon: Clock01Icon,
    maxWidth: 'wide',
    fallbackParent: '/app',
  },
  expiring: {
    id: 'expiring',
    eyebrow: 'COLLECTION',
    title: 'Expiring Soon',
    description: 'Documents with expiry dates approaching within your configured review window.',
    href: '/app/expiring',
    icon: Alert02Icon,
    maxWidth: 'wide',
    fallbackParent: '/app',
  },
  settings: {
    id: 'settings',
    eyebrow: 'ACCOUNT',
    title: 'Vault Settings',
    description: 'Manage your profile, appearance, themes, tags, document preferences, and account controls.',
    href: '/app/settings',
    icon: Settings02Icon,
    maxWidth: 'reading',
    fallbackParent: '/app',
  },
  document: {
    id: 'document',
    eyebrow: 'VAULT RECORD',
    title: 'Document Details',
    description: 'Secure document metadata, tags, and cryptographic verification.',
    href: '/app/document',
    icon: File01Icon,
    maxWidth: 'wide',
    fallbackParent: '/app',
  },
}
