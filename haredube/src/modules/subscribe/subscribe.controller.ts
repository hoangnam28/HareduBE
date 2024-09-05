import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors } from '@nestjs/common';
import { SubscribeService } from './subscribe.service';
import { ApiBearerAuth, ApiBody, ApiParam, ApiQuery, ApiTags } from '@nestjs/swagger';
import { Subscriber } from '@models/subscribe.model';
import { ApiPaginationResponse } from '@common/decorators/api-response/api-pagination-response.decorator';
import { PaginationDTO } from 'src/dto/common.dto';
import { GetPagination } from '@common/decorators/pagination-request';
import { Pagination } from '@common/interfaces/filter.interface';
import { JwtTokenDecrypted } from '@common/interfaces/auth.interface';
import { Profile } from '@common/decorators/user.decorator';
import { PaginationInterceptor } from '@interceptors/pagination.interceptor';
import { SubscribeDTO } from 'src/dto/subscribe.dto';
import { ResponseType } from '@common/constants/global.const';
import { ApiNormalResponse } from '@common/decorators/api-response';

@Controller('subscribes')
@ApiTags('subscribes')
@ApiBearerAuth()
export class SubscribeController {
  constructor(private readonly subscribeService: SubscribeService) {}

  @Get('')
  @ApiQuery({ type: PaginationDTO })
  @ApiPaginationResponse(Subscriber)
  @UseInterceptors(PaginationInterceptor<Subscriber>)
  getClassrooms(@Profile() user: JwtTokenDecrypted, @GetPagination() pagination: Pagination) {
    return this.subscribeService.getAll(user.userId, user.role, pagination);
  }

  @Post()
  @ApiBody({ type: SubscribeDTO })
  @ApiNormalResponse({ model: Subscriber, type: ResponseType.Created })
  createClassroom(@Profile() user: JwtTokenDecrypted, @Body() createClassroomDto: SubscribeDTO) {
    return this.subscribeService.create(createClassroomDto);
  }

  @Delete(':id')
  @ApiParam({ name: 'id', type: String, required: true })
  @ApiNormalResponse({ model: Subscriber, type: ResponseType.Ok })
  deleteClassroom(@Param('id') id: string) {
    return this.subscribeService.delete(id);
  }

  @Get(':owner')
  @ApiParam({ name: 'owner', type: String, required: true })
  @ApiNormalResponse({ model: Subscriber, type: ResponseType.Ok })
  getSubscriber(@Profile() user: JwtTokenDecrypted, @Param('owner') owner: string) {
    return this.subscribeService.getSubscriber(user.userId, owner);
  }
}
