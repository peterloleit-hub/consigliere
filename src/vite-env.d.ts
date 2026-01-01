/// <reference types="vite/client" />

interface ImportMetaEnv {
    readonly VITE_SUPABASE_URL: string
    readonly VITE_SUPABASE_ANON_KEY: string
    readonly VITE_N8N_BUSINESS_INTEL_URL: string
    readonly VITE_N8N_CAREER_SCOUT_URL: string
    readonly VITE_N8N_LINKEDIN_RESEARCHER_URL: string
}

interface ImportMeta {
    readonly env: ImportMetaEnv
}
