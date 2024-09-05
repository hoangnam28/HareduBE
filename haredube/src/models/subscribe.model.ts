import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { User } from './user.model';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
import { PopulatedDoc, SchemaTypes, Types, Document } from 'mongoose';

@Schema({ timestamps: true })
export class Subscriber extends Document {
  @ApiProperty()
  @IsNotEmpty()
  @Prop({ type: SchemaTypes.ObjectId, ref: User.name, required: true })
  subscriber: PopulatedDoc<User, Types.ObjectId>;

  @ApiProperty()
  @IsNotEmpty()
  @Prop({ type: SchemaTypes.ObjectId, ref: User.name, required: true })
  owner: PopulatedDoc<User, Types.ObjectId>;
}

export const SubscriberSchema = SchemaFactory.createForClass(Subscriber);
SubscriberSchema.statics = {};
