-- FalconFleetOps normalized data model.
-- Named decision: TimescaleDB is selected over ClickHouse for v1 because PostgreSQL row-level
-- security, transactional ticket/audit writes and time_bucket rollups keep the modular monolith simple.
CREATE EXTENSION IF NOT EXISTS timescaledb;
CREATE TYPE robot_status AS ENUM ('nominal','degraded','fault','maintenance','offline');
CREATE TYPE deployment_strategy AS ENUM ('immediate','canary','staged');
CREATE TYPE deployment_state AS ENUM ('pending','dispatched','installing','installed','rolled_back','failed');
CREATE TYPE downtime_attribution AS ENUM ('fault','software','firmware','parts_wait','scheduled','unknown');
CREATE TABLE customers (id uuid PRIMARY KEY, name text NOT NULL, billing_plan text NOT NULL, robot_count int NOT NULL DEFAULT 0, stripe_customer_id text, created_at timestamptz NOT NULL DEFAULT now(), updated_at timestamptz NOT NULL DEFAULT now());
CREATE TABLE sites (id uuid PRIMARY KEY, name text NOT NULL, address text NOT NULL, timezone text NOT NULL, customer_id uuid NOT NULL REFERENCES customers(id), config jsonb NOT NULL DEFAULT '{}', created_at timestamptz NOT NULL DEFAULT now(), updated_at timestamptz NOT NULL DEFAULT now());
CREATE TABLE robots (id uuid PRIMARY KEY, site_id uuid NOT NULL REFERENCES sites(id), vendor text NOT NULL, model text NOT NULL, serial_number text UNIQUE NOT NULL, firmware_version text NOT NULL, can_id_or_endpoint text NOT NULL, commissioning_date date NOT NULL, status robot_status NOT NULL DEFAULT 'offline', last_seen timestamptz, created_at timestamptz NOT NULL DEFAULT now(), updated_at timestamptz NOT NULL DEFAULT now());
CREATE TABLE telemetry_raw (robot_id uuid NOT NULL REFERENCES robots(id), ts timestamptz NOT NULL, metrics jsonb NOT NULL, source text NOT NULL, created_at timestamptz NOT NULL DEFAULT now(), updated_at timestamptz NOT NULL DEFAULT now(), PRIMARY KEY(robot_id, ts));
SELECT create_hypertable('telemetry_raw', by_range('ts'), if_not_exists => TRUE);
CREATE TABLE telemetry_rollups_1m (robot_id uuid NOT NULL REFERENCES robots(id), ts timestamptz NOT NULL, battery_pct_avg numeric NOT NULL, temp_max numeric NOT NULL, distance_m numeric NOT NULL, runtime_s bigint NOT NULL, fault_codes text[] NOT NULL DEFAULT '{}', status robot_status NOT NULL, created_at timestamptz NOT NULL DEFAULT now(), updated_at timestamptz NOT NULL DEFAULT now(), PRIMARY KEY(robot_id, ts));
CREATE TABLE telemetry_rollups_1h (LIKE telemetry_rollups_1m INCLUDING ALL);
CREATE TABLE audit_events (id uuid PRIMARY KEY, site_id uuid NOT NULL REFERENCES sites(id), robot_id uuid REFERENCES robots(id), actor_id text NOT NULL, actor_role text NOT NULL, event_type text NOT NULL, payload jsonb NOT NULL, hash_prev text, hash_self text NOT NULL, created_at timestamptz NOT NULL DEFAULT now(), updated_at timestamptz NOT NULL DEFAULT now());
CREATE OR REPLACE FUNCTION deny_audit_mutation() RETURNS trigger LANGUAGE plpgsql AS $$ BEGIN RAISE EXCEPTION 'audit_events is append-only'; END; $$;
CREATE TRIGGER audit_no_update BEFORE UPDATE OR DELETE ON audit_events FOR EACH ROW EXECUTE FUNCTION deny_audit_mutation();
ALTER TABLE sites ENABLE ROW LEVEL SECURITY;
ALTER TABLE robots ENABLE ROW LEVEL SECURITY;
CREATE POLICY tenant_sites ON sites USING (customer_id = current_setting('app.customer_id')::uuid);
CREATE POLICY tenant_robots ON robots USING (site_id IN (SELECT id FROM sites WHERE customer_id = current_setting('app.customer_id')::uuid));
