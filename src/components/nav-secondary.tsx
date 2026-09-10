import * as React from "react"
import { Link } from "react-router-dom"
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"

export interface NavSecondaryItem {
  title: string
  url?: string
  icon: React.ReactNode
  onClick?: () => void
}

export function NavSecondary({
  items,
  ...props
}: {
  items: NavSecondaryItem[]
} & React.ComponentPropsWithoutRef<typeof SidebarGroup>) {
  const { state } = useSidebar()
  const isCollapsed = state === "collapsed"

  return (
    <SidebarGroup {...props}>
      <SidebarGroupContent>
        <SidebarMenu>
          {items.map((item) => (
            <SidebarMenuItem key={item.title}>
              {item.onClick ? (
                <SidebarMenuButton
                  size="default"
                  tooltip={item.title}
                  onClick={item.onClick}
                  className={isCollapsed ? "justify-center" : ""}
                >
                  {item.icon}
                  {!isCollapsed && <span>{item.title}</span>}
                </SidebarMenuButton>
              ) : item.url ? (
                <SidebarMenuButton
                  size="default"
                  tooltip={item.title}
                  render={<Link to={item.url} />}
                  className={isCollapsed ? "justify-center" : ""}
                >
                  {item.icon}
                  {!isCollapsed && <span>{item.title}</span>}
                </SidebarMenuButton>
              ) : (
                <SidebarMenuButton
                  size="default"
                  tooltip={item.title}
                  className={isCollapsed ? "justify-center" : ""}
                >
                  {item.icon}
                  {!isCollapsed && <span>{item.title}</span>}
                </SidebarMenuButton>
              )}
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  )
}
