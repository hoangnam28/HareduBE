import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Document, PopulatedDoc, SchemaTypes, Types } from 'mongoose';
import { IsArray, IsBoolean, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { Gallery } from './gallery.model';
import { User } from './user.model';
import { TeachingFiled } from './teaching-filed.model';
import { Slot } from './slot.model';

@Schema({ timestamps: true })
export class Comment {
  @ApiProperty()
  @Prop({ type: SchemaTypes.ObjectId, required: true })
  userId: PopulatedDoc<User, Types.ObjectId>;

  @ApiProperty()
  @IsString()
  @Prop({ type: String, required: true })
  comment: string;
}

@Schema({ timestamps: true })
export class Post {
  @ApiProperty()
  @Prop({ type: SchemaTypes.ObjectId, required: true })
  userId: PopulatedDoc<User, Types.ObjectId>;

  @ApiProperty()
  @Prop({ type: [String], default: [] })
  images: string[];

  @ApiProperty()
  @Prop({ type: String, required: true })
  content: string;

  @ApiProperty()
  @Prop({ type: Number, default: 0 })
  likeQuantity: number;

  @ApiProperty()
  @IsOptional()
  @IsArray()
  @Prop({ type: SchemaTypes.Array, schema: [Comment], default: [] })
  comments: Comment[];
}

@Schema({ timestamps: true })
export class Classroom extends Document {
  @ApiProperty()
  @IsNotEmpty()
  @Prop({ required: true })
  name: string;

  @ApiProperty({ type: String })
  @IsOptional()
  @Prop({ type: SchemaTypes.ObjectId, ref: Gallery.name, required: false, default: null })
  thumbnail: PopulatedDoc<Gallery, Types.ObjectId>;

  @ApiProperty({ type: String })
  @IsOptional()
  @Prop({ type: SchemaTypes.ObjectId, ref: Gallery.name, required: false, default: null })
  banner: PopulatedDoc<Gallery, Types.ObjectId>;

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

  @ApiProperty({ type: String })
  @IsOptional()
  @Prop({ type: SchemaTypes.ObjectId, ref: User.name, required: true })
  lecture: PopulatedDoc<User, Types.ObjectId>;

  @ApiProperty({ type: String })
  @IsOptional()
  @Prop({ type: [SchemaTypes.ObjectId], ref: User.name, required: false, default: [] })
  students: PopulatedDoc<User, Types.ObjectId>[];

  @ApiProperty()
  @IsOptional()
  @Prop({ type: [SchemaTypes.ObjectId], ref: Slot.name, required: false, default: [] })
  slots: PopulatedDoc<Slot, Types.ObjectId>[];

  @ApiProperty()
  @IsOptional()
  @Prop({ type: [SchemaTypes.ObjectId], ref: TeachingFiled.name, required: false, default: [] })
  teachFileds: PopulatedDoc<TeachingFiled, Types.ObjectId>[];

  @ApiProperty()
  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  @Prop({ required: false, default: false })
  isActive: boolean;

  @ApiProperty()
  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  @Prop({ required: false, default: false })
  status: boolean;

  @ApiProperty()
  @IsOptional()
  @IsArray()
  @Prop({ type: SchemaTypes.Array, schema: [Post], default: [] })
  posts: Array<Post>;

  @ApiProperty()
  @IsNumber()
  @Prop({ required: true, default: 0 })
  price: number;

  @ApiProperty()
  @IsNumber()
  @Prop({ type: Number, required: true, default: 0 })
  wallet: number;
}

export const ClassroomSchema = SchemaFactory.createForClass(Classroom);
ClassroomSchema.statics = {};
