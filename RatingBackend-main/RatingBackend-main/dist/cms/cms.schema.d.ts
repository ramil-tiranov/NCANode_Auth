import { Document, Types } from 'mongoose';
export declare enum Action {
    CREATEPROFILE = "createprofile",
    UPDATEPROFILE = "updateprofile",
    REGISTRATION = "registration",
    FEEDBACK = "feedback",
    UPDATECOMPANY = "UPDATECOMPANY",
    DELETECOMPANY = "DELETECOMPANY",
    CREATECOMPANY = "CREATECOMPANY",
    FEEDBACK_REMOVED = "FEEDBACK_REMOVED"
}
export declare class CMS extends Document {
    userId: Types.ObjectId;
    cms: string;
    action: Action;
    createdAt: Date;
}
export declare const CMSSchema: import("mongoose").Schema<CMS, import("mongoose").Model<CMS, any, any, any, Document<unknown, any, CMS> & CMS & Required<{
    _id: unknown;
}> & {
    __v?: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, CMS, Document<unknown, {}, import("mongoose").FlatRecord<CMS>> & import("mongoose").FlatRecord<CMS> & Required<{
    _id: unknown;
}> & {
    __v?: number;
}>;
declare class Revocation {
    revoked: boolean;
    by: string;
    revocationTime: Date | null;
    reason: string | null;
    createdAt: Date;
}
declare class SubjectIssuer {
    commonName: string;
    lastName: string;
    surName: string;
    email: string;
    organization: string;
    gender: string;
    iin: string;
    bin: string;
    country: string;
    locality: string;
    state: string;
    dn: string;
    createdAt: Date;
}
declare class Certificate {
    valid: boolean;
    revocations: Revocation[];
    notBefore: Date | null;
    notAfter: Date | null;
    keyUsage: string;
    serialNumber: string;
    signAlg: string;
    keyUser: string[];
    publicKey: string;
    signature: string;
    subject: SubjectIssuer;
    issuer: SubjectIssuer;
    createdAt: Date;
}
declare class TSP {
    serialNumber: string;
    genTime: Date | null;
    policy: string;
    tsa: string | null;
    tspHashAlgorithm: string;
    hash: string;
    createdAt: Date;
}
declare class InnerSigner {
    certificates: Certificate[];
    tsp: TSP | null;
    createdAt: Date;
}
declare class Signer {
    signers: InnerSigner[];
    createdAt: Date;
}
export declare class CMSVerification extends Document {
    userId: Types.ObjectId;
    valid: boolean;
    signers: Signer[];
    createdAt: Date;
}
export declare const CMSVerificationSchema: import("mongoose").Schema<CMSVerification, import("mongoose").Model<CMSVerification, any, any, any, Document<unknown, any, CMSVerification> & CMSVerification & Required<{
    _id: unknown;
}> & {
    __v?: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, CMSVerification, Document<unknown, {}, import("mongoose").FlatRecord<CMSVerification>> & import("mongoose").FlatRecord<CMSVerification> & Required<{
    _id: unknown;
}> & {
    __v?: number;
}>;
export {};
