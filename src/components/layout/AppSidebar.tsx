import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { ChevronRight } from 'lucide-react'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'
import {
    Sidebar,
    SidebarTrigger,
    SidebarHeader,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuItem,
    SidebarMenuButton,
    SidebarMenuSub,
    SidebarMenuSubItem,
    SidebarMenuSubButton
} from '@/components/ui/sidebar'
import { sidebarGroups, SidebarGroupData } from '@/configs/sidebarGroups'
import { RootState } from '@/store'
import SidebarUserButton from '@/components/common/SidebarUserButton'
import AppLogo from '@/components/common/AppLogo'
import verifyPermission from '@/utils/verifyPermission'

const AppSidebar = () => {
    const user = useSelector((state: RootState) => state.auth.user)
    const visibleSidebarGroups = useMemo(() => {
        return sidebarGroups
            .map((group) => {
                const visibleItems = group.items
                    .map((groupItem) => {
                        if (!verifyPermission(user, groupItem.accessRequirement)) return null

                        const visibleChildren = (groupItem.children ?? []).filter((child) =>
                            verifyPermission(user, child.accessRequirement)
                        )

                        if ((groupItem.children ?? []).length > 0 && visibleChildren.length === 0) return null
                        return { ...groupItem, children: visibleChildren }
                    })
                    .filter(Boolean) // remove "null"

                if (visibleItems.length === 0) return null
                return { ...group, items: visibleItems as typeof group.items }
            })
            .filter(Boolean) // remove "null"
    }, [user])

    return (
        <Sidebar collapsible="icon" className="overflow-hidden">
            <SidebarHeader className="flex-row gap-2 items-center justify-between border-b-2">
                <SidebarTrigger />
                <AppLogo reverse />
            </SidebarHeader>
            <SidebarContent className="gap-0">
                {(visibleSidebarGroups as SidebarGroupData[]).map((group, i) => (
                    <SidebarGroupItem key={i} {...group} />
                ))}
            </SidebarContent>
            <SidebarFooter className="border-t-2">
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarUserButton />
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarFooter>
        </Sidebar>
    )
}

const SidebarGroupItem = (group: SidebarGroupData) => {
    return (
        <SidebarGroup>
            <SidebarGroupLabel>{group.title}</SidebarGroupLabel>
            <SidebarMenu>
                {group.items.map((item) =>
                    item.children?.length ? (
                        <Collapsible key={item.title} asChild defaultOpen={item.isActive} className="group/collapsible">
                            <SidebarMenuItem>
                                <CollapsibleTrigger asChild>
                                    <SidebarMenuButton tooltip={item.title}>
                                        <item.icon />
                                        <span>{item.title}</span>
                                        <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                                    </SidebarMenuButton>
                                </CollapsibleTrigger>
                                <CollapsibleContent className="transition-all data-[state=closed]:animate-collapsible-up data-[state=open]:animate-collapsible-down">
                                    <SidebarMenuSub>
                                        {item.children.map((subItem) => (
                                            <SidebarMenuSubItem key={subItem.title}>
                                                <SidebarMenuSubButton asChild>
                                                    <Link to={subItem.url}>
                                                        <span>{subItem.title}</span>
                                                    </Link>
                                                </SidebarMenuSubButton>
                                            </SidebarMenuSubItem>
                                        ))}
                                    </SidebarMenuSub>
                                </CollapsibleContent>
                            </SidebarMenuItem>
                        </Collapsible>
                    ) : (
                        <SidebarMenuItem key={item.title}>
                            <SidebarMenuButton tooltip={item.title} asChild>
                                <Link to={item.url!}>
                                    <item.icon />
                                    <span>{item.title}</span>
                                </Link>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    )
                )}
            </SidebarMenu>
        </SidebarGroup>
    )
}

export default AppSidebar
