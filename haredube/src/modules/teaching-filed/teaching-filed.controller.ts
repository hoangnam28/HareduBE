import { Body, Controller, Get, Post, UseInterceptors } from '@nestjs/common';
import { TeachingFiledService } from './teaching-filed.service';
import { ApiBody, ApiQuery, ApiTags } from '@nestjs/swagger';
import { PaginationDTO } from 'src/dto/common.dto';
import { TeachingFiled } from '@models/teaching-filed.model';
import { PaginationInterceptor } from '@interceptors/pagination.interceptor';
import { GetPagination } from '@common/decorators/pagination-request';
import { Pagination } from '@common/interfaces/filter.interface';
import { ApiPaginationResponse } from '@common/decorators/api-response/api-pagination-response.decorator';
import { Public } from '@common/decorators/common.decorator';
import { ApiNormalResponse } from '@common/decorators/api-response';
import { ResponseType } from '@common/constants/global.const';
import { TeachingFiledDto } from 'src/dto/filed.dto';

@Controller('fields')
@ApiTags('fields')
export class TeachingFiledController {
  constructor(private readonly teachingFiledService: TeachingFiledService) {}

  @Get('')
  @Public()
  getAllField() {
    return this.teachingFiledService.getAll();
  }

  @Post()
  @Public()
  @ApiBody({ type: TeachingFiledDto })
  @ApiNormalResponse({ model: TeachingFiled, type: ResponseType.Created })
  create(@Body() teachingFiledDto: TeachingFiledDto) {
    return this.teachingFiledService.create(teachingFiledDto);
  }
}
