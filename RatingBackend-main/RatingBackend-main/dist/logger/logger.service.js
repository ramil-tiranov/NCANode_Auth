"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CustomLogger = exports.LogLevel = void 0;
const common_1 = require("@nestjs/common");
const winston_1 = require("winston");
require("winston-daily-rotate-file");
const kleur_1 = __importDefault(require("kleur"));
var LogLevel;
(function (LogLevel) {
    LogLevel["ERROR"] = "error";
    LogLevel["WARN"] = "warn";
    LogLevel["INFO"] = "info";
    LogLevel["DEBUG"] = "debug";
    LogLevel["VERBOSE"] = "verbose";
})(LogLevel || (exports.LogLevel = LogLevel = {}));
let CustomLogger = class CustomLogger {
    constructor() {
        const logLevel = process.env.LOG_LEVEL || LogLevel.INFO;
        this.logger = (0, winston_1.createLogger)({
            level: logLevel,
            format: this.getLogFormat(),
            transports: this.getLogTransports(),
        });
    }
    getLogFormat() {
        return winston_1.format.combine(winston_1.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }), winston_1.format.printf(({ timestamp, level, message, stack, context }) => {
            const colorFunction = this.getLogColor(level);
            const contextInfo = context ? ` [${context}]` : '';
            return `${timestamp} [${level.toUpperCase()}]: ${colorFunction(message)}${contextInfo} ${stack || ''}`.trim();
        }));
    }
    getLogTransports() {
        return [
            new winston_1.transports.Console(),
            new winston_1.transports.DailyRotateFile({
                filename: 'logs/application-%DATE%.log',
                datePattern: 'YYYY-MM-DD',
                zippedArchive: true,
                maxSize: '20m',
                maxFiles: '14d',
            }),
        ];
    }
    getLogColor(level) {
        const colorMap = {
            [LogLevel.ERROR]: kleur_1.default.red,
            [LogLevel.WARN]: kleur_1.default.yellow,
            [LogLevel.INFO]: kleur_1.default.green,
            [LogLevel.DEBUG]: kleur_1.default.cyan,
            [LogLevel.VERBOSE]: kleur_1.default.magenta,
        };
        return colorMap[level] || kleur_1.default.dim;
    }
    log(message, context) {
        this.logger.info(message, { context });
    }
    error(message, trace, context) {
        this.logger.error(message, { stack: trace, context });
    }
    warn(message, context) {
        this.logger.warn(message, { context });
    }
    debug(message, context) {
        this.logger.debug(message, { context });
    }
    verbose(message, context) {
        this.logger.verbose(message, { context });
    }
    logObject(obj, context) {
        this.logger.info(this.formatObject(obj), { context });
    }
    formatObject(obj) {
        try {
            return JSON.stringify(obj, null, 2);
        }
        catch {
            return String(obj);
        }
    }
};
exports.CustomLogger = CustomLogger;
exports.CustomLogger = CustomLogger = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], CustomLogger);
//# sourceMappingURL=logger.service.js.map