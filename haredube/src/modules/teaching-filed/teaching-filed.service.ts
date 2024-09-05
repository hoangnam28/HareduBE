import { Injectable } from '@nestjs/common';
import { TeachingFiledRepository } from './teaching-filed.repository';
import { Pagination, PaginationResult } from '@common/interfaces/filter.interface';
import { TeachingFiled } from '@models/teaching-filed.model';
import { TeachingFiledDto } from 'src/dto/filed.dto';

@Injectable()
export class TeachingFiledService {
  constructor(private teachingFiledRepository: TeachingFiledRepository) {}

  async getAll() {
    return await this.teachingFiledRepository.findAll();
  }

  async create(teachingFiledDto: TeachingFiledDto): Promise<TeachingFiled> {
    return await this.teachingFiledRepository.create(teachingFiledDto);
  }
}
