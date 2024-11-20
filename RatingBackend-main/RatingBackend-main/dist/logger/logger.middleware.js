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
exports.LoggingMiddleware = void 0;
const common_1 = require("@nestjs/common");
const logger_service_1 = require("./logger.service");
const kleur_1 = __importDefault(require("kleur"));
let LoggingMiddleware = class LoggingMiddleware {
    constructor(logger) {
        this.logger = logger;
        this.DEBUG_MODE = process.env.DEBUG_LOGS === 'true';
        this.MAX_LENGTH = 200;
    }
    use(req, res, next) {
        const startTime = Date.now();
        this.logRequestDetails(req);
        const originalSend = res.send.bind(res);
        res.send = (body) => {
            res.locals.responseBody = body;
            return originalSend(body);
        };
        res.on('finish', () => this.logResponseDetails(res, startTime));
        next();
    }
    formatJson(data) {
        if (typeof data === 'string')
            return data;
        try {
            return JSON.stringify(data, null, 2);
        }
        catch {
            return String(data);
        }
    }
    truncateBody(body) {
        const bodyString = this.formatJson(body);
        return bodyString.length > this.MAX_LENGTH
            ? `${bodyString.slice(0, this.MAX_LENGTH)}... (truncated)`
            : bodyString;
    }
    shouldLogDetails() {
        return this.DEBUG_MODE;
    }
    logRequestDetails(req) {
        const requestDetails = `
${kleur_1.default.red('-'.repeat(80))}
${kleur_1.default.bold('📥 Incoming Request')}
${kleur_1.default.yellow('Method:')} ${req.method}
${kleur_1.default.yellow('URL:')} ${req.originalUrl}
${this.shouldLogDetails() ? kleur_1.default.yellow('Request Headers:') + `\n${this.formatJson(req.headers)}` : ''}
${this.shouldLogDetails()
            ? kleur_1.default.yellow('Request Body:') + `\n${this.formatJson(req.body)}`
            : kleur_1.default.yellow('Request Body:') + `\n${this.truncateBody(req.body)}`}
${kleur_1.default.red('-'.repeat(80))}
    `;
        this.logger.log(requestDetails);
    }
    logResponseDetails(res, startTime) {
        const responseBody = res.locals.responseBody || {};
        const responseTime = Date.now() - startTime;
        const responseDetails = `
${kleur_1.default.red('-'.repeat(80))}
${kleur_1.default.bold('📤 Response Details')}
${kleur_1.default.red('Status Code:')} ${res.statusCode}
${this.shouldLogDetails() ? kleur_1.default.yellow('Response Headers:') + `\n${this.formatJson(res.getHeaders())}` : ''}
${this.shouldLogDetails()
            ? kleur_1.default.yellow('Response Body:') + `\n${this.formatJson(responseBody)}`
            : kleur_1.default.yellow('Response Body:') + `\n${this.truncateBody(responseBody)}`}
${kleur_1.default.yellow('Response Time:')} ${responseTime} ms
${kleur_1.default.red('-'.repeat(80))}
    `;
        this.logger.log(responseDetails);
    }
};
exports.LoggingMiddleware = LoggingMiddleware;
exports.LoggingMiddleware = LoggingMiddleware = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [logger_service_1.CustomLogger])
], LoggingMiddleware);
//# sourceMappingURL=logger.middleware.js.map