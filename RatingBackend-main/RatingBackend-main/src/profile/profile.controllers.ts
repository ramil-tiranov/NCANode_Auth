import { Controller, Get, Post, Put, Delete, Body, UseGuards, BadRequestException, Param, Query } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ProfileService } from './profile.service';
import { ProfileDto } from '../data/dto/profile.dto/profile.dto';
import { FeedbackEntry } from './profile.schema';
import { RolesGuard } from 'src/users/roles/roles.guard';
import { Users } from '../users/user.decorator';
import { Roles } from 'src/users/roles/roles.decorator';

@Controller('profile')
@UseGuards(AuthGuard('jwt'), RolesGuard)
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @Roles('manager')
  @Post()
  async createProfile(@Users() user, @Body() profileDto: ProfileDto, @Body('cms') cms: string) {
    if (!user || !user._id) {
      throw new BadRequestException('User ID is required to create profile');
    }
    return this.profileService.createProfile(user._id, profileDto.email, profileDto, cms, profileDto.pin);
  }

  @Get()
  async getProfile(@Query('email') email: string) {
  if (typeof email !== 'string') {
    throw new BadRequestException('Email must be a string');
  }
  return this.profileService.getProfileByEmail(email);
  } 

  @Get('/list')
  async getProfiles(
    @Query('page') page: number = 1,  
    @Query('limit') limit: number = 10 
  ) {
    const pageNumber = Math.max(1, page); 
    const limitNumber = Math.max(1, Math.min(100, limit));
  
    return this.profileService.getPaginatedProfiles(pageNumber, limitNumber);
  }
  

  @Put()
  async updateProfile(@Users() user, @Body() profileDto: ProfileDto, @Body('cms') cms: string) {
    return this.profileService.updateProfile(user._id,cms,profileDto.email, profileDto);
  }

  @Delete()
  async deleteProfile(@Users() user,@Body('email') email : string) {
    return this.profileService.deleteProfile(user._id,email);
  }

  @Post('/feedback')
  async addFeedback(@Users() user,@Body() feedbackEntry: FeedbackEntry, @Body('email') email : string, @Body('cms') cms : string) {
    feedbackEntry.companyId = user._id 
    return this.profileService.addFeedback(user._id,cms ,email ,feedbackEntry);
  }

  @Get('/feedback')
  async getFeedbacks(@Body('email') email : string) {
    return this.profileService.getFeedbacks(email);
  }

  @Get('/search')
  async searchProfiles(
  @Query('query') query: string,
  @Query('page') page: number = 1,
  @Query('limit') limit: number = 10,
  ): Promise<ProfileDto[]> {
  if (!query) {
    throw new BadRequestException('Query is required');
  }
  console.log('Search Query:', query);
  return this.profileService.searchProfiles(query, page, limit);
}
  
}
