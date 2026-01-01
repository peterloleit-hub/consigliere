import type { ConfigField } from '@/types/agent'

/** Bremen Protocol - Shared settings across all agents */
export interface BremenProtocol {
    deepWorkStart: string
    deepWorkEnd: string
    highStatusWhitelist: string[]
    mobilityMode: 'ebike' | 'transit' | 'auto'
    weatherOverride: boolean
    toddlerBuffer: number
}

/** Default Bremen Protocol settings */
export const defaultBremenProtocol: BremenProtocol = {
    deepWorkStart: '09:00',
    deepWorkEnd: '12:00',
    highStatusWhitelist: [],
    mobilityMode: 'auto',
    weatherOverride: true,
    toddlerBuffer: 15,
}

/** Bremen Protocol config fields for UI */
export const bremenProtocolFields: ConfigField[] = [
    {
        key: 'deep_work_start',
        label: 'Deep Work Start',
        type: 'text',
        description: 'Start of protected focus time',
        defaultValue: '09:00',
    },
    {
        key: 'deep_work_end',
        label: 'Deep Work End',
        type: 'text',
        description: 'End of protected focus time',
        defaultValue: '12:00',
    },
    {
        key: 'high_status_whitelist',
        label: 'High-Status Whitelist',
        type: 'textarea',
        description: 'Domains/names that bypass Deep Work silence (one per line)',
        defaultValue: '',
    },
    {
        key: 'mobility_mode',
        label: 'Mobility Mode',
        type: 'select',
        options: [
            { value: 'ebike', label: 'E-Bike First' },
            { value: 'transit', label: 'Transit Only' },
            { value: 'auto', label: 'Auto (weather-based)' },
        ],
        defaultValue: 'auto',
    },
    {
        key: 'weather_override',
        label: 'Rain → Transit Override',
        type: 'toggle',
        description: 'Automatically switch to transit in rain/ice',
        defaultValue: true,
    },
    {
        key: 'toddler_buffer',
        label: 'Toddler Buffer (minutes)',
        type: 'slider',
        description: 'Extra time added for appointments with children',
        min: 0,
        max: 30,
        step: 5,
        defaultValue: 15,
    },
]
