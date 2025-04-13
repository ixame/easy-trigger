"use client"

import * as React from "react"
import {
    LayoutDashboardIcon,
    LayoutList,
    Moon,
    History,
    Sun,
} from "lucide-react"

// import {NavMain} from "@/components/nav-main"
// import {NavSecondary} from "@/components/nav-secondary"
// import {NavUser} from "@/components/nav-user"
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from "@/components/ui/sidebar"
import { Button } from "./ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem } from "./ui/dropdown-menu"
import { DropdownMenuTrigger } from "@radix-ui/react-dropdown-menu"
import { useTheme } from "@/components/theme-provider"
import { IconLayoutSidebarRightCollapse } from "@tabler/icons-react"

const data = {
    // navDashboard: [{
    //     title: "Dashboard",
    //     url: "/",
    //     icon: LayoutDashboardIcon,
    // },],
    navTrigger: [
        {
            title: "Jobs",
            url: "/",
            icon: LayoutList,
        },
        {
            title: "Run History",
            url: "/triggers/history",
            icon: History,
        },
    ],
    // navNotifications: [
    //     {
    //         title: "Channel",
    //         url: "/notifications/channels",
    //         icon: LayoutDashboardIcon,
    //     }
    // ],
    // navSetting: [
    //     {
    //         title: "Settings",
    //         url: "/settings",
    //         icon: SettingsIcon,
    //     },
    // ],
}


const title = {
    navDashboard: "Dashboard",
    navTrigger: "Triggers",
    navNotifications: "Notifications",
    navSetting: "Settings",
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {

    const { setTheme } = useTheme()
    return (
        <Sidebar collapsible="offcanvas" {...props}>
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton
                            asChild
                            className="data-[slot=sidebar-menu-button]:!p-1.5"
                        >
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>
            <SidebarContent>



                {
                    Object.keys(data).map((key) => {
                        const item = data[key as keyof typeof data]
                        return (
                            <SidebarGroup key={key}>

                                <SidebarGroupLabel className="text-lg font-semibold tracking-tight">
                                    {title[key as keyof typeof title]}
                                </SidebarGroupLabel>
                                <SidebarGroupContent className="flex flex-col gap-2">
                                    <SidebarMenu key={key}>
                                        {item.map((item) => (
                                            <SidebarMenuItem key={item.title}>
                                                <SidebarMenuButton asChild isActive={(item.url === window.location.pathname)}>
                                                    <a href={item.url}>
                                                        {item.icon && <item.icon className="mr-2" />}
                                                        <span className={''}>{item.title}</span>
                                                    </a>
                                                </SidebarMenuButton>

                                            </SidebarMenuItem>
                                        ))}
                                    </SidebarMenu>
                                </SidebarGroupContent>
                            </SidebarGroup>
                        )
                    })
                }





            </SidebarContent>
            <SidebarFooter>
                {/*<NavUser user={data.user}/>*/}
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="outline" size="icon">
                            <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                            <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                            <span className="sr-only">Toggle theme</span>
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => setTheme("light")}>
                            Light
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setTheme("dark")}>
                            Dark
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setTheme("system")}>
                            System
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </SidebarFooter>
        </Sidebar>
    )
}
