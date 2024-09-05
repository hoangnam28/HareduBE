import { PenaltyCardType } from '@common/constants/global.const';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { Document, PopulatedDoc, SchemaTypes, Types } from 'mongoose';
import { Report } from './report.model';
import { User } from './user.model';

@Schema({ timestamps: true })
export class PenaltyCard extends Document {
  @ApiProperty()
  @Prop({ type: SchemaTypes.ObjectId, required: true })
  userId: PopulatedDoc<User, Types.ObjectId>;

  @ApiProperty()
  @Prop({ type: PenaltyCardType, required: true })
  type: PenaltyCardType;

  @ApiProperty()
  @Prop({ type: String, required: true })
  reason: string;

  @ApiProperty()
  @Prop({ type: SchemaTypes.ObjectId, required: true })
  reportId: PopulatedDoc<Report, Types.ObjectId>;
}

export const PenaltyCardSchema = SchemaFactory.createForClass(PenaltyCard);
PenaltyCardSchema.statics = {};
