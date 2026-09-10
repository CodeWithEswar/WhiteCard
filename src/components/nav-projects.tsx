import { Link } from "react-router-dom"
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

export interface NavProjectItem {
  name: string
  url: string
  icon: React.ReactNode
  badge?: number
}

export function NavProjects({
  projects,
}: {
  projects: NavProjectItem[]
}) {
  return (
    <SidebarGroup className="group-data-[collapsible=icon]:hidden">
      <SidebarGroupLabel className="text-[10.5px] uppercase font-semibold text-muted-foreground tracking-wider">
        Collections & Alerts
      </SidebarGroupLabel>
      <SidebarMenu>
        {projects.map((item) => (
          <SidebarMenuItem key={item.name}>
            <SidebarMenuButton render={<Link to={item.url} />}>
              {item.icon}
              <span>{item.name}</span>
              {item.badge !== undefined && item.badge > 0 && (
                <span className="ml-auto size-5 rounded-full bg-amber-500/15 text-amber-700 dark:text-amber-400 border border-amber-500/25 text-[10px] font-mono font-bold flex items-center justify-center">
                  {item.badge}
                </span>
              )}
            </SidebarMenuButton>
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  )
}
