import { Controller, Get, Post, Body, UseInterceptors } from '@nestjs/common';
import { DemoService } from './demo.service';
import { ApiTags, ApiBody, ApiQuery, ApiBearerAuth } from '@nestjs/swagger';
import { CreateDemoDto } from 'src/dto/demo.dto';
import { ApiNormalResponse } from '@common/decorators/api-response';
import { Demo } from '@models/demo.model';
import { ResponseType } from '@common/constants/global.const';
import { PaginationDTO } from 'src/dto/common.dto';
import { ApiPaginationResponse } from '@common/decorators/api-response/api-pagination-response.decorator';
import { PaginationInterceptor } from '@interceptors/pagination.interceptor';
import { Pagination } from '@common/interfaces/filter.interface';
import { GetPagination } from '@common/decorators/pagination-request';
import { Public } from '@common/decorators/api-response/common.decorator';

@Controller('demo')
@ApiTags('demo')
export class DemoController {
  constructor(private readonly demoService: DemoService) {}

  @Post()
  @Public()
  @ApiBody({ type: CreateDemoDto })
  @ApiNormalResponse({ model: Demo, type: ResponseType.Created })
  create(@Body() createDemoDto: CreateDemoDto) {
    return this.demoService.create(createDemoDto);
  }

  @Get()
  @Public()
  @ApiQuery({ name: 'demo', type: PaginationDTO })
  @ApiPaginationResponse(Demo)
  @UseInterceptors(PaginationInterceptor<Demo>)
  findAll(@GetPagination() pagination: Pagination) {
    return this.demoService.findAll(pagination);
  }
}
