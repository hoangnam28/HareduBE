import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { Document, PopulatedDoc, SchemaTypes, Types } from 'mongoose';
import { TeachingFiled } from './teaching-filed.model';
import { User } from './user.model';

@Schema({ timestamps: true })
export class Post extends Document {
  @ApiProperty()
  @Prop({ type: SchemaTypes.ObjectId, required: true, unique: true })
  userId: PopulatedDoc<User, Types.ObjectId>;

  @ApiProperty()
  @Prop({ type: [SchemaTypes.ObjectId], default: [] })
  teachingFiledsId: PopulatedDoc<TeachingFiled, Types.ObjectId>[];

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
  @Prop({ type: [() => Comment], default: [] })
  comments: Comment[];

  @ApiProperty()
  @Prop({ type: Boolean, default: false })
  isActive: boolean;
}

export const PostSchema = SchemaFactory.createForClass(Post);
PostSchema.statics = {};

class Comment {
  @ApiProperty()
  @Prop({ type: SchemaTypes.ObjectId, required: true, unique: true })
  userId: PopulatedDoc<User, Types.ObjectId>;

  @ApiProperty()
  @Prop({ type: String, required: true })
  comment: string;

  @ApiProperty()
  @Prop({ type: Date, default: new Date() })
  createTime: Date;
}
