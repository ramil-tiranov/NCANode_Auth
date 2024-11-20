import { Model, Types } from 'mongoose';
import { CompanyProfile, FeedbackEntry } from './company.schema';
import { CreateCompanyDto, UpdateCompanyDto } from 'src/data/dto/company.dto/company.dto';
import { CMSService } from 'src/cms/cms.service';
import { CustomLogger } from 'src/logger/logger.service';
export declare class CompanyService {
    private companyModel;
    private readonly cmsService;
    private readonly logger;
    constructor(companyModel: Model<CompanyProfile>, cmsService: CMSService, logger: CustomLogger);
    create(createCompanyDto: CreateCompanyDto, cms: string, userId: Types.ObjectId): Promise<Omit<CompanyProfile, 'activityLogs'>>;
    findAll(): Promise<Omit<CompanyProfile, 'activityLogs'>[]>;
    findOne(id: string): Promise<Omit<CompanyProfile, 'activityLogs'>>;
    update(id: string, updateCompanyDto: UpdateCompanyDto, cms: string, userId: Types.ObjectId): Promise<Omit<CompanyProfile, 'activityLogs'>>;
    addFeedback(userId: Types.ObjectId, companyId: string, feedback: FeedbackEntry, cms: string): Promise<Omit<CompanyProfile, 'activityLogs'>>;
    getFeedbacks(companyId: string): Promise<any[]>;
    removeFeedback(companyId: string, feedbackId: string): Promise<Omit<CompanyProfile, 'activityLogs'>>;
    getCompanyById(id: string): Promise<Omit<CompanyProfile, 'activityLogs'> | null>;
    omitActivityLogs(company: CompanyProfile): Omit<CompanyProfile, 'activityLogs' | null>;
}
