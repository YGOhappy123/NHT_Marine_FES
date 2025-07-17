import { useEffect } from 'react'
import { Outlet } from 'react-router-dom'
import { SidebarProvider } from '@/components/ui/sidebar'
import { useIsMobile } from '@/hooks/useMobile'
import AppSidebar from '@/components/layout/AppSidebar'
import useTitle from '@/hooks/useTitle'
import MobileSidebar from '@/components/layout/MobileSidebar'

const DashboardLayout = () => {
    useTitle('NHT Marine Staff | Dashboard')
    useEffect(() => {
        window.scrollTo(0, 0)
    }, [])

    const isMobile = useIsMobile()

    return (
        <SidebarProvider>
            <AppSidebar />
            <main className="h-screen flex-1 overflow-y-auto flex flex-col">
                {isMobile && <MobileSidebar />}

                <div className="p-4 flex-1">
                    <Outlet />
                </div>
            </main>
        </SidebarProvider>
    )
}

export default DashboardLayout
