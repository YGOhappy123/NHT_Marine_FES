import { useLocation } from 'react-router-dom'
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator
} from '@/components/ui/breadcrumb'
import { Separator } from '@/components/ui/separator'
import { SidebarTrigger } from '@/components/ui/sidebar'
import { sidebarGroups } from '@/configs/sidebarGroups'
import { useIsMobile } from '@/hooks/useMobile'
import ThemeToggler from '@/components/common/ThemeToggler'

const PageBreadcrumb = () => {
    const { pathname } = useLocation()
    const isMobile = useIsMobile()

    const matchingGroup = sidebarGroups.find((group) =>
        group.items.some((item) => item.url === pathname || item.children?.some((child) => child.url === pathname))
    )
    const matchingItem = matchingGroup?.items.find(
        (item) => item.url === pathname || item.children?.some((child) => child.url === pathname)
    )
    const matchingChild =
        matchingItem?.children?.length &&
        matchingItem.children.length > 0 &&
        matchingItem.children.find((child) => child.url === pathname)

    return (
        <div className="flex h-16 shrink-0 items-center justify-between gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
            <div className="flex items-center gap-2">
                {!isMobile && (
                    <>
                        <SidebarTrigger className="-ml-1" />
                        <Separator orientation="vertical" className="mr-2 data-[orientation=vertical]:h-4" />
                    </>
                )}
                <Breadcrumb>
                    <BreadcrumbList>
                        <BreadcrumbItem className="hidden md:block">
                            <BreadcrumbLink>{matchingGroup?.title}</BreadcrumbLink>
                        </BreadcrumbItem>
                        <BreadcrumbSeparator className="hidden md:block" />

                        {matchingChild ? (
                            <>
                                <BreadcrumbItem className="hidden md:block">
                                    <BreadcrumbLink>{matchingItem.title}</BreadcrumbLink>
                                </BreadcrumbItem>
                                <BreadcrumbSeparator className="hidden md:block" />
                                <BreadcrumbItem>
                                    <BreadcrumbPage>{matchingChild.title}</BreadcrumbPage>
                                </BreadcrumbItem>
                            </>
                        ) : (
                            <BreadcrumbItem>
                                <BreadcrumbPage>{matchingItem?.title}</BreadcrumbPage>
                            </BreadcrumbItem>
                        )}
                    </BreadcrumbList>
                </Breadcrumb>
            </div>

            {!isMobile && <ThemeToggler />}
        </div>
    )
}

export default PageBreadcrumb
