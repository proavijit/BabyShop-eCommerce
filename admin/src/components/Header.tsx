import { useAuthStore } from '../store/useAuthStore';
import { Search, Bell, Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';

export default function Header() {
    const { user } = useAuthStore();
    const { theme, setTheme } = useTheme();

    return (
        <header className="h-20 bg-[#0f172a]/80 backdrop-blur-md border-b border-white/5 px-8 flex items-center justify-between sticky top-0 z-40 transition-all">
            {/* Search Bar */}
            <div className="flex-1 max-w-xl">
                <div className="relative group">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-blue-500 transition-colors" />
                    <input
                        type="text"
                        placeholder="Search for orders, products, or users..."
                        className="w-full bg-white/5 border border-white/5 rounded-xl pl-10 pr-4 py-2 text-sm text-slate-300 outline-none focus:border-blue-500/50 focus:ring-4 focus:ring-blue-500/10 transition-all"
                    />
                </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-4">
                {/* Theme Toggle */}
                <button
                    onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                    className="p-2.5 rounded-xl bg-white/5 border border-white/5 text-slate-400 hover:text-white hover:bg-white/10 transition-all"
                    title="Toggle Theme"
                >
                    {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                </button>

                {/* Notifications */}
                <button className="relative p-2.5 rounded-xl bg-white/5 border border-white/5 text-slate-400 hover:text-white hover:bg-white/10 transition-all">
                    <Bell className="w-5 h-5" />
                    <span className="absolute top-2.5 right-2.5 w-1.5 h-1.5 bg-blue-500 rounded-full border border-[#0f172a]" />
                </button>

                {/* Vertical Divider */}
                <div className="w-px h-8 bg-white/5 mx-2" />

                {/* Quick Profile (Visible on mobile/small screens or as summary) */}
                <div className="flex items-center gap-3 pl-2">
                    <div className="flex flex-col items-end hidden md:flex">
                        <span className="text-white text-sm font-semibold leading-none">{user?.name || 'Admin'}</span>
                        <span className="text-blue-400 text-[10px] uppercase font-bold tracking-wider mt-1">Super Admin</span>
                    </div>
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-purple-600 p-[1px]">
                        <div className="w-full h-full rounded-xl bg-[#1e293b] flex items-center justify-center overflow-hidden">
                            {user?.avatar ? (
                                <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                            ) : (
                                <span className="text-white font-bold text-sm">{user?.name?.charAt(0) || 'A'}</span>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
}
