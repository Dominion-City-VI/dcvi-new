export enum LogLevel {
  DEBUG = 'DEBUG',
  INFO = 'INFO',
  WARN = 'WARN',
  ERROR = 'ERROR'
}

export class Logger {
  logLevel: LogLevel;

  constructor(logLevel: LogLevel = LogLevel.INFO) {
    this.logLevel = logLevel;
  }

  private canLog(level: LogLevel): boolean {
    const levels = Object.values(LogLevel);
    return levels.indexOf(level) >= levels.indexOf(this.logLevel);
  }
  private loggerTitle(level: LogLevel, message = '') {
    return `[${new Date().toISOString()}] [${level.toUpperCase()}]::${message}`;
  }

  debug(message: string, ...optionalParams: unknown[]) {
    if (this.canLog(LogLevel.DEBUG)) {
      console.debug(this.loggerTitle(LogLevel.DEBUG), message, ...optionalParams);
    }
  }

  info(message: string, ...optionalParams: unknown[]) {
    if (this.canLog(LogLevel.INFO)) {
      console.log(this.loggerTitle(LogLevel.INFO), message, ...optionalParams);
    }
  }

  warn(message: string, ...optionalParams: unknown[]) {
    if (this.canLog(LogLevel.WARN)) {
      console.warn(this.loggerTitle(LogLevel.WARN), message, ...optionalParams);
    }
  }

  error(message: string, error: unknown, ...optionalParams: unknown[]) {
    if (this.canLog(LogLevel.ERROR)) {
      console.error(this.loggerTitle(LogLevel.ERROR), message, ...optionalParams);
    }
    const err = new Error(this.loggerTitle(LogLevel.ERROR, message));
    err.cause = error;
  }
}

// Export a logger instance, defaulting to INFO level in production and DEBUG in development
const logger = new Logger(process.env.NODE_ENV === 'production' ? LogLevel.INFO : LogLevel.DEBUG);
export default logger;
