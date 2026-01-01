-- Mission Control Database Schema
-- Run with: npx supabase db push

-- Agent configurations (key-value store)
CREATE TABLE IF NOT EXISTS agent_configs (
    key TEXT PRIMARY KEY,
    value JSONB NOT NULL DEFAULT '{}',
    last_updated TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Agent activity logs
CREATE TABLE IF NOT EXISTS agent_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    agent_name TEXT NOT NULL,
    action_detail TEXT NOT NULL,
    status TEXT NOT NULL CHECK (status IN ('success', 'error', 'pending')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Business metrics (Thai Tone Trainer)
CREATE TABLE IF NOT EXISTS business_metrics (
    date DATE PRIMARY KEY,
    users INTEGER NOT NULL DEFAULT 0,
    revenue NUMERIC(10,2) NOT NULL DEFAULT 0,
    spend NUMERIC(10,2) NOT NULL DEFAULT 0
);

-- Indexes for common queries
CREATE INDEX IF NOT EXISTS idx_agent_logs_agent_name ON agent_logs(agent_name);
CREATE INDEX IF NOT EXISTS idx_agent_logs_created_at ON agent_logs(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_business_metrics_date ON business_metrics(date DESC);

-- Auto-update last_updated on agent_configs
CREATE OR REPLACE FUNCTION update_last_updated()
RETURNS TRIGGER AS $$
BEGIN
    NEW.last_updated = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS agent_configs_updated ON agent_configs;
CREATE TRIGGER agent_configs_updated
    BEFORE UPDATE ON agent_configs
    FOR EACH ROW
    EXECUTE FUNCTION update_last_updated();

-- Seed some default configurations
INSERT INTO agent_configs (key, value) VALUES
    ('bremen-protocol', '{"deep_work_start": "09:00", "deep_work_end": "12:00", "mobility_mode": "auto", "weather_override": true, "toddler_buffer": 15}'),
    ('business-intel', '{"briefing_time": "09:00", "anomaly_threshold": 20, "budget_limit": "500", "budget_alert_threshold": 90}'),
    ('career-scout', '{"regions_include": ["EMEA"], "regions_exclude": ["US", "AU"], "bangkok_observatory": true, "language_priority": 80, "engagement_types": ["full-time", "contract", "fractional"], "auto_apply": true}'),
    ('linkedin-researcher', '{"topics": ["Frontier AI", "RAG", "Agentic AI"], "personas": ["eu-regulation", "mittelstand", "cto-bizdev"], "output_format": "both"}')
ON CONFLICT (key) DO NOTHING;
