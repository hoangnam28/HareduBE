import { Student } from '@models/student.model';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BaseRepository } from 'src/base/base.repository';

@Injectable()
export class StudentRepository extends BaseRepository<Student> {
  constructor(@InjectModel(Student.name) studentModel: Model<Student>) {
    super(studentModel);
  }
}
