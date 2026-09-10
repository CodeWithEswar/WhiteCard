import {
  Home01Icon,
  Passport01Icon,
  Certificate01Icon,
  Search01Icon,
  Alert02Icon,
  Upload01Icon,
  Settings02Icon,
} from '@hugeicons/core-free-icons'
import type { IconSvgElement } from '@hugeicons/react'

export interface NavigationChildItem {
  id: string
  label: string
  href: string
  category?: string
  view?: string
}

export interface NavigationItem {
  id: string
  label: string
  href: string
  icon: IconSvgElement
  children?: NavigationChildItem[]
  badgeKey?: 'expiring'
  isAction?: boolean
  actionId?: string
}

export interface NavigationGroup {
  id: string
  label: string
  items: NavigationItem[]
}

export const NAVIGATION_CONFIG: NavigationGroup[] = [
  {
    id: 'vault-spaces',
    label: 'VAULT SPACES',
    items: [
      {
        id: 'home',
        label: 'Vault Home',
        href: '/app',
        icon: Home01Icon,
        children: [
          {
            id: 'dashboard-overview',
            label: 'Dashboard Overview',
            href: '/app',
          },
          {
            id: 'storage-breakdown',
            label: 'Storage Breakdown',
            href: '/app/storage',
          },
        ],
      },
      {
        id: 'government',
        label: 'Government',
        href: '/app/government',
        icon: Passport01Icon,
        children: [
          {
            id: 'all-government',
            label: 'All Government',
            href: '/app/government',
          },
          {
            id: 'passports-ids',
            label: 'Passports & IDs',
            href: '/app/government?category=passport',
            category: 'passport',
          },
          {
            id: 'vehicle-licences',
            label: 'Vehicle Licences',
            href: '/app/government?category=vehicle',
            category: 'vehicle',
          },
        ],
      },
      {
        id: 'student',
        label: 'Student',
        href: '/app/student',
        icon: Certificate01Icon,
        children: [
          {
            id: 'all-certificates',
            label: 'All Certificates',
            href: '/app/student',
          },
          {
            id: 'degree-certificates',
            label: 'Degree Certificates',
            href: '/app/student?category=degree',
            category: 'degree',
          },
          {
            id: 'transcripts-marks',
            label: 'Transcripts & Marks',
            href: '/app/student?category=transcript',
            category: 'transcript',
          },
        ],
      },
      {
        id: 'search',
        label: 'Search Vault',
        href: '/app/search',
        icon: Search01Icon,
      },
    ],
  },
  {
    id: 'collections-alerts',
    label: 'COLLECTIONS & ALERTS',
    items: [
      {
        id: 'collection-government',
        label: 'Government Documents',
        href: '/app/government',
        icon: Passport01Icon,
      },
      {
        id: 'collection-student',
        label: 'Student Certificates',
        href: '/app/student',
        icon: Certificate01Icon,
      },
      {
        id: 'collection-expiring',
        label: 'Expiring Soon',
        href: '/app/expiring',
        icon: Alert02Icon,
        badgeKey: 'expiring',
      },
      {
        id: 'action-upload',
        label: 'Quick Upload',
        href: '#',
        icon: Upload01Icon,
        isAction: true,
        actionId: 'upload',
      },
    ],
  },
]

export const MOBILE_PRIMARY_TABS = [
  { id: 'home', label: 'Home', href: '/app', icon: Home01Icon },
  { id: 'government', label: 'Government', href: '/app/government', icon: Passport01Icon },
  { id: 'student', label: 'Student', href: '/app/student', icon: Certificate01Icon },
  { id: 'search', label: 'Search', href: '/app/search', icon: Search01Icon },
]

export const BOTTOM_UTILITIES = [
  {
    id: 'settings',
    label: 'Settings & 10 Themes',
    href: '/app/settings',
    icon: Settings02Icon,
  },
]
