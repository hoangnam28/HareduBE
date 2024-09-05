import { ErrorMessage } from '@common/constants/global.const';
import { handleLogError } from '@common/utils/helper.utils';
import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus } from '@nestjs/common';
import { Response } from 'express';
import * as i18n from 'i18n';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest();
    const status = exception instanceof HttpException ? exception.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR;
    let message: string | string[];
    try {
      message = exception?.status ? exception.getResponse().message : exception.message;
    } catch (err) {
      message = exception.message;
    }

    const error = exception?.status
      ? typeof exception?.getResponse === 'function'
        ? exception?.getResponse()
        : ''
      : '';

    const exceptionContent = {
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      success: false,
      errors: getErrorMessage(message, JSON.stringify(error || {})),
      body: request.body,
    };

    handleLogError({ ...exceptionContent, stack: exception?.stack });
    response.status(status).json(exceptionContent);
  }
}

function getErrorMessage(error: string | string[], key: string): string {
  if (!error?.length) return i18n.__('internal-server-error');

  const sub = key && !key?.includes(' ') ? i18n.__(key) : 'Query';

  if (Array.isArray(error)) {
    return getErrorMessage((error || [])[0], null);
  }

  if (error.includes(ErrorMessage.UNIQUE)) {
    const key = error.split('"')[1] ?? error.match(/(\w+)\s*:\s*null/)?.[1] ?? error.match(/(\w+)\s*:\s*ObjectId/)?.[1];
    if (key) {
      return i18n.__('update-check-same-property', i18n.__(key));
    }
  }

  if (error.includes(ErrorMessage.QUERY_WRONG)) {
    return i18n.__('query-invalid', sub);
  }

  if (error.includes(ErrorMessage.DATE_TIME_INVALID)) {
    return i18n.__('query-invalid', sub);
  }

  return i18n.__(error);
}
