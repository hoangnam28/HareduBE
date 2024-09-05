import { TransactionHistory } from '@models/transaction-history.model';
import { Prop } from '@nestjs/mongoose';
import { ApiProperty, PickType } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreatePaymentDto {
  @ApiProperty()
  @IsNotEmpty()
  @Prop({ required: true })
  amount: number;
}

export class CreateTransDto extends PickType(TransactionHistory, [
  'userId',
  'changeBalance',
  'changeState',
  'afterBalance',
  'reason',
  'token',
  'status',
]) {}

export class RejectTrans {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @Prop({ required: true })
  reasonReject: string;
}

export class AcceptTrans {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @Prop({ required: true })
  userId: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @Prop({ required: true })
  proof: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  @Prop({ required: true })
  amount: number;
}
