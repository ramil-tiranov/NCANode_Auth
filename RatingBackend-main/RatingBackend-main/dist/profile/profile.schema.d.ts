import { Document, Types } from 'mongoose';
import { CMS } from '../cms/cms.schema';
export declare enum Rating {
    POOR = 1,
    AVERAGE = 2,
    GOOD = 3,
    EXCELLENT = 4,
    AMAZING = 5
}
export declare class FeedbackEntry {
    rating: Rating;
    feedback?: string;
    createdAt: Date;
    companyId: Types.ObjectId;
}
export declare class Profile extends Document {
    companyId: Types.ObjectId;
    email: string;
    pin: string;
    firstName?: string;
    lastName?: string;
    bio?: string;
    profilePicture?: string;
    contacts?: string;
    feedbacks?: FeedbackEntry[];
    activityLogs: CMS[];
    createdAt: Date;
}
export declare const ProfileSchema: import("mongoose").Schema<Profile, import("mongoose").Model<Profile, any, any, any, Document<unknown, any, Profile> & Profile & Required<{
    _id: unknown;
}> & {
    __v?: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Profile, Document<unknown, {}, import("mongoose").FlatRecord<Profile>> & import("mongoose").FlatRecord<Profile> & Required<{
    _id: unknown;
}> & {
    __v?: number;
}>;
