import { Injectable } from '@nestjs/common';
import { DemoRepository } from './demo.repository';
import { CreateDemoDto } from 'src/dto/demo.dto';
import { Pagination, PaginationResult } from '@common/interfaces/filter.interface';
import { Demo } from '@models/demo.model';

@Injectable()
export class DemoService {
  constructor(private demoRepository: DemoRepository) {}

  async create(createDemoDto: CreateDemoDto): Promise<CreateDemoDto> {
    const newDemo = await this.demoRepository.create(createDemoDto);
    return newDemo;
  }

  async findAll(pagination: Pagination): Promise<PaginationResult<Demo>> {
    const [data, total] = await this.demoRepository.paginate({
      pagination,
      searchBy: ['name', 'address'],
    });
    return { data, total };
  }
}
