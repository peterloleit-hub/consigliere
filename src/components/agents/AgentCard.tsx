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
            return { icon: CheckCircle2, color: 'text-[--color-success]', bg: 'bg-[--color-success]/10', label: 'Active' }
        case 'error':
            return { icon: AlertCircle, color: 'text-[--color-error]', bg: 'bg-[--color-error]/10', label: 'Error' }
        case 'pending':
            return { icon: Loader2, color: 'text-[--color-warning]', bg: 'bg-[--color-warning]/10', label: 'Running' }
        default:
            return { icon: Clock, color: 'text-[--color-on-surface-variant]', bg: 'bg-[--color-surface-container]', label: 'Idle' }
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
        <div className="rounded-xl bg-[--color-surface-container] p-4 shadow-[--shadow-md]">
            {/* Header */}
            <div className="flex items-start justify-between gap-3 mb-3">
                <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-[--color-primary-100]">
                        <AgentIcon className="h-5 w-5 text-[--color-primary-600]" />
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
                        <div className="h-6 w-16 rounded-full bg-[--color-surface-container-high] animate-pulse" />
                    ) : (
                        <span
                            className={cn(
                                'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium',
                                statusConfig.bg,
                                statusConfig.color
                            )}
                        >
                            <StatusIcon className={cn('h-3.5 w-3.5', status === 'pending' && 'animate-spin')} />
                            {statusConfig.label}
                        </span>
                    )}
                    {latestLog?.created_at && (
                        <span className="text-xs text-[--color-on-surface-variant]">
                            {formatRelativeTime(latestLog.created_at)}
                        </span>
                    )}
                </div>

                {/* Trigger button */}
                <button
                    onClick={handleTrigger}
                    disabled={triggering}
                    className={cn(
                        'inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors',
                        'bg-[--color-primary-500] text-white hover:bg-[--color-primary-600]',
                        'disabled:opacity-50 disabled:cursor-not-allowed',
                        'active:scale-95'
                    )}
                >
                    {triggering ? (
                        <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    ) : (
                        <Play className="h-3.5 w-3.5" />
                    )}
                    Trigger
                </button>
            </div>
        </div>
    )
}
