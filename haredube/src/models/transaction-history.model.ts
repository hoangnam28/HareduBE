import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { Document, PopulatedDoc, SchemaTypes, Types } from 'mongoose';
import { User } from './user.model';
import { IsOptional, IsString } from 'class-validator';
import { TransactionStatus } from '@common/constants/global.const';

@Schema({ timestamps: true })
export class TransactionHistory extends Document {
  @ApiProperty()
  @Prop({ type: SchemaTypes.ObjectId, ref: User.name, required: true })
  userId: PopulatedDoc<User, Types.ObjectId>;

  @ApiProperty()
  @Prop({ type: Number, required: true })
  changeBalance: number;

  @ApiProperty()
  @Prop({ type: Boolean, required: true })
  changeState: boolean;

  @ApiProperty()
  @Prop({ type: Number, required: true })
  afterBalance: number;

  @ApiProperty()
  @Prop({ type: String, required: true })
  reason: string;

  @ApiProperty()
  @IsString()
  @Prop({ type: String, required: true, unique: true })
  token: string;

  @ApiProperty()
  @IsString()
  @Prop({ type: String, required: true, default: TransactionStatus.PENDING })
  status: TransactionStatus;

  @ApiProperty()
  @IsString()
  @IsOptional()
  @Prop({ type: String, required: false })
  proof: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  @Prop({ type: String, required: false })
  reasonReject: string;
}

export const TransactionHistorySchema = SchemaFactory.createForClass(TransactionHistory);
TransactionHistorySchema.statics = {};
