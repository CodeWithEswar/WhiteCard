export function isParentRouteActive(
  href: string,
  pathname: string,
  search: string = ''
): boolean {
  if (href === '/app') {
    return pathname === '/app' || pathname === '/app/' || pathname === '/app/recent'
  }

  if (href === '/app/government') {
    return pathname.startsWith('/app/government')
  }

  if (href === '/app/student') {
    return pathname.startsWith('/app/student')
  }

  if (href === '/app/search') {
    return pathname === '/app/search'
  }

  if (href === '/app/expiring') {
    return pathname === '/app/expiring' || search.includes('filter=expiring')
  }

  if (href === '/app/settings') {
    return pathname === '/app/settings'
  }

  return pathname === href
}

export function isChildRouteActive(
  child: { href: string; category?: string; view?: string },
  pathname: string,
  searchParams: URLSearchParams
): boolean {
  const currentCategory = searchParams.get('category')
  const currentView = searchParams.get('view')

  if (child.view) {
    return pathname === '/app' && currentView === child.view
  }

  if (child.category) {
    return currentCategory === child.category
  }

  // Base child route (e.g. All Government, All Certificates, Dashboard Overview)
  if (child.href === '/app') {
    return pathname === '/app' && !currentView
  }

  if (child.href === '/app/government') {
    return pathname === '/app/government' && !currentCategory
  }

  if (child.href === '/app/student') {
    return pathname === '/app/student' && !currentCategory
  }

  return pathname === child.href
}
