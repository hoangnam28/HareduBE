import { Roles } from '@common/constants/global.const';
import { IsEmail } from '@common/validator';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import * as bcrypt from 'bcrypt';
import { Type } from 'class-transformer';
import { IsBoolean, IsDate, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { NextFunction } from 'express';
import { Date, Document } from 'mongoose';

@Schema({ timestamps: true })
export class User extends Document {
  @ApiProperty()
  @IsEmail()
  @Prop({ type: String, required: true, unique: true })
  email: string;

  @ApiProperty()
  @IsString()
  @Prop({ type: String, required: true, unique: true })
  slug: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  @Prop({ type: String, required: false })
  name: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  @Prop({ type: String, required: false })
  avatar: string;

  @ApiProperty()
  @IsNumber()
  @IsOptional()
  @Prop({ type: Number, required: false, default: 0 })
  money: number;

  @ApiProperty()
  @IsBoolean()
  @IsOptional()
  @Prop({ type: Boolean, required: false })
  gender: boolean;

  @ApiProperty()
  @Type(() => Date)
  @IsDate()
  @IsOptional()
  @Prop({ type: Date, required: false })
  dob: Date;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @Prop({ type: String, required: true })
  password: string;

  @ApiProperty()
  @IsNotEmpty()
  @Prop({ type: String, required: true })
  role: Roles;

  @ApiProperty()
  @Prop({ type: Boolean, required: false, default: true })
  isActive: boolean;

  @ApiProperty()
  @Prop({ type: Boolean, required: false, default: false })
  status: boolean;

  @Prop({ type: Date, default: null })
  deletedAt: Date | null;

  @ApiProperty()
  @IsBoolean()
  @Prop({ type: Boolean, default: false })
  needVerify: boolean;

  @ApiProperty()
  @IsBoolean()
  @Prop({ type: Boolean, default: false })
  isVerified: boolean;

  @ApiProperty()
  @IsString()
  @Prop({ type: String, default: 'Your account has not been verified. Need to update avatar, 2 sides of citizen ID.' })
  reasonNotVerified: string;

  isValidPassword: (password: string) => Promise<boolean>;
}

export const UserSchema = SchemaFactory.createForClass(User);

UserSchema.pre<User>('save', async function (next: NextFunction) {
  try {
    const saltOrRounds = 10;
    const salt = await bcrypt.genSalt(saltOrRounds);
    const hash = await bcrypt.hash(this.password, salt);
    this.password = hash;
    next();
  } catch (error) {
    next(error);
  }
});

UserSchema.pre('findOneAndUpdate', async function (next) {
  const update = this.getUpdate();
  if ('password' in update && typeof update === 'object') {
    const password = update.password;
    if (password) {
      const saltOrRounds = 10;
      const hash = await bcrypt.hash(password, saltOrRounds);
      update.password = hash;
    }
  }
  next();
});

UserSchema.methods.isValidPassword = async function (password: string) {
  try {
    return await bcrypt.compare(password, this.password);
  } catch (error) {
    throw new Error(error);
  }
};

UserSchema.statics = {};
