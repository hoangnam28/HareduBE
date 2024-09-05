import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { Document, PopulatedDoc, SchemaTypes, Types } from 'mongoose';
import { TeachingFiled } from './teaching-filed.model';
import { User } from './user.model';
import { IsBoolean, IsOptional, IsString } from 'class-validator';

class Bank {
  @ApiProperty()
  @Prop({ type: String, default: '' })
  name: string;

  @ApiProperty()
  @Prop({ type: String, default: '' })
  code: string;

  @ApiProperty()
  @IsString()
  @Prop({ type: String, default: '' })
  bin: string;

  @ApiProperty()
  @Prop({ type: String, default: '' })
  shortName: string;

  @ApiProperty()
  @Prop({ type: String, default: '' })
  logo: string;

  @ApiProperty()
  @IsString()
  @Prop({ type: String, default: '' })
  accountNumber: string;

  @ApiProperty()
  @IsString()
  @Prop({ type: String, default: '' })
  accountName: string;
}

@Schema({ timestamps: true })
export class Tutor extends Document {
  @ApiProperty()
  @Prop({ type: SchemaTypes.ObjectId, ref: User.name, required: true, unique: true })
  userId: PopulatedDoc<User, Types.ObjectId>;

  @ApiProperty()
  @Prop({ type: [SchemaTypes.ObjectId], ref: TeachingFiled.name, default: [] })
  teachingFiledsId: PopulatedDoc<TeachingFiled, Types.ObjectId>[];

  @ApiProperty()
  @Prop({ type: String, default: '' })
  curriculumVitaePath: string;

  @ApiProperty()
  @Prop({ type: String, default: '' })
  identityCardFront: string;

  @ApiProperty()
  @Prop({ type: String, default: '' })
  identityCardBack: string;

  @ApiProperty()
  @Prop({ type: () => Bank, default: null })
  bank: Bank;
}

export const TutorSchema = SchemaFactory.createForClass(Tutor);
TutorSchema.statics = {};
