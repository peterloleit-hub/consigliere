import { AlertCircle, CheckCircle2, Clock, Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import { formatRelativeTime } from '@/lib/utils'
import { useAgentLogs } from '@/hooks'
import { getAgent } from '@/agents'
import type { AgentLog } from '@/types/database'

function getStatusIcon(status: AgentLog['status']) {
    switch (status) {
        case 'success':
            return <CheckCircle2 className="h-4 w-4 text-[--color-success]" />
        case 'error':
            return <AlertCircle className="h-4 w-4 text-[--color-error]" />
        case 'pending':
            return <Loader2 className="h-4 w-4 text-[--color-warning] animate-spin" />
        default:
            return <Clock className="h-4 w-4 text-[--color-on-surface-variant]" />
    }
}

export function ActivityFeed() {
    const { data: logs, isLoading, error } = useAgentLogs(15)

    if (isLoading) {
        return (
            <div className="space-y-2">
                {Array.from({ length: 5 }).map((_, i) => (
                    <div key={i} className="h-16 rounded-lg bg-[--color-surface-container] animate-pulse" />
                ))}
            </div>
        )
    }

    if (error) {
        return (
            <div className="flex items-center gap-2 p-4 rounded-lg bg-[--color-error]/10 text-[--color-error]">
                <AlertCircle className="h-4 w-4" />
                <span className="text-sm">Failed to load activity</span>
            </div>
        )
    }

    if (!logs?.length) {
        return (
            <div className="flex flex-col items-center justify-center py-8 text-[--color-on-surface-variant]">
                <Clock className="h-8 w-8 mb-2 opacity-50" />
                <p className="text-sm">No activity yet</p>
                <p className="text-xs mt-1">Agent actions will appear here</p>
            </div>
        )
    }

    return (
        <div className="space-y-2">
            {logs.map((log) => {
                const agent = getAgent(log.agent_name)
                const AgentIcon = agent?.icon

                return (
                    <div
                        key={log.id}
                        className={cn(
                            'flex items-start gap-3 p-3 rounded-lg',
                            'bg-[--color-surface-container] hover:bg-[--color-surface-container-high]',
                            'transition-colors'
                        )}
                    >
                        <div className="flex-shrink-0 mt-0.5">{getStatusIcon(log.status)}</div>
                        <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                                {AgentIcon && <AgentIcon className="h-3.5 w-3.5 text-[--color-on-surface-variant]" />}
                                <span className="text-xs font-medium text-[--color-on-surface-variant]">
                                    {agent?.name || log.agent_name}
                                </span>
                            </div>
                            <p className="text-sm text-[--color-on-surface] mt-0.5 line-clamp-2">
                                {log.action_detail}
                            </p>
                        </div>
                        <span className="flex-shrink-0 text-xs text-[--color-on-surface-variant]">
                            {formatRelativeTime(log.created_at)}
                        </span>
                    </div>
                )
            })}
        </div>
    )
}
