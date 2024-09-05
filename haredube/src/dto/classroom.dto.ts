import { Classroom } from '@models/classroom.model';
import { PickType } from '@nestjs/swagger';

export class CreateClassroomDto extends PickType(Classroom, [
  'name',
  'thumbnail',
  'banner',
  'description',
  'startTime',
  'endTime',
  'teachFileds',
  'price',
]) {}
