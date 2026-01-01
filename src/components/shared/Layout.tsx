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

            {/* Bottom tab navigation - ARIA labeled for screen readers */}
            <nav
                className={cn(
                    'fixed bottom-0 left-0 right-0 z-50',
                    'bg-[--color-surface]/95 backdrop-blur-sm',
                    'border-t border-[--color-surface-container-highest]',
                    'shadow-[--elevation-2]',
                    'nav-bottom'
                )}
                aria-label="Primary navigation"
            >
                <div className="flex items-center justify-around h-16 max-w-lg mx-auto">
                    {navItems.map(({ to, icon: Icon, label }) => (
                        <NavLink
                            key={to}
                            to={to}
                            className={({ isActive }) =>
                                cn(
                                    /* Full height for 48px+ touch target */
                                    'flex flex-col items-center justify-center gap-1 w-full h-full',
                                    'min-h-12 min-w-12',
                                    /* Base colors */
                                    'text-[--color-on-surface-variant]',
                                    /* Hover state */
                                    'hover:text-[--color-primary-600]',
                                    /* Focus visible for keyboard navigation */
                                    'focus-visible:outline-none focus-visible:bg-[--color-primary-500]/[0.08] rounded-lg',
                                    /* Active state */
                                    isActive && 'text-[--color-primary-600]',
                                    /* Transition */
                                    'transition-colors duration-150'
                                )
                            }
                        >
                            {({ isActive }) => (
                                <>
                                    <div
                                        className={cn(
                                            /* Icon container: 40px for comfortable touch */
                                            'p-2.5 rounded-2xl transition-colors',
                                            isActive && 'bg-[--color-primary-100]'
                                        )}
                                    >
                                        <Icon className="h-5 w-5" aria-hidden="true" />
                                    </div>
                                    {/* Label: rem-based for scaling */}
                                    <span className="text-[0.6875rem] font-medium">{label}</span>
                                </>
                            )}
                        </NavLink>
                    ))}
                </div>
            </nav>
        </div>
    )
}
