import { Link, useLocation } from 'react-router-dom'
import {
    LayoutDashboard,
    Users,
    ShoppingCart,
    FileText,
    Package,
    Tag,
    UserCircle,
    Image,
    Info,
    Grid3x3
} from 'lucide-react'

const menuItems = [
    { path: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { path: '/dashboard/users', icon: Users, label: 'Users' },
    { path: '/dashboard/orders', icon: ShoppingCart, label: 'Orders' },
    { path: '/dashboard/invoices', icon: FileText, label: 'Invoices' },
    { path: '/dashboard/products', icon: Package, label: 'Products' },
    { path: '/dashboard/brands', icon: Tag, label: 'Brands' },
    { path: '/dashboard/categories', icon: Grid3x3, label: 'Categories' },
    { path: '/dashboard/accounts', icon: UserCircle, label: 'Accounts' },
    { path: '/dashboard/banner', icon: Image, label: 'Banner' },
    { path: '/dashboard/about', icon: Info, label: 'About' },
]

export default function Sidebar() {
    const location = useLocation()

    return (
        <div className="fixed inset-y-0 left-0 z-50 w-64 flex flex-col bg-sidebar border-r border-sidebar-border shadow-xl">
            {/* Logo/Brand Section */}
            <div className="h-16 flex items-center px-6 border-b border-sidebar-border bg-sidebar">
                <h1 className="text-xl font-bold text-sidebar-foreground">
                    🍼 BabyMart
                </h1>
            </div>

            {/* Navigation Menu */}
            <nav className="flex-1 overflow-y-auto py-4 px-3">
                <div className="space-y-1">
                    {menuItems.map((item) => {
                        const Icon = item.icon
                        const isActive = location.pathname === item.path

                        return (
                            <Link
                                key={item.path}
                                to={item.path}
                                className={`
                  flex items-center gap-3 px-3 py-2.5 rounded-lg
                  text-sm font-medium transition-all duration-200
                  ${isActive
                                        ? 'bg-sidebar-accent text-sidebar-accent-foreground shadow-sm'
                                        : 'text-sidebar-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground'
                                    }
                `}
                            >
                                <Icon className="w-5 h-5 flex-shrink-0" />
                                <span>{item.label}</span>
                            </Link>
                        )
                    })}
                </div>
            </nav>

            {/* Footer Section */}
            <div className="p-4 border-t border-sidebar-border bg-sidebar">
                <div className="text-xs text-sidebar-foreground/60 text-center">
                    © 2024 BabyMart Admin
                </div>
            </div>
        </div>
    )
}
