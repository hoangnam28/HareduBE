import { ResponseType } from '@common/constants/global.const';
import { BaseResponse } from '@common/interfaces/response.interface';
import { applyDecorators, Type } from '@nestjs/common';
import { ApiCreatedResponse, ApiOkResponse, ApiResponseOptions, getSchemaPath } from '@nestjs/swagger';

export const ApiListResponse = <TModel extends Type<any>>(model: TModel, type = ResponseType.Ok) => {
  const apiResponseType: (options?: ApiResponseOptions) => MethodDecorator & ClassDecorator =
    type === ResponseType.Ok ? ApiOkResponse : ApiCreatedResponse;
  return applyDecorators(
    apiResponseType({
      schema: {
        allOf: [
          { $ref: getSchemaPath(BaseResponse) },
          {
            properties: {
              data: {
                type: 'array',
                items: { $ref: getSchemaPath(model) },
              },
            },
          },
        ],
      },
    }),
  );
};
