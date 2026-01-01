import { AGENTS } from '@/agents'
import { AgentCard, ActivityFeed } from '@/components/agents'

export default function Dashboard() {
    return (
        <div className="p-4 space-y-6">
            {/* Page header */}
            <div>
                <h2 className="text-lg font-semibold text-[--color-on-surface]">Dashboard</h2>
                <p className="text-sm text-[--color-on-surface-variant]">
                    At-a-glance view of all agents
                </p>
            </div>

            {/* Agent cards */}
            <section>
                <h3 className="text-sm font-medium text-[--color-on-surface-variant] mb-3">
                    Agents
                </h3>
                <div className="space-y-3">
                    {AGENTS.map((agent) => (
                        <AgentCard key={agent.id} agent={agent} />
                    ))}
                </div>
            </section>

            {/* Activity feed */}
            <section>
                <h3 className="text-sm font-medium text-[--color-on-surface-variant] mb-3">
                    Recent Activity
                </h3>
                <ActivityFeed />
            </section>
        </div>
    )
}
