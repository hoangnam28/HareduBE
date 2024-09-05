import { Module } from '@nestjs/common';
import { PayosService } from './payos.service';
import { PayosController } from './payos.controller';
import { JwtModule } from '@nestjs/jwt';
import { UserModule } from '@modules/user/user.module';
import { TransactionModule } from '@modules/transaction/transaction.module';

@Module({
  imports: [JwtModule, UserModule, TransactionModule],
  controllers: [PayosController],
  providers: [PayosService],
  exports: [PayosService],
})
export class PayosModule {}
