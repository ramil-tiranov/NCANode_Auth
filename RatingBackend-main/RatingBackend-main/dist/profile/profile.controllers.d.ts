import { ProfileService } from './profile.service';
import { ProfileDto } from '../data/dto/profile.dto/profile.dto';
import { FeedbackEntry } from './profile.schema';
export declare class ProfileController {
    private readonly profileService;
    constructor(profileService: ProfileService);
    createProfile(user: any, profileDto: ProfileDto, cms: string): Promise<Omit<import("./profile.schema").Profile, "activityLogs">>;
    getProfile(email: string): Promise<Omit<import("./profile.schema").Profile, "activityLogs">>;
    getProfiles(page?: number, limit?: number): Promise<{
        profiles: Omit<import("./profile.schema").Profile, "activityLogs">[];
        totalCount: number;
    }>;
    updateProfile(user: any, profileDto: ProfileDto, cms: string): Promise<Omit<import("./profile.schema").Profile, "activityLogs">>;
    deleteProfile(user: any, email: string): Promise<Omit<import("./profile.schema").Profile, "activityLogs">>;
    addFeedback(user: any, feedbackEntry: FeedbackEntry, email: string, cms: string): Promise<Omit<import("./profile.schema").Profile, "activityLogs">>;
    getFeedbacks(email: string): Promise<FeedbackEntry[]>;
    searchProfiles(query: string, page?: number, limit?: number): Promise<ProfileDto[]>;
}
