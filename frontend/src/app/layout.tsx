import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import { Outlet } from "react-router-dom"
import { SiteHeader } from "@/components/site-header"
 
export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <SiteHeader />
        <div className="flex flex-1 flex-col">

          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
            {children ?? <Outlet />}
            </div>
          </div>
        </div>
      </SidebarInset>
  
      {/* <main
        id='content'
        className={`overflow-x-hidden pt-16 transition-[margin] md:overflow-y-hidden md:pt-0  h-full`}
      >
        <div className={`relative w-full h-16 overflow-hidden`}>
          <LayoutHeader
            className='fixed w-full h-16 z-10 border-b md:top-0 lg:top-0 right-0 sm:top-20 bg-background'>
  
            <div className='ml-auto flex items-center space-x-4'>
              <Notice/>
              <Language/>
              <ThemeToggle/>
              <UserNav/>
            </div>
          </LayoutHeader>
        </div>
        <LayoutBody className='flex flex-col'>
          <div className='flex-1 md:m-auto lg:m-auto lg:flex-row space-y-5 md:w-10/12 lg:w-10/12'>
            <Outlet/>
          </div>
        </LayoutBody>
      </main> */}
    </SidebarProvider>
  )
}