import { LoggerService } from '@nestjs/common';
import 'winston-daily-rotate-file';
export declare enum LogLevel {
    ERROR = "error",
    WARN = "warn",
    INFO = "info",
    DEBUG = "debug",
    VERBOSE = "verbose"
}
export declare class CustomLogger implements LoggerService {
    private logger;
    constructor();
    private getLogFormat;
    private getLogTransports;
    private getLogColor;
    log(message: string, context?: string): void;
    error(message: string, trace?: string, context?: string): void;
    warn(message: string, context?: string): void;
    debug(message: string, context?: string): void;
    verbose(message: string, context?: string): void;
    logObject(obj: any, context?: string): void;
    private formatObject;
}
