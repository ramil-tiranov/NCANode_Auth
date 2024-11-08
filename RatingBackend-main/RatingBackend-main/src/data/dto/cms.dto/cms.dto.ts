import { IsBoolean, IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { Types } from 'mongoose';
import { Action } from 'src/cms/cms.schema';

export class CreateCmsDto {
  @IsNotEmpty()
  @IsString()
  userId: Types.ObjectId;

  @IsNotEmpty()
  @IsString()
  cms: string; 

  @IsEnum(Action)
  action: Action;
}

export class CmsReturnDto {
  @IsNotEmpty()
  @IsString()
  company: string;

  @IsString()
  name: string;

  @IsNotEmpty()
  @IsBoolean()
  valid: boolean;

  @IsString()
  pin: string;
}