"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CompanyService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const company_schema_1 = require("./company.schema");
const cms_service_1 = require("../cms/cms.service");
const cms_schema_1 = require("../cms/cms.schema");
const logger_service_1 = require("../logger/logger.service");
let CompanyService = class CompanyService {
    constructor(companyModel, cmsService, logger) {
        this.companyModel = companyModel;
        this.cmsService = cmsService;
        this.logger = logger;
    }
    async create(createCompanyDto, cms, userId) {
        const isCmsValid = await this.cmsService.cmsVerify(cms);
        if (!isCmsValid) {
            this.logger.error('Invalid CMS');
            throw new common_1.BadRequestException('Invalid CMS');
        }
        const company = new this.companyModel({ ...createCompanyDto });
        company.companyId = userId;
        const cmsEntry = {
            userId,
            cms,
            action: cms_schema_1.Action.CREATECOMPANY,
            createdAt: new Date(),
        };
        company.activityLogs.push(cmsEntry);
        await company.save();
        return this.omitActivityLogs(company);
    }
    async findAll() {
        const companies = await this.companyModel.find().exec();
        return companies.map(company => this.omitActivityLogs(company));
    }
    async findOne(id) {
        if (!mongoose_2.Types.ObjectId.isValid(id)) {
            throw new common_1.BadRequestException('Invalid ID format');
        }
        const company = await this.companyModel.findById(id).exec();
        if (!company) {
            throw new common_1.BadRequestException('Company not found');
        }
        return this.omitActivityLogs(company);
    }
    async update(id, updateCompanyDto, cms, userId) {
        this.logger.log(cms);
        const isCmsValid = await this.cmsService.cmsVerify(cms);
        if (!isCmsValid) {
            throw new common_1.BadRequestException('Invalid CMS');
        }
        const company = await this.companyModel.findById(id);
        if (!company) {
            throw new common_1.BadRequestException('Company not found');
        }
        Object.assign(company, updateCompanyDto);
        const cmsEntry = {
            userId,
            cms,
            action: cms_schema_1.Action.UPDATECOMPANY,
            createdAt: new Date(),
        };
        company.activityLogs.push(cmsEntry);
        await company.save();
        return this.omitActivityLogs(company);
    }
    async addFeedback(userId, companyId, feedback, cms) {
        const isCmsValid = await this.cmsService.cmsVerify(cms);
        if (!isCmsValid) {
            throw new common_1.BadRequestException('Invalid CMS');
        }
        const company = await this.companyModel.findById(companyId);
        if (!company) {
            throw new common_1.BadRequestException('Company not found');
        }
        feedback.createdBy = userId.toString();
        company.feedbacks.push(feedback);
        const cmsEntry = {
            userId,
            cms,
            action: cms_schema_1.Action.FEEDBACK,
            createdAt: new Date(),
        };
        company.activityLogs.push(cmsEntry);
        await company.save();
        return this.omitActivityLogs(company);
    }
    async getFeedbacks(companyId) {
        const company = await this.companyModel.findById(companyId);
        if (!company) {
            throw new common_1.BadRequestException('Company not found');
        }
        return company.feedbacks;
    }
    async removeFeedback(companyId, feedbackId) {
        const company = await this.companyModel.findById(companyId);
        if (!company) {
            throw new common_1.BadRequestException('Company not found');
        }
        company.feedbacks = company.feedbacks.filter(fb => fb.createdBy.toString() !== feedbackId);
        const cmsEntry = {
            action: cms_schema_1.Action.FEEDBACK_REMOVED,
            createdAt: new Date(),
        };
        company.activityLogs.push(cmsEntry);
        await company.save();
        return this.omitActivityLogs(company);
    }
    async getCompanyById(id) {
        this.logger.log(`userID ${id}`);
        const company = await this.companyModel.findById(id).exec();
        if (!company) {
            this.logger.error('Company not found');
        }
        return this.omitActivityLogs(company);
    }
    omitActivityLogs(company) {
        if (!company) {
            return null;
        }
        const { activityLogs, ...companyWithoutLogs } = company.toObject();
        return companyWithoutLogs;
    }
};
exports.CompanyService = CompanyService;
exports.CompanyService = CompanyService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(company_schema_1.CompanyProfile.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        cms_service_1.CMSService,
        logger_service_1.CustomLogger])
], CompanyService);
//# sourceMappingURL=company.service.js.map