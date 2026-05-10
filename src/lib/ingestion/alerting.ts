const WEBHOOK_URL = process.env.ALERT_WEBHOOK_URL ?? "";
const ENV = process.env.NODE_ENV ?? "development";

export type AlertLevel = "info" | "warning" | "error";

export interface AlertMessage {
  level: AlertLevel;
  source: string;
  message: string;
  details?: string;
}

// Track consecutive failures to avoid noise
const failureCount: Record<string, number> = {};
const THRESHOLD = 3; // alert only after N consecutive failures

export async function sendAlert(alert: AlertMessage): Promise<void> {
  if (!WEBHOOK_URL) return;
  if (alert.level === "error" && (failureCount[alert.source] ?? 0) < THRESHOLD) {
    failureCount[alert.source] = (failureCount[alert.source] ?? 0) + 1;
    return; // suppress until threshold reached
  }

  if (alert.level === "error") {
    failureCount[alert.source] = 0;
  }

  const body = {
    env: ENV,
    level: alert.level,
    source: alert.source,
    message: alert.message,
    details: alert.details,
    timestamp: new Date().toISOString(),
  };

  try {
    await fetch(WEBHOOK_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
  } catch {
    // swallowing errors in alerting — never break ingestion due to alerting
  }
}

export function resetFailureCount(source: string) {
  failureCount[source] = 0;
}