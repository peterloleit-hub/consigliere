import { ArrowRight, AlertTriangle, Plus, CheckCircle2, Clock, Loader2, Zap } from 'lucide-react'
import { cn } from '@/lib/utils'
import { formatRelativeTime } from '@/lib/utils'
import { useLatestAgentLog } from '@/hooks'
import type { AgentDefinition, AgentStatus } from '@/types/agent'

interface AgentListItemProps {
    agent: AgentDefinition
    isSelected: boolean
    onSelect: () => void
}

// Mock stats per agent - in production these would come from the API
const MOCK_AGENT_STATS: Record<string, { newItems: number; errors: number; lastRunSuccess: boolean }> = {
    'business-intel': { newItems: 3, errors: 0, lastRunSuccess: true },
    'career-scout': { newItems: 12, errors: 2, lastRunSuccess: true },
    'linkedin-researcher': { newItems: 0, errors: 0, lastRunSuccess: true },
}

function getStatusDisplay(status: AgentStatus | undefined, isLoading: boolean) {
    if (isLoading) {
        return { label: 'Loading', color: 'text-[--color-on-surface-variant]', bgColor: 'bg-[--color-surface-container-highest]', icon: Clock }
    }
    switch (status) {
        case 'success':
            return { label: 'Active', color: 'text-[--color-success]', bgColor: 'bg-[--color-success-container]', icon: CheckCircle2 }
        case 'error':
            return { label: 'Error', color: 'text-[--color-error]', bgColor: 'bg-[--color-error-container]', icon: AlertTriangle }
        case 'pending':
            return { label: 'Running', color: 'text-[--color-warning]', bgColor: 'bg-[--color-warning-container]', icon: Loader2 }
        default:
            return { label: 'Idle', color: 'text-[--color-on-surface-variant]', bgColor: 'bg-[--color-surface-container-high]', icon: Clock }
    }
}

export function AgentListItem({ agent, isSelected, onSelect }: AgentListItemProps) {
    const { data: latestLog, isLoading } = useLatestAgentLog(agent.id)

    const status = latestLog?.status as AgentStatus | undefined
    const statusDisplay = getStatusDisplay(status, isLoading)
    const StatusIcon = statusDisplay.icon
    const AgentIcon = agent.icon
    const stats = MOCK_AGENT_STATS[agent.id] || { newItems: 0, errors: 0, lastRunSuccess: true }

    return (
        <button
            onClick={onSelect}
            aria-pressed={isSelected}
            className={cn(
                /* Card with complete border */
                'w-full text-left p-4 rounded-xl',
                'bg-[--color-surface-container]',
                'border-2',
                isSelected
                    ? 'border-[--color-accent] shadow-[--elevation-3]'
                    : 'border-[--color-surface-container-highest] shadow-[--elevation-1]',
                /* Hover & transitions */
                'hover:shadow-[--elevation-2] hover:border-[--color-primary-300]',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[--color-accent] focus-visible:ring-offset-2',
                'transition-all duration-200'
            )}
        >
            {/* Header: Icon + Title */}
            <div className="flex items-center gap-3 mb-3">
                <div className="p-2 rounded-lg bg-[--color-primary-100]">
                    <AgentIcon className="h-5 w-5 text-[--color-primary-600]" aria-hidden="true" />
                </div>
                <h3 className="font-semibold text-base text-[--color-on-surface]">
                    {agent.name}
                </h3>
            </div>

            {/* Status Badge Row */}
            <div className="flex items-center gap-2 mb-3">
                <span className={cn(
                    'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium',
                    statusDisplay.bgColor,
                    statusDisplay.color
                )}>
                    <StatusIcon className={cn('h-3 w-3', status === 'pending' && 'animate-spin')} aria-hidden="true" />
                    {statusDisplay.label}
                </span>

                {latestLog?.created_at && (
                    <time
                        dateTime={latestLog.created_at}
                        className="text-xs text-[--color-on-surface-variant]"
                    >
                        {formatRelativeTime(latestLog.created_at)}
                    </time>
                )}
            </div>

            {/* Route: Source → Destination */}
            <div className="flex items-center gap-2 mb-3 py-2 px-3 rounded-lg bg-[--color-surface]">
                <span className="font-mono text-sm font-semibold text-[--color-on-surface] tracking-tight">
                    {agent.route.source}
                </span>
                <ArrowRight className="h-3.5 w-3.5 text-[--color-on-surface-variant]" aria-hidden="true" />
                <span className="font-mono text-sm font-semibold text-[--color-on-surface] tracking-tight">
                    {agent.route.destination}
                </span>
            </div>

            {/* Stats Row: New Items, Errors */}
            <div className="flex items-center gap-3 pt-2 border-t border-[--color-surface-container-highest]">
                {/* New additions */}
                {stats.newItems > 0 && (
                    <div className="flex items-center gap-1 text-[--color-success]">
                        <Plus className="h-3.5 w-3.5" aria-hidden="true" />
                        <span className="text-xs font-medium">{stats.newItems} new</span>
                    </div>
                )}

                {/* Errors */}
                {stats.errors > 0 && (
                    <div className="flex items-center gap-1 text-[--color-error]">
                        <AlertTriangle className="h-3.5 w-3.5" aria-hidden="true" />
                        <span className="text-xs font-medium">{stats.errors} errors</span>
                    </div>
                )}

                {/* Show "All good" if no new items and no errors */}
                {stats.newItems === 0 && stats.errors === 0 && (
                    <div className="flex items-center gap-1 text-[--color-on-surface-variant]">
                        <Zap className="h-3.5 w-3.5" aria-hidden="true" />
                        <span className="text-xs font-medium">Up to date</span>
                    </div>
                )}
            </div>
        </button>
    )
}
