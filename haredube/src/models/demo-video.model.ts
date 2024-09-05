import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { Document, PopulatedDoc, SchemaTypes, Types } from 'mongoose';
import { TeachingFiled } from './teaching-filed.model';
import { User } from './user.model';

@Schema({ timestamps: true })
export class DemoVideo extends Document {
  @ApiProperty()
  @Prop({ type: SchemaTypes.ObjectId, required: true, ref: User.name })
  userId: PopulatedDoc<User, Types.ObjectId>;

  @ApiProperty()
  @Prop({ type: String, required: true })
  name: string;

  @ApiProperty()
  @Prop({ type: SchemaTypes.ObjectId, required: true, ref: TeachingFiled.name })
  teachingFiledId: PopulatedDoc<TeachingFiled, Types.ObjectId>;

  @ApiProperty()
  @Prop({ type: String, required: true })
  thumbnail: string;

  @ApiProperty()
  @Prop({ type: String, required: true })
  video: string;

  @ApiProperty()
  @Prop({ type: String, default: '' })
  description: string;

  @ApiProperty()
  @Prop({ type: Number, required: true, default: 0 })
  view: number;
}

export const DemoVideoSchema = SchemaFactory.createForClass(DemoVideo);
DemoVideoSchema.statics = {};
