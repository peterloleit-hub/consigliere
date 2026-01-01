import { BarChart3, Briefcase, Linkedin } from 'lucide-react'
import type { AgentDefinition } from '@/types/agent'

/** Business Intelligence Agent - Thai Tone Trainer metrics */
const businessIntel: AgentDefinition = {
    id: 'business-intel',
    name: 'Business Monitor',
    description: 'Daily briefings, anomaly detection, and budget tracking for Thai Tone Trainer',
    icon: BarChart3,
    category: 'business',
    webhookEnvKey: 'VITE_N8N_BUSINESS_INTEL_URL',
    route: { source: 'KPIs', destination: 'Alerts' },
    configFields: [
        {
            key: 'briefing_time',
            label: 'Daily Briefing Time',
            type: 'text',
            description: 'Time for daily kickoff report (CET)',
            defaultValue: '09:00',
        },
        {
            key: 'anomaly_threshold',
            label: 'Anomaly Threshold (%)',
            type: 'slider',
            description: 'Traffic spike/drop trigger percentage',
            min: 5,
            max: 50,
            step: 5,
            defaultValue: 20,
        },
        {
            key: 'budget_limit',
            label: 'Monthly Budget (€)',
            type: 'text',
            description: 'Maximum monthly spend cap',
            defaultValue: '500',
        },
        {
            key: 'budget_alert_threshold',
            label: 'Budget Alert (%)',
            type: 'slider',
            description: 'Alert when spend reaches this percentage',
            min: 50,
            max: 95,
            step: 5,
            defaultValue: 90,
        },
    ],
}

/** Career Portfolio Scout - EMEA job hunting */
const careerScout: AgentDefinition = {
    id: 'career-scout',
    name: 'Career Portfolio Scout',
    description: 'EMEA-focused job monitoring with geographic and timezone guardrails',
    icon: Briefcase,
    category: 'career',
    webhookEnvKey: 'VITE_N8N_CAREER_SCOUT_URL',
    route: { source: 'Jobs', destination: 'Matches' },
    configFields: [
        {
            key: 'regions_include',
            label: 'Include Regions',
            type: 'multi-select',
            description: 'Regions to actively monitor',
            options: [
                { value: 'EMEA', label: 'EMEA' },
                { value: 'UK', label: 'United Kingdom' },
                { value: 'DE', label: 'Germany' },
                { value: 'NL', label: 'Netherlands' },
            ],
            defaultValue: ['EMEA'],
        },
        {
            key: 'regions_exclude',
            label: 'Exclude Regions',
            type: 'multi-select',
            description: 'Regions to filter out',
            options: [
                { value: 'US', label: 'United States' },
                { value: 'AU', label: 'Australia' },
                { value: 'APAC', label: 'Asia-Pacific' },
            ],
            defaultValue: ['US', 'AU'],
        },
        {
            key: 'bangkok_observatory',
            label: 'Bangkok Observatory Mode',
            type: 'toggle',
            description: 'Save Bangkok roles without applying',
            defaultValue: true,
        },
        {
            key: 'language_priority',
            label: 'English Priority',
            type: 'slider',
            description: 'Weight towards English vs German roles',
            min: 0,
            max: 100,
            step: 10,
            defaultValue: 80,
        },
        {
            key: 'engagement_types',
            label: 'Engagement Types',
            type: 'multi-select',
            options: [
                { value: 'full-time', label: 'Full-time' },
                { value: 'part-time', label: 'Part-time' },
                { value: 'contract', label: 'Contract' },
                { value: 'fractional', label: 'Fractional' },
            ],
            defaultValue: ['full-time', 'contract', 'fractional'],
        },
        {
            key: 'auto_apply',
            label: 'Auto Easy Apply',
            type: 'toggle',
            description: 'Automatically apply to Tier-1 matches',
            defaultValue: true,
        },
    ],
}

/** LinkedIn Researcher - Thought leadership */
const linkedinResearcher: AgentDefinition = {
    id: 'linkedin-researcher',
    name: 'LinkedIn Researcher',
    description: 'AI topic tracking and multi-persona content generation',
    icon: Linkedin,
    category: 'career',
    webhookEnvKey: 'VITE_N8N_LINKEDIN_RESEARCHER_URL',
    route: { source: 'Sources', destination: 'Summaries' },
    configFields: [
        {
            key: 'topics',
            label: 'Topics of Interest',
            type: 'tags',
            description: 'Keywords to track',
            defaultValue: ['Frontier AI', 'RAG', 'Agentic AI', 'AI Business Trends'],
        },
        {
            key: 'personas',
            label: 'Content Personas',
            type: 'multi-select',
            options: [
                { value: 'eu-regulation', label: 'EU Regulation (AI Act)' },
                { value: 'mittelstand', label: 'German Mittelstand' },
                { value: 'cto-bizdev', label: 'CTO/BizDev' },
            ],
            defaultValue: ['eu-regulation', 'mittelstand', 'cto-bizdev'],
        },
        {
            key: 'output_format',
            label: 'Output Format',
            type: 'select',
            options: [
                { value: 'review-deck', label: 'Review Deck (summaries + sources)' },
                { value: 'linkedin-posts', label: 'LinkedIn Posts' },
                { value: 'both', label: 'Both' },
            ],
            defaultValue: 'both',
        },
    ],
}

/** Central agent registry - add new agents here */
export const AGENTS: AgentDefinition[] = [
    businessIntel,
    careerScout,
    linkedinResearcher,
]

/** Get agent by ID */
export function getAgent(id: string): AgentDefinition | undefined {
    return AGENTS.find((agent) => agent.id === id)
}

/** Get agents by category */
export function getAgentsByCategory(category: AgentDefinition['category']): AgentDefinition[] {
    return AGENTS.filter((agent) => agent.category === category)
}
