import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { IsEmail } from 'class-validator';
import { Document, Types } from 'mongoose';
import { CMS, CMSSchema } from 'src/cms/cms.schema';

export enum Rating {
  POOR = 1,
  AVERAGE = 2,
  GOOD = 3,
  EXCELLENT = 4,
  AMZAING = 5,
}

@Schema({ _id: false })
export class FeedbackEntry {
  @Prop({ required: true, enum: Rating })
  rating: Rating;

  @Prop({ required: false })
  feedback?: string;

  @Prop({ required: true})
  createdBy: string

  @Prop({ default: Date.now })
  createdAt: Date;
}


@Schema()
export class CompanyProfile extends Document {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true, unique: true })
  companyId: Types.ObjectId;

  @Prop({required : true})
  companyName : string

  @Prop({ required: false, unique: false })
  @IsEmail()
  email: string;

  @Prop({ required: false })
  bio?: string;

  @Prop({ required: false })
  logo?: string;

  @Prop({ required: false})
  contacts? : string

  @Prop({ required: false })
  contactNumber: string;

  @Prop({ type: [FeedbackEntry], default: [] })
  feedbacks?: FeedbackEntry[];

  @Prop({ type: [CMSSchema], default: [] , required : true})
  activityLogs: CMS[]; 
}

export const CompanyProfileSchema = SchemaFactory.createForClass(CompanyProfile);
