import { OfflineIndicator } from './OfflineIndicator'

export function Header() {
    return (
        <header className="sticky top-0 z-50 bg-[var(--color-accent)] border-b border-[var(--color-accent)]/20">
            <div className="relative flex items-center justify-center px-4 h-16">
                {/* Branding - Centered */}
                <div className="flex flex-col items-center">
                    <h1 className="text-2xl font-bold text-white tracking-widest uppercase font-[family-name:var(--font-sans)]">
                        Mission Control
                    </h1>
                    <p className="text-[0.65rem] text-white/80 font-mono tracking-[0.2em] -mt-1">
                        EXECUTIVE AUTHORITY
                    </p>
                </div>

                {/* Status - Absolute Right */}
                <div className="absolute right-4 top-1/2 -translate-y-1/2">
                    <OfflineIndicator />
                </div>
            </div>
        </header>
    )
}
