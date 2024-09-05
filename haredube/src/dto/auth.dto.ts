import { IsNotEmpty, IsString } from '@common/validator';
import { User } from '@models/user.model';
import { ApiProperty, PickType } from '@nestjs/swagger';

export class LoginDto extends PickType(User, ['email', 'password']) {}

export class RenewTokenDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  refreshToken: string;
}

export class RegisterDto extends PickType(User, ['password', 'email', 'role']) {}

export class ConfirmDTO {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  token: string;
}
