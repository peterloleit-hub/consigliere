import { Play, X, AlertCircle, CheckCircle2, Clock, Loader2, ArrowRight, Shield } from 'lucide-react'
import { cn } from '@/lib/utils'
import { formatRelativeTime } from '@/lib/utils'
import { useTriggerAgent, useAgentLogsByName } from '@/hooks'
import type { AgentDefinition, AgentStatus } from '@/types/agent'
import type { AgentLog } from '@/types/database'

interface AgentDetailPanelProps {
    agent: AgentDefinition
    onClose: () => void
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

function getLogStatusIcon(status: AgentLog['status']) {
    switch (status) {
        case 'success':
            return <CheckCircle2 className="h-3.5 w-3.5 text-[--color-success]" aria-hidden="true" />
        case 'error':
            return <AlertCircle className="h-3.5 w-3.5 text-[--color-error]" aria-hidden="true" />
        case 'pending':
            return <Loader2 className="h-3.5 w-3.5 text-[--color-warning] animate-spin" aria-hidden="true" />
        default:
            return <Clock className="h-3.5 w-3.5 text-[--color-on-surface-variant]" aria-hidden="true" />
    }
}

export function AgentDetailPanel({ agent, onClose }: AgentDetailPanelProps) {
    const { data: logs, isLoading: logsLoading } = useAgentLogsByName(agent.id, 5)
    const { mutate: trigger, isPending: triggering } = useTriggerAgent()

    const latestLog = logs?.[0]
    const status = latestLog?.status as AgentStatus | undefined
    const statusConfig = getStatusConfig(status)
    const StatusIcon = statusConfig.icon
    const AgentIcon = agent.icon

    const handleTrigger = () => {
        trigger({ webhookEnvKey: agent.webhookEnvKey })
    }

    return (
        /* Dark Protocol: Deep Navy Surface + Subtle Border */
        <div className="h-full flex flex-col bg-[var(--color-surface)] rounded-xl shadow-[var(--elevation-3)] overflow-hidden border border-[var(--color-surface-container-high)]">
            {/* Header: Darker Contrast for HUD feel */}
            <header className="flex items-start justify-between gap-4 p-6 border-b border-[var(--color-surface-container-highest)] bg-[var(--color-background)]/50">
                <div className="flex items-start gap-4">
                    <div className="p-3 rounded-xl bg-[var(--color-primary-900)] border border-[var(--color-primary-700)]">
                        <AgentIcon className="h-6 w-6 text-[var(--color-primary-400)]" aria-hidden="true" />
                    </div>
                    <div>
                        <div className="flex items-center gap-2">
                            <h2 className="text-xl font-bold text-[var(--color-on-surface)] tracking-tight font-[family-name:var(--font-sans)]">
                                {agent.name}
                            </h2>
                            {/* Presidential Shield Seal */}
                            <Shield className="h-5 w-5 text-[var(--color-accent)] fill-[var(--color-accent-subtle)] drop-shadow-[0_0_8px_rgba(212,175,55,0.4)]" />
                        </div>
                        <p className="text-sm text-[var(--color-on-surface-variant)] mt-1">
                            {agent.description}
                        </p>
                    </div>
                </div>

                {/* Close button - only on mobile */}
                <button
                    onClick={onClose}
                    className="p-2 rounded-lg hover:bg-[var(--color-surface-container-high)] text-[var(--color-on-surface-variant)] hover:text-[var(--color-on-surface)] transition-colors md:hidden"
                    aria-label="Close detail panel"
                >
                    <X className="h-5 w-5" />
                </button>
            </header>

            {/* Status & Route */}
            <div className="px-6 py-6 border-b border-[var(--color-surface-container-highest)]">
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-2">
                        <span className={cn('flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border border-transparent', statusConfig.bg, statusConfig.color)}>
                            <StatusIcon className={cn('h-3.5 w-3.5', status === 'pending' && 'animate-spin')} aria-hidden="true" />
                            {statusConfig.label}
                        </span>
                        {latestLog?.created_at && (
                            <time dateTime={latestLog.created_at} className="text-xs text-[var(--color-on-surface-variant)] font-mono">
                                {formatRelativeTime(latestLog.created_at)}
                            </time>
                        )}
                    </div>
                </div>

                {/* Route display - HUD Metrics */}
                <div className="flex items-center justify-center gap-8 py-6 px-6 rounded-2xl bg-[var(--color-background)] border border-[var(--color-primary-800)] shadow-inner">
                    <div className="text-center">
                        <div className="font-mono text-3xl font-bold text-[var(--color-accent)] tracking-tight drop-shadow-[0_0_10px_rgba(212,175,55,0.2)]">
                            {agent.route.source}
                        </div>
                        <div className="text-[10px] font-bold text-[var(--color-primary-400)] mt-1 uppercase tracking-widest opacity-80">SOURCE</div>
                    </div>
                    <ArrowRight className="h-5 w-5 text-[var(--color-primary-600)]" aria-hidden="true" />
                    <div className="text-center">
                        <div className="font-mono text-3xl font-bold text-[var(--color-strategic)] tracking-tight drop-shadow-[0_0_10px_rgba(59,130,246,0.2)]">
                            {agent.route.destination}
                        </div>
                        <div className="text-[10px] font-bold text-[var(--color-primary-400)] mt-1 uppercase tracking-widest opacity-80">OUTPUT</div>
                    </div>
                </div>
            </div>

            {/* Activity Log */}
            <div className="flex-1 overflow-y-auto px-4 py-4">
                <h3 className="text-xs font-bold text-[var(--color-on-surface-variant)] uppercase tracking-wider mb-3 px-2">
                    System Log
                </h3>

                {logsLoading ? (
                    <div className="space-y-2">
                        {Array.from({ length: 3 }).map((_, i) => (
                            <div key={i} className="h-10 rounded-lg bg-[--color-surface] animate-pulse" />
                        ))}
                    </div>
                ) : logs?.length ? (
                    <ul className="space-y-2" role="log" aria-label="Agent activity">
                        {logs.map((log) => (
                            <li
                                key={log.id}
                                className="flex items-start gap-2.5 p-2.5 rounded-lg bg-[--color-surface]"
                            >
                                <div className="mt-0.5">{getLogStatusIcon(log.status)}</div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm text-[--color-on-surface] line-clamp-1">
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
                        ))}
                    </ul>
                ) : (
                    <div className="flex flex-col items-center justify-center py-8 text-[--color-on-surface-variant]">
                        <Clock className="h-6 w-6 mb-2 opacity-50" aria-hidden="true" />
                        <p className="text-sm">No activity yet</p>
                    </div>
                )}
            </div>

            {/* Action Button */}
            <div className="p-4 border-t border-[--color-surface-container-highest]">
                <button
                    onClick={handleTrigger}
                    disabled={triggering}
                    aria-busy={triggering}
                    className={cn(
                        'w-full flex items-center justify-center gap-2 min-h-12 rounded-xl',
                        'text-sm font-semibold',
                        'bg-[--color-primary-500] text-white',
                        'hover:bg-[--color-primary-600]',
                        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[--color-primary-300] focus-visible:ring-offset-2',
                        'active:scale-[0.98] active:bg-[--color-primary-700]',
                        'disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100',
                        'transition-all duration-150 shadow-[var(--elevation-1)] hover:shadow-[var(--elevation-2)]'
                    )}
                >
                    {triggering ? (
                        <>
                            <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                            <span>Initiating Protocol...</span>
                        </>
                    ) : (
                        <>
                            <Play className="h-4 w-4 fill-current" aria-hidden="true" />
                            <span>Run Agent Override</span>
                        </>
                    )}
                </button>
            </div>
        </div>
    )
}
