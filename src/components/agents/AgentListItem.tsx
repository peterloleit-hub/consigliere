import { ArrowRight, AlertCircle, CheckCircle2, Clock, Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import { formatRelativeTime } from '@/lib/utils'
import { useLatestAgentLog } from '@/hooks'
import type { AgentDefinition, AgentStatus } from '@/types/agent'

interface AgentListItemProps {
    agent: AgentDefinition
    isSelected: boolean
    onSelect: () => void
}

function getStatusConfig(status: AgentStatus | undefined) {
    switch (status) {
        case 'success':
            return {
                icon: CheckCircle2,
                color: 'text-[--color-success]',
                bg: 'bg-[--color-success]',
                label: 'Active'
            }
        case 'error':
            return {
                icon: AlertCircle,
                color: 'text-[--color-error]',
                bg: 'bg-[--color-error]',
                label: 'Error'
            }
        case 'pending':
            return {
                icon: Loader2,
                color: 'text-[--color-warning]',
                bg: 'bg-[--color-warning]',
                label: 'Running'
            }
        default:
            return {
                icon: Clock,
                color: 'text-[--color-on-surface-variant]',
                bg: 'bg-[--color-on-surface-variant]',
                label: 'Idle'
            }
    }
}

export function AgentListItem({ agent, isSelected, onSelect }: AgentListItemProps) {
    const { data: latestLog, isLoading } = useLatestAgentLog(agent.id)

    const status = latestLog?.status as AgentStatus | undefined
    const statusConfig = getStatusConfig(status)
    const AgentIcon = agent.icon

    return (
        <button
            onClick={onSelect}
            aria-pressed={isSelected}
            className={cn(
                /* Base card styling */
                'w-full text-left p-4 rounded-xl',
                'bg-[--color-surface-container]',
                'shadow-[--elevation-1]',
                'transition-all duration-200',
                /* Hover state */
                'hover:shadow-[--elevation-2] hover:bg-[--color-surface-container-high]',
                /* Focus state */
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[--color-accent] focus-visible:ring-offset-2',
                /* Selected state: teal left border */
                isSelected && 'border-l-3 border-l-[--color-accent] shadow-[--elevation-2] bg-[--color-surface-container-high]'
            )}
        >
            {/* Header row: Icon, Name, Status */}
            <div className="flex items-center justify-between gap-3 mb-3">
                <div className="flex items-center gap-2.5">
                    <div className="p-1.5 rounded-lg bg-[--color-primary-100]">
                        <AgentIcon className="h-4 w-4 text-[--color-primary-600]" aria-hidden="true" />
                    </div>
                    <span className="font-semibold text-sm text-[--color-on-surface] uppercase tracking-wide">
                        {agent.name.split(' ')[0]}
                    </span>
                </div>

                {/* Status indicator */}
                <div className="flex items-center gap-1.5">
                    {isLoading ? (
                        <div className="h-2 w-2 rounded-full bg-[--color-surface-container-highest] animate-pulse" />
                    ) : (
                        <>
                            <div className={cn('h-2 w-2 rounded-full', statusConfig.bg)} />
                            <span className={cn('text-xs font-medium', statusConfig.color)}>
                                {statusConfig.label}
                            </span>
                        </>
                    )}
                </div>
            </div>

            {/* Route: Source → Destination */}
            <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2 text-[--color-on-surface]">
                    <span className="font-mono text-base font-bold tracking-tight">
                        {agent.route.source}
                    </span>
                    <ArrowRight className="h-3.5 w-3.5 text-[--color-on-surface-variant]" aria-hidden="true" />
                    <span className="font-mono text-base font-bold tracking-tight">
                        {agent.route.destination}
                    </span>
                </div>
            </div>

            {/* Time since last run */}
            {latestLog?.created_at && (
                <div className="mt-2 pt-2 border-t border-[--color-surface-container-highest]">
                    <time
                        dateTime={latestLog.created_at}
                        className="text-xs text-[--color-on-surface-variant]"
                    >
                        {formatRelativeTime(latestLog.created_at)}
                    </time>
                </div>
            )}
        </button>
    )
}
