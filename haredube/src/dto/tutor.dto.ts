import { Tutor } from '@models/tutor.model';
import { PickType } from '@nestjs/swagger';

export class UpdateTutorDTO extends PickType(Tutor, ['bank']) {}
