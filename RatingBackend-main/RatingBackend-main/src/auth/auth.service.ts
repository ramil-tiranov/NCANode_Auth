import { Injectable, BadRequestException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { SignupDto } from '../data/dto/signup.dto/signup.dto';
import { LoginDto } from '../data/dto/login.dto/login.dto';
import * as bcrypt from 'bcrypt';
import { CMSService } from '../cms/cms.service';
import { Action, CMS } from '../cms/cms.schema';
import { UserRole } from 'src/users/user.schema';
import { CustomLogger } from 'src/logger/logger.service';
import { ProfileService } from 'src/profile/profile.service';
import { CompanyService } from 'src/company/company.service';
import { CreateCompanyDto } from 'src/data/dto/company.dto/company.dto';
import { Types } from 'mongoose';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UsersService,
    private readonly jwtService: JwtService,
    private readonly cmsService: CMSService,
    private readonly logger: CustomLogger,
    private readonly profileService: ProfileService,
    private readonly companyService: CompanyService
  ) {}

  async signup(signupDto: SignupDto) {
    const { email, password, phoneNumber, cms } = signupDto;
  
    const isCmsValid = await this.cmsService.cmsVerify(cms);
    if (!isCmsValid) {
      this.logger.error('Invalid CMS');
      throw new BadRequestException('Invalid CMS');
    }
  
    const [name, surName] = isCmsValid.name.split(" ");
    let company = isCmsValid.company || "EMPLOYEE";
    let role = company ? UserRole.EMPLOYEE : UserRole.MANAGER;
    const pin = isCmsValid.pin;
    let shape: Types.ObjectId;
  
    try {
      const user = await this.userService.create({
        email,
        password,
        company,
        name,
        surname: surName,
        role,
        phoneNumber,
        pin,
        shape: null, 
      });
  
      if (!isCmsValid.company) {
        shape = await this.profileService.getProfileByPin(pin);
        if (!shape) {
        const simpleProfile = await this.profileService.create(
          user._id as Types.ObjectId,  // user._id passed as userId
          email,                       // email
          { email: email, pin: pin },  // profileDto with email and pin
          pin,                         // pin
          cms                          // cms
        );
        shape = simpleProfile._id as Types.ObjectId;
        }

      } else {
        const createCompanyDto: CreateCompanyDto = {
          companyId: user._id as Types.ObjectId,
          email,
          companyName: company,
          contactNumber: '',
          bio: 'A brief bio',
          logo: '',
          contacts: 'Contact Info'
        };
        const companyEntry = await this.companyService.create(createCompanyDto,cms,user._id as Types.ObjectId);
        shape = companyEntry._id as Types.ObjectId; 
      }
  
      user.shape = shape;
      await user.save();
  
      const cmsEntry = {
        userId: user._id,
        cms,
        action: Action.REGISTRATION,
        createdAt: new Date(),
      };
      user.activityLogs.push(cmsEntry as CMS);
  
      await user.save();
  
      const token = this.jwtService.sign({ userId: user._id, roles: user.role, email: user.email , profileId : user.shape});
  
      return { token, role : user.role };
    } catch (error) {
      this.logger.error('Could not complete registration', error);
      throw new BadRequestException('Could not complete registration.');
    }
  }  
  

  async login(loginDto: LoginDto) {
    const { identifier, password } = loginDto;

    let user = await this.userService.findByEmail(identifier) || 
               await this.userService.findByPhone(identifier);
    
    if (!user || !(await bcrypt.compare(password, user.password))) {
      this.logger.error('Invalid credntials')
      throw new UnauthorizedException('Invalid credentials');
    }

    const token = this.jwtService.sign({ userId: user._id, roles: user.role, email : user.email, profileId : user.shape});
    return { token, role : user.role };
  }
}
