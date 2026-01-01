import { useState, useEffect } from 'react'
import { WifiOff, Wifi } from 'lucide-react'
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

    if (isOnline) {
        return (
            <div className="flex items-center gap-1.5 text-xs text-[--color-success]">
                <Wifi className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Online</span>
            </div>
        )
    }

    return (
        <div
            className={cn(
                'flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-medium',
                'bg-[--color-error]/10 text-[--color-error]',
                'animate-pulse'
            )}
        >
            <WifiOff className="h-3.5 w-3.5" />
            <span>Offline</span>
        </div>
    )
}
