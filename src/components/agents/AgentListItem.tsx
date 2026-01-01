import { AlertTriangle, Plus, CheckCircle2, Clock, Loader2 } from 'lucide-react'
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
const MOCK_AGENT_STATS: Record<string, { newItems: number; errors: number }> = {
    'business-intel': { newItems: 3, errors: 0 },
    'career-scout': { newItems: 12, errors: 2 },
    'linkedin-researcher': { newItems: 0, errors: 0 },
}

// Traffic light status colors
function getStatusDisplay(status: AgentStatus | undefined, isLoading: boolean) {
    if (isLoading) {
        return {
            label: 'Loading',
            dotColor: 'bg-[--color-surface-container-highest]',
            textColor: 'text-[--color-on-surface-variant]',
            icon: Clock
        }
    }
    switch (status) {
        case 'success':
            return {
                label: 'Active',
                dotColor: 'bg-[--color-success]',
                textColor: 'text-[--color-success]',
                icon: CheckCircle2
            }
        case 'error':
            return {
                label: 'Error',
                dotColor: 'bg-[--color-error]',
                textColor: 'text-[--color-error]',
                icon: AlertTriangle
            }
        case 'pending':
            return {
                label: 'Running',
                dotColor: 'bg-[--color-warning]',
                textColor: 'text-[--color-warning]',
                icon: Loader2
            }
        default:
            return {
                label: 'Idle',
                dotColor: 'bg-[--color-surface-container-highest]',
                textColor: 'text-[--color-on-surface-variant]',
                icon: Clock
            }
    }
}

export function AgentListItem({ agent, isSelected, onSelect }: AgentListItemProps) {
    const { data: latestLog, isLoading } = useLatestAgentLog(agent.id)

    const status = latestLog?.status as AgentStatus | undefined
    const statusDisplay = getStatusDisplay(status, isLoading)
    const AgentIcon = agent.icon
    const stats = MOCK_AGENT_STATS[agent.id] || { newItems: 0, errors: 0 }

    return (
        <button
            onClick={onSelect}
            aria-pressed={isSelected}
            className={cn(
                /* Wider card */
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
            {/* Header Row: Status dot + Title + Icon */}
            <div className="flex items-center gap-3">
                {/* Traffic light status dot */}
                <div className={cn('h-3 w-3 rounded-full flex-shrink-0', statusDisplay.dotColor)} />

                {/* Agent icon */}
                <div className="p-2 rounded-lg bg-[--color-primary-100] flex-shrink-0">
                    <AgentIcon className="h-5 w-5 text-[--color-primary-600]" aria-hidden="true" />
                </div>

                {/* Title + Status label */}
                <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-base text-[--color-on-surface] truncate">
                        {agent.name}
                    </h3>
                    <div className="flex items-center gap-2 mt-0.5">
                        <span className={cn('text-xs font-medium', statusDisplay.textColor)}>
                            {statusDisplay.label}
                        </span>
                        {latestLog?.created_at && (
                            <>
                                <span className="text-[--color-on-surface-variant]">·</span>
                                <time
                                    dateTime={latestLog.created_at}
                                    className="text-xs text-[--color-on-surface-variant]"
                                >
                                    {formatRelativeTime(latestLog.created_at)}
                                </time>
                            </>
                        )}
                    </div>
                </div>
            </div>

            {/* Stats Row: New Items, Errors */}
            <div className="flex items-center gap-4 mt-3 pt-3 border-t border-[--color-surface-container-highest]">
                {/* New additions - green */}
                <div className={cn(
                    'flex items-center gap-1.5',
                    stats.newItems > 0 ? 'text-green-600' : 'text-[--color-on-surface-variant]'
                )}>
                    <Plus className="h-4 w-4" aria-hidden="true" />
                    <span className="text-sm font-medium">{stats.newItems}</span>
                    <span className="text-xs">new</span>
                </div>

                {/* Errors - red */}
                <div className={cn(
                    'flex items-center gap-1.5',
                    stats.errors > 0 ? 'text-red-600' : 'text-[--color-on-surface-variant]'
                )}>
                    <AlertTriangle className="h-4 w-4" aria-hidden="true" />
                    <span className="text-sm font-medium">{stats.errors}</span>
                    <span className="text-xs">errors</span>
                </div>
            </div>
        </button>
    )
}
