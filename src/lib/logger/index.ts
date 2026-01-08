
type LogLevel = 'info' | 'warn' | 'error' | 'debug';

const isDevelopment = process.env.NODE_ENV === 'development';

const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  green: '\x1b[32m',
  blue: '\x1b[36m',
};

const getTimestamp = () => new Date().toISOString();

const formatMessage = (level: LogLevel, message: string, data?: any) => {
  const timestamp = getTimestamp();
  const levelUpper = level.toUpperCase();
  
  let prefix = '';
  if (isDevelopment) {
    switch (level) {
      case 'error':
        prefix = colors.red;
        break;
      case 'warn':
        prefix = colors.yellow;
        break;
      case 'info':
        prefix = colors.green;
        break;
      case 'debug':
        prefix = colors.blue;
        break;
    }
    prefix += levelUpper + colors.reset;
  } else {
    prefix = levelUpper;
  }

  const baseMessage = `[${timestamp}] ${prefix}: ${message}`;
  return data ? `${baseMessage} ${JSON.stringify(data)}` : baseMessage;
};

export const logger = {
  info: (message: string, data?: any) => {
    console.log(formatMessage('info', message, data));
  },
  warn: (message: string, data?: any) => {
    console.warn(formatMessage('warn', message, data));
  },
  error: (message: string, error?: Error | any) => {
    const errMsg = error && (error.message || (typeof error === 'string' ? error : JSON.stringify(error)));
    const display = errMsg && errMsg.length > 400 ? errMsg.slice(0, 400) + '... [truncated]' : errMsg || error;
    console.error(formatMessage('error', message, display));
  },
  debug: (message: string, data?: any) => {
    if (isDevelopment) {
      console.log(formatMessage('debug', message, data));
    }
  },
};

export default logger;
