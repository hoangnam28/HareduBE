import { SORT_DIRECTION } from '@common/constants/global.const';
import { IsArray, IsBoolean, IsIn, IsNotEmpty, IsNumber, IsOptional, IsString } from '@common/validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsMongoId } from 'class-validator';

export class PaginationDTO {
  @ApiPropertyOptional()
  @IsOptional()
  page?: number;

  @ApiPropertyOptional()
  @IsOptional()
  size?: number;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  sortBy?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsIn(SORT_DIRECTION)
  @IsOptional()
  sortType?: string;

  @ApiPropertyOptional()
  @IsBoolean()
  @IsOptional()
  isDeleted?: boolean;

  @ApiPropertyOptional()
  @IsBoolean()
  @IsOptional()
  onlyDeleted?: boolean;

  @IsOptional()
  @IsString()
  text?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  dateFrom?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  dateTo?: number;
}

export class ChangeActiveDTO {
  @ApiProperty()
  @IsNotEmpty()
  @IsBoolean()
  isActive: boolean;

  @ApiProperty()
  @IsNotEmpty()
  @IsMongoId()
  id: string;
}

export class ChangePermissionDTO {
  @ApiProperty()
  @IsNotEmpty()
  @IsBoolean()
  isActive: boolean;

  @ApiProperty()
  @IsNotEmpty()
  @IsArray()
  @IsString({ each: true })
  @IsNotEmpty({ each: true })
  id: string;
}
