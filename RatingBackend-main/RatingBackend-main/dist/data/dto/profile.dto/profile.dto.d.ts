import { Rating } from '../../../profile/profile.schema';
import { Types } from 'mongoose';
export declare class FeedbackDto {
    rating: Rating;
    feedback?: string;
    companyId: Types.ObjectId;
}
export declare class ProfileDto {
    email: string;
    firstName?: string;
    lastName?: string;
    bio?: string;
    profilePicture?: string;
    pin: string;
    feedbacks?: FeedbackDto[];
}
