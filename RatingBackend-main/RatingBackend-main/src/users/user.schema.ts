import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { IsEmail, IsNotEmpty, IsString, IsOptional, IsPhoneNumber } from 'class-validator';
import { CMS, CMSSchema } from 'src/cms/cms.schema';

export enum UserRole {
  EMPLOYEE = 'employee',
  MANAGER = 'manager',
  ADMIN = 'admin',
}

@Schema()
export class User extends Document {
  @Prop({ required: true, unique: true })
  @IsEmail()
  email: string;

  @Prop({ required: true })
  @IsString()
  @IsNotEmpty()
  company: string;

  @Prop({ required: true, unique: false })
  @IsString()
  @IsNotEmpty()
  name: string;

  @Prop({ required: true, unique: false })
  @IsString()
  @IsNotEmpty()
  surname: string;

  @Prop({ required: true })
  @IsString()
  @IsNotEmpty()
  password: string;

  @Prop({ enum: UserRole, required: true })
  role: UserRole;

  @IsString()
  @IsNotEmpty()
  @IsPhoneNumber('KZ') 
  @Prop({ required: false })
  phoneNumber: string;

  @Prop({ type: [CMSSchema], default: [] , required : true})
  activityLogs: CMS[]; 
  
  @Prop({ type: Date, default: Date.now })
  createdAt: Date;
  
  @Prop({ required: true})
  pin: string

  @Prop({ type: Types.ObjectId, required: false })
  shape?: Types.ObjectId;
}

export const UserSchema = SchemaFactory.createForClass(User);
