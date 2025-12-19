import { Link, useLocation, useNavigate } from 'react-router-dom'
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
    Grid3x3,
    LogOut,
    ChevronRight,
    Settings
} from 'lucide-react'
import { useAuthStore } from '../store/useAuthStore'
import { toast } from 'sonner'

const menuItems = [
    { path: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { path: '/dashboard/users', icon: Users, label: 'Users' },
    { path: '/dashboard/orders', icon: ShoppingCart, label: 'Orders' },
    { path: '/dashboard/products', icon: Package, label: 'Products' },
    { path: '/dashboard/categories', icon: Grid3x3, label: 'Categories' },
    { path: '/dashboard/brands', icon: Tag, label: 'Brands' },
    { path: '/dashboard/banner', icon: Image, label: 'Banners' },
    { path: '/dashboard/invoices', icon: FileText, label: 'Invoices' },
    { path: '/dashboard/accounts', icon: UserCircle, label: 'Accounts' },
    { path: '/dashboard/about', icon: Info, label: 'About App' },
]

export default function Sidebar() {
    const location = useLocation()
    const navigate = useNavigate()
    const { user, logout } = useAuthStore()

    const handleLogout = () => {
        logout()
        toast.success('Logged out successfully')
        navigate('/login')
    }

    return (
        <div className="fixed inset-y-0 left-0 z-50 w-64 flex flex-col bg-[#0f172a] border-r border-white/5 shadow-2xl transition-all duration-300">
            {/* Logo Section */}
            <div className="h-20 flex items-center px-6 border-b border-white/5 bg-[#0f172a]/50 backdrop-blur-md">
                <Link to="/dashboard" className="flex items-center gap-3 group">
                    <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-600/20 group-hover:scale-105 transition-transform duration-200">
                        <span className="text-white font-bold text-xl">B</span>
                    </div>
                    <div className="flex flex-col">
                        <span className="text-white font-bold text-lg leading-tight tracking-tight">BabyMart</span>
                        <span className="text-blue-400 text-[10px] font-semibold uppercase tracking-widest">Admin Panel</span>
                    </div>
                </Link>
            </div>

            {/* User Profile Section */}
            <div className="px-4 py-6">
                <div className="bg-white/5 rounded-2xl p-4 border border-white/5 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button className="text-slate-500 hover:text-white transition-colors">
                            <Settings className="w-4 h-4" />
                        </button>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-blue-600 to-purple-600 p-[2px] shadow-inner">
                            <div className="w-full h-full rounded-full bg-[#1e293b] flex items-center justify-center border-2 border-[#1e293b]">
                                {user?.avatar ? (
                                    <img src={user.avatar} alt={user.name} className="w-full h-full rounded-full object-cover" />
                                ) : (
                                    <span className="text-white font-bold text-lg">{user?.name?.charAt(0) || 'A'}</span>
                                )}
                            </div>
                        </div>
                        <div className="flex flex-col min-w-0">
                            <span className="text-white font-semibold text-sm truncate">{user?.name || 'Admin User'}</span>
                            <span className="text-slate-500 text-[11px] truncate">{user?.email || 'admin@babymart.com'}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Navigation Menu */}
            <nav className="flex-1 overflow-y-auto px-4 py-2 space-y-1 custom-scrollbar">
                <div className="text-[10px] uppercase font-bold text-slate-500 mb-2 px-3 tracking-widest">Main Menu</div>
                {menuItems.map((item) => {
                    const Icon = item.icon
                    const isActive = location.pathname === item.path || (item.path === '/dashboard' && location.pathname === '/')

                    return (
                        <Link
                            key={item.path}
                            to={item.path}
                            className={`
                                flex items-center justify-between px-4 py-3 rounded-xl
                                text-sm font-medium transition-all duration-200 group
                                ${isActive
                                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20'
                                    : 'text-slate-400 hover:bg-white/5 hover:text-white'
                                }
                            `}
                        >
                            <div className="flex items-center gap-3">
                                <Icon className={`w-5 h-5 transition-transform duration-200 ${isActive ? 'scale-110' : 'group-hover:scale-110'}`} />
                                <span>{item.label}</span>
                            </div>
                            {isActive && <div className="w-1.5 h-1.5 rounded-full bg-white opacity-80" />}
                        </Link>
                    )
                })}
            </nav>

            {/* Logout Section */}
            <div className="p-4 border-t border-white/5 bg-[#0f172a]/50">
                <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-red-400 hover:bg-red-500/10 transition-all duration-200 group"
                >
                    <LogOut className="w-5 h-5 transition-transform group-hover:-translate-x-1" />
                    <span>Logout</span>
                    <ChevronRight className="w-4 h-4 ml-auto opacity-0 group-hover:opacity-100 transition-all" />
                </button>
                <div className="mt-4 text-[10px] text-slate-600 text-center font-medium tracking-tight">
                    © 2025 BabyMart v1.0.0
                </div>
            </div>
        </div>
    )
}

