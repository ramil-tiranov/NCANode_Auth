import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { SignupDto } from '../data/dto/signup.dto/signup.dto';
import { LoginDto } from '../data/dto/login.dto/login.dto';
import { CMSService } from '../cms/cms.service';
import { UserRole } from 'src/users/user.schema';
import { CustomLogger } from 'src/logger/logger.service';
import { ProfileService } from 'src/profile/profile.service';
import { CompanyService } from 'src/company/company.service';
export declare class AuthService {
    private readonly userService;
    private readonly jwtService;
    private readonly cmsService;
    private readonly logger;
    private readonly profileService;
    private readonly companyService;
    constructor(userService: UsersService, jwtService: JwtService, cmsService: CMSService, logger: CustomLogger, profileService: ProfileService, companyService: CompanyService);
    signup(signupDto: SignupDto): Promise<{
        token: string;
        role: UserRole;
    }>;
    login(loginDto: LoginDto): Promise<{
        token: string;
        role: UserRole;
    }>;
}
