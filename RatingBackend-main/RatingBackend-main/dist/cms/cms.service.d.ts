import { Model } from 'mongoose';
import { CMS } from './cms.schema';
import { CmsReturnDto, CreateCmsDto } from '../data/dto/cms.dto/cms.dto';
import { CustomLogger } from 'src/logger/logger.service';
export declare class CMSService {
    private readonly cmsModel;
    private readonly logger;
    viewContent(id: string): string | PromiseLike<string>;
    constructor(cmsModel: Model<CMS>, logger: CustomLogger);
    create(createCmsDto: CreateCmsDto): Promise<CMS>;
    findAll(): Promise<CMS[]>;
    findById(id: string): Promise<CMS>;
    update(id: string, updateCmsDto: Partial<CMS>): Promise<CMS>;
    delete(id: string): Promise<CMS>;
    decodeBase64(encodedData: string): Promise<string>;
    encodeBase64(decodedData: string): Promise<string>;
    cmsExtract(CMS: string): Promise<any>;
    cmsVerify(CMS: string): Promise<CmsReturnDto>;
}
