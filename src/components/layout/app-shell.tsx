import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import { DesktopSidebar } from './desktop-sidebar'
import { TabletRail } from './tablet-rail'
import { MobileTopbar } from './mobile-topbar'
import { AppTopbar } from './app-topbar'
import { UploadDialog } from '../../features/upload/components/upload-dialog'
import { CommandMenu } from './command-menu'
import { GridBackground } from '../backgrounds/grid-background'

import { useOnlineStatus } from '@/hooks/use-online-status'

export function AppShell() {
  const [uploadOpen, setUploadOpen] = useState(false)
  const isOnline = useOnlineStatus()

  return (
    <div className="relative flex min-h-screen w-full bg-background text-foreground">
      {/* Background Architectural Grid */}
      <GridBackground
        mask="radial"
        className="fixed inset-0 pointer-events-none opacity-40 z-0"
      />

      {/* 1. Desktop Sidebar (>= 1024px) */}
      <div className="hidden lg:flex shrink-0 z-30">
        <DesktopSidebar onOpenUpload={() => setUploadOpen(true)} />
      </div>

      {/* 2. Tablet Compact Rail (768px - 1023px) */}
      <div className="hidden md:flex lg:hidden shrink-0 z-30">
        <TabletRail onOpenUpload={() => setUploadOpen(true)} />
      </div>

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
        <div className="block md:hidden sticky top-0 z-20">
          <MobileTopbar onOpenUpload={() => setUploadOpen(true)} />
        </div>

        {/* 4. Desktop & Tablet Top Command Bar (>= 768px) */}
        <div className="hidden md:block sticky top-0 z-20">
          <AppTopbar onOpenUpload={() => setUploadOpen(true)} />
        </div>

        {/* Dynamic Page Content Canvas */}
        <main className="flex-1 min-w-0 w-full max-w-[1480px] mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 pb-8 md:pb-12">
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
