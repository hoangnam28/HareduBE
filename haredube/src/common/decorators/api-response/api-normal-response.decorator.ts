import { ResponseType } from '@common/constants/global.const';
import { BaseResponse } from '@common/interfaces/response.interface';
import { applyDecorators, Type } from '@nestjs/common';
import { ApiCreatedResponse, ApiExtraModels, ApiOkResponse, ApiResponseOptions, getSchemaPath } from '@nestjs/swagger';

export const ApiNormalResponse = <TModel extends Type<any>>({
  model,
  type = ResponseType.Ok,
}: {
  model: TModel;
  type?: ResponseType;
}) => {
  let apiResponseType: (options?: ApiResponseOptions) => MethodDecorator & ClassDecorator;
  switch (type) {
    case ResponseType.Created:
      apiResponseType = ApiCreatedResponse;
      break;
    default:
      apiResponseType = ApiOkResponse;
      break;
  }
  return applyDecorators(
    apiResponseType({
      schema: {
        allOf: [
          { $ref: getSchemaPath(BaseResponse) },
          {
            properties: {
              data: {
                allOf: [{ $ref: getSchemaPath(model) }],
              },
            },
          },
        ],
      },
    }),
    ApiExtraModels(model),
  );
};
