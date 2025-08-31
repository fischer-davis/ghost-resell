import { Link, useRouterState } from "@tanstack/react-router";
import { Home, Shield, User } from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

const settingsNavItems = [
  {
    title: "Account",
    items: [
      {
        title: "Profile",
        href: "/settings/profile",
        icon: User,
        description: "Manage your profile information",
      },
      {
        title: "Security",
        href: "/settings/security",
        icon: Shield,
        description: "Password and security settings",
      },
    ],
  },
];

const tabs = [
  {
    title: "Home",
    href: "/dashboard",
    icon: Home,
  },
];

export function NavSidebar() {
  const router = useRouterState();
  const currentPath = router.location.pathname;

  const isActiveRoute = (href: string) => {
    return currentPath === href || currentPath.startsWith(`${href}/`);
  };

  return (
    <Sidebar className="border-r">
      <SidebarHeader className="px-6 py-4">
        <Link to="/">
          <h2 className="font-semibold text-lg">Ghost-Drop</h2>
        </Link>
      </SidebarHeader>

      <SidebarContent className="px-4 py-8">
        <SidebarGroupContent>
          <SidebarMenu>
            {tabs.map((tab) => (
              <SidebarMenuItem key={tab.title}>
                <SidebarMenuButton asChild className="w-full justify-start">
                  <Link
                    className="flex items-center gap-3 rounded-md px-4 py-3 font-medium text-sm transition-colors"
                    to={tab.href}
                  >
                    <tab.icon className="h-4 w-4"/>
                    <div className="flex flex-col items-start">
                      <span>{tab.title}</span>
                    </div>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroupContent>
        {settingsNavItems.map((section) => (
          <SidebarGroup key={section.title}>
            <SidebarGroupLabel className="mb-2 font-medium text-muted-foreground text-xs uppercase tracking-wider">
              {section.title}
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {section.items.map((item) => (
                  <SidebarMenuItem key={item.href}>
                    <SidebarMenuButton
                      asChild
                      className="w-full justify-start"
                      isActive={isActiveRoute(item.href)}
                    >
                      <Link
                        className="flex items-center gap-3 rounded-md px-3 py-2 font-medium text-sm transition-colors"
                        to={item.href}
                      >
                        <item.icon className="h-4 w-4"/>
                        <div className="flex flex-col items-start">
                          <span>{item.title}</span>
                        </div>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>
    </Sidebar>
  );
}
