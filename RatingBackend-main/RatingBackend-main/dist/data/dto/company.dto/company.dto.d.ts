import { Types } from 'mongoose';
import { Rating } from 'src/profile/profile.schema';
export declare class CreateCompanyDto {
    companyId: Types.ObjectId;
    email: string;
    companyName: any;
    bio?: string;
    logo?: string;
    contacts?: string;
    contactNumber: string;
}
export declare class UpdateCompanyDto {
    bio?: string;
    logo?: string;
    contacts?: string;
    contactNumber?: string;
    feedbacks?: FeedbackEntryDto[];
    cms: string;
}
export declare class FeedbackEntryDto {
    rating: Rating;
    feedback?: string;
}
