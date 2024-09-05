import { BaseResponse } from '@common/interfaces/response.interface';
import { applyDecorators } from '@nestjs/common';
import { ApiCreatedResponse, getSchemaPath } from '@nestjs/swagger';

export const ApiRawResponse = (type: any) => {
  return applyDecorators(
    ApiCreatedResponse({
      schema: {
        allOf: [
          { $ref: getSchemaPath(BaseResponse) },
          {
            properties: {
              data: type,
            },
          },
        ],
      },
    }),
  );
};
