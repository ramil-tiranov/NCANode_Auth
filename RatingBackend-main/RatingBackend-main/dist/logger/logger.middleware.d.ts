import { NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { CustomLogger } from './logger.service';
export declare class LoggingMiddleware implements NestMiddleware {
    private readonly logger;
    private readonly DEBUG_MODE;
    private readonly MAX_LENGTH;
    constructor(logger: CustomLogger);
    use(req: Request, res: Response, next: NextFunction): void;
    private formatJson;
    private truncateBody;
    private shouldLogDetails;
    private logRequestDetails;
    private logResponseDetails;
}
