import { Demo } from '@models/demo.model';
import { PickType } from '@nestjs/swagger';

export class CreateDemoDto extends PickType(Demo, ['phone', 'name', 'address']) {}
