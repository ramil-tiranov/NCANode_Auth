import { AuthService } from './auth.service';
import { SignupDto } from '../data/dto/signup.dto/signup.dto';
import { LoginDto } from '../data/dto/login.dto/login.dto';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    signup(signupDto: SignupDto): Promise<{
        token: string;
        role: import("../users/user.schema").UserRole;
    }>;
    login(loginDto: LoginDto): Promise<{
        token: string;
        role: import("../users/user.schema").UserRole;
    }>;
}
