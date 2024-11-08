import { Controller, Post, Body , Logger} from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignupDto } from '../data/dto/signup.dto/signup.dto';
import { LoginDto } from '../data/dto/login.dto/login.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  
  @Post('signup')
  async signup(@Body() signupDto: SignupDto) {
    return this.authService.signup(signupDto);
  }

  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }
}
