import { useState, useEffect, useCallback } from 'react'
import { AGENTS } from '@/agents'
import { AgentListItem, AgentDetailPanel } from '@/components/agents'
import { cn } from '@/lib/utils'

export default function Dashboard() {
    const [selectedAgentId, setSelectedAgentId] = useState<string>(AGENTS[0]?.id ?? '')

    const selectedAgent = AGENTS.find((a) => a.id === selectedAgentId)

    // Keyboard navigation
    const handleKeyDown = useCallback((e: KeyboardEvent) => {
        const currentIndex = AGENTS.findIndex((a) => a.id === selectedAgentId)

        if (e.key === 'ArrowDown' || e.key === 'j') {
            e.preventDefault()
            const nextIndex = Math.min(currentIndex + 1, AGENTS.length - 1)
            setSelectedAgentId(AGENTS[nextIndex].id)
        } else if (e.key === 'ArrowUp' || e.key === 'k') {
            e.preventDefault()
            const prevIndex = Math.max(currentIndex - 1, 0)
            setSelectedAgentId(AGENTS[prevIndex].id)
        }
    }, [selectedAgentId])

    useEffect(() => {
        window.addEventListener('keydown', handleKeyDown)
        return () => window.removeEventListener('keydown', handleKeyDown)
    }, [handleKeyDown])

    return (
        <div className="h-[calc(100vh-8rem)] flex flex-col md:flex-row gap-4 p-4">
            {/* Left Panel: Agent List */}
            <aside
                className={cn(
                    'flex-shrink-0 space-y-3 overflow-y-auto',
                    /* Board styling: Distinct background container */
                    'bg-[--color-surface-container-high] rounded-2xl p-3',
                    /* Desktop: fixed width sidebar */
                    'md:w-80 lg:w-96',
                    /* Mobile: horizontal scroll or stacked */
                    'flex flex-row md:flex-col gap-3 overflow-x-auto md:overflow-x-visible pb-2 md:pb-0',
                    '-mx-4 px-4 md:mx-0'
                )}
                role="listbox"
                aria-label="Agent list"
                aria-activedescendant={selectedAgentId}
            >
                {AGENTS.map((agent) => (
                    <div
                        key={agent.id}
                        id={agent.id}
                        role="option"
                        aria-selected={agent.id === selectedAgentId}
                        className="flex-shrink-0 w-64 md:w-full"
                    >
                        <AgentListItem
                            agent={agent}
                            isSelected={agent.id === selectedAgentId}
                            onSelect={() => setSelectedAgentId(agent.id)}
                        />
                    </div>
                ))}
            </aside>

            {/* Right Panel: Agent Detail */}
            <main
                className={cn(
                    'flex-1 min-w-0',
                    /* Mobile: full height when agent selected */
                    'hidden md:block',
                    selectedAgentId && 'block'
                )}
                aria-live="polite"
            >
                {selectedAgent ? (
                    <AgentDetailPanel
                        agent={selectedAgent}
                        onClose={() => setSelectedAgentId('')}
                    />
                ) : (
                    <div className="h-full flex items-center justify-center bg-[--color-surface-container] rounded-xl">
                        <p className="text-[--color-on-surface-variant]">
                            Select an agent to view details
                        </p>
                    </div>
                )}
            </main>
        </div>
    )
}
