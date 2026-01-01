import { Outlet, NavLink } from 'react-router-dom'
import { LayoutDashboard, Settings, BarChart3 } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Header } from './Header'

const navItems = [
    { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/config', icon: Settings, label: 'Config' },
    { to: '/metrics', icon: BarChart3, label: 'Metrics' },
]

export function Layout() {
    return (
        <div className="min-h-screen flex flex-col bg-[--color-surface]">
            <Header />

            {/* Main content area */}
            <main className="flex-1 overflow-y-auto pb-20">
                <Outlet />
            </main>

            {/* Bottom tab navigation - thumb-friendly for mobile */}
            <nav className="fixed bottom-0 left-0 right-0 z-50 bg-[--color-surface]/95 backdrop-blur-sm border-t border-[--color-surface-container-highest] nav-bottom">
                <div className="flex items-center justify-around h-16 max-w-lg mx-auto">
                    {navItems.map(({ to, icon: Icon, label }) => (
                        <NavLink
                            key={to}
                            to={to}
                            className={({ isActive }) =>
                                cn(
                                    'flex flex-col items-center justify-center gap-1 w-full h-full transition-colors',
                                    'text-[--color-on-surface-variant] hover:text-[--color-primary-600]',
                                    isActive && 'text-[--color-primary-600]'
                                )
                            }
                        >
                            {({ isActive }) => (
                                <>
                                    <div
                                        className={cn(
                                            'p-1.5 rounded-full transition-colors',
                                            isActive && 'bg-[--color-primary-100]'
                                        )}
                                    >
                                        <Icon className="h-5 w-5" />
                                    </div>
                                    <span className="text-[11px] font-medium">{label}</span>
                                </>
                            )}
                        </NavLink>
                    ))}
                </div>
            </nav>
        </div>
    )
}
