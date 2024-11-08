import { IsEmail, IsNotEmpty, IsOptional, IsPhoneNumber, IsString, IsArray } from 'class-validator';
import { Types } from 'mongoose';
import { Rating } from 'src/profile/profile.schema';

export class CreateCompanyDto {
  @IsNotEmpty()
  companyId: Types.ObjectId;

  @IsEmail()
  email: string;

  @IsString()
  companyName

  @IsOptional()
  @IsString()
  bio?: string;

  @IsOptional()
  @IsString() 
  logo?: string;

  @IsOptional()
  @IsString()
  contacts?: string;

  @IsNotEmpty()
  @IsPhoneNumber(null)
  contactNumber: string;

}

export class UpdateCompanyDto {
  @IsOptional()
  @IsString()
  bio?: string;

  @IsOptional()
  @IsString()
  logo?: string;

  @IsOptional()
  @IsString()
  contacts?: string;

  @IsOptional()
  @IsPhoneNumber(null)
  contactNumber?: string;

  @IsOptional()
  @IsArray()
  feedbacks?: FeedbackEntryDto[];

  @IsString()
  cms: string
}

export class FeedbackEntryDto {
  @IsNotEmpty()
  rating: Rating;

  @IsOptional()
  feedback?: string;
}

