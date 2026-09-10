import { useState, useEffect } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { DesktopSidebar } from './desktop-sidebar'
import { TabletRail } from './tablet-rail'
import { MobileTopbar } from './mobile-topbar'
import { AppTopbar } from './app-topbar'
import { UploadDialog } from '../../features/upload/components/upload-dialog'
import { CommandMenu } from './command-menu'
import { AppThemeBackground } from '../backgrounds/app-theme-background'

import { useOnlineStatus } from '@/hooks/use-online-status'

export function AppShell() {
  const [uploadOpen, setUploadOpen] = useState(false)
  const [isViewerFocus, setIsViewerFocus] = useState(false)
  const isOnline = useOnlineStatus()
  const location = useLocation()
  const isDocumentViewer =
    location.pathname.startsWith('/app/document/') ||
    location.pathname.startsWith('/app/documents/')

  // Listen for document viewer focus mode events
  useEffect(() => {
    const handleFocusEvent = (e: CustomEvent<boolean>) => {
      setIsViewerFocus(Boolean(e.detail))
    }
    window.addEventListener('viewer-focus-mode' as any, handleFocusEvent)
    return () => {
      window.removeEventListener('viewer-focus-mode' as any, handleFocusEvent)
    }
  }, [])

  // Reset focus state if navigating away from viewer
  useEffect(() => {
    if (!isDocumentViewer && isViewerFocus) {
      setIsViewerFocus(false)
    }
  }, [isDocumentViewer, isViewerFocus])

  return (
    <div className="relative flex min-h-screen w-full bg-transparent text-foreground">
      {/* Dynamic Theme-Aware Architectural Background (No grid pattern for app shell) */}
      <AppThemeBackground variant="app" grid={false} />

      {/* 1. Desktop Sidebar (>= 1024px) */}
      {!isViewerFocus && (
        <div className="hidden lg:flex shrink-0 z-30">
          <DesktopSidebar onOpenUpload={() => setUploadOpen(true)} />
        </div>
      )}

      {/* 2. Tablet Compact Rail (768px - 1023px) */}
      {!isViewerFocus && (
        <div className="hidden md:flex lg:hidden shrink-0 z-30">
          <TabletRail onOpenUpload={() => setUploadOpen(true)} />
        </div>
      )}

      {/* Main Content Column */}
      <div className="flex-1 flex flex-col min-w-0 z-10">
        {/* Offline notification banner (Prompt #66 & #67) */}
        {!isOnline && (
          <div
            role="status"
            aria-live="polite"
            className="bg-amber-500/10 border-b border-amber-500/20 px-4 py-1.5 text-center text-xs font-medium text-amber-800 dark:text-amber-300 flex items-center justify-center gap-2 select-none"
          >
            <span className="size-2 rounded-full bg-amber-500 animate-pulse shrink-0" />
            <span>You're offline. Showing your last loaded data.</span>
          </div>
        )}

        {/* 3. Mobile Topbar (< 768px) */}
        {!isDocumentViewer && (
          <div className="block md:hidden sticky top-0 z-20">
            <MobileTopbar onOpenUpload={() => setUploadOpen(true)} />
          </div>
        )}

        {/* 4. Desktop & Tablet Top Command Bar (>= 768px) */}
        {!isDocumentViewer && (
          <div className="hidden md:block sticky top-0 z-20">
            <AppTopbar onOpenUpload={() => setUploadOpen(true)} />
          </div>
        )}

        {/* Dynamic Page Content Canvas */}
        <main className="flex-1 min-w-0 w-full">
          <Outlet />
        </main>
      </div>

      {/* Global Responsive Upload Modal */}
      <UploadDialog open={uploadOpen} onOpenChange={setUploadOpen} />

      {/* Global ⌘K / Ctrl K Command Palette */}
      <CommandMenu onOpenUpload={() => setUploadOpen(true)} />
    </div>
  )
}
