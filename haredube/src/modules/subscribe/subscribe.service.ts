import { Roles } from '@common/constants/global.const';
import { SubscribeRepository } from './subscribe.repository';
import { Injectable } from '@nestjs/common';
import { SubscribeDTO } from 'src/dto/subscribe.dto';

@Injectable()
export class SubscribeService {
  constructor(private readonly subscribeRepository: SubscribeRepository) {}

  async getAll(userId: string, role: string, pagination: any) {
    const [data, total] = await this.subscribeRepository.paginate({
      pagination: {
        ...pagination,
        ...(role === Roles.TUTOR ? { owner: userId } : { subscriber: userId }),
      },
      populates: [
        { path: 'subscriber', select: '-password' },
        { path: 'owner', select: '-password' },
      ],
    });
    return { data, total };
  }

  async create(data: SubscribeDTO) {
    return await this.subscribeRepository.create(data);
  }

  async delete(id: string) {
    return await this.subscribeRepository.remove(id);
  }

  async getSubscriber(subscriber: string, owner: string) {
    return await this.subscribeRepository.findOne({
      subscriber,
      owner,
    });
  }
}
