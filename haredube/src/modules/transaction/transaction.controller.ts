import { Body, Controller, Get, Param, Post, UseInterceptors } from '@nestjs/common';
import { TransactionService } from './transaction.service';
import { PaginationDTO } from 'src/dto/common.dto';
import { TransactionHistory } from '@models/transaction-history.model';
import { ApiPaginationResponse } from '@common/decorators/api-response/api-pagination-response.decorator';
import { PaginationInterceptor } from '@interceptors/pagination.interceptor';
import { Pagination } from '@common/interfaces/filter.interface';
import { ApiParam, ApiQuery, ApiTags } from '@nestjs/swagger';
import { Profile } from '@common/decorators/user.decorator';
import { JwtTokenDecrypted } from '@common/interfaces/auth.interface';
import { GetPagination } from '@common/decorators/pagination-request';
import { ResponseType, Roles } from '@common/constants/global.const';
import { Auth } from '@common/decorators/auth.decorator';
import { ApiNormalResponse } from '@common/decorators/api-response';
import { AcceptTrans, RejectTrans } from 'src/dto/payment.dto';

@Controller('transaction')
@ApiTags('transaction')
export class TransactionController {
  constructor(private readonly transactionService: TransactionService) {}

  @Get('')
  @ApiQuery({ type: PaginationDTO })
  @ApiPaginationResponse(TransactionHistory)
  @UseInterceptors(PaginationInterceptor<TransactionHistory>)
  getClassrooms(@Profile() user: JwtTokenDecrypted, @GetPagination() pagination: Pagination) {
    return this.transactionService.getTransactionHistory(user.userId, pagination);
  }

  @Get('lecture-withdraw')
  @Auth([Roles.ADMIN])
  @ApiQuery({ type: PaginationDTO })
  @ApiPaginationResponse(TransactionHistory)
  @UseInterceptors(PaginationInterceptor<TransactionHistory>)
  getLectureWithdraw(@GetPagination() pagination: Pagination) {
    return this.transactionService.getLectureWithdraw(pagination);
  }

  @Post('reject/:id')
  @ApiParam({ name: 'id', type: String, required: true })
  @ApiNormalResponse({ model: TransactionHistory, type: ResponseType.Ok })
  reject(@Profile() user: JwtTokenDecrypted, @Param('id') id: string, @Body() reasonReject: RejectTrans) {
    return this.transactionService.rejectTransaction(id, reasonReject.reasonReject);
  }

  @Post('confirm/:id')
  @ApiParam({ name: 'id', type: String, required: true })
  @ApiNormalResponse({ model: TransactionHistory, type: ResponseType.Ok })
  accept(@Profile() user: JwtTokenDecrypted, @Param('id') id: string, @Body() reasonReject: AcceptTrans) {
    return this.transactionService.confirmTransaction(
      reasonReject.userId,
      id,
      reasonReject.proof,
      reasonReject.amount,
      user.userId,
    );
  }
}
