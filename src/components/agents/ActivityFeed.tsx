import { AlertCircle, CheckCircle2, Clock, Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import { formatRelativeTime } from '@/lib/utils'
import { useAgentLogs } from '@/hooks'
import { getAgent } from '@/agents'
import type { AgentLog } from '@/types/database'

function getStatusIcon(status: AgentLog['status']) {
    switch (status) {
        case 'success':
            return <CheckCircle2 className="h-4 w-4 text-[--color-success]" aria-hidden="true" />
        case 'error':
            return <AlertCircle className="h-4 w-4 text-[--color-error]" aria-hidden="true" />
        case 'pending':
            return <Loader2 className="h-4 w-4 text-[--color-warning] animate-spin" aria-hidden="true" />
        default:
            return <Clock className="h-4 w-4 text-[--color-on-surface-variant]" aria-hidden="true" />
    }
}

function getStatusLabel(status: AgentLog['status']): string {
    switch (status) {
        case 'success': return 'Completed successfully'
        case 'error': return 'Failed'
        case 'pending': return 'In progress'
        default: return 'Unknown status'
    }
}

export function ActivityFeed() {
    const { data: logs, isLoading, error } = useAgentLogs(15)

    if (isLoading) {
        return (
            <div
                className="space-y-2"
                role="status"
                aria-label="Loading activity feed"
            >
                {Array.from({ length: 5 }).map((_, i) => (
                    <div
                        key={i}
                        className="h-16 rounded-lg bg-[--color-surface-container] animate-pulse"
                    />
                ))}
                <span className="sr-only">Loading recent activity...</span>
            </div>
        )
    }

    if (error) {
        return (
            <div
                className="flex items-center gap-2 p-4 rounded-lg bg-[--color-error-container] text-[--color-error]"
                role="alert"
            >
                <AlertCircle className="h-4 w-4" aria-hidden="true" />
                <span className="text-sm">Failed to load activity</span>
            </div>
        )
    }

    if (!logs?.length) {
        return (
            <div
                className="flex flex-col items-center justify-center py-8 text-[--color-on-surface-variant]"
                role="status"
            >
                <Clock className="h-8 w-8 mb-2 opacity-50" aria-hidden="true" />
                <p className="text-sm">No activity yet</p>
                <p className="text-xs mt-1">Agent actions will appear here</p>
            </div>
        )
    }

    return (
        <ul
            className="space-y-2"
            role="log"
            aria-label="Recent agent activity"
            aria-live="polite"
        >
            {logs.map((log) => {
                const agent = getAgent(log.agent_name)
                const AgentIcon = agent?.icon

                return (
                    <li
                        key={log.id}
                        className={cn(
                            'flex items-start gap-3 p-3 rounded-lg',
                            'bg-[--color-surface-container]',
                            'hover:bg-[--color-primary-500]/[0.04]',
                            'transition-colors duration-150'
                        )}
                    >
                        <div className="flex-shrink-0 mt-0.5" title={getStatusLabel(log.status)}>
                            {getStatusIcon(log.status)}
                        </div>
                        <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                                {AgentIcon && <AgentIcon className="h-3.5 w-3.5 text-[--color-on-surface-variant]" aria-hidden="true" />}
                                <span className="text-xs font-medium text-[--color-on-surface-variant]">
                                    {agent?.name || log.agent_name}
                                </span>
                            </div>
                            <p className="text-sm text-[--color-on-surface] mt-0.5 line-clamp-2">
                                {log.action_detail}
                            </p>
                        </div>
                        <time
                            dateTime={log.created_at}
                            className="flex-shrink-0 text-xs text-[--color-on-surface-variant]"
                        >
                            {formatRelativeTime(log.created_at)}
                        </time>
                    </li>
                )
            })}
        </ul>
    )
}
