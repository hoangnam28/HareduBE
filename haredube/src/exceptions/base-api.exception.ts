import { HttpException } from '@nestjs/common';

type ObjectError = {
  message?: string;
  status?: number;
  data?: object;
};
export class BaseApiException extends HttpException {
  constructor(objectError: ObjectError = {}) {
    // eslint-disable-next-line prefer-const
    let { message, status, data } = objectError;
    if (!message) {
      message = 'UNKNOW_ERROR';
    }
    if (!status) {
      status = 400;
    }
    const returnObj: any = {
      message,
    };
    if (data) {
      returnObj.data = data;
    }
    super(returnObj, status);
  }
}
