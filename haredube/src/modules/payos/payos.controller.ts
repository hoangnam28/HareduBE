import { Body, Controller, Post, Request } from '@nestjs/common';
import { PayosService } from './payos.service';
import { ApiBearerAuth, ApiBody, ApiTags } from '@nestjs/swagger';
import { Profile } from '@common/decorators/user.decorator';
import { JwtTokenDecrypted } from '@common/interfaces/auth.interface';
import { CreatePaymentDto } from 'src/dto/payment.dto';
import { ConfirmDTO } from 'src/dto/auth.dto';

@Controller('payment')
@ApiTags('payment')
@ApiBearerAuth()
export class PayosController {
  constructor(private readonly payosService: PayosService) {}

  @Post()
  @ApiBody({ type: CreatePaymentDto })
  createPayment(
    @Profile() user: JwtTokenDecrypted,
    @Body() createSlotSto: CreatePaymentDto,
    @Request() request: Request,
  ) {
    return this.payosService.createPayment(user.userId, createSlotSto.amount, request);
  }

  @Post('confirm')
  @ApiBody({ type: ConfirmDTO })
  confirm(@Body() confirmDto: ConfirmDTO) {
    return this.payosService.confirm(confirmDto.token);
  }
}
