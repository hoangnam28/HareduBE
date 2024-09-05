import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { Document, PopulatedDoc, SchemaTypes, Types } from 'mongoose';
import { TeachingFiled } from './teaching-filed.model';
import { User } from './user.model';

@Schema({ timestamps: true })
export class Student extends Document {
  @ApiProperty()
  @Prop({ type: SchemaTypes.ObjectId, required: true, unique: true })
  userId: PopulatedDoc<User, Types.ObjectId>;

  @ApiProperty()
  @Prop({ type: [SchemaTypes.ObjectId], default: [] })
  teachingFiledsId: PopulatedDoc<TeachingFiled, Types.ObjectId>[];

  @ApiProperty()
  @Prop({ type: Number, default: 0 })
  blance: number;
}

export const StudentSchema = SchemaFactory.createForClass(Student);
StudentSchema.statics = {};
