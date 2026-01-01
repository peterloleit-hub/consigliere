import { useState, useEffect } from 'react'
import { Wifi, WifiOff } from 'lucide-react'
import { cn } from '@/lib/utils'

export function OfflineIndicator() {
    const [isOnline, setIsOnline] = useState(navigator.onLine)

    useEffect(() => {
        const handleOnline = () => setIsOnline(true)
        const handleOffline = () => setIsOnline(false)

        window.addEventListener('online', handleOnline)
        window.addEventListener('offline', handleOffline)

        return () => {
            window.removeEventListener('online', handleOnline)
            window.removeEventListener('offline', handleOffline)
        }
    }, [])

    // Status Pill: Static Green for Active, Amber for issues
    return (
        <div
            className={cn(
                "flex items-center gap-2 px-3 py-1 rounded-full border transition-all duration-300 shadow-sm backdrop-blur-md",
                isOnline
                    ? "bg-emerald-500/90 border-emerald-300 text-white shadow-[0_0_10px_rgba(16,185,129,0.4)]"
                    : "bg-amber-500/90 border-amber-300 text-white shadow-[0_0_10px_rgba(245,158,11,0.4)]"
            )}
        >
            {isOnline ? (
                <Wifi className="h-3.5 w-3.5" strokeWidth={3} />
            ) : (
                <WifiOff className="h-3.5 w-3.5" />
            )}
            <span className="text-[0.65rem] font-bold uppercase tracking-widest">
                {isOnline ? 'WiFi On' : 'Offline'}
            </span>
        </div>
    )
}
