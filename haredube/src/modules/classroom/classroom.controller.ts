import { Body, Controller, Delete, Get, Param, Patch, Post, UseInterceptors } from '@nestjs/common';
import { ClassroomService } from './classroom.service';
import { ApiBearerAuth, ApiBody, ApiParam, ApiQuery, ApiTags } from '@nestjs/swagger';
import { PaginationDTO } from 'src/dto/common.dto';
import { Classroom } from '@models/classroom.model';
import { ApiPaginationResponse } from '@common/decorators/api-response/api-pagination-response.decorator';
import { PaginationInterceptor } from '@interceptors/pagination.interceptor';
import { GetPagination } from '@common/decorators/pagination-request';
import { Pagination } from '@common/interfaces/filter.interface';
import { CreateClassroomDto } from 'src/dto/classroom.dto';
import { ApiNormalResponse } from '@common/decorators/api-response';
import { ResponseType } from '@common/constants/global.const';
import { JwtTokenDecrypted } from '@common/interfaces/auth.interface';
import { Profile } from '@common/decorators/user.decorator';

@Controller('classrooms')
@ApiTags('classrooms')
@ApiBearerAuth()
export class ClassroomController {
  constructor(private readonly classroomService: ClassroomService) {}

  @Get('my-classes')
  @ApiQuery({ type: PaginationDTO })
  @ApiPaginationResponse(Classroom)
  @UseInterceptors(PaginationInterceptor<Classroom>)
  getMyClassrooms(@Profile() user: JwtTokenDecrypted, @GetPagination() pagination: Pagination) {
    return this.classroomService.getMyClasses(user.userId, pagination);
  }

  @Get('')
  @ApiQuery({ type: PaginationDTO })
  @ApiPaginationResponse(Classroom)
  @UseInterceptors(PaginationInterceptor<Classroom>)
  getClassrooms(@GetPagination() pagination: Pagination) {
    return this.classroomService.getClasses(pagination);
  }

  @Get('all-slots')
  @ApiQuery({ type: PaginationDTO })
  getAllSlots(@Profile() user: JwtTokenDecrypted, @GetPagination() pagination: Pagination) {
    return this.classroomService.getAllSlots(user.userId, pagination);
  }

  @Get('all-my-slots')
  @ApiQuery({ type: PaginationDTO })
  getAllMySlots(@Profile() user: JwtTokenDecrypted, @GetPagination() pagination: Pagination) {
    return this.classroomService.getAllMySlot(user.userId, pagination);
  }

  @Get(':id')
  @ApiParam({ name: 'id', type: String, required: true })
  @ApiNormalResponse({ model: Classroom, type: ResponseType.Ok })
  getClassroomDetail(@Param('id') id: string) {
    return this.classroomService.findClassById(id);
  }

  @Post()
  @ApiBody({ type: CreateClassroomDto })
  @ApiNormalResponse({ model: Classroom, type: ResponseType.Created })
  createClassroom(@Profile() user: JwtTokenDecrypted, @Body() createClassroomDto: CreateClassroomDto) {
    return this.classroomService.createClass(user.userId, createClassroomDto);
  }

  @Post('with-draw-money/:id')
  @ApiParam({ name: 'id', type: String, required: true })
  @ApiNormalResponse({ model: Classroom, type: ResponseType.Ok })
  withDrawMoney(@Profile() user: JwtTokenDecrypted, @Param('id') id: string) {
    return this.classroomService.withDrawMoney(user.userId, id);
  }

  @Patch('join/:id')
  @ApiParam({ name: 'id', type: String, required: true })
  @ApiNormalResponse({ model: Classroom, type: ResponseType.Created })
  joinClass(@Profile() user: JwtTokenDecrypted, @Param('id') id: string) {
    return this.classroomService.joinClass(user.userId, id);
  }

  @Delete(':id')
  @ApiParam({ name: 'id', type: String, required: true })
  @ApiNormalResponse({ model: Classroom, type: ResponseType.Ok })
  deleteClassroom(@Param('id') id: string) {
    return this.classroomService.deleteClass(id);
  }
}
