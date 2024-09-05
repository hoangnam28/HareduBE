import { forwardRef, Module } from '@nestjs/common';
import { TransactionService } from './transaction.service';
import { TransactionController } from './transaction.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { TransactionHistory, TransactionHistorySchema } from '@models/transaction-history.model';
import { TransactionRepository } from './transaction.repository';
import { UserModule } from '@modules/user/user.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: TransactionHistory.name, schema: TransactionHistorySchema }]),
    forwardRef(() => UserModule),
  ],
  controllers: [TransactionController],
  providers: [TransactionService, TransactionRepository],
  exports: [TransactionService, TransactionRepository],
})
export class TransactionModule {}
