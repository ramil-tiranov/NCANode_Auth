import { IsEmail, IsNotEmpty, IsString, MinLength, IsEnum, IsOptional, IsPhoneNumber } from 'class-validator';
import { Prop } from '@nestjs/mongoose';
import { UserRole } from 'src/users/user.schema';

export class SignupDto {
  @IsEmail()
  @IsNotEmpty()
  @Prop({ required: true, unique: true })
  email: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  @Prop({ required: true })
  password: string;

  @IsString()
  @IsNotEmpty()
  @IsPhoneNumber('KZ') 
  @Prop({ required: true }) 
  phoneNumber: string;

  @IsString()
  @Prop({ required: true})
  cms: string;
}
