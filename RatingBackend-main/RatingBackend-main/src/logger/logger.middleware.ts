import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { CustomLogger } from './logger.service';
import kleur from 'kleur';

@Injectable()
export class LoggingMiddleware implements NestMiddleware {
  private readonly DEBUG_MODE: boolean = process.env.DEBUG_LOGS === 'true';
  private readonly MAX_LENGTH = 200;

  constructor(private readonly logger: CustomLogger) {}

  use(req: Request, res: Response, next: NextFunction) {
    const startTime = Date.now();

    this.logRequestDetails(req);

    const originalSend = res.send.bind(res);
    res.send = (body: any) => {
      res.locals.responseBody = body;
      return originalSend(body);
    };

    res.on('finish', () => this.logResponseDetails(res, startTime));
    next();
  }

  private formatJson(data: any): string {
    if (typeof data === 'string') return data;
    try {
      return JSON.stringify(data, null, 2);
    } catch {
      return String(data);
    }
  }

  private truncateBody(body: any): string {
    const bodyString = this.formatJson(body);
    return bodyString.length > this.MAX_LENGTH
      ? `${bodyString.slice(0, this.MAX_LENGTH)}... (truncated)`
      : bodyString;
  }

  private shouldLogDetails(): boolean {
    return this.DEBUG_MODE;
  }

  private logRequestDetails(req: Request): void {
    const requestDetails = `
${kleur.red('-'.repeat(80))}
${kleur.bold('📥 Incoming Request')}
${kleur.yellow('Method:')} ${req.method}
${kleur.yellow('URL:')} ${req.originalUrl}
${this.shouldLogDetails() ? kleur.yellow('Request Headers:') + `\n${this.formatJson(req.headers)}` : ''}
${this.shouldLogDetails() 
    ? kleur.yellow('Request Body:') + `\n${this.formatJson(req.body)}` 
    : kleur.yellow('Request Body:') + `\n${this.truncateBody(req.body)}`}
${kleur.red('-'.repeat(80))}
    `;
    this.logger.log(requestDetails);
  }

  private logResponseDetails(res: Response, startTime: number): void {
    const responseBody = res.locals.responseBody || {};
    const responseTime = Date.now() - startTime;

    const responseDetails = `
${kleur.red('-'.repeat(80))}
${kleur.bold('📤 Response Details')}
${kleur.red('Status Code:')} ${res.statusCode}
${this.shouldLogDetails() ? kleur.yellow('Response Headers:') + `\n${this.formatJson(res.getHeaders())}` : ''}
${this.shouldLogDetails() 
    ? kleur.yellow('Response Body:') + `\n${this.formatJson(responseBody)}` 
    : kleur.yellow('Response Body:') + `\n${this.truncateBody(responseBody)}`}
${kleur.yellow('Response Time:')} ${responseTime} ms
${kleur.red('-'.repeat(80))}
    `;
    this.logger.log(responseDetails);
  }
}
