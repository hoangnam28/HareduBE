import { Test, TestingModule } from '@nestjs/testing';
import { PayosController } from './payos.controller';
import { PayosService } from './payos.service';

describe('PayosController', () => {
  let controller: PayosController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PayosController],
      providers: [PayosService],
    }).compile();

    controller = module.get<PayosController>(PayosController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
