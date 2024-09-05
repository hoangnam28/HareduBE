import { UsersRepository } from '@modules/user/user.repository';
import { BadRequestException, Injectable } from '@nestjs/common';
import { TransactionRepository } from './transaction.repository';
import { CreateTransDto } from 'src/dto/payment.dto';
import { Pagination } from '@common/interfaces/filter.interface';
import { TransactionReason, TransactionStatus } from '@common/constants/global.const';
import { randomBytes } from 'crypto';

@Injectable()
export class TransactionService {
  constructor(
    private readonly transRepo: TransactionRepository,
    private usersRepository: UsersRepository,
  ) {}

  async createTransaction(data: CreateTransDto) {
    return await this.transRepo.create(data);
  }

  async getTransByToken(userId: string, token: string) {
    return await this.transRepo.findOne({ userId, token });
  }

  async getTransactionHistory(userId: string, pagination: Pagination) {
    const { from, to, plus, minus } = pagination;
    const [data, total] = await this.transRepo.paginate({
      pagination: {
        ...pagination,
        userId,
        createdAt: { $gte: from, $lte: to },
        ...(plus && !minus && { changeBalance: { $gte: 0 } }),
        ...(minus && !plus && { changeBalance: { $lte: 0 } }),
        sortBy: 'updatedAt',
      },
      populates: ['userId'],
      select: '-token',
    });

    return { data, total };
  }

  async getLectureWithdraw(pagination: Pagination) {
    const { from, to, plus, minus } = pagination;
    const [data, total] = await this.transRepo.paginate({
      pagination: {
        ...pagination,
        reason: TransactionReason.WITHDRAW_PROFILE,
        status: TransactionStatus.PENDING,
        createdAt: { $gte: from, $lte: to },
        ...(plus && !minus && { changeBalance: { $gte: 0 } }),
        ...(minus && !plus && { changeBalance: { $lte: 0 } }),
      },
      select: '-token -afterBalance',
    });

    return { data, total };
  }

  async rejectTransaction(id: string, reasonReject: string) {
    return await this.transRepo.update(id, { status: TransactionStatus.REJECT, reasonReject });
  }

  async confirmTransaction(userId: string, id: string, proof: string, amount: number, adminId: string) {
    const user = await this.usersRepository.findById(userId);
    const admin = await this.usersRepository.findById(adminId);
    console.log('🚀 ~ TransactionService ~ confirmTransaction ~ user.money:', user.money);
    if (user.money < amount) {
      await this.transRepo.update(id, {
        status: TransactionStatus.REJECT,
        reasonReject: 'Balance of this account is not enough',
      });
      throw new BadRequestException('Balance of this account is not enough');
    }
    await this.createTransaction({
      userId: admin._id,
      changeBalance: amount,
      changeState: true,
      afterBalance: 0,
      reason: TransactionReason.CONFIRM,
      token: randomBytes(16).toString('hex'),
      status: TransactionStatus.SUCCESS,
    });
    await this.transRepo.update(id, {
      status: TransactionStatus.SUCCESS,
      afterBalance: (user.money ?? 0) - amount,
      proof,
    });
    await user.updateOne({ money: (user.money ?? 0) - amount });
    return {};
  }
}
