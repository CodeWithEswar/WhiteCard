export interface BreadcrumbSegment {
  id: string
  label: string
  href?: string
  isCurrent?: boolean
}

export interface DocumentBreadcrumbMeta {
  title?: string
  space?: string
  category?: string
}

export function buildBreadcrumbs(
  pathname: string,
  searchParams: URLSearchParams,
  documentMeta?: DocumentBreadcrumbMeta
): BreadcrumbSegment[] {
  const category = searchParams.get('category')
  const view = searchParams.get('view')

  // 1. Vault Home
  if (pathname === '/app') {
    if (view === 'storage') {
      return [
        { id: 'vault', label: 'Vault', href: '/app' },
        { id: 'storage', label: 'Storage Breakdown', isCurrent: true },
      ]
    }
    return [{ id: 'vault', label: 'Vault', isCurrent: true }]
  }

  // 2. Government Space
  if (pathname.startsWith('/app/government')) {
    const crumbs: BreadcrumbSegment[] = [
      { id: 'vault', label: 'Vault', href: '/app' },
      { id: 'government', label: 'Government', href: category ? '/app/government' : undefined, isCurrent: !category },
    ]

    if (category === 'passport' || pathname.endsWith('/passports')) {
      crumbs.push({ id: 'passport', label: 'Passports & IDs', isCurrent: true })
    } else if (category === 'vehicle' || pathname.endsWith('/vehicle')) {
      crumbs.push({ id: 'vehicle', label: 'Vehicle Licences', isCurrent: true })
    } else if (category) {
      crumbs.push({ id: category, label: category.charAt(0).toUpperCase() + category.slice(1), isCurrent: true })
    }

    return crumbs
  }

  // 3. Student Space
  if (pathname.startsWith('/app/student')) {
    const crumbs: BreadcrumbSegment[] = [
      { id: 'vault', label: 'Vault', href: '/app' },
      { id: 'student', label: 'Student', href: category ? '/app/student' : undefined, isCurrent: !category },
    ]

    if (category === 'degree' || pathname.endsWith('/degrees')) {
      crumbs.push({ id: 'degree', label: 'Degree Certificates', isCurrent: true })
    } else if (category === 'transcript' || pathname.endsWith('/transcripts')) {
      crumbs.push({ id: 'transcript', label: 'Transcripts & Marks', isCurrent: true })
    } else if (category) {
      crumbs.push({ id: category, label: category.charAt(0).toUpperCase() + category.slice(1), isCurrent: true })
    }

    return crumbs
  }

  // 4. Dynamic Document Detail View
  if (pathname.startsWith('/app/document/') || pathname.startsWith('/app/documents/')) {
    const crumbs: BreadcrumbSegment[] = [{ id: 'vault', label: 'Vault', href: '/app' }]

    if (documentMeta?.space === 'government') {
      crumbs.push({ id: 'government', label: 'Government', href: '/app/government' })
      if (documentMeta.category === 'passport') {
        crumbs.push({ id: 'passport', label: 'Passports & IDs', href: '/app/government?category=passport' })
      } else if (documentMeta.category === 'vehicle') {
        crumbs.push({ id: 'vehicle', label: 'Vehicle Licences', href: '/app/government?category=vehicle' })
      }
    } else if (documentMeta?.space === 'student') {
      crumbs.push({ id: 'student', label: 'Student', href: '/app/student' })
      if (documentMeta.category === 'degree') {
        crumbs.push({ id: 'degree', label: 'Degree Certificates', href: '/app/student?category=degree' })
      } else if (documentMeta.category === 'transcript') {
        crumbs.push({ id: 'transcript', label: 'Transcripts & Marks', href: '/app/student?category=transcript' })
      }
    } else {
      crumbs.push({ id: 'documents', label: 'Documents', href: '/app' })
    }

    crumbs.push({
      id: 'document-current',
      label: documentMeta?.title || 'Document',
      isCurrent: true,
    })

    return crumbs
  }

  // 5. Cross-Space Views
  if (pathname === '/app/search') {
    return [
      { id: 'vault', label: 'Vault', href: '/app' },
      { id: 'search', label: 'Search Vault', isCurrent: true },
    ]
  }

  if (pathname === '/app/recent') {
    return [
      { id: 'vault', label: 'Vault', href: '/app' },
      { id: 'recent', label: 'Recent Documents', isCurrent: true },
    ]
  }

  if (pathname === '/app/expiring') {
    return [
      { id: 'vault', label: 'Vault', href: '/app' },
      { id: 'expiring', label: 'Expiring Soon', isCurrent: true },
    ]
  }

  if (pathname === '/app/settings') {
    return [
      { id: 'vault', label: 'Vault', href: '/app' },
      { id: 'settings', label: 'Settings', isCurrent: true },
    ]
  }

  return [{ id: 'vault', label: 'Vault', isCurrent: true }]
}
