import { ApiProperty, ApiPropertyOptional, PickType } from '@nestjs/swagger';
import { PaginationDTO } from './common.dto';
import { IsBoolean, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { User } from '@models/user.model';

export class UserQueryDto extends PaginationDTO {
  @ApiPropertyOptional()
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  role?: number;
}

export class UpdateUserDTO extends PickType(User, [, 'dob', 'name', 'slug', 'gender']) {}

export class WithDrawDto {
  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  money: number;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  password: string;
}
