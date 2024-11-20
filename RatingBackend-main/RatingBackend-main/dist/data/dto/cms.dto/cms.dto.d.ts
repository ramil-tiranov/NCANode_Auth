import { Types } from 'mongoose';
import { Action } from 'src/cms/cms.schema';
export declare class CreateCmsDto {
    userId: Types.ObjectId;
    cms: string;
    action: Action;
}
export declare class CmsReturnDto {
    company: string;
    name: string;
    valid: boolean;
    pin: string;
}
