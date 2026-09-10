export interface BreadcrumbItem {
  label: string
  href?: string
}

export function getPageTitle(pathname: string, searchParams: URLSearchParams): string {
  const category = searchParams.get('category')
  const view = searchParams.get('view')

  if (pathname === '/app') {
    if (view === 'storage') return 'Storage Breakdown'
    return 'Vault Home'
  }

  if (pathname.startsWith('/app/government')) {
    if (category === 'passport' || pathname.endsWith('/passports')) return 'Passports & IDs'
    if (category === 'vehicle' || pathname.endsWith('/vehicle')) return 'Vehicle Licences'
    return 'Government Documents'
  }

  if (pathname.startsWith('/app/student')) {
    if (category === 'degree' || pathname.endsWith('/degrees')) return 'Degree Certificates'
    if (category === 'transcript' || pathname.endsWith('/transcripts')) return 'Transcripts & Marks'
    return 'Student Certificates'
  }

  if (pathname === '/app/search') return 'Search Vault'
  if (pathname === '/app/expiring') return 'Expiring Soon'
  if (pathname === '/app/recent') return 'Recent Documents'
  if (pathname === '/app/settings') return 'Vault Settings'

  if (pathname.startsWith('/app/document/') || pathname.startsWith('/app/documents/')) {
    return 'Document Details'
  }

  return 'White Card Vault'
}

export function getBreadcrumbs(
  pathname: string,
  searchParams: URLSearchParams,
  documentTitle?: string
): BreadcrumbItem[] {
  const breadcrumbs: BreadcrumbItem[] = [{ label: 'Vault', href: '/app' }]

  const category = searchParams.get('category')

  if (pathname.startsWith('/app/government')) {
    breadcrumbs.push({ label: 'Government', href: '/app/government' })
    if (category === 'passport' || pathname.endsWith('/passports')) {
      breadcrumbs.push({ label: 'Passports & IDs' })
    } else if (category === 'vehicle' || pathname.endsWith('/vehicle')) {
      breadcrumbs.push({ label: 'Vehicle Licences' })
    }
    return breadcrumbs
  }

  if (pathname.startsWith('/app/student')) {
    breadcrumbs.push({ label: 'Student', href: '/app/student' })
    if (category === 'degree' || pathname.endsWith('/degrees')) {
      breadcrumbs.push({ label: 'Degree Certificates' })
    } else if (category === 'transcript' || pathname.endsWith('/transcripts')) {
      breadcrumbs.push({ label: 'Transcripts & Marks' })
    }
    return breadcrumbs
  }

  if (pathname.startsWith('/app/document/') || pathname.startsWith('/app/documents/')) {
    breadcrumbs.push({ label: 'Documents', href: '/app' })
    breadcrumbs.push({ label: documentTitle || 'Document Details' })
    return breadcrumbs
  }

  if (pathname === '/app/expiring') {
    breadcrumbs.push({ label: 'Expiring Soon' })
    return breadcrumbs
  }

  if (pathname === '/app/search') {
    breadcrumbs.push({ label: 'Search' })
    return breadcrumbs
  }

  if (pathname === '/app/settings') {
    breadcrumbs.push({ label: 'Settings' })
    return breadcrumbs
  }

  return []
}
