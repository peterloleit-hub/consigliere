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
    const sectionId = `section-${configKey}`
    const contentId = `${sectionId}-content`

    const handleSave = () => {
        save({ key: configKey, value: values })
    }

    const updateValue = (key: string, value: unknown) => {
        setValues((prev) => ({ ...prev, [key]: value }))
    }

    return (
        <div className="rounded-xl bg-[--color-surface-container] overflow-hidden shadow-[--elevation-1]">
            {/* Accordion header with ARIA */}
            <button
                id={sectionId}
                onClick={() => setIsOpen(!isOpen)}
                aria-expanded={isOpen}
                aria-controls={contentId}
                className={cn(
                    'flex items-center justify-between w-full p-4 text-left',
                    'min-h-14', /* 56px for comfortable touch */
                    'hover:bg-[--color-primary-500]/[0.08]',
                    'focus-visible:outline-none focus-visible:bg-[--color-primary-500]/[0.12]',
                    'transition-colors duration-150'
                )}
            >
                <div className="flex items-center gap-3">
                    {Icon && (
                        <div className="p-2 rounded-lg bg-[--color-primary-100]">
                            <Icon className="h-5 w-5 text-[--color-primary-600]" aria-hidden="true" />
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
                        'h-5 w-5 text-[--color-on-surface-variant] transition-transform duration-200',
                        isOpen && 'rotate-180'
                    )}
                    aria-hidden="true"
                />
            </button>

            {/* Collapsible content */}
            {isOpen && (
                <div
                    id={contentId}
                    role="region"
                    aria-labelledby={sectionId}
                    className="px-4 pb-4 space-y-4 border-t border-[--color-surface-container-highest]"
                >
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

                    {/* Save button — 48px min height */}
                    <button
                        onClick={handleSave}
                        disabled={isPending}
                        aria-busy={isPending}
                        className={cn(
                            'w-full flex items-center justify-center gap-2 min-h-12 rounded-xl',
                            'font-medium text-sm',
                            'bg-[--color-primary-500] text-white',
                            'hover:bg-[--color-primary-600]',
                            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[--color-primary-300] focus-visible:ring-offset-2',
                            'active:scale-[0.99] active:bg-[--color-primary-700]',
                            'disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100',
                            'transition-all duration-150'
                        )}
                    >
                        {isPending ? (
                            <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                        ) : (
                            <Save className="h-4 w-4" aria-hidden="true" />
                        )}
                        <span>{isPending ? 'Saving...' : 'Save Changes'}</span>
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
    const fieldId = `field-${field.key}`
    const descId = `${fieldId}-desc`

    const baseInputClass = cn(
        'w-full px-3 py-2.5 rounded-lg min-h-11',
        'bg-[--color-surface] border border-[--color-surface-container-highest]',
        'text-sm text-[--color-on-surface]',
        'focus:outline-none focus:ring-2 focus:ring-[--color-primary-500] focus:border-transparent',
        'transition-shadow duration-150'
    )

    switch (field.type) {
        case 'toggle':
            return (
                <div className="flex items-center justify-between py-2 min-h-12">
                    <div className="pr-4">
                        <label
                            htmlFor={fieldId}
                            className="font-medium text-sm text-[--color-on-surface] cursor-pointer"
                        >
                            {field.label}
                        </label>
                        {field.description && (
                            <p id={descId} className="text-xs text-[--color-on-surface-variant] mt-0.5">
                                {field.description}
                            </p>
                        )}
                    </div>
                    <button
                        id={fieldId}
                        type="button"
                        role="switch"
                        aria-checked={!!value}
                        aria-describedby={field.description ? descId : undefined}
                        onClick={() => onChange(!value)}
                        className={cn(
                            /* Size: 48x28 for touch target */
                            'relative inline-flex h-7 w-12 flex-shrink-0 items-center rounded-full',
                            'p-0.5',
                            value
                                ? 'bg-[--color-primary-500]'
                                : 'bg-[--color-surface-container-highest]',
                            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[--color-primary-300] focus-visible:ring-offset-2',
                            'transition-colors duration-200'
                        )}
                    >
                        <span
                            className={cn(
                                'inline-block h-5 w-5 transform rounded-full bg-white shadow-sm',
                                value ? 'translate-x-5' : 'translate-x-0',
                                'transition-transform duration-200'
                            )}
                        />
                        <span className="sr-only">{value ? 'Enabled' : 'Disabled'}</span>
                    </button>
                </div>
            )

        case 'slider':
            return (
                <div className="py-2">
                    <div className="flex items-center justify-between mb-2">
                        <label htmlFor={fieldId} className="font-medium text-sm text-[--color-on-surface]">
                            {field.label}
                        </label>
                        <span className="text-sm text-[--color-primary-600] font-medium tabular-nums">
                            {value as number}
                        </span>
                    </div>
                    {field.description && (
                        <p id={descId} className="text-xs text-[--color-on-surface-variant] mb-2">
                            {field.description}
                        </p>
                    )}
                    <input
                        id={fieldId}
                        type="range"
                        min={field.min}
                        max={field.max}
                        step={field.step}
                        value={value as number}
                        onChange={(e) => onChange(Number(e.target.value))}
                        aria-describedby={field.description ? descId : undefined}
                        className="w-full h-2 accent-[--color-primary-500] cursor-pointer"
                    />
                </div>
            )

        case 'textarea':
            return (
                <div className="py-2">
                    <label htmlFor={fieldId} className="block font-medium text-sm text-[--color-on-surface] mb-1">
                        {field.label}
                    </label>
                    {field.description && (
                        <p id={descId} className="text-xs text-[--color-on-surface-variant] mb-2">
                            {field.description}
                        </p>
                    )}
                    <textarea
                        id={fieldId}
                        value={value as string}
                        onChange={(e) => onChange(e.target.value)}
                        rows={3}
                        aria-describedby={field.description ? descId : undefined}
                        className={cn(baseInputClass, 'resize-none')}
                    />
                </div>
            )

        case 'select':
            return (
                <div className="py-2">
                    <label htmlFor={fieldId} className="block font-medium text-sm text-[--color-on-surface] mb-1">
                        {field.label}
                    </label>
                    {field.description && (
                        <p id={descId} className="text-xs text-[--color-on-surface-variant] mb-2">
                            {field.description}
                        </p>
                    )}
                    <select
                        id={fieldId}
                        value={value as string}
                        onChange={(e) => onChange(e.target.value)}
                        aria-describedby={field.description ? descId : undefined}
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
                <div className="py-2">
                    <div className="font-medium text-sm text-[--color-on-surface] mb-1">
                        {field.label}
                    </div>
                    {field.description && (
                        <p id={descId} className="text-xs text-[--color-on-surface-variant] mb-2">
                            {field.description}
                        </p>
                    )}
                    <div
                        className="flex flex-wrap gap-2"
                        role="group"
                        aria-label={field.label}
                        aria-describedby={field.description ? descId : undefined}
                    >
                        {field.options?.map((opt) => {
                            const isSelected = selectedValues.includes(opt.value)
                            const chipId = `${fieldId}-${opt.value}`
                            return (
                                <button
                                    key={opt.value}
                                    id={chipId}
                                    type="button"
                                    role="checkbox"
                                    aria-checked={isSelected}
                                    onClick={() => {
                                        if (isSelected) {
                                            onChange(selectedValues.filter((v) => v !== opt.value))
                                        } else {
                                            onChange([...selectedValues, opt.value])
                                        }
                                    }}
                                    className={cn(
                                        /* 44px min height for touch target */
                                        'px-4 min-h-11 rounded-full text-sm font-medium',
                                        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[--color-primary-300] focus-visible:ring-offset-2',
                                        'transition-all duration-150',
                                        isSelected
                                            ? 'bg-[--color-primary-500] text-white active:bg-[--color-primary-600]'
                                            : 'bg-[--color-surface-container-high] text-[--color-on-surface-variant] hover:bg-[--color-surface-container-highest] active:scale-[0.98]'
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
                <div className="py-2">
                    <label htmlFor={fieldId} className="block font-medium text-sm text-[--color-on-surface] mb-1">
                        {field.label}
                    </label>
                    {field.description && (
                        <p id={descId} className="text-xs text-[--color-on-surface-variant] mb-2">
                            {field.description}
                        </p>
                    )}
                    <input
                        id={fieldId}
                        type="text"
                        value={value as string}
                        onChange={(e) => onChange(e.target.value)}
                        aria-describedby={field.description ? descId : undefined}
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
            <header>
                <h2 className="text-lg font-semibold text-[--color-on-surface]">Configuration</h2>
                <p className="text-sm text-[--color-on-surface-variant]">
                    Agent settings and Bremen Protocol
                </p>
            </header>

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
