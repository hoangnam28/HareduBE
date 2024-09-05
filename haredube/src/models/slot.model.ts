import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Document, PopulatedDoc, SchemaTypes, Types } from 'mongoose';
import { IsBoolean, IsMongoId, IsNotEmpty, IsOptional } from 'class-validator';
import { Classroom } from './classroom.model';

@Schema({ timestamps: true })
export class Slot extends Document {
  @ApiProperty()
  @IsNotEmpty()
  @Prop({ required: true })
  title: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsMongoId()
  @Prop({ type: SchemaTypes.ObjectId, ref: 'Classroom', required: true, default: null })
  classroomId: PopulatedDoc<Classroom, Types.ObjectId>;

  @ApiProperty()
  @IsNotEmpty()
  @Prop({ required: true })
  description: string;

  @ApiProperty()
  @IsNotEmpty()
  @Prop({ required: true })
  startTime: Date;

  @ApiProperty()
  @IsNotEmpty()
  @Prop({ required: true })
  endTime: Date;

  @ApiProperty()
  @ApiPropertyOptional()
  @IsOptional()
  @Prop({ required: false })
  meetingId: string;

  @ApiProperty()
  @ApiPropertyOptional()
  @IsOptional()
  @Prop({ required: false })
  uid: string;

  @ApiProperty()
  @ApiPropertyOptional()
  @IsOptional()
  @Prop({ required: false })
  mainVideo: string;

  @ApiProperty()
  @ApiPropertyOptional()
  @IsOptional()
  @Prop({ required: false })
  subVideo: string[];

  @ApiProperty()
  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  @Prop({ required: false, default: true })
  status: boolean;
}

export const SlotSchema = SchemaFactory.createForClass(Slot);
SlotSchema.statics = {};
