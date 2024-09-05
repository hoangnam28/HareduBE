import { NotifyUserRepository } from './notifyUser.repository';
import { Injectable } from '@nestjs/common';
import { NotifyRepository } from './notification.repository';
import { NotifyDTO } from 'src/dto/notify.dto';
import { Pagination } from '@common/interfaces/filter.interface';

@Injectable()
export class NotificationService {
  constructor(
    private readonly notifyRepository: NotifyRepository,
    private notifyUserRepository: NotifyUserRepository,
  ) {}

  async createNotification(data: NotifyDTO) {
    return await this.notifyRepository.create(data);
  }

  async getAllNotifications(owner: string[], pagination: Pagination) {
    const [data, total] = await this.notifyRepository.paginate({
      pagination: {
        ...pagination,
        owner: { $in: owner },
      },
      populates: ['owner'],
    });
    return { data, total };
  }

  async getNotificationByUser(userId: string) {
    return await this.notifyUserRepository.findAll({ user: userId }, [
      { path: 'notifyId', populate: { path: 'owner' } },
    ]);
  }

  async updateNotification(userId: string) {
    const notify = await this.notifyUserRepository.findAll({ user: userId, isSend: false });
    notify.forEach(async (item) => {
      await item.update({ isSend: true });
    });
    return {};
  }
}
