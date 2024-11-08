import { Controller, Post, Get, Put, Body, Param, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from './user.schema';
import { Roles } from './roles/roles.decorator'; 
import { RolesGuard } from './roles/roles.guard'; 
import { AuthGuard } from '@nestjs/passport';
import { Users } from '../users/user.decorator';
import { ProfileService } from 'src/profile/profile.service';
import { Profile } from 'src/profile/profile.schema';
import { CompanyProfile } from 'src/company/company.schema';
import { CompanyService } from 'src/company/company.service';

@Controller('users')
@UseGuards(AuthGuard('jwt'), RolesGuard)
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly profileService: ProfileService,
    private readonly companyService: CompanyService
  ) {}

  @Post()
  async createUser(@Body() createUserDto: any): Promise<User> {
    return this.usersService.create(createUserDto);
  }

  @Get()
  @Roles('admin')
  async getAllUsers(): Promise<User[]> {
    return this.usersService.getAllUsers();
  }

  @Put(':userId/promote')
  @Roles('admin')
  async promoteUser(@Param('userId') userId: string): Promise<User> {
    return this.usersService.promoteToAdmin(userId);
  }

  @Get('profile')
  async getUsersProfile(@Users() user): Promise<Omit<Profile, 'activityLogs'> | Omit<CompanyProfile, 'activityLogs'>> {
    const userProfile = await this.profileService.getProfileById(user.shape);
    const companyProfile = await this.companyService.getCompanyById(user.shape);

    if (userProfile) {
      return userProfile;    
    }

    if (companyProfile ) {
      return companyProfile;
    }

  }
}
