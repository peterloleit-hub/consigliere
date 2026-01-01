import { Play, AlertCircle, CheckCircle2, Clock, Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import { formatRelativeTime } from '@/lib/utils'
import { useTriggerAgent, useLatestAgentLog } from '@/hooks'
import type { AgentDefinition, AgentStatus } from '@/types/agent'

interface AgentCardProps {
    agent: AgentDefinition
}

function getStatusConfig(status: AgentStatus | undefined) {
    switch (status) {
        case 'success':
            return {
                icon: CheckCircle2,
                color: 'text-[--color-success]',
                bg: 'bg-[--color-success-container]',
                label: 'Active'
            }
        case 'error':
            return {
                icon: AlertCircle,
                color: 'text-[--color-error]',
                bg: 'bg-[--color-error-container]',
                label: 'Error'
            }
        case 'pending':
            return {
                icon: Loader2,
                color: 'text-[--color-warning]',
                bg: 'bg-[--color-warning-container]',
                label: 'Running'
            }
        default:
            return {
                icon: Clock,
                color: 'text-[--color-on-surface-variant]',
                bg: 'bg-[--color-surface-container-high]',
                label: 'Idle'
            }
    }
}

export function AgentCard({ agent }: AgentCardProps) {
    const { data: latestLog, isLoading: logLoading } = useLatestAgentLog(agent.id)
    const { mutate: trigger, isPending: triggering } = useTriggerAgent()

    const status = latestLog?.status as AgentStatus | undefined
    const statusConfig = getStatusConfig(status)
    const StatusIcon = statusConfig.icon
    const AgentIcon = agent.icon

    const handleTrigger = () => {
        trigger({ webhookEnvKey: agent.webhookEnvKey })
    }

    return (
        <article
            className={cn(
                'rounded-xl bg-[--color-surface-container] p-4',
                /* MD3 Level 1 for resting card, Level 2 on hover */
                'shadow-[--elevation-1] hover:shadow-[--elevation-2]',
                'transition-shadow duration-200'
            )}
        >
            {/* Header */}
            <div className="flex items-start justify-between gap-3 mb-3">
                <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-[--color-primary-100]">
                        <AgentIcon className="h-5 w-5 text-[--color-primary-600]" aria-hidden="true" />
                    </div>
                    <div>
                        <h3 className="font-medium text-[--color-on-surface]">{agent.name}</h3>
                        <p className="text-xs text-[--color-on-surface-variant] mt-0.5 line-clamp-1">
                            {agent.description}
                        </p>
                    </div>
                </div>
            </div>

            {/* Status row */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    {logLoading ? (
                        <div
                            className="h-6 w-16 rounded-full bg-[--color-surface-container-high] animate-pulse"
                            role="status"
                            aria-label="Loading status"
                        />
                    ) : (
                        <span
                            className={cn(
                                'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium',
                                statusConfig.bg,
                                statusConfig.color
                            )}
                            role="status"
                            aria-live="polite"
                        >
                            <StatusIcon
                                className={cn('h-3.5 w-3.5', status === 'pending' && 'animate-spin')}
                                aria-hidden="true"
                            />
                            {statusConfig.label}
                        </span>
                    )}
                    {latestLog?.created_at && (
                        <time
                            dateTime={latestLog.created_at}
                            className="text-xs text-[--color-on-surface-variant]"
                        >
                            {formatRelativeTime(latestLog.created_at)}
                        </time>
                    )}
                </div>

                {/* Trigger button — 48px min touch target */}
                <button
                    onClick={handleTrigger}
                    disabled={triggering}
                    aria-busy={triggering}
                    className={cn(
                        /* 48px min touch target */
                        'inline-flex items-center justify-center gap-2 min-h-12 px-4 rounded-xl',
                        'text-sm font-medium',
                        /* Colors */
                        'bg-[--color-primary-500] text-white',
                        /* Hover state */
                        'hover:bg-[--color-primary-600]',
                        /* Focus ring for keyboard users */
                        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[--color-primary-300] focus-visible:ring-offset-2',
                        /* Pressed state */
                        'active:scale-[0.98] active:bg-[--color-primary-700]',
                        /* Disabled state */
                        'disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100',
                        /* Transition */
                        'transition-all duration-150'
                    )}
                >
                    {triggering ? (
                        <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                    ) : (
                        <Play className="h-4 w-4" aria-hidden="true" />
                    )}
                    <span>{triggering ? 'Triggering...' : 'Trigger'}</span>
                </button>
            </div>
        </article>
    )
}
