import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { CompanyProfile, FeedbackEntry } from './company.schema';
import { CreateCompanyDto, UpdateCompanyDto } from 'src/data/dto/company.dto/company.dto';
import { CMSService } from 'src/cms/cms.service';
import { Action, CMS } from 'src/cms/cms.schema';
import { CustomLogger } from 'src/logger/logger.service';

@Injectable()
export class CompanyService {
  constructor(
    @InjectModel(CompanyProfile.name) private companyModel: Model<CompanyProfile>,
    private readonly cmsService: CMSService,
    private readonly logger: CustomLogger
  ) {}

  async create(createCompanyDto: CreateCompanyDto, cms: string, userId: Types.ObjectId): Promise<Omit<CompanyProfile, 'activityLogs'>> {
    const isCmsValid = await this.cmsService.cmsVerify(cms);
    if (!isCmsValid) {
      this.logger.error('Invalid CMS');
      throw new BadRequestException('Invalid CMS');
    }

    const company = new this.companyModel({ ...createCompanyDto });
    company.companyId = userId;

    const cmsEntry = {
      userId,
      cms,
      action: Action.CREATECOMPANY,
      createdAt: new Date(),
    };

    company.activityLogs.push(cmsEntry as CMS);
    await company.save();
    return this.omitActivityLogs(company);
  }

  async findAll(): Promise<Omit<CompanyProfile, 'activityLogs'>[]> {
    const companies = await this.companyModel.find().exec();
    return companies.map(company => this.omitActivityLogs(company));
  }

  async findOne(id: string): Promise<Omit<CompanyProfile, 'activityLogs'>> {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Invalid ID format');
    }
    
    const company = await this.companyModel.findById(id).exec();
    if (!company) {
      throw new BadRequestException('Company not found');
    }
    
    return this.omitActivityLogs(company);
  }
  

  async update(
    id: string,
    updateCompanyDto: UpdateCompanyDto,
    cms: string,
    userId: Types.ObjectId
  ): Promise<Omit<CompanyProfile, 'activityLogs'>> {
    this.logger.log(cms)
    const isCmsValid = await this.cmsService.cmsVerify(cms);
    if (!isCmsValid) {
      throw new BadRequestException('Invalid CMS');
    }

    const company = await this.companyModel.findById(id);
    if (!company) {
      throw new BadRequestException('Company not found');
    }

    Object.assign(company, updateCompanyDto);
    const cmsEntry = {
      userId,
      cms,
      action: Action.UPDATECOMPANY,
      createdAt: new Date(),
    };

    company.activityLogs.push(cmsEntry as CMS);
    await company.save();
    return this.omitActivityLogs(company);
  }

  async addFeedback(
    userId: Types.ObjectId,
    companyId: string,
    feedback: FeedbackEntry,
    cms: string
  ): Promise<Omit<CompanyProfile, 'activityLogs'>> {
    const isCmsValid = await this.cmsService.cmsVerify(cms);
   
    if (!isCmsValid) {
      throw new BadRequestException('Invalid CMS');
    }

    const company = await this.companyModel.findById(companyId);
    if (!company) {
      throw new BadRequestException('Company not found');
    }

    feedback.createdBy = userId.toString();

    company.feedbacks.push(feedback);

    const cmsEntry = {
      userId,
      cms,
      action: Action.FEEDBACK,
      createdAt: new Date(),
    };

    company.activityLogs.push(cmsEntry as CMS);
    await company.save();
    return this.omitActivityLogs(company);
  }

  async getFeedbacks(companyId: string): Promise<any[]> {
    const company = await this.companyModel.findById(companyId);
    if (!company) {
      throw new BadRequestException('Company not found');
    }

    return company.feedbacks;
  }

  async removeFeedback(companyId: string, feedbackId: string): Promise<Omit<CompanyProfile, 'activityLogs'>> {
    const company = await this.companyModel.findById(companyId);
    if (!company) {
      throw new BadRequestException('Company not found');
    }

    company.feedbacks = company.feedbacks.filter(fb => fb.createdBy.toString() !== feedbackId);

    const cmsEntry = {
      action: Action.FEEDBACK_REMOVED,
      createdAt: new Date(),
    };

    company.activityLogs.push(cmsEntry as CMS);
    await company.save();
    return this.omitActivityLogs(company);
  }
  
  async getCompanyById(id: string): Promise<Omit<CompanyProfile, 'activityLogs'> | null> {
    this.logger.log(`userID ${id}`)
  
    const company = await this.companyModel.findById(id).exec();
    if (!company) {
      
      this.logger.error('Company not found');
    }
    return this.omitActivityLogs(company);
  }
  
  public omitActivityLogs(company: CompanyProfile): Omit<CompanyProfile, 'activityLogs' | null> {
    if (!company) {
      return null
    }
    const { activityLogs, ...companyWithoutLogs } = company.toObject();
    return companyWithoutLogs;
  }
}