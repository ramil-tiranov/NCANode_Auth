import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { IsEmail } from 'class-validator';
import { Document, Types } from 'mongoose';
import { CMS, CMSSchema, Action } from '../cms/cms.schema'; 

export enum Rating {
  POOR = 1,
  AVERAGE = 2,
  GOOD = 3,
  EXCELLENT = 4,
  AMAZING = 5,
}

@Schema({ _id: false })
export class FeedbackEntry {
  @Prop({ required: true, enum: Rating })
  rating: Rating;

  @Prop({ required: false })
  feedback?: string;

  @Prop({ default: Date.now })
  createdAt: Date;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  companyId: Types.ObjectId;
}

@Schema()
export class Profile extends Document {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  companyId: Types.ObjectId;

  @Prop({ required: true, unique: true })
  @IsEmail()
  email: string;

  @Prop({required: true,unique: true})
  pin: string

  @Prop({ required: false })
  firstName?: string;

  @Prop({ required: false })
  lastName?: string;

  @Prop({ required: false })
  bio?: string;

  @Prop({ required: false })
  profilePicture?: string;

  @Prop({ required: false })
  contacts?: string;

  @Prop({ type: [FeedbackEntry], default: [] })
  feedbacks?: FeedbackEntry[];

  @Prop({ type: [CMSSchema], default: [] , required : true})
  activityLogs: CMS[]; 

  @Prop({ type: Date, default: Date.now })
  createdAt: Date;
}

export const ProfileSchema = SchemaFactory.createForClass(Profile);
