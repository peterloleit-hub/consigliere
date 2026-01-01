import { type LucideIcon } from 'lucide-react'

/** Field types for dynamic config forms */
export type ConfigFieldType =
    | 'toggle'
    | 'slider'
    | 'text'
    | 'textarea'
    | 'time-range'
    | 'multi-select'
    | 'select'
    | 'tags'

/** Single configuration field definition */
export interface ConfigField {
    key: string
    label: string
    type: ConfigFieldType
    description?: string
    defaultValue?: unknown
    options?: { value: string; label: string }[]
    min?: number
    max?: number
    step?: number
}

/** Agent category for grouping */
export type AgentCategory = 'business' | 'career' | 'lifestyle'

/** Agent definition - add new agents to registry.ts */
export interface AgentDefinition {
    id: string
    name: string
    description: string
    icon: LucideIcon
    category: AgentCategory
    webhookEnvKey: string
    configFields: ConfigField[]
}

/** Agent status from logs */
export type AgentStatus = 'success' | 'idle' | 'error' | 'pending'
