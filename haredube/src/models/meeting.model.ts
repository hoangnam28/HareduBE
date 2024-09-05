import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Document, PopulatedDoc, SchemaTypes, Types } from 'mongoose';
import { IsArray, IsBoolean, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { User } from './user.model';
import { Slot } from './slot.model';

@Schema()
export class Members {
  @ApiProperty()
  @IsNotEmpty()
  @Prop({ type: SchemaTypes.ObjectId, ref: User.name, required: true })
  userId: PopulatedDoc<User, Types.ObjectId>;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  @Prop({ required: false, default: false })
  isHost: boolean;

  @ApiPropertyOptional()
  @IsString()
  @Prop({ required: false, default: false })
  clientId: string;

  @ApiPropertyOptional()
  @IsString()
  @Prop({ required: false, default: false })
  userName: string;
}

@Schema({ timestamps: true })
export class Room extends Document {
  @ApiProperty()
  @IsOptional()
  @IsArray()
  @Prop({ type: SchemaTypes.Array, schema: [Members], default: [] })
  members: Array<Members>;

  @ApiProperty()
  @IsNotEmpty()
  @Prop({ type: SchemaTypes.ObjectId, ref: Slot.name, required: true })
  slotId: PopulatedDoc<Slot, Types.ObjectId>;

  @ApiProperty()
  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  @Prop({ required: false, default: false })
  status: boolean;
}

export const RoomSchema = SchemaFactory.createForClass(Room);
RoomSchema.statics = {};
