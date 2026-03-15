import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus } from '@nestjs/common';
import { Request, Response } from 'express';

export interface ErrorResponse {
    success: false;
    error: {
        message: string;
        code: string;
        statusCode: number;
        timestamp: string;
        path: string;
    };
}

export interface ExceptionResponse {
    message?: string;
    error?: string;
    code?: string;
}

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
    catch(exception: HttpException, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();
        const request = ctx.getRequest<Request>();

        const status =
            exception instanceof HttpException
                ? exception.getStatus()
                : HttpStatus.INTERNAL_SERVER_ERROR;

        const exceptionResponse = exception.getResponse();
        let message = 'Internal server error';
        let code = 'INTERNAL_SERVER_ERROR';

        if (typeof exceptionResponse === 'string') {
            message = exceptionResponse;
        } else if (typeof exceptionResponse === 'object' && exceptionResponse !== null) {
            const responseObj = exceptionResponse as ExceptionResponse;
            message = responseObj.message || responseObj.error || message;
            code = responseObj.code || code;
        }

        const errorResponse: ErrorResponse = {
            success: false,
            error: {
                message,
                code,
                statusCode: status,
                timestamp: new Date().toISOString(),
                path: request.url,
            },
        };

        response.status(status).json(errorResponse);
    }
}
