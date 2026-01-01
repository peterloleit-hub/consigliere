import { useNavigate } from 'react-router-dom'
import { MapPinOff, ArrowLeft } from 'lucide-react'
import { cn } from '@/lib/utils'

export default function NotFound() {
    const navigate = useNavigate()

    return (
        <div className="min-h-screen flex items-center justify-center bg-[--color-background] p-4 text-center">
            <div className="max-w-md w-full">
                <div className="mb-8 flex justify-center">
                    <div className="p-6 bg-[--color-surface-container-high] rounded-full inline-flex md:p-8">
                        <MapPinOff className="h-12 w-12 text-[--color-on-surface-variant] opacity-50" />
                    </div>
                </div>

                <h1 className="text-4xl font-bold text-[--color-on-surface] mb-3 tracking-tight">
                    404
                </h1>
                <h2 className="text-xl font-semibold text-[--color-strategic] mb-4 uppercase tracking-wider">
                    Coordinates Not Found
                </h2>

                <p className="text-[--color-on-surface-variant] mb-10 max-w-sm mx-auto">
                    The sector you are trying to access does not exist or has been redacted.
                    Return to Mission Control.
                </p>

                <button
                    onClick={() => navigate('/')}
                    className={cn(
                        "inline-flex items-center gap-2 px-6 py-3 rounded-xl",
                        "bg-[--color-primary-500] text-white font-medium",
                        "hover:bg-[--color-primary-600] active:scale-[0.98] shadow-[var(--elevation-1)]",
                        "transition-all duration-200"
                    )}
                >
                    <ArrowLeft className="h-5 w-5" />
                    Return to Base
                </button>
            </div>
        </div>
    )
}
