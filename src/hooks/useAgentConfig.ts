import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import type { AgentConfig } from '@/types/database'
import { toast } from 'sonner'

/** Fetch all agent configs */
export function useAgentConfigs() {
    return useQuery({
        queryKey: ['agent-configs'],
        queryFn: async () => {
            const { data, error } = await supabase
                .from('agent_configs')
                .select('*')
                .order('key')

            if (error) throw error
            return data as AgentConfig[]
        },
    })
}

/** Get a specific config value */
export function useAgentConfig(key: string) {
    return useQuery({
        queryKey: ['agent-config', key],
        queryFn: async () => {
            const { data, error } = await supabase
                .from('agent_configs')
                .select('*')
                .eq('key', key)
                .single()

            if (error && error.code !== 'PGRST116') throw error // PGRST116 = no rows
            return data as AgentConfig | null
        },
    })
}

/** Update or insert a config value */
export function useUpdateAgentConfig() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: async ({ key, value }: { key: string; value: Record<string, unknown> }) => {
            // Use any to bypass strict typing when Supabase tables aren't configured
            const { error } = await (supabase as any)
                .from('agent_configs')
                .upsert({ key, value }, { onConflict: 'key' })

            if (error) throw error
        },
        onSuccess: (_, { key }) => {
            queryClient.invalidateQueries({ queryKey: ['agent-configs'] })
            queryClient.invalidateQueries({ queryKey: ['agent-config', key] })
            toast.success('Settings saved')
        },
        onError: (error) => {
            toast.error(`Failed to save: ${error.message}`)
        },
    })
}
