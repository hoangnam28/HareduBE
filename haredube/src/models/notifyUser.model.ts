import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { User } from './user.model';
import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsOptional } from 'class-validator';
import { PopulatedDoc, SchemaTypes, Types, Document } from 'mongoose';
import { Notification } from './notification.model';

@Schema({ timestamps: true })
export class NotifyUser extends Document {
  @ApiProperty({ type: String })
  @IsOptional()
  @Prop({ type: SchemaTypes.ObjectId, ref: Notification.name, required: true })
  notifyId: PopulatedDoc<Notification, Types.ObjectId>;

  @ApiProperty({ type: String })
  @IsOptional()
  @Prop({ type: SchemaTypes.ObjectId, ref: User.name, required: true })
  user: PopulatedDoc<User, Types.ObjectId>;

  @ApiProperty()
  @IsBoolean()
  @Prop({ type: Boolean, required: false, default: false })
  isSend: boolean;
}

export const NotifyUserSchema = SchemaFactory.createForClass(NotifyUser);
NotifyUserSchema.statics = {};
