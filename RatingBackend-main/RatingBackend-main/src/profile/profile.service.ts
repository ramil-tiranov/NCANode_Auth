import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { FeedbackEntry, Profile } from './profile.schema';
import { ProfileDto } from '../data/dto/profile.dto/profile.dto';
import { Action, CMS } from '../cms/cms.schema';
import { CMSService } from '../cms/cms.service';
import { CustomLogger } from 'src/logger/logger.service';

@Injectable()
export class ProfileService {
  constructor(
    @InjectModel(Profile.name) private profileModel: Model<Profile>,
    private readonly cmsService: CMSService,
    private readonly logger: CustomLogger
  ) {}

  async createProfile(userId: Types.ObjectId, email: string, profileDto: ProfileDto, cms: string, pin: string): Promise<Omit<Profile, 'activityLogs'>> {
    const existingProfile = await this.profileModel.findOne({ email : email, pin : pin});
    
    if (existingProfile) {
      this.logger.error('Profile already exists for this user');
      throw new BadRequestException('Profile already exists for this user');
    }

    const isCmsValid = await this.cmsService.cmsVerify(cms);
    if (!isCmsValid) {
      this.logger.error('Invalid CMS');
      throw new BadRequestException('Invalid CMS');
    }
    
    const profile = new this.profileModel({ companyId: userId, ...profileDto });
    const cmsEntry = {
      userId: userId,
      cms: cms,
      action: Action.CREATEPROFILE,
      createdAt: new Date()
    };
    profile.activityLogs.push(cmsEntry as CMS);

    this.logger.log('Profile created successfully');
    await profile.save();
    return this.omitActivityLogs(profile);
  }

  async getAllProfiles(): Promise<Omit<Profile, 'activityLogs'>[]> {
    const profiles = await this.profileModel.find().exec();
    return profiles.map(profile => this.omitActivityLogs(profile)); 
  }

  async getProfileByEmail(email: string): Promise<Omit<Profile, 'activityLogs'>> {
    this.logger.debug(`Email received: ${JSON.stringify(email)}`);
    
    const profile = await this.profileModel.findOne({ email }).exec();
  
    if (!profile) {
      this.logger.error('Profile not found for this user');
      throw new NotFoundException('Profile not found for this user');
    }
  
    return this.omitActivityLogs(profile);
  }
  

  public omitActivityLogs(profile: Profile): Omit<Profile, 'activityLogs' | null> {
    if (!profile) {
      return null
    }
    const { activityLogs, ...profileWithoutLogs } = profile.toObject();
    return profileWithoutLogs;
  }

  async getProfileWithoutActivityLogs(email: string): Promise<Omit<Profile, 'activityLogs'>> {
    return this.getProfileByEmail(email);
  }

  async updateProfile(
    userId: Types.ObjectId,
    cms: string,
    email: string,
    profileDto: ProfileDto
  ): Promise<Omit<Profile, 'activityLogs'>> {
    const isCmsValid = await this.cmsService.cmsVerify(cms);
    if (!isCmsValid) {
      this.logger.error('Invalid CMS');
      throw new BadRequestException('Invalid CMS');
    }
  
    const profile = await this.profileModel.findOne({ email });
    if (!profile) {
      this.logger.error('Profile not found for this user');
      throw new NotFoundException('Profile not found for this user');
    }
  
    Object.assign(profile, profileDto);
  
    const cmsEntry = {
      userId: userId,
      cms: cms,
      action: Action.UPDATEPROFILE,
      createdAt: new Date()
    };
    profile.activityLogs.push(cmsEntry as CMS);
  
    await profile.save();
  
    this.logger.log('Profile updated successfully');
    return this.omitActivityLogs(profile); 
  }

  async create(
    userId: Types.ObjectId, 
    email: string, 
    profileDto: ProfileDto, 
    pin: string,
    cms: string
  ): Promise<Omit<Profile, 'activityLogs'>> {
  
    const existingProfile = await this.profileModel.findOne({ email: email, pin: pin });
  
    if (existingProfile) {
      this.logger.error('Profile already exists for this user');
      throw new BadRequestException('Profile already exists for this user');
    }
  
    const profile = new this.profileModel({
      companyId: userId, 
      ...profileDto
    });
  
    const cmsEntry = {
      userId: userId,
      cms: cms, 
      action: Action.CREATEPROFILE,
      createdAt: new Date()
    };
  
    profile.activityLogs.push(cmsEntry as CMS);
  
    this.logger.log('Profile created successfully without CMS verification');
  
    await profile.save();
  
    return this.omitActivityLogs(profile);
  }
  
  
  async deleteProfile(userID: Types.ObjectId, email: string): Promise<Omit<Profile, 'activityLogs'>> {
    const profile = await this.profileModel.findOneAndDelete({ companyId: userID, email: email });

    if (!profile) {
      this.logger.error('Profile not found for this user with this email');
      throw new NotFoundException('Profile not found for this user with this email');
    }

    return this.omitActivityLogs(profile); 
  }

  async addFeedback(userId: Types.ObjectId, cms: string, email: string, feedbackEntry: FeedbackEntry): Promise<Omit<Profile, 'activityLogs'>> {
    const profile = await this.profileModel.findOne({ email: email });

    const isCmsValid = await this.cmsService.cmsVerify(cms);

    if (!isCmsValid) {
      this.logger.error('Invalid CMS');
      throw new BadRequestException('Invalid CMS');
    }

    if (!profile) {
      this.logger.error('Profile not found for this user');
      throw new NotFoundException('Profile not found for this user');
    }

    const cmsEntry = {
      userId: userId,
      cms: cms,
      action: Action.FEEDBACK,
      createdAt: new Date()
    };
    profile.activityLogs.push(cmsEntry as CMS);
  
    profile.feedbacks.push(feedbackEntry);
    await profile.save();

    return this.omitActivityLogs(profile);
  }

  async getFeedbacks(email: string): Promise<FeedbackEntry[]> {
    const profile = await this.getProfileByEmail(email);
    return profile.feedbacks;
  }

  async getProfileByPin(pin: string): Promise<Types.ObjectId | null> {
    const profile = await this.profileModel.findOne({ pin }).exec();
    
    if (!profile) {
      return null;  
    }

    return profile._id as Types.ObjectId; 
  }
  async getProfileById(userId: Types.ObjectId): Promise<Omit<Profile, 'activityLogs'> | null> {
    this.logger.log(`userID ${userId}`)
    const profile = await this.profileModel.findById(userId).exec();

    if (!profile) {
      this.logger.error('Profile not found');
    }
    return this.omitActivityLogs(profile);
  }
  
}
