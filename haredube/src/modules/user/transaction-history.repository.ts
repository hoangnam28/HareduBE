import { TransactionHistory } from '@models/transaction-history.model';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BaseRepository } from 'src/base/base.repository';

@Injectable()
export class TransactionHistoryRepository extends BaseRepository<TransactionHistory> {
  constructor(@InjectModel(TransactionHistory.name) transactionHistoryModel: Model<TransactionHistory>) {
    super(transactionHistoryModel);
  }
}
