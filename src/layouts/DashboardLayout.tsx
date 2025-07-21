import { Outlet } from 'react-router-dom'
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar'
import { useIsMobile } from '@/hooks/useMobile'
import AppSidebar from '@/components/layout/AppSidebar'
import MobileSidebar from '@/components/layout/MobileSidebar'
import PageBreadcrumb from '@/components/common/PageBreadcrumb'

const DashboardLayout = () => {
    const isMobile = useIsMobile()

    return (
        <SidebarProvider>
            <AppSidebar />
            <SidebarInset>
                {isMobile && <MobileSidebar />}

                <div className="flex flex-1 flex-col px-4">
                    <PageBreadcrumb />
                    <Outlet />
                </div>
            </SidebarInset>
        </SidebarProvider>
    )
}

export default DashboardLayout
