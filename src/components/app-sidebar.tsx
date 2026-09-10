import * as React from "react"
import { Link } from "react-router-dom"
import { NavMain, type NavMainItem } from "@/components/nav-main"
import { NavProjects, type NavProjectItem } from "@/components/nav-projects"
import { NavSecondary, type NavSecondaryItem } from "@/components/nav-secondary"
import { NavUser } from "@/components/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  useSidebar,
} from "@/components/ui/sidebar"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  Home01Icon,
  Passport01Icon,
  Certificate01Icon,
  Search01Icon,
  Upload01Icon,
  Settings02Icon,
  Alert02Icon,
  Clock01Icon,
} from "@hugeicons/core-free-icons"
import { WhiteCardLogo } from "@/components/brand/white-card-logo"
import { useVaultStats } from "@/features/documents/hooks/use-documents"
import { useProfile } from "@/features/auth/hooks/use-profile"

interface AppSidebarProps extends React.ComponentProps<typeof Sidebar> {
  onOpenUpload?: () => void
}

export function AppSidebar({ onOpenUpload, ...props }: AppSidebarProps) {
  const { expiringCount } = useVaultStats()
  const { state } = useSidebar()
  const isCollapsed = state === "collapsed"

  const navMain: NavMainItem[] = [
    {
      title: "Vault Home",
      url: "/app",
      icon: <HugeiconsIcon icon={Home01Icon} strokeWidth={2} />,
      isActive: true,
      items: [
        { title: "Dashboard Overview", url: "/app" },
        { title: "Storage Breakdown", url: "/app" },
      ],
    },
    {
      title: "Government",
      url: "/app/government",
      icon: <HugeiconsIcon icon={Passport01Icon} strokeWidth={2} />,
      items: [
        { title: "All Government", url: "/app/government" },
        { title: "Passports & IDs", url: "/app/government" },
        { title: "Vehicle Licences", url: "/app/government" },
      ],
    },
    {
      title: "Student",
      url: "/app/student",
      icon: <HugeiconsIcon icon={Certificate01Icon} strokeWidth={2} />,
      items: [
        { title: "All Certificates", url: "/app/student" },
        { title: "Degree Certificates", url: "/app/student" },
        { title: "Transcripts & Marks", url: "/app/student" },
      ],
    },
    {
      title: "Search Vault",
      url: "/app/search",
      icon: <HugeiconsIcon icon={Search01Icon} strokeWidth={2} />,
    },
  ]

  const collections: NavProjectItem[] = [
    {
      name: "Government Documents",
      url: "/app/government",
      icon: <HugeiconsIcon icon={Passport01Icon} strokeWidth={2} />,
    },
    {
      name: "Student Certificates",
      url: "/app/student",
      icon: <HugeiconsIcon icon={Certificate01Icon} strokeWidth={2} />,
    },
    {
      name: "Expiring Soon",
      url: "/app/government?filter=expiring",
      icon: <HugeiconsIcon icon={Alert02Icon} strokeWidth={2} />,
      badge: expiringCount,
    },
  ]

  const navSecondary: NavSecondaryItem[] = [
    {
      title: "Quick Upload",
      icon: <HugeiconsIcon icon={Upload01Icon} strokeWidth={2} />,
      onClick: onOpenUpload,
    },
    {
      title: "Settings & 10 Themes",
      url: "/app/settings",
      icon: <HugeiconsIcon icon={Settings02Icon} strokeWidth={2} />,
    },
  ]

  const { profile } = useProfile()
  const currentUser = profile || {
    name: "Personal Vault",
    email: "Private Account",
  }

  return (
    <Sidebar collapsible="icon" variant="sidebar" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              size="lg"
              tooltip="White Card Vault"
              className={isCollapsed ? "justify-center" : ""}
              render={<Link to="/" />}
            >
              <WhiteCardLogo
                size={isCollapsed ? 20 : 28}
                showWordmark={!isCollapsed}
              />
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <NavMain items={navMain} />
        <NavProjects projects={collections} />
        <NavSecondary items={navSecondary} className="mt-auto" />
      </SidebarContent>

      <SidebarFooter>
        <NavUser user={currentUser} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
