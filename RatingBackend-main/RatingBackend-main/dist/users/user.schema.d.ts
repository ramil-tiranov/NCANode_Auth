import { Document, Types } from 'mongoose';
import { CMS } from 'src/cms/cms.schema';
export declare enum UserRole {
    EMPLOYEE = "employee",
    MANAGER = "manager",
    ADMIN = "admin"
}
export declare class User extends Document {
    email: string;
    company: string;
    name: string;
    surname: string;
    password: string;
    role: UserRole;
    phoneNumber: string;
    activityLogs: CMS[];
    createdAt: Date;
    pin: string;
    shape?: Types.ObjectId;
}
export declare const UserSchema: import("mongoose").Schema<User, import("mongoose").Model<User, any, any, any, Document<unknown, any, User> & User & Required<{
    _id: unknown;
}> & {
    __v?: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, User, Document<unknown, {}, import("mongoose").FlatRecord<User>> & import("mongoose").FlatRecord<User> & Required<{
    _id: unknown;
}> & {
    __v?: number;
}>;
