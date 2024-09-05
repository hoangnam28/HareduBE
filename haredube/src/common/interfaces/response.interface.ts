import { ApiProperty } from '@nestjs/swagger';

export class BaseResponse<T> {
  @ApiProperty({
    default: 200,
  })
  code: number;

  @ApiProperty()
  success: boolean;

  @ApiProperty()
  message: string;

  @ApiProperty()
  data: T | PaginateResponse<T>;
}

export class PaginateResponse<T> {
  @ApiProperty()
  total: number;
  @ApiProperty()
  lastPage: number;
  @ApiProperty()
  page: number;
  @ApiProperty()
  size: number;
  @ApiProperty()
  records: T[];
}
