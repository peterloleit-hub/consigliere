import { useMutation, useQuery } from '@tanstack/react-query'
import { toast } from 'sonner'

/** Get webhook URL for an agent from env */
function getWebhookUrl(envKey: string): string | null {
    const url = import.meta.env[envKey]
    return url && url !== 'placeholder' ? url : null
}

/** Trigger an agent's n8n webhook */
export function useTriggerAgent() {
    return useMutation({
        mutationFn: async ({ webhookEnvKey, payload }: { webhookEnvKey: string; payload?: Record<string, unknown> }) => {
            const url = getWebhookUrl(webhookEnvKey)

            if (!url) {
                throw new Error(`Webhook not configured: ${webhookEnvKey}`)
            }

            const response = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload || { triggered: true, timestamp: new Date().toISOString() }),
            })

            if (!response.ok) {
                throw new Error(`Webhook failed: ${response.status}`)
            }

            return response.json()
        },
        onSuccess: () => {
            toast.success('Agent triggered successfully')
        },
        onError: (error) => {
            toast.error(`Failed to trigger: ${error.message}`)
        },
    })
}

/** Test connectivity to n8n instance */
export function useTestN8NConnectivity() {
    return useQuery({
        queryKey: ['n8n-connectivity'],
        queryFn: async () => {
            // Try to reach any configured webhook URL
            const urls = [
                import.meta.env.VITE_N8N_BUSINESS_INTEL_URL,
                import.meta.env.VITE_N8N_CAREER_SCOUT_URL,
                import.meta.env.VITE_N8N_LINKEDIN_RESEARCHER_URL,
            ].filter((url) => url && url !== 'placeholder')

            if (urls.length === 0) {
                return { connected: false, message: 'No webhooks configured' }
            }

            try {
                // Just do a HEAD request to check connectivity
                const response = await fetch(urls[0], { method: 'HEAD' })
                return { connected: response.ok || response.status === 405, message: 'Connected' }
            } catch {
                return { connected: false, message: 'Cannot reach n8n instance' }
            }
        },
        enabled: false, // Manual trigger only
        retry: false,
    })
}
