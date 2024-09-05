import { ReportStatus } from '@common/constants/global.const';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { Document, PopulatedDoc, SchemaTypes, Types } from 'mongoose';
import { Slot } from './slot.model';
import { User } from './user.model';

@Schema({ timestamps: true })
export class Report extends Document {
  @ApiProperty()
  @Prop({ type: SchemaTypes.ObjectId, required: true })
  slotId: PopulatedDoc<Slot, Types.ObjectId>;

  @ApiProperty()
  @Prop({ type: String, required: true })
  slot: string;

  @ApiProperty()
  @Prop({ type: SchemaTypes.ObjectId, required: true })
  reporterId: PopulatedDoc<User, Types.ObjectId>;

  @ApiProperty()
  @Prop({ type: SchemaTypes.ObjectId, required: true })
  assigneeId: PopulatedDoc<User, Types.ObjectId>;

  @ApiProperty()
  @Prop({ type: String, required: true })
  description: string;

  @ApiProperty()
  @Prop({ type: () => Reason })
  reasonRejectOfAssignee: Reason;

  @ApiProperty()
  @Prop({ type: () => Reason })
  reasonRejectOfStaff: Reason;

  @ApiProperty()
  @Prop({ type: () => Reason })
  reasonApproveOfStaff: Reason;

  @ApiProperty()
  @Prop({ type: Boolean, required: true })
  isRead: boolean;

  @ApiProperty()
  @Prop({ type: ReportStatus, required: true })
  status: ReportStatus;
}

export const ReportSchema = SchemaFactory.createForClass(Report);
ReportSchema.statics = {};

class Reason {
  @ApiProperty()
  @Prop({ type: String, required: true })
  content: string;

  @ApiProperty()
  @Prop({ type: String, required: true })
  attachFile: string;
}
