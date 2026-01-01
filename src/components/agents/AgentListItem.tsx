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
const MOCK_AGENT_STATS: Record<string, { newItems: number; errors: number; progress: number }> = {
    'business-intel': { newItems: 3, errors: 0, progress: 0 },
    'career-scout': { newItems: 12, errors: 2, progress: 45 },
    'linkedin-researcher': { newItems: 0, errors: 0, progress: 0 },
}

// Traffic light status colors
function getStatusDisplay(status: AgentStatus | undefined, isLoading: boolean) {
    if (isLoading) {
        return {
            label: 'Loading',
            dotColor: 'bg-[--color-surface-container-highest]',
            textColor: 'text-[--color-on-surface-variant]',
            bgColor: 'bg-[--color-surface-container-highest]',
            icon: Clock
        }
    }
    switch (status) {
        case 'success':
            return {
                label: 'Active',
                dotColor: 'bg-[--color-success]',
                textColor: 'text-[--color-success]',
                bgColor: 'bg-[--color-success-container]/30',
                icon: CheckCircle2
            }
        case 'error':
            return {
                label: 'Error',
                dotColor: 'bg-[--color-error]',
                textColor: 'text-[--color-error]',
                bgColor: 'bg-[--color-error-container]/30',
                icon: AlertTriangle
            }
        case 'pending':
            return {
                label: 'Running',
                dotColor: 'bg-[--color-warning]',
                textColor: 'text-[--color-warning]',
                bgColor: 'bg-[--color-warning-container]/30',
                icon: Loader2
            }
        default:
            return {
                label: 'Idle',
                dotColor: 'bg-[--color-surface-container-highest]',
                textColor: 'text-[--color-on-surface-variant]',
                bgColor: 'bg-[--color-surface-container-highest]',
                icon: Clock
            }
    }
}

export function AgentListItem({ agent, isSelected, onSelect }: AgentListItemProps) {
    const { data: latestLog, isLoading } = useLatestAgentLog(agent.id)

    const status = latestLog?.status as AgentStatus | undefined
    const statusDisplay = getStatusDisplay(status, isLoading)
    const AgentIcon = agent.icon
    const stats = MOCK_AGENT_STATS[agent.id] || { newItems: 0, errors: 0, progress: 0 }

    // For demo: Show progress if status is pending OR if there's progress value (simulating active work)
    const showProgress = status === 'pending' || stats.progress > 0

    return (
        <button
            onClick={onSelect}
            aria-pressed={isSelected}
            className={cn(
                /* MD3 Elevated Card */
                'w-full text-left p-4 rounded-xl',
                'bg-[--color-surface-container-low] md:bg-[--color-surface-container]', // Use container-low if available, else container
                'border-2', // Keep border-2 for layout stability
                isSelected
                    ? 'border-[--color-accent] shadow-[--elevation-3] bg-[--color-surface-container-high]'
                    : 'border-transparent shadow-[--elevation-1]', // Transparent border = visual "no border" but no layout shift
                /* Hover & transitions */
                'hover:shadow-[--elevation-2] hover:bg-[--color-surface-container-high]',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[--color-accent] focus-visible:ring-offset-2',
                'transition-all duration-200 ease-in-out'
            )}
        >
            <div className="flex items-start gap-3.5">
                {/* Large Icon */}
                <div className="p-2.5 rounded-xl bg-[--color-primary-100] flex-shrink-0 mt-0.5">
                    <AgentIcon className="h-6 w-6 text-[--color-primary-600]" aria-hidden="true" />
                </div>

                <div className="flex-1 min-w-0">
                    {/* Header: Title + Status Pill */}
                    <div className="flex items-center justify-between mb-2">
                        <h3 className="font-bold text-base text-[--color-on-surface] truncate pr-2">
                            {agent.name}
                        </h3>
                        <span className={cn(
                            'inline-flex items-center gap-1.5 px-2 py-1 rounded-md text-xs font-semibold flex-shrink-0',
                            statusDisplay.bgColor,
                            statusDisplay.textColor
                        )}>
                            <div className={cn('h-1.5 w-1.5 rounded-full', statusDisplay.dotColor)} />
                            {statusDisplay.label}
                        </span>
                    </div>

                    {/* Progress Bar (if active) */}
                    {showProgress && (
                        <div className="mb-2.5">
                            <div className="flex items-center justify-between text-[10px] font-medium text-[--color-on-surface-variant] mb-1">
                                <span>Processing...</span>
                                <span>{stats.progress}%</span>
                            </div>
                            <div className="h-1.5 w-full bg-[--color-surface-container-highest] rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-[--color-primary-500] transition-all duration-500 ease-out"
                                    style={{ width: `${stats.progress}%` }}
                                />
                            </div>
                        </div>
                    )}

                    {/* Time & Stats Row */}
                    <div className="flex items-center justify-between mt-1">
                        {/* Time */}
                        {latestLog?.created_at ? (
                            <time
                                dateTime={latestLog.created_at}
                                className="flex items-center gap-1 text-xs text-[--color-on-surface-variant]"
                            >
                                <Clock className="h-3 w-3" />
                                {formatRelativeTime(latestLog.created_at)}
                            </time>
                        ) : (
                            <span className="text-xs text-[--color-on-surface-variant]">-</span>
                        )}

                        {/* Stats badges */}
                        <div className="flex items-center gap-3">
                            {stats.newItems > 0 && (
                                <span className="flex items-center gap-1 text-xs font-medium text-[--color-success]">
                                    <Plus className="h-3 w-3" /> {stats.newItems}
                                </span>
                            )}
                            {stats.errors > 0 && (
                                <span className="flex items-center gap-1 text-xs font-medium text-[--color-error]">
                                    <AlertTriangle className="h-3 w-3" /> {stats.errors}
                                </span>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </button>
    )
}
