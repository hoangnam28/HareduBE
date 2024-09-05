import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { User } from './user.model';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { PopulatedDoc, SchemaTypes, Types, Document } from 'mongoose';

@Schema({ timestamps: true })
export class Notification extends Document {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @Prop({ type: String, required: true })
  title: string;

  @ApiProperty()
  @IsNotEmpty()
  @Prop({ type: SchemaTypes.ObjectId, ref: User.name, required: true })
  owner: PopulatedDoc<User, Types.ObjectId>;

  @ApiProperty()
  @IsOptional()
  @IsString()
  @Prop({ type: String, required: false })
  link?: string;
}

export const NotificationSchema = SchemaFactory.createForClass(Notification);
NotificationSchema.statics = {};
