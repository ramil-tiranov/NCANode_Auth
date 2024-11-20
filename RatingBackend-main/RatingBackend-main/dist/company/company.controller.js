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
exports.CompanyController = void 0;
const common_1 = require("@nestjs/common");
const passport_1 = require("@nestjs/passport");
const company_service_1 = require("./company.service");
const company_dto_1 = require("../data/dto/company.dto/company.dto");
const company_schema_1 = require("./company.schema");
const roles_guard_1 = require("../users/roles/roles.guard");
const user_decorator_1 = require("../users/user.decorator");
let CompanyController = class CompanyController {
    constructor(companyService) {
        this.companyService = companyService;
    }
    async getAllCompanies() {
        return await this.companyService.findAll();
    }
    async getCompanyById(id) {
        try {
            return await this.companyService.findOne(id);
        }
        catch (error) {
            if (error instanceof common_1.BadRequestException) {
                throw new common_1.BadRequestException(error.message);
            }
            throw error;
        }
    }
    async updateCompany(updateCompanyDto, user) {
        try {
            return await this.companyService.update(user.shape, updateCompanyDto, updateCompanyDto.cms, user._id);
        }
        catch (error) {
            if (error instanceof common_1.BadRequestException) {
                throw new common_1.BadRequestException(error.message);
            }
            throw error;
        }
    }
    async addFeedback(user, feedback, cms, companyId) {
        try {
            return await this.companyService.addFeedback(user._id, companyId, feedback, cms);
        }
        catch (error) {
            if (error instanceof common_1.BadRequestException) {
                throw new common_1.BadRequestException(error.message);
            }
            throw error;
        }
    }
    async getFeedbacks(companyId) {
        return await this.companyService.getFeedbacks(companyId);
    }
    async removeFeedback(companyId, feedbackId) {
        try {
            return await this.companyService.removeFeedback(companyId, feedbackId);
        }
        catch (error) {
            if (error instanceof common_1.BadRequestException) {
                throw new common_1.BadRequestException(error.message);
            }
            throw error;
        }
    }
};
exports.CompanyController = CompanyController;
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], CompanyController.prototype, "getAllCompanies", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], CompanyController.prototype, "getCompanyById", null);
__decorate([
    (0, common_1.Put)(''),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, user_decorator_1.Users)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [company_dto_1.UpdateCompanyDto, Object]),
    __metadata("design:returntype", Promise)
], CompanyController.prototype, "updateCompany", null);
__decorate([
    (0, common_1.Post)(':companyId/feedback'),
    __param(0, (0, user_decorator_1.Users)()),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Body)('cms')),
    __param(3, (0, common_1.Param)('companyId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, company_schema_1.FeedbackEntry, String, String]),
    __metadata("design:returntype", Promise)
], CompanyController.prototype, "addFeedback", null);
__decorate([
    (0, common_1.Get)(':companyId/feedback'),
    __param(0, (0, common_1.Param)('companyId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], CompanyController.prototype, "getFeedbacks", null);
__decorate([
    (0, common_1.Delete)(':companyId/feedback/:feedbackId'),
    __param(0, (0, common_1.Param)('companyId')),
    __param(1, (0, common_1.Param)('feedbackId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], CompanyController.prototype, "removeFeedback", null);
exports.CompanyController = CompanyController = __decorate([
    (0, common_1.Controller)('company'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt'), roles_guard_1.RolesGuard),
    __metadata("design:paramtypes", [company_service_1.CompanyService])
], CompanyController);
//# sourceMappingURL=company.controller.js.map