import { Body, Controller, Post, Request } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Public } from '@common/decorators/common.decorator';
import { ApiBearerAuth, ApiBody, ApiTags } from '@nestjs/swagger';
import { ApiNormalResponse } from '@common/decorators/api-response';
import { User } from '@models/user.model';
import { ResponseType } from '@common/constants/global.const';
import { ConfirmDTO, LoginDto, RegisterDto, RenewTokenDto } from 'src/dto/auth.dto';
import { Profile } from '@common/decorators/user.decorator';
import { IToken } from '@common/interfaces/auth.interface';

@Controller('auth')
@ApiTags('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @Post('/login')
  @Public()
  @ApiBody({ type: LoginDto })
  @ApiNormalResponse({ model: User, type: ResponseType.Ok })
  login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @Post('/register')
  @Public()
  @ApiBody({ type: RegisterDto })
  @ApiNormalResponse({ model: User, type: ResponseType.Ok })
  register(@Body() registerDto: RegisterDto, @Request() request: Request) {
    return this.authService.register(registerDto, request);
  }

  @Post('renew-token')
  @ApiBearerAuth()
  @ApiBody({ type: RenewTokenDto })
  renewToken(@Body() renewTokenDto: RenewTokenDto) {
    return this.authService.renewToken(renewTokenDto);
  }

  @Post('logout')
  @ApiBearerAuth()
  logout(@Profile() user: IToken) {
    return this.authService.logout(user);
  }

  @Post('confirm')
  @Public()
  @ApiBody({ type: ConfirmDTO })
  confirm(@Body() confirmDto: ConfirmDTO) {
    return this.authService.confirm(confirmDto.token);
  }
}
