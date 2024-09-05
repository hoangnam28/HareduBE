import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { Document, PopulatedDoc, SchemaTypes, Types } from 'mongoose';

@Schema({ timestamps: true })
export class TeachingFiled extends Document {
  @ApiProperty()
  @Prop({ type: String, required: true })
  name: string;

  @ApiProperty()
  @Prop({ type: SchemaTypes.ObjectId, default: null })
  parentTeachingFiledId: PopulatedDoc<TeachingFiled, Types.ObjectId>;
}

export const TeachingFiledSchema = SchemaFactory.createForClass(TeachingFiled);
TeachingFiledSchema.statics = {};
