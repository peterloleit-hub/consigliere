import { Radar } from 'lucide-react'
import { OfflineIndicator } from './OfflineIndicator'

export function Header() {
    return (
        <header className="sticky top-0 z-50 bg-[--color-surface]/95 backdrop-blur-sm border-b border-[--color-surface-container-highest]">
            <div className="flex items-center justify-between px-4 h-14">
                {/* Branding */}
                <div className="flex items-center gap-2">
                    <div className="p-1.5 rounded-lg bg-[--color-primary-500]">
                        <Radar className="h-5 w-5 text-white" />
                    </div>
                    <div>
                        <h1 className="text-base font-semibold text-[--color-on-surface]">
                            Mission Control
                        </h1>
                        <p className="text-[10px] text-[--color-on-surface-variant] -mt-0.5">
                            Agentic AI CoS
                        </p>
                    </div>
                </div>

                {/* Status */}
                <OfflineIndicator />
            </div>
        </header>
    )
}
