import { Test, TestingModule } from '@nestjs/testing';
import { AgoreService } from './agore.service';

describe('AgoreService', () => {
  let service: AgoreService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AgoreService],
    }).compile();

    service = module.get<AgoreService>(AgoreService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
