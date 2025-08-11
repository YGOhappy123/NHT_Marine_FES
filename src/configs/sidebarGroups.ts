import {
    Album,
    ChartLine,
    CircleDollarSignIcon,
    ClipboardType,
    ClockArrowUp,
    Fish,
    KeyRound,
    LucideIcon,
    MessageCircleMore,
    Package,
    ScanBarcode,
    ShieldUser,
    ShoppingCart,
    TicketCheck,
    Truck,
    UserIcon,
    Users
} from 'lucide-react'
import permissions from '@/configs/permissions'

export type SidebarGroupData = {
    title: string
    items: {
        title: string
        icon: LucideIcon
        url?: string
        accessRequirement?: (typeof permissions)[keyof typeof permissions]
        isActive?: boolean
        children?: {
            title: string
            url: string
            accessRequirement?: (typeof permissions)[keyof typeof permissions]
        }[]
    }[]
}

export const sidebarGroups: SidebarGroupData[] = [
    {
        title: 'Profile',
        items: [
            {
                title: 'Thông tin cá nhân',
                icon: UserIcon,
                isActive: true,
                children: [
                    { title: 'Xem thông tin', url: '/profile' },
                    { title: 'Đổi mật khẩu', url: '/change-password' }
                ]
            }
        ]
    },
    {
        title: 'Chăm sóc khách hàng',
        items: [
            {
                title: 'Danh sách khách hàng',
                icon: Users,
                url: '/customers',
                accessRequirement: permissions.accessCustomerDashboardPage
            }
            // {
            //     title: 'Trò chuyện trực tuyến',
            //     icon: MessageCircleMore,
            //     url: '/chat',
            //     accessRequirement: permissions.accessAdvisoryDashboardPage
            // }
        ]
    },
    {
        title: 'Đơn hàng và vận chuyển',
        items: [
            {
                title: 'Đơn hàng',
                icon: ShoppingCart,
                url: '/orders',
                accessRequirement: permissions.accessOrderDashboardPage
            },
            {
                title: 'Đơn vị vận chuyển',
                icon: Truck,
                url: '/delivery-services',
                accessRequirement: permissions.accessDeliveryServiceDashboardPage
            },
            {
                title: 'Trạng thái đơn hàng',
                icon: ClockArrowUp,
                accessRequirement: permissions.accessOrderStatusDashboardPage,
                children: [
                    { title: 'Danh sách trạng thái', url: '/order-statuses' },
                    { title: 'Chuyển đổi trạng thái', url: '/status-transitions' }
                ]
            }
        ]
    },
    {
        title: 'Sản phẩm và khuyến mãi',
        items: [
            {
                title: 'Danh mục hàng hóa',
                icon: Album,
                url: '/categories'
            },
            {
                title: 'Danh sách sản phẩm',
                icon: Fish,
                url: '/products'
            },
            {
                title: 'Khuyến mãi',
                icon: TicketCheck,
                children: [
                    {
                        title: 'Chương trình khuyến mãi',
                        url: '/promotions',
                        accessRequirement: permissions.accessPromotionDashboardPage
                    },
                    {
                        title: 'Phiếu giảm giá',
                        url: '/coupons',
                        accessRequirement: permissions.accessCouponDashboardPage
                    }
                ]
            }
        ]
    },
    {
        title: 'Nhân sự',
        items: [
            {
                title: 'Quản lý nhân viên',
                icon: ShieldUser,
                url: '/staffs',
                accessRequirement: permissions.accessStaffDashboardPage
            },
            {
                title: 'Vai trò và quyền hạn',
                icon: KeyRound,
                url: '/personnel/staff-roles',
                accessRequirement: permissions.accessRoleDashboardPage
            }
        ]
    },
    {
        title: 'Kho hàng',
        items: [
            {
                title: 'Nhập hàng',
                icon: Package,
                children: [
                    {
                        title: 'Nhà cung cấp',
                        url: '/suppliers',
                        accessRequirement: permissions.accessSupplierDashboardPage
                    },
                    {
                        title: 'Đơn nhập hàng',
                        url: '/products/imports',
                        accessRequirement: permissions.accessImportDashboardPage
                    },
                    {
                        title: 'Phân phối sản phẩm',
                        url: '/inventories/distributions',
                        accessRequirement: permissions.accessStorageDashboardPage
                    }
                ]
            },
            {
                title: 'Hàng tồn kho',
                icon: ScanBarcode,
                accessRequirement: permissions.accessStorageDashboardPage,
                children: [
                    { title: 'Sản phẩm trong kho', url: '/inventories' },
                    { title: 'Danh sách kho/ bể', url: '/storages' },
                    { title: 'Loại kho/ bể', url: '/storage-types' }
                ]
            },
            {
                title: 'Báo cáo thiệt hại',
                icon: ClipboardType,
                accessRequirement: permissions.accessDamageReportDashboardPage,
                children: [
                    // { title: 'Danh sách báo cáo', url: '/damage-reports' },
                    { title: 'Loại thiệt hại', url: '/damage-types' }
                ]
            }
        ]
    },
    {
        title: 'Thống kê',
        items: [
            {
                title: 'Dữ liệu bán hàng',
                icon: CircleDollarSignIcon,
                url: '/statistics/sales',
                accessRequirement: permissions.accessStatisticDashboardPage
            },
            {
                title: 'Thống kê chi tiết',
                icon: ChartLine,
                url: '/statistics/detail',
                accessRequirement: permissions.accessStatisticDashboardPage
            }
        ]
    }
]
