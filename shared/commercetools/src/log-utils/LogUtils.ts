import { LogDictionary } from "./log-dictionary";
// This could be a separete shared packate
type InfoLoggerParams = {
  body?: any;
  code: string;
  message: LogDictionary;
};

type ErrorLoggerParams = {
  reason: any;
  code: string;
  message: LogDictionary;
  throwError?: boolean;
};

enum LogLevel {
  ERROR = "ERROR",
  WARN = "WARN",
  INFO = "INFO",
  DEBUG = "DEBUG",
}

export function errorLogger({
  reason,
  code,
  message,
  throwError = true,
}: ErrorLoggerParams): any {
  const errorMessage = {
    errorCode: code,
    errorMessage: message,
    stack: reason,
  };

  console.error(errorMessage);

  if (throwError) {
    if (process.env.NODE_ENV === "production") {
      throw new Error(code);
    } else {
      throw new Error(reason, { cause: code });
    }
  } else {
    return reason;
  }
}

export function infoLogger({ body, code, message }: InfoLoggerParams): any {
  const infoMessage = {
    code: code,
    message: message,
    body: body ? body : null,
  };

  const logLevel = process.env.LOG_LEVEL ? process.env.LOG_LEVEL: LogLevel.WARN;

  if (logLevel === LogLevel.INFO || logLevel === LogLevel.DEBUG) {
    console.info(infoMessage);
  }

  if (body) {
    return body;
  }
}
