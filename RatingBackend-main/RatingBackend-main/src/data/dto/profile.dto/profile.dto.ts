import { IsOptional, IsString, IsEnum, IsEmail, IsNotEmpty, isString } from 'class-validator';
import { Rating } from '../../../profile/profile.schema';
import { Types } from 'mongoose';

export class FeedbackDto {
  @IsEnum(Rating)
  rating: Rating;

  @IsOptional()
  @IsString()
  feedback?: string;
  
  @IsNotEmpty()
  companyId: Types.ObjectId;
}

export class ProfileDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsOptional()
  @IsString()
  firstName?: string;

  @IsOptional()
  @IsString()
  lastName?: string;

  @IsOptional()
  @IsString()
  bio?: string;

  @IsOptional()
  @IsString()
  profilePicture?: string;

  @IsString()
  pin: string

  @IsOptional()
  feedbacks?: FeedbackDto[]; 
}
