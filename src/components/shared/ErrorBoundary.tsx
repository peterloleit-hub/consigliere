import { Component, ErrorInfo, ReactNode } from 'react'
import { RefreshCcw, ShieldAlert } from 'lucide-react'
import { cn } from '@/lib/utils'

interface Props {
    children?: ReactNode
}

interface State {
    hasError: boolean
    error: Error | null
}

export class ErrorBoundary extends Component<Props, State> {
    public state: State = {
        hasError: false,
        error: null,
    }

    public static getDerivedStateFromError(error: Error): State {
        return { hasError: true, error }
    }

    public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error('Uncaught error:', error, errorInfo)
    }

    public handleReload = () => {
        window.location.reload()
    }

    public render() {
        if (this.state.hasError) {
            return (
                <div className="min-h-screen flex items-center justify-center bg-[--color-background] p-4 text-center">
                    <div className="max-w-md w-full bg-[--color-surface] border-2 border-[--color-error] rounded-2xl shadow-[var(--elevation-3)] overflow-hidden">
                        {/* Header */}
                        <div className="bg-[--color-error-container] p-6 flex flex-col items-center">
                            <div className="p-4 bg-[--color-surface] rounded-full mb-4 shadow-sm">
                                <ShieldAlert className="h-10 w-10 text-[--color-error]" />
                            </div>
                            <h1 className="text-2xl font-bold text-[--color-on-surface] tracking-tight">
                                SYSTEM CHECK FAILURE
                            </h1>
                            <p className="text-[--color-error] font-medium mt-1 uppercase tracking-wider text-sm">
                                Critical Error Detected
                            </p>
                        </div>

                        {/* Content */}
                        <div className="p-8">
                            <p className="text-[--color-on-surface-variant] mb-6">
                                The mission control interface has encountered an unexpected anomaly.
                                Secure protocols have prevented a full system crash.
                            </p>

                            <div className="bg-[--color-surface-container-high] p-4 rounded-lg mb-8 text-left overflow-auto max-h-32">
                                <p className="font-mono text-xs text-[--color-error] break-all">
                                    {this.state.error?.message || 'Unknown error occurred'}
                                </p>
                            </div>

                            <button
                                onClick={this.handleReload}
                                className={cn(
                                    "flex items-center justify-center w-full gap-2 px-6 py-3 rounded-xl",
                                    "bg-[--color-error] text-white font-semibold",
                                    "hover:bg-red-600 active:scale-[0.98]",
                                    "transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[--color-error] focus-visible:ring-offset-2"
                                )}
                            >
                                <RefreshCcw className="h-5 w-5" />
                                Reboot System
                            </button>
                        </div>
                    </div>
                </div>
            )
        }

        return this.props.children
    }
}
