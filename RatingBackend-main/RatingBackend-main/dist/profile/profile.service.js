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
exports.ProfileService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const profile_schema_1 = require("./profile.schema");
const cms_schema_1 = require("../cms/cms.schema");
const cms_service_1 = require("../cms/cms.service");
const logger_service_1 = require("../logger/logger.service");
let ProfileService = class ProfileService {
    constructor(profileModel, cmsService, logger) {
        this.profileModel = profileModel;
        this.cmsService = cmsService;
        this.logger = logger;
    }
    async createProfile(userId, email, profileDto, cms, pin) {
        const existingProfile = await this.profileModel.findOne({ email: email, pin: pin });
        if (existingProfile) {
            this.logger.error('Profile already exists for this user');
            throw new common_1.BadRequestException('Profile already exists for this user');
        }
        const isCmsValid = await this.cmsService.cmsVerify(cms);
        if (!isCmsValid) {
            this.logger.error('Invalid CMS');
            throw new common_1.BadRequestException('Invalid CMS');
        }
        const profile = new this.profileModel({ companyId: userId, ...profileDto });
        const cmsEntry = {
            userId: userId,
            cms: cms,
            action: cms_schema_1.Action.CREATEPROFILE,
            createdAt: new Date()
        };
        profile.activityLogs.push(cmsEntry);
        this.logger.log('Profile created successfully');
        await profile.save();
        return this.omitActivityLogs(profile);
    }
    async getAllProfiles() {
        const profiles = await this.profileModel.find().exec();
        return profiles.map(profile => this.omitActivityLogs(profile));
    }
    async getProfileByEmail(email) {
        this.logger.debug(`Email received: ${JSON.stringify(email)}`);
        const profile = await this.profileModel.findOne({ email }).exec();
        if (!profile) {
            this.logger.error('Profile not found for this user');
            throw new common_1.NotFoundException('Profile not found for this user');
        }
        return this.omitActivityLogs(profile);
    }
    omitActivityLogs(profile) {
        if (!profile) {
            return null;
        }
        const { activityLogs, ...profileWithoutLogs } = profile.toObject();
        return profileWithoutLogs;
    }
    async getProfileWithoutActivityLogs(email) {
        return this.getProfileByEmail(email);
    }
    async updateProfile(userId, cms, email, profileDto) {
        const isCmsValid = await this.cmsService.cmsVerify(cms);
        if (!isCmsValid) {
            this.logger.error('Invalid CMS');
            throw new common_1.BadRequestException('Invalid CMS');
        }
        const profile = await this.profileModel.findOne({ email });
        if (!profile) {
            this.logger.error('Profile not found for this user');
            throw new common_1.NotFoundException('Profile not found for this user');
        }
        Object.assign(profile, profileDto);
        const cmsEntry = {
            userId: userId,
            cms: cms,
            action: cms_schema_1.Action.UPDATEPROFILE,
            createdAt: new Date()
        };
        profile.activityLogs.push(cmsEntry);
        await profile.save();
        this.logger.log('Profile updated successfully');
        return this.omitActivityLogs(profile);
    }
    async create(userId, email, profileDto, pin, cms) {
        const existingProfile = await this.profileModel.findOne({ email: email, pin: pin });
        if (existingProfile) {
            this.logger.error('Profile already exists for this user');
            throw new common_1.BadRequestException('Profile already exists for this user');
        }
        const profile = new this.profileModel({
            companyId: userId,
            ...profileDto
        });
        const cmsEntry = {
            userId: userId,
            cms: cms,
            action: cms_schema_1.Action.CREATEPROFILE,
            createdAt: new Date()
        };
        profile.activityLogs.push(cmsEntry);
        this.logger.log('Profile created successfully without CMS verification');
        await profile.save();
        return this.omitActivityLogs(profile);
    }
    async getPaginatedProfiles(page, limit) {
        const skip = (page - 1) * limit;
        const totalCount = await this.profileModel.countDocuments().exec();
        const profiles = await this.profileModel
            .find()
            .skip(skip)
            .limit(limit)
            .exec();
        return {
            profiles: profiles.map(profile => this.omitActivityLogs(profile)),
            totalCount,
        };
    }
    async searchProfiles(query, page = 1, limit = 10) {
        if (!query || query.trim().length === 0) {
            throw new Error('Search query cannot be empty');
        }
        const searchQuery = query.toLowerCase();
        const profiles = await this.profileModel
            .find({
            $or: [
                { firstName: { $regex: searchQuery, $options: 'i' } },
                { lastName: { $regex: searchQuery, $options: 'i' } },
                { email: { $regex: searchQuery, $options: 'i' } },
                { contacts: { $regex: searchQuery, $options: 'i' } },
                { pin: { $regex: searchQuery, $options: 'i' } },
            ],
        })
            .skip((page - 1) * limit)
            .limit(limit);
        return profiles.map(profile => this.omitActivityLogs(profile));
    }
    async deleteProfile(userID, email) {
        const profile = await this.profileModel.findOneAndDelete({ companyId: userID, email: email });
        if (!profile) {
            this.logger.error('Profile not found for this user with this email');
            throw new common_1.NotFoundException('Profile not found for this user with this email');
        }
        return this.omitActivityLogs(profile);
    }
    async addFeedback(userId, cms, email, feedbackEntry) {
        const profile = await this.profileModel.findOne({ email: email });
        const isCmsValid = await this.cmsService.cmsVerify(cms);
        if (!isCmsValid) {
            this.logger.error('Invalid CMS');
            throw new common_1.BadRequestException('Invalid CMS');
        }
        if (!profile) {
            this.logger.error('Profile not found for this user');
            throw new common_1.NotFoundException('Profile not found for this user');
        }
        const cmsEntry = {
            userId: userId,
            cms: cms,
            action: cms_schema_1.Action.FEEDBACK,
            createdAt: new Date()
        };
        profile.activityLogs.push(cmsEntry);
        profile.feedbacks.push(feedbackEntry);
        await profile.save();
        return this.omitActivityLogs(profile);
    }
    async getFeedbacks(email) {
        const profile = await this.getProfileByEmail(email);
        return profile.feedbacks;
    }
    async getProfileByPin(pin) {
        const profile = await this.profileModel.findOne({ pin }).exec();
        if (!profile) {
            return null;
        }
        return profile._id;
    }
    async getProfileById(userId) {
        this.logger.log(`userID ${userId}`);
        const profile = await this.profileModel.findById(userId).exec();
        if (!profile) {
            this.logger.error('Profile not found');
        }
        return this.omitActivityLogs(profile);
    }
};
exports.ProfileService = ProfileService;
exports.ProfileService = ProfileService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(profile_schema_1.Profile.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        cms_service_1.CMSService,
        logger_service_1.CustomLogger])
], ProfileService);
//# sourceMappingURL=profile.service.js.map