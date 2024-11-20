import { CompanyService } from './company.service';
import { UpdateCompanyDto } from 'src/data/dto/company.dto/company.dto';
import { CompanyProfile, FeedbackEntry } from './company.schema';
export declare class CompanyController {
    private readonly companyService;
    constructor(companyService: CompanyService);
    getAllCompanies(): Promise<Omit<CompanyProfile, 'activityLogs'>[]>;
    getCompanyById(id: string): Promise<Omit<CompanyProfile, 'activityLogs'>>;
    updateCompany(updateCompanyDto: UpdateCompanyDto, user: any): Promise<Omit<CompanyProfile, 'activityLogs'>>;
    addFeedback(user: any, feedback: FeedbackEntry, cms: string, companyId: string): Promise<Omit<CompanyProfile, 'activityLogs'>>;
    getFeedbacks(companyId: string): Promise<any[]>;
    removeFeedback(companyId: string, feedbackId: string): Promise<Omit<CompanyProfile, 'activityLogs'>>;
}
