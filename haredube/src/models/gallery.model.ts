import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
import { Document, PopulatedDoc, SchemaTypes, Types } from 'mongoose';
import { User } from './user.model';
import { Roles } from '@common/constants/global.const';

@Schema({ timestamps: true })
export class Gallery extends Document {
  @ApiProperty()
  @IsNotEmpty()
  @Prop({ type: SchemaTypes.ObjectId, ref: User.name, required: true })
  userId: PopulatedDoc<User, Types.ObjectId>;

  @ApiProperty()
  @IsNotEmpty()
  @Prop({ type: SchemaTypes.String })
  imageUrl: string;

  @ApiProperty()
  @IsNotEmpty()
  @Prop({ type: String, enum: Roles })
  role: Roles;
}

export const GallerySchema = SchemaFactory.createForClass(Gallery);
GallerySchema.statics = {};
