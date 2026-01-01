import { useQuery } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import type { AgentLog } from '@/types/database'

const POLLING_INTERVAL = 5000 // 5 seconds

/** Fetch agent logs with polling */
export function useAgentLogs(limit = 20) {
    return useQuery({
        queryKey: ['agent-logs', limit],
        queryFn: async () => {
            const { data, error } = await supabase
                .from('agent_logs')
                .select('*')
                .order('created_at', { ascending: false })
                .limit(limit)

            if (error) throw error
            return data as AgentLog[]
        },
        refetchInterval: POLLING_INTERVAL,
    })
}

/** Fetch logs for a specific agent */
export function useAgentLogsByName(agentName: string, limit = 10) {
    return useQuery({
        queryKey: ['agent-logs', agentName, limit],
        queryFn: async () => {
            const { data, error } = await supabase
                .from('agent_logs')
                .select('*')
                .eq('agent_name', agentName)
                .order('created_at', { ascending: false })
                .limit(limit)

            if (error) throw error
            return data as AgentLog[]
        },
        refetchInterval: POLLING_INTERVAL,
    })
}

/** Get the most recent log for an agent (for status) */
export function useLatestAgentLog(agentName: string) {
    return useQuery({
        queryKey: ['agent-logs', agentName, 'latest'],
        queryFn: async () => {
            const { data, error } = await supabase
                .from('agent_logs')
                .select('*')
                .eq('agent_name', agentName)
                .order('created_at', { ascending: false })
                .limit(1)
                .single()

            if (error && error.code !== 'PGRST116') throw error
            return data as AgentLog | null
        },
        refetchInterval: POLLING_INTERVAL,
    })
}
