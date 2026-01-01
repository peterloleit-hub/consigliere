/** Supabase table: agent_configs */
export interface AgentConfig {
    key: string
    value: Record<string, unknown>
    last_updated: string
}

/** Supabase table: agent_logs */
export interface AgentLog {
    id: string
    agent_name: string
    action_detail: string
    status: 'success' | 'error' | 'pending'
    created_at: string
}

/** Supabase table: business_metrics */
export interface BusinessMetric {
    date: string
    users: number
    revenue: number
    spend: number
}

/** Database schema for Supabase type generation */
export interface Database {
    public: {
        Tables: {
            agent_configs: {
                Row: AgentConfig
                Insert: Omit<AgentConfig, 'last_updated'>
                Update: Partial<Omit<AgentConfig, 'last_updated'>>
            }
            agent_logs: {
                Row: AgentLog
                Insert: Omit<AgentLog, 'id' | 'created_at'>
                Update: Partial<Omit<AgentLog, 'id' | 'created_at'>>
            }
            business_metrics: {
                Row: BusinessMetric
                Insert: BusinessMetric
                Update: Partial<BusinessMetric>
            }
        }
    }
}
