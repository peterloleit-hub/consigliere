import { useQuery } from '@tanstack/react-query'
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
} from 'recharts'
import { TrendingUp, Users, Euro, AlertCircle } from 'lucide-react'
import { cn } from '@/lib/utils'
import { supabase } from '@/lib/supabase'
import type { BusinessMetric } from '@/types/database'

// Mock data for demo when Supabase isn't configured
const mockData: BusinessMetric[] = Array.from({ length: 14 }, (_, i) => {
    const date = new Date()
    date.setDate(date.getDate() - (13 - i))
    return {
        date: date.toISOString().split('T')[0],
        users: 150 + Math.floor(Math.random() * 50) + i * 3,
        revenue: 45 + Math.random() * 20 + i * 2,
        spend: 15 + Math.random() * 10,
    }
})

function useBusinessMetrics() {
    return useQuery({
        queryKey: ['business-metrics'],
        queryFn: async () => {
            const { data, error } = await supabase
                .from('business_metrics')
                .select('*')
                .order('date', { ascending: true })
                .limit(30)

            if (error) {
                console.warn('Using mock data:', error.message)
                return mockData
            }
            return data.length > 0 ? (data as BusinessMetric[]) : mockData
        },
    })
}

interface MetricCardProps {
    title: string
    value: string
    change?: string
    changePositive?: boolean
    icon: React.ComponentType<{ className?: string }>
}

function MetricCard({ title, value, change, changePositive, icon: Icon }: MetricCardProps) {
    return (
        <div className="rounded-xl bg-[--color-surface-container] p-4">
            <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-medium text-[--color-on-surface-variant]">{title}</span>
                <Icon className="h-4 w-4 text-[--color-on-surface-variant]" />
            </div>
            <div className="text-2xl font-semibold text-[--color-on-surface]">{value}</div>
            {change && (
                <div
                    className={cn(
                        'text-xs font-medium mt-1',
                        changePositive ? 'text-[--color-success]' : 'text-[--color-error]'
                    )}
                >
                    {changePositive ? '↑' : '↓'} {change}
                </div>
            )}
        </div>
    )
}

interface BudgetProgressProps {
    spent: number
    limit: number
}

function BudgetProgress({ spent, limit }: BudgetProgressProps) {
    const percentage = Math.min((spent / limit) * 100, 100)
    const isWarning = percentage >= 90

    return (
        <div className="rounded-xl bg-[--color-surface-container] p-4">
            <div className="flex items-center justify-between mb-3">
                <div>
                    <h3 className="font-medium text-[--color-on-surface]">Marketing Budget</h3>
                    <p className="text-xs text-[--color-on-surface-variant]">Monthly spend tracker</p>
                </div>
                {isWarning && (
                    <div className="flex items-center gap-1 text-[--color-warning]">
                        <AlertCircle className="h-4 w-4" />
                        <span className="text-xs font-medium">90% reached</span>
                    </div>
                )}
            </div>

            {/* Progress bar */}
            <div className="h-3 rounded-full bg-[--color-surface-container-highest] overflow-hidden">
                <div
                    className={cn(
                        'h-full rounded-full transition-all',
                        isWarning ? 'bg-[--color-warning]' : 'bg-[--color-primary-500]'
                    )}
                    style={{ width: `${percentage}%` }}
                />
            </div>

            <div className="flex items-center justify-between mt-2 text-sm">
                <span className="text-[--color-on-surface]">€{spent.toFixed(0)} spent</span>
                <span className="text-[--color-on-surface-variant]">€{limit} limit</span>
            </div>
        </div>
    )
}

export default function BusinessMetrics() {
    const { data: metrics, isLoading } = useBusinessMetrics()

    const latestMetric = metrics?.[metrics.length - 1]
    const previousMetric = metrics?.[metrics.length - 2]

    const userChange = latestMetric && previousMetric
        ? ((latestMetric.users - previousMetric.users) / previousMetric.users * 100).toFixed(1)
        : null

    const revenueChange = latestMetric && previousMetric
        ? ((latestMetric.revenue - previousMetric.revenue) / previousMetric.revenue * 100).toFixed(1)
        : null

    const totalSpend = metrics?.reduce((sum, m) => sum + m.spend, 0) || 0

    return (
        <div className="p-4 space-y-6">
            {/* Page header */}
            <div>
                <h2 className="text-lg font-semibold text-[--color-on-surface]">Business Metrics</h2>
                <p className="text-sm text-[--color-on-surface-variant]">Thai Tone Trainer performance</p>
            </div>

            {/* Summary cards */}
            <div className="grid grid-cols-2 gap-3">
                <MetricCard
                    title="Active Users"
                    value={latestMetric?.users?.toString() || '—'}
                    change={userChange ? `${userChange}%` : undefined}
                    changePositive={Number(userChange) > 0}
                    icon={Users}
                />
                <MetricCard
                    title="Revenue"
                    value={latestMetric ? `€${latestMetric.revenue.toFixed(0)}` : '—'}
                    change={revenueChange ? `${revenueChange}%` : undefined}
                    changePositive={Number(revenueChange) > 0}
                    icon={Euro}
                />
            </div>

            {/* Budget progress */}
            <BudgetProgress spent={totalSpend} limit={500} />

            {/* Charts */}
            <section>
                <h3 className="text-sm font-medium text-[--color-on-surface-variant] mb-3 flex items-center gap-2">
                    <TrendingUp className="h-4 w-4" />
                    14-Day Trend
                </h3>

                {isLoading ? (
                    <div className="h-48 rounded-xl bg-[--color-surface-container] animate-pulse" />
                ) : (
                    <div className="rounded-xl bg-[--color-surface-container] p-4">
                        <ResponsiveContainer width="100%" height={200}>
                            <LineChart data={metrics}>
                                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-surface-container-highest)" />
                                <XAxis
                                    dataKey="date"
                                    tick={{ fontSize: 10, fill: 'var(--color-on-surface-variant)' }}
                                    tickFormatter={(v) => new Date(v).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}
                                />
                                <YAxis
                                    yAxisId="left"
                                    tick={{ fontSize: 10, fill: 'var(--color-on-surface-variant)' }}
                                    width={40}
                                />
                                <YAxis
                                    yAxisId="right"
                                    orientation="right"
                                    tick={{ fontSize: 10, fill: 'var(--color-on-surface-variant)' }}
                                    width={40}
                                />
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: 'var(--color-surface-container-high)',
                                        border: 'none',
                                        borderRadius: '8px',
                                        fontSize: 12,
                                    }}
                                />
                                <Line
                                    yAxisId="left"
                                    type="monotone"
                                    dataKey="users"
                                    stroke="var(--color-primary-500)"
                                    strokeWidth={2}
                                    dot={false}
                                    name="Users"
                                />
                                <Line
                                    yAxisId="right"
                                    type="monotone"
                                    dataKey="revenue"
                                    stroke="var(--color-success)"
                                    strokeWidth={2}
                                    dot={false}
                                    name="Revenue (€)"
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                )}
            </section>
        </div>
    )
}
