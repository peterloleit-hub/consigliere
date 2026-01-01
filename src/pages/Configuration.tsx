import { useState } from 'react'
import { ChevronDown, Save, Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import { AGENTS, bremenProtocolFields } from '@/agents'
import { useUpdateAgentConfig } from '@/hooks'
import type { ConfigField } from '@/types/agent'

interface ConfigSectionProps {
    title: string
    description?: string
    fields: ConfigField[]
    configKey: string
    icon?: React.ComponentType<{ className?: string }>
    defaultOpen?: boolean
}

function ConfigSection({
    title,
    description,
    fields,
    configKey,
    icon: Icon,
    defaultOpen = false,
}: ConfigSectionProps) {
    const [isOpen, setIsOpen] = useState(defaultOpen)
    const [values, setValues] = useState<Record<string, unknown>>(() => {
        const initial: Record<string, unknown> = {}
        fields.forEach((f) => {
            initial[f.key] = f.defaultValue
        })
        return initial
    })

    const { mutate: save, isPending } = useUpdateAgentConfig()

    const handleSave = () => {
        save({ key: configKey, value: values })
    }

    const updateValue = (key: string, value: unknown) => {
        setValues((prev) => ({ ...prev, [key]: value }))
    }

    return (
        <div className="rounded-xl bg-[--color-surface-container] overflow-hidden">
            {/* Header */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center justify-between w-full p-4 text-left hover:bg-[--color-surface-container-high] transition-colors"
            >
                <div className="flex items-center gap-3">
                    {Icon && (
                        <div className="p-2 rounded-lg bg-[--color-primary-100]">
                            <Icon className="h-5 w-5 text-[--color-primary-600]" />
                        </div>
                    )}
                    <div>
                        <h3 className="font-medium text-[--color-on-surface]">{title}</h3>
                        {description && (
                            <p className="text-xs text-[--color-on-surface-variant] mt-0.5">{description}</p>
                        )}
                    </div>
                </div>
                <ChevronDown
                    className={cn(
                        'h-5 w-5 text-[--color-on-surface-variant] transition-transform',
                        isOpen && 'rotate-180'
                    )}
                />
            </button>

            {/* Fields */}
            {isOpen && (
                <div className="px-4 pb-4 space-y-4 border-t border-[--color-surface-container-highest]">
                    <div className="pt-4 space-y-4">
                        {fields.map((field) => (
                            <ConfigFieldInput
                                key={field.key}
                                field={field}
                                value={values[field.key]}
                                onChange={(v) => updateValue(field.key, v)}
                            />
                        ))}
                    </div>

                    {/* Save button */}
                    <button
                        onClick={handleSave}
                        disabled={isPending}
                        className={cn(
                            'w-full flex items-center justify-center gap-2 py-2.5 rounded-lg font-medium text-sm transition-colors',
                            'bg-[--color-primary-500] text-white hover:bg-[--color-primary-600]',
                            'disabled:opacity-50 disabled:cursor-not-allowed'
                        )}
                    >
                        {isPending ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                            <Save className="h-4 w-4" />
                        )}
                        Save Changes
                    </button>
                </div>
            )}
        </div>
    )
}

interface ConfigFieldInputProps {
    field: ConfigField
    value: unknown
    onChange: (value: unknown) => void
}

function ConfigFieldInput({ field, value, onChange }: ConfigFieldInputProps) {
    const baseInputClass =
        'w-full px-3 py-2 rounded-lg bg-[--color-surface] border border-[--color-surface-container-highest] text-sm text-[--color-on-surface] focus:outline-none focus:ring-2 focus:ring-[--color-primary-500]'

    switch (field.type) {
        case 'toggle':
            return (
                <label className="flex items-center justify-between cursor-pointer">
                    <div>
                        <div className="font-medium text-sm text-[--color-on-surface]">{field.label}</div>
                        {field.description && (
                            <div className="text-xs text-[--color-on-surface-variant]">{field.description}</div>
                        )}
                    </div>
                    <button
                        type="button"
                        role="switch"
                        aria-checked={!!value}
                        onClick={() => onChange(!value)}
                        className={cn(
                            'relative inline-flex h-6 w-11 items-center rounded-full transition-colors',
                            value ? 'bg-[--color-primary-500]' : 'bg-[--color-surface-container-highest]'
                        )}
                    >
                        <span
                            className={cn(
                                'inline-block h-4 w-4 transform rounded-full bg-white transition-transform',
                                value ? 'translate-x-6' : 'translate-x-1'
                            )}
                        />
                    </button>
                </label>
            )

        case 'slider':
            return (
                <div>
                    <div className="flex items-center justify-between mb-2">
                        <label className="font-medium text-sm text-[--color-on-surface]">{field.label}</label>
                        <span className="text-sm text-[--color-primary-600] font-medium">{value as number}</span>
                    </div>
                    {field.description && (
                        <div className="text-xs text-[--color-on-surface-variant] mb-2">{field.description}</div>
                    )}
                    <input
                        type="range"
                        min={field.min}
                        max={field.max}
                        step={field.step}
                        value={value as number}
                        onChange={(e) => onChange(Number(e.target.value))}
                        className="w-full accent-[--color-primary-500]"
                    />
                </div>
            )

        case 'textarea':
            return (
                <div>
                    <label className="block font-medium text-sm text-[--color-on-surface] mb-1">
                        {field.label}
                    </label>
                    {field.description && (
                        <div className="text-xs text-[--color-on-surface-variant] mb-2">{field.description}</div>
                    )}
                    <textarea
                        value={value as string}
                        onChange={(e) => onChange(e.target.value)}
                        rows={3}
                        className={cn(baseInputClass, 'resize-none')}
                    />
                </div>
            )

        case 'select':
            return (
                <div>
                    <label className="block font-medium text-sm text-[--color-on-surface] mb-1">
                        {field.label}
                    </label>
                    {field.description && (
                        <div className="text-xs text-[--color-on-surface-variant] mb-2">{field.description}</div>
                    )}
                    <select
                        value={value as string}
                        onChange={(e) => onChange(e.target.value)}
                        className={baseInputClass}
                    >
                        {field.options?.map((opt) => (
                            <option key={opt.value} value={opt.value}>
                                {opt.label}
                            </option>
                        ))}
                    </select>
                </div>
            )

        case 'multi-select':
            const selectedValues = (value as string[]) || []
            return (
                <div>
                    <label className="block font-medium text-sm text-[--color-on-surface] mb-1">
                        {field.label}
                    </label>
                    {field.description && (
                        <div className="text-xs text-[--color-on-surface-variant] mb-2">{field.description}</div>
                    )}
                    <div className="flex flex-wrap gap-2">
                        {field.options?.map((opt) => {
                            const isSelected = selectedValues.includes(opt.value)
                            return (
                                <button
                                    key={opt.value}
                                    type="button"
                                    onClick={() => {
                                        if (isSelected) {
                                            onChange(selectedValues.filter((v) => v !== opt.value))
                                        } else {
                                            onChange([...selectedValues, opt.value])
                                        }
                                    }}
                                    className={cn(
                                        'px-3 py-1.5 rounded-full text-xs font-medium transition-colors',
                                        isSelected
                                            ? 'bg-[--color-primary-500] text-white'
                                            : 'bg-[--color-surface-container-high] text-[--color-on-surface-variant] hover:bg-[--color-surface-container-highest]'
                                    )}
                                >
                                    {opt.label}
                                </button>
                            )
                        })}
                    </div>
                </div>
            )

        default:
            return (
                <div>
                    <label className="block font-medium text-sm text-[--color-on-surface] mb-1">
                        {field.label}
                    </label>
                    {field.description && (
                        <div className="text-xs text-[--color-on-surface-variant] mb-2">{field.description}</div>
                    )}
                    <input
                        type="text"
                        value={value as string}
                        onChange={(e) => onChange(e.target.value)}
                        className={baseInputClass}
                    />
                </div>
            )
    }
}

export default function Configuration() {
    return (
        <div className="p-4 space-y-4">
            {/* Page header */}
            <div>
                <h2 className="text-lg font-semibold text-[--color-on-surface]">Configuration</h2>
                <p className="text-sm text-[--color-on-surface-variant]">
                    Agent settings and Bremen Protocol
                </p>
            </div>

            {/* Bremen Protocol */}
            <ConfigSection
                title="Bremen Protocol"
                description="Shared settings: Deep Work, Mobility, Guardrails"
                fields={bremenProtocolFields}
                configKey="bremen-protocol"
                defaultOpen
            />

            {/* Agent configs */}
            {AGENTS.map((agent) => (
                <ConfigSection
                    key={agent.id}
                    title={agent.name}
                    description={agent.description}
                    fields={agent.configFields}
                    configKey={agent.id}
                    icon={agent.icon}
                />
            ))}
        </div>
    )
}
