import { Document, Types } from 'mongoose';
import { CMS } from 'src/cms/cms.schema';
export declare enum Rating {
    POOR = 1,
    AVERAGE = 2,
    GOOD = 3,
    EXCELLENT = 4,
    AMZAING = 5
}
export declare class FeedbackEntry {
    rating: Rating;
    feedback?: string;
    createdBy: string;
    createdAt: Date;
}
export declare class CompanyProfile extends Document {
    companyId: Types.ObjectId;
    companyName: string;
    email: string;
    bio?: string;
    logo?: string;
    contacts?: string;
    contactNumber: string;
    feedbacks?: FeedbackEntry[];
    activityLogs: CMS[];
}
export declare const CompanyProfileSchema: import("mongoose").Schema<CompanyProfile, import("mongoose").Model<CompanyProfile, any, any, any, Document<unknown, any, CompanyProfile> & CompanyProfile & Required<{
    _id: unknown;
}> & {
    __v?: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, CompanyProfile, Document<unknown, {}, import("mongoose").FlatRecord<CompanyProfile>> & import("mongoose").FlatRecord<CompanyProfile> & Required<{
    _id: unknown;
}> & {
    __v?: number;
}>;
