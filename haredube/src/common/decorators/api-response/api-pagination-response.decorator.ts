import { BaseResponse, PaginateResponse } from '@common/interfaces/response.interface';
import { Type, applyDecorators } from '@nestjs/common';
import { ApiOkResponse, getSchemaPath } from '@nestjs/swagger';

export const ApiPaginationResponse = <TModel extends Type<any>>(model: TModel) => {
  return applyDecorators(
    ApiOkResponse({
      schema: {
        allOf: [
          { $ref: getSchemaPath(BaseResponse) },
          {
            properties: {
              data: {
                allOf: [
                  { $ref: getSchemaPath(PaginateResponse) },
                  {
                    properties: {
                      records: {
                        type: 'array',
                        items: { $ref: getSchemaPath(model) },
                      },
                    },
                  },
                ],
              },
            },
          },
        ],
      },
    }),
  );
};
