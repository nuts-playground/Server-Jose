import { Injectable, Logger, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { getClientIp } from 'request-ip';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  private logger = new Logger('HTTP');

  use(request: Request, response: Response, next: NextFunction): void {
    const { method, originalUrl } = request;
    const userAgent = request.get('user-agent') || '';
    console.log(getClientIp(request))
    response.on('finish', () => {
      const { statusCode } = response;
      const contentLength = response.get('content-length');
      this.logger.log(
        `[METHOD: ${method}] [ORIGIN_URL: ${originalUrl === undefined ? decodeURIComponent(originalUrl) : '/'}] [STATUS_CODE: ${statusCode}] [CONTENT_LENGTH: ${contentLength}] ::: [AGENT: ${userAgent}] [IP: ${getClientIp(request)}]`,
      );
    });

    next();
  }
}