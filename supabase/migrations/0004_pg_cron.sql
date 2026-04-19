-- Enable pg_cron (requires pg_cron extension — available on Supabase Pro)
-- Run this in the Supabase SQL editor after enabling the extension in the dashboard.

CREATE EXTENSION IF NOT EXISTS pg_cron;

-- Invoke the advance-phase Edge Function every minute.
-- The function self-loops every 3s for 55s, covering sub-minute granularity.
SELECT cron.schedule(
  'advance-phase',
  '* * * * *',
  $$
    SELECT net.http_post(
      url := current_setting('app.supabase_url') || '/functions/v1/advance-phase',
      headers := jsonb_build_object(
        'Authorization', 'Bearer ' || current_setting('app.service_role_key'),
        'Content-Type', 'application/json'
      ),
      body := '{}'::jsonb
    );
  $$
);

-- Stale room cleanup: delete abandoned rooms older than 2 hours
SELECT cron.schedule(
  'cleanup-stale-rooms',
  '0 * * * *',
  $$
    DELETE FROM rooms
    WHERE (phase = 'leaderboard' OR phase = 'lobby')
      AND updated_at < now() - interval '2 hours';
  $$
);
