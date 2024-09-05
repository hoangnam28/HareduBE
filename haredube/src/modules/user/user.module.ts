import { TeachingFiled, TeachingFiledSchema } from '@models/teaching-filed.model';
import { TransactionHistory, TransactionHistorySchema } from '@models/transaction-history.model';
import { Tutor, TutorSchema } from '@models/tutor.model';
import { User, UserSchema } from '@models/user.model';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TransactionHistoryRepository } from './transaction-history.repository';
import { TutorRepository } from './tutor.repository';
import { UserController } from './user.controller';
import { UsersRepository } from './user.repository';
import { UserService } from './user.service';
import { TransactionModule } from '@modules/transaction/transaction.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Tutor.name, schema: TutorSchema },
      { name: TeachingFiled.name, schema: TeachingFiledSchema },
      { name: TransactionHistory.name, schema: TransactionHistorySchema },
    ]),
    TransactionModule,
  ],
  controllers: [UserController],
  providers: [UsersRepository, UserService, TutorRepository, TransactionHistoryRepository],
  exports: [UsersRepository, UserService, TutorRepository, TransactionHistoryRepository],
})
export class UserModule {}
