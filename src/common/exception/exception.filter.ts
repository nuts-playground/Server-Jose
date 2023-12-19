import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { instanceToPlain } from 'class-transformer';
import { ResponseDto } from '../dtos/response.dto';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status =
      exception instanceof HttpException ? exception.getStatus() : 500;
    const exceptionToPlain = instanceToPlain(exception);
    const dtoToPlain = instanceToPlain(
      ResponseDto.exception(exceptionToPlain.message),
    );
    const responseData = {
      ...dtoToPlain,
      statusCode: status,
    };

    response.status(status).json(responseData);
  }
}
