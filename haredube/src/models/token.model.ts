import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { User } from './user.model';
import { Document, PopulatedDoc, SchemaTypes, Types } from 'mongoose';

@Schema({ timestamps: true })
export class Token extends Document {
  @ApiProperty()
  @Prop({ type: SchemaTypes.ObjectId, ref: User.name, required: true })
  userId: PopulatedDoc<User, Types.ObjectId>;

  @ApiProperty()
  @Prop({ required: false })
  sessionId: string;

  @ApiProperty()
  @Prop({ required: true })
  token: string;
}

export const TokenSchema = SchemaFactory.createForClass(Token);
TokenSchema.statics = {};
