import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Document } from 'mongoose';
import { IsBoolean, IsNotEmpty, IsOptional } from 'class-validator';

@Schema({ timestamps: true })
export class Demo extends Document {
  @ApiProperty()
  @IsNotEmpty()
  @Prop({ required: true })
  name: string;

  @ApiProperty()
  @IsNotEmpty()
  @Prop({ required: false })
  address: string;

  @ApiProperty()
  @IsNotEmpty()
  @Prop({ required: true })
  phone: string;

  @ApiProperty()
  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  @Prop({ required: false, default: false })
  isActive: boolean;
}

export const DemoSchema = SchemaFactory.createForClass(Demo);
DemoSchema.statics = {};
