import * as Sentry from "@sentry/nextjs";

const isDevelopment = process.env.NODE_ENV !== "production";
const safeContextKeys = new Set([
  "area",
  "method",
  "operation",
  "source",
  "status",
]);

function sanitizeContext(context = {}) {
  return Object.fromEntries(
    Object.entries(context).filter(
      ([key, value]) => {
        if (!safeContextKeys.has(key)) return false;
        if (key === "status") return Number.isInteger(value);
        if (key === "method") {
          return ["GET", "POST", "PUT", "PATCH", "DELETE"].includes(value);
        }
        return (
          typeof value === "string" &&
          /^[a-z0-9_-]{1,64}$/i.test(value)
        );
      },
    ),
  );
}

function sanitizeSentryEvent(event) {
  if (event.request) {
    event.request = {
      ...event.request,
      url: undefined,
      query_string: undefined,
      headers: undefined,
      data: undefined,
      cookies: undefined,
    };
  }

  event.user = undefined;
  event.extra = undefined;
  event.contexts = undefined;
  event.message = event.message ? "Frontend error" : undefined;
  event.logentry = undefined;
  event.transaction = undefined;

  if (event.tags) {
    event.tags = Object.fromEntries(
      Object.entries(event.tags).filter(([key]) => safeContextKeys.has(key)),
    );
  }

  if (event.exception?.values) {
    event.exception.values = event.exception.values.map((exception) => ({
      ...exception,
      value: "Frontend exception",
    }));
  }

  if (event.breadcrumbs) {
    event.breadcrumbs = event.breadcrumbs.map(({ message, data, ...breadcrumb }) => ({
      ...breadcrumb,
      ...(message ? { message: "Application event" } : {}),
      ...(data ? { data: undefined } : {}),
    }));
  }

  return event;
}

export function initializeErrorMonitoring() {
  const dsn = process.env.NEXT_PUBLIC_SENTRY_DSN;

  if (
    typeof window === "undefined" ||
    isDevelopment ||
    !dsn
  ) {
    return;
  }

  Sentry.init({
    dsn,
    sendDefaultPii: false,
    beforeSend: sanitizeSentryEvent,
  });
}

function write(level, event, context = {}, exception) {
  const safeContext = sanitizeContext(context);
  const safeEvent =
    typeof event === "string" && /^[a-z0-9_.-]{1,100}$/i.test(event)
      ? event
      : "application.event";

  if (isDevelopment) {
    const record = {
      timestamp: new Date().toISOString(),
      level,
      event: safeEvent,
      ...safeContext,
      ...(exception
        ? {
            error: {
              name:
                typeof exception.name === "string" &&
                /^[a-z0-9_-]{1,40}$/i.test(exception.name)
                  ? exception.name
                  : "Error",
            },
          }
        : {}),
    };
    console[level](JSON.stringify(record));
    return;
  }

  if (level !== "error" || typeof window === "undefined") return;

  Sentry.withScope((scope) => {
    for (const [key, value] of Object.entries(safeContext)) {
      scope.setTag(key, String(value));
    }

    if (exception instanceof Error) {
      Sentry.captureException(exception);
    } else {
      Sentry.captureMessage(safeEvent, "error");
    }
  });
}

export const logger = {
  debug: (event, context) => write("debug", event, context),
  info: (event, context) => write("info", event, context),
  warn: (event, context) => write("warn", event, context),
  error: (event, context, exception) =>
    write("error", event, context, exception),
};
