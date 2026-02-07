/**
 * Comprehensive Logger for FusionFlow API
 * Provides consistent, clean logging with log levels and context
 */

type LogLevel = 'debug' | 'info' | 'warn' | 'error';

interface LogOptions {
    context?: string;
    data?: Record<string, unknown>;
}

const LOG_LEVELS: Record<LogLevel, number> = {
    debug: 0,
    info: 1,
    warn: 2,
    error: 3,
};

// Set minimum log level from environment (default: info in production, debug in dev)
const MIN_LEVEL = process.env.LOG_LEVEL as LogLevel ||
    (process.env.NODE_ENV === 'production' ? 'info' : 'debug');

const COLORS = {
    reset: '\x1b[0m',
    dim: '\x1b[2m',
    cyan: '\x1b[36m',
    yellow: '\x1b[33m',
    red: '\x1b[31m',
    green: '\x1b[32m',
    magenta: '\x1b[35m',
};

function formatTimestamp(): string {
    return new Date().toISOString().slice(11, 23); // HH:mm:ss.SSS
}

function formatContext(context?: string): string {
    return context ? `${COLORS.magenta}[${context}]${COLORS.reset} ` : '';
}

function formatData(data?: Record<string, unknown>): string {
    if (!data || Object.keys(data).length === 0) return '';

    // Summarize data instead of full dump
    const summary = Object.entries(data).map(([key, value]) => {
        if (typeof value === 'string' && value.length > 50) {
            return `${key}:"${value.slice(0, 47)}..."`;
        }
        if (Array.isArray(value)) {
            return `${key}:[${value.length} items]`;
        }
        if (typeof value === 'object' && value !== null) {
            return `${key}:{...}`;
        }
        return `${key}:${JSON.stringify(value)}`;
    }).join(', ');

    return ` ${COLORS.dim}(${summary})${COLORS.reset}`;
}

function shouldLog(level: LogLevel): boolean {
    return LOG_LEVELS[level] >= LOG_LEVELS[MIN_LEVEL];
}

function log(level: LogLevel, message: string, options?: LogOptions): void {
    if (!shouldLog(level)) return;

    const timestamp = `${COLORS.dim}${formatTimestamp()}${COLORS.reset}`;
    const context = formatContext(options?.context);
    const data = formatData(options?.data);

    let levelTag: string;
    switch (level) {
        case 'debug':
            levelTag = `${COLORS.cyan}DBG${COLORS.reset}`;
            break;
        case 'info':
            levelTag = `${COLORS.green}INF${COLORS.reset}`;
            break;
        case 'warn':
            levelTag = `${COLORS.yellow}WRN${COLORS.reset}`;
            break;
        case 'error':
            levelTag = `${COLORS.red}ERR${COLORS.reset}`;
            break;
    }

    const output = `${timestamp} ${levelTag} ${context}${message}${data}`;

    if (level === 'error') {
        console.error(output);
    } else if (level === 'warn') {
        console.warn(output);
    } else {
        console.log(output);
    }
}

export const logger = {
    debug: (message: string, options?: LogOptions) => log('debug', message, options),
    info: (message: string, options?: LogOptions) => log('info', message, options),
    warn: (message: string, options?: LogOptions) => log('warn', message, options),
    error: (message: string, options?: LogOptions) => log('error', message, options),

    // Convenience methods for common contexts
    api: (message: string, data?: Record<string, unknown>) =>
        log('info', message, { context: 'API', data }),
    fal: (message: string, data?: Record<string, unknown>) =>
        log('info', message, { context: 'FAL', data }),
    db: (message: string, data?: Record<string, unknown>) =>
        log('info', message, { context: 'DB', data }),
    auth: (message: string, data?: Record<string, unknown>) =>
        log('debug', message, { context: 'AUTH', data }),
};

export default logger;
