import { Body, Controller, Get, Param, Post, UseInterceptors } from '@nestjs/common';
import { SlotService } from './slot.service';
import { ApiBearerAuth, ApiBody, ApiParam, ApiQuery, ApiTags } from '@nestjs/swagger';
import { CreateManySlotDto, CreateSlotDto } from 'src/dto/slot.dto';
import { JwtTokenDecrypted } from '@common/interfaces/auth.interface';
import { Profile } from '@common/decorators/user.decorator';
import { Slot } from '@models/slot.model';
import { ResponseType } from '@common/constants/global.const';
import { ApiNormalResponse } from '@common/decorators/api-response';
import { PaginationDTO } from 'src/dto/common.dto';
import { ApiPaginationResponse } from '@common/decorators/api-response/api-pagination-response.decorator';
import { PaginationInterceptor } from '@interceptors/pagination.interceptor';
import { GetPagination } from '@common/decorators/pagination-request';
import { Pagination } from '@common/interfaces/filter.interface';

@Controller('slots')
@ApiTags('slots')
@ApiBearerAuth()
export class SlotController {
  constructor(private readonly slotService: SlotService) {}

  @Post()
  @ApiBody({ type: CreateSlotDto })
  @ApiNormalResponse({ model: Slot, type: ResponseType.Created })
  createSlot(@Profile() user: JwtTokenDecrypted, @Body() createSlotSto: CreateSlotDto) {
    return this.slotService.createSlot(user.userId, createSlotSto);
  }

  @Post('create-many')
  @ApiBody({ type: CreateManySlotDto })
  @ApiNormalResponse({ model: Slot, type: ResponseType.Created })
  createManySlots(@Profile() user: JwtTokenDecrypted, @Body() createSlotSto: CreateManySlotDto) {
    return this.slotService.createManySlot(user.userId, createSlotSto);
  }

  @Get(':id')
  @ApiQuery({ type: PaginationDTO })
  @ApiParam({ name: 'id', type: String, required: true })
  @ApiPaginationResponse(Slot)
  @UseInterceptors(PaginationInterceptor<Slot>)
  getClassrooms(@GetPagination() pagination: Pagination, @Param('id') id: string) {
    return this.slotService.getSlots(pagination, id);
  }

  @Get('detail/:id')
  @ApiParam({ name: 'id', type: String, required: true })
  @ApiNormalResponse({ model: Slot, type: ResponseType.Ok })
  getClassroomDetail(@Param('id') id: string) {
    return this.slotService.findSlotById(id);
  }
}
