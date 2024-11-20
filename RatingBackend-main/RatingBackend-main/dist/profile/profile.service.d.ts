import { Model, Types } from 'mongoose';
import { FeedbackEntry, Profile } from './profile.schema';
import { ProfileDto } from '../data/dto/profile.dto/profile.dto';
import { CMSService } from '../cms/cms.service';
import { CustomLogger } from 'src/logger/logger.service';
export declare class ProfileService {
    private profileModel;
    private readonly cmsService;
    private readonly logger;
    constructor(profileModel: Model<Profile>, cmsService: CMSService, logger: CustomLogger);
    createProfile(userId: Types.ObjectId, email: string, profileDto: ProfileDto, cms: string, pin: string): Promise<Omit<Profile, 'activityLogs'>>;
    getAllProfiles(): Promise<Omit<Profile, 'activityLogs'>[]>;
    getProfileByEmail(email: string): Promise<Omit<Profile, 'activityLogs'>>;
    omitActivityLogs(profile: Profile): Omit<Profile, 'activityLogs' | null>;
    getProfileWithoutActivityLogs(email: string): Promise<Omit<Profile, 'activityLogs'>>;
    updateProfile(userId: Types.ObjectId, cms: string, email: string, profileDto: ProfileDto): Promise<Omit<Profile, 'activityLogs'>>;
    create(userId: Types.ObjectId, email: string, profileDto: ProfileDto, pin: string, cms: string): Promise<Omit<Profile, 'activityLogs'>>;
    getPaginatedProfiles(page: number, limit: number): Promise<{
        profiles: Omit<Profile, 'activityLogs'>[];
        totalCount: number;
    }>;
    searchProfiles(query: string, page?: number, limit?: number): Promise<Promise<Omit<Profile, 'activityLogs'>[]>>;
    deleteProfile(userID: Types.ObjectId, email: string): Promise<Omit<Profile, 'activityLogs'>>;
    addFeedback(userId: Types.ObjectId, cms: string, email: string, feedbackEntry: FeedbackEntry): Promise<Omit<Profile, 'activityLogs'>>;
    getFeedbacks(email: string): Promise<FeedbackEntry[]>;
    getProfileByPin(pin: string): Promise<Types.ObjectId | null>;
    getProfileById(userId: Types.ObjectId): Promise<Omit<Profile, 'activityLogs'> | null>;
}
