import { Test, TestingModule } from '@nestjs/testing';
import { TeachingFiledService } from './teaching-filed.service';

describe('TeachingFiledService', () => {
  let service: TeachingFiledService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TeachingFiledService],
    }).compile();

    service = module.get<TeachingFiledService>(TeachingFiledService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
