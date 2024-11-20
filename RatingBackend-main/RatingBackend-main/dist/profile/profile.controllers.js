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
exports.ProfileController = void 0;
const common_1 = require("@nestjs/common");
const passport_1 = require("@nestjs/passport");
const profile_service_1 = require("./profile.service");
const profile_dto_1 = require("../data/dto/profile.dto/profile.dto");
const profile_schema_1 = require("./profile.schema");
const roles_guard_1 = require("../users/roles/roles.guard");
const user_decorator_1 = require("../users/user.decorator");
const roles_decorator_1 = require("../users/roles/roles.decorator");
let ProfileController = class ProfileController {
    constructor(profileService) {
        this.profileService = profileService;
    }
    async createProfile(user, profileDto, cms) {
        if (!user || !user._id) {
            throw new common_1.BadRequestException('User ID is required to create profile');
        }
        return this.profileService.createProfile(user._id, profileDto.email, profileDto, cms, profileDto.pin);
    }
    async getProfile(email) {
        if (typeof email !== 'string') {
            throw new common_1.BadRequestException('Email must be a string');
        }
        return this.profileService.getProfileByEmail(email);
    }
    async getProfiles(page = 1, limit = 10) {
        const pageNumber = Math.max(1, page);
        const limitNumber = Math.max(1, Math.min(100, limit));
        return this.profileService.getPaginatedProfiles(pageNumber, limitNumber);
    }
    async updateProfile(user, profileDto, cms) {
        return this.profileService.updateProfile(user._id, cms, profileDto.email, profileDto);
    }
    async deleteProfile(user, email) {
        return this.profileService.deleteProfile(user._id, email);
    }
    async addFeedback(user, feedbackEntry, email, cms) {
        feedbackEntry.companyId = user._id;
        return this.profileService.addFeedback(user._id, cms, email, feedbackEntry);
    }
    async getFeedbacks(email) {
        return this.profileService.getFeedbacks(email);
    }
    async searchProfiles(query, page = 1, limit = 10) {
        if (!query) {
            throw new common_1.BadRequestException('Query is required');
        }
        console.log('Search Query:', query);
        return this.profileService.searchProfiles(query, page, limit);
    }
};
exports.ProfileController = ProfileController;
__decorate([
    (0, roles_decorator_1.Roles)('manager'),
    (0, common_1.Post)(),
    __param(0, (0, user_decorator_1.Users)()),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Body)('cms')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, profile_dto_1.ProfileDto, String]),
    __metadata("design:returntype", Promise)
], ProfileController.prototype, "createProfile", null);
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)('email')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ProfileController.prototype, "getProfile", null);
__decorate([
    (0, common_1.Get)('/list'),
    __param(0, (0, common_1.Query)('page')),
    __param(1, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number]),
    __metadata("design:returntype", Promise)
], ProfileController.prototype, "getProfiles", null);
__decorate([
    (0, common_1.Put)(),
    __param(0, (0, user_decorator_1.Users)()),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Body)('cms')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, profile_dto_1.ProfileDto, String]),
    __metadata("design:returntype", Promise)
], ProfileController.prototype, "updateProfile", null);
__decorate([
    (0, common_1.Delete)(),
    __param(0, (0, user_decorator_1.Users)()),
    __param(1, (0, common_1.Body)('email')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], ProfileController.prototype, "deleteProfile", null);
__decorate([
    (0, common_1.Post)('/feedback'),
    __param(0, (0, user_decorator_1.Users)()),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Body)('email')),
    __param(3, (0, common_1.Body)('cms')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, profile_schema_1.FeedbackEntry, String, String]),
    __metadata("design:returntype", Promise)
], ProfileController.prototype, "addFeedback", null);
__decorate([
    (0, common_1.Get)('/feedback'),
    __param(0, (0, common_1.Body)('email')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ProfileController.prototype, "getFeedbacks", null);
__decorate([
    (0, common_1.Get)('/search'),
    __param(0, (0, common_1.Query)('query')),
    __param(1, (0, common_1.Query)('page')),
    __param(2, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Number, Number]),
    __metadata("design:returntype", Promise)
], ProfileController.prototype, "searchProfiles", null);
exports.ProfileController = ProfileController = __decorate([
    (0, common_1.Controller)('profile'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt'), roles_guard_1.RolesGuard),
    __metadata("design:paramtypes", [profile_service_1.ProfileService])
], ProfileController);
//# sourceMappingURL=profile.controllers.js.map