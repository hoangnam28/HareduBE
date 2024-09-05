import { Test, TestingModule } from '@nestjs/testing';
import { TeachingFiledController } from './teaching-filed.controller';
import { TeachingFiledService } from './teaching-filed.service';

describe('TeachingFiledController', () => {
  let controller: TeachingFiledController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TeachingFiledController],
      providers: [TeachingFiledService],
    }).compile();

    controller = module.get<TeachingFiledController>(TeachingFiledController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
