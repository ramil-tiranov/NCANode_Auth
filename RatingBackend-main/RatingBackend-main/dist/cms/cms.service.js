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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CMSService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const cms_schema_1 = require("./cms.schema");
const axios_1 = __importDefault(require("axios"));
const logger_service_1 = require("../logger/logger.service");
let CMSService = class CMSService {
    viewContent(id) {
        throw new Error('Method not implemented.');
    }
    constructor(cmsModel, logger) {
        this.cmsModel = cmsModel;
        this.logger = logger;
    }
    async create(createCmsDto) {
        const cms = new this.cmsModel(createCmsDto);
        if (!cms) {
            this.logger.error('Error while creating CMS');
            throw new common_1.NotFoundException('Error while creating CMS');
        }
        return await cms.save();
    }
    async findAll() {
        return await this.cmsModel.find().populate('userId').exec();
    }
    async findById(id) {
        const cms = await this.cmsModel.findById(id).populate('userId').exec();
        if (!cms) {
            throw new common_1.NotFoundException(`CMS entry with ID ${id} not found`);
        }
        return cms;
    }
    async update(id, updateCmsDto) {
        const cms = await this.cmsModel.findByIdAndUpdate(id, updateCmsDto, { new: true }).populate('userId').exec();
        if (!cms) {
            throw new common_1.NotFoundException(`CMS entry with ID ${id} not found`);
        }
        return cms;
    }
    async delete(id) {
        const cms = await this.cmsModel.findByIdAndDelete(id).exec();
        if (!cms) {
            throw new common_1.NotFoundException(`CMS entry with ID ${id} not found`);
        }
        return cms;
    }
    async decodeBase64(encodedData) {
        const buffer = Buffer.from(encodedData, 'base64');
        return buffer.toString('utf8');
    }
    async encodeBase64(decodedData) {
        const buffer = Buffer.from(decodedData, 'utf8');
        return buffer.toString('base64');
    }
    async cmsExtract(CMS) {
        try {
            const response = await axios_1.default.post('http://localhost:14579/cms/extract', { cms: CMS });
            if (!response.data) {
                this.logger.error('Empty response data from extraction');
                throw new Error('Empty response data');
            }
            return response.data;
        }
        catch (error) {
            this.logger.error(`CMS Extract Error: ${error.message}`);
            throw new common_1.NotFoundException('Failed to extract CMS data');
        }
    }
    async cmsVerify(CMS) {
        try {
            const extractedData = await this.cmsExtract(CMS);
            if (!extractedData || !extractedData.data) {
                this.logger.error(`Data extraction from CMS if failed`);
                throw new common_1.BadRequestException('CMS extraction failed');
            }
            const response = await axios_1.default.post('http://localhost:14579/cms/verify', {
                revocationCheck: ["OCSP"],
                cms: CMS,
                data: extractedData.data,
            });
            const { valid, signers } = response.data;
            if (!Array.isArray(signers) || signers.length === 0) {
                this.logger.error(`Document wasn't signed properly`);
                throw new common_1.BadRequestException('No signers found in response');
            }
            const organizationFromResponse = signers[0]?.certificates?.[0]?.subject?.organization ||
                signers[0]?.signers?.[0]?.subject?.organization;
            const nameFromRespone = signers[0]?.certificates?.[0]?.subject?.commonName ||
                signers[0]?.signers?.[0]?.subject?.commonName;
            const pintFromResponse = signers[0]?.certificates?.[0]?.subject?.iin ||
                signers[0]?.signers?.[0]?.subject?.iin;
            if (valid && nameFromRespone) {
                this.logger.log(`CMS is valid for ${nameFromRespone} and company ${organizationFromResponse}`);
                return {
                    valid: true,
                    company: organizationFromResponse,
                    name: nameFromRespone,
                    pin: pintFromResponse
                };
            }
            else {
                this.logger.error(`CMS is invalid`);
                throw new common_1.BadRequestException('CMS data is invalid');
            }
        }
        catch (error) {
            this.logger.error(`CMS verify Error: ${error.message}`);
            throw new common_1.BadRequestException('Failed to verify CMS data');
        }
    }
};
exports.CMSService = CMSService;
exports.CMSService = CMSService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(cms_schema_1.CMS.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        logger_service_1.CustomLogger])
], CMSService);
//# sourceMappingURL=cms.service.js.map