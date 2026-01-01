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
            <main className="flex-1 overflow-y-auto pb-20" id="main-content">
                <Outlet />
            </main>

            {/* Bottom tab navigation - Frosted Command Deck */}
            <nav
                className={cn(
                    'fixed bottom-0 left-0 right-0 z-50',
                    'bg-[var(--color-surface)]/70 backdrop-blur-md',
                    'border-t-2 border-[var(--color-primary-600)]',
                    'shadow-[0_-4px_20px_rgba(0,0,0,0.3)]',
                    'nav-bottom py-3'
                )}
                aria-label="Primary navigation"
            >
                <div className="flex items-center justify-center gap-4 max-w-lg mx-auto px-4">
                    {navItems.map(({ to, icon: Icon, label }) => (
                        <NavLink
                            key={to}
                            to={to}
                            className={({ isActive }) =>
                                cn(
                                    /* Base Button Style */
                                    'flex flex-col items-center justify-center gap-1 w-full h-16 rounded-xl border-2 transition-all duration-200',

                                    /* Active vs Inactive State */
                                    isActive
                                        ? 'border-[var(--color-accent)] bg-[var(--color-accent-subtle)] text-[var(--color-accent)] shadow-[0_0_15px_rgba(212,175,55,0.15)] scale-105'
                                        : 'border-white/10 text-white/60 hover:bg-white/5 hover:border-white/30 hover:text-white',

                                    /* Focus */
                                    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)]'
                                )
                            }
                        >
                            {({ isActive }) => (
                                <>
                                    <Icon className={cn("h-5 w-5", isActive && "drop-shadow-[0_0_5px_currentColor]")} aria-hidden="true" />
                                    <span className="text-[0.65rem] font-bold uppercase tracking-wider">{label}</span>
                                </>
                            )}
                        </NavLink>
                    ))}
                </div>
            </nav>
        </div>
    )
}
