"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const users_service_1 = require("../users/users.service");
const bcrypt = __importStar(require("bcrypt"));
const cms_service_1 = require("../cms/cms.service");
const cms_schema_1 = require("../cms/cms.schema");
const user_schema_1 = require("../users/user.schema");
const logger_service_1 = require("../logger/logger.service");
const profile_service_1 = require("../profile/profile.service");
const company_service_1 = require("../company/company.service");
let AuthService = class AuthService {
    constructor(userService, jwtService, cmsService, logger, profileService, companyService) {
        this.userService = userService;
        this.jwtService = jwtService;
        this.cmsService = cmsService;
        this.logger = logger;
        this.profileService = profileService;
        this.companyService = companyService;
    }
    async signup(signupDto) {
        const { email, password, phoneNumber, cms } = signupDto;
        const isCmsValid = await this.cmsService.cmsVerify(cms);
        if (!isCmsValid) {
            this.logger.error('Invalid CMS');
            throw new common_1.BadRequestException('Invalid CMS');
        }
        const [name, surName] = isCmsValid.name.split(" ");
        let company = isCmsValid.company || "EMPLOYEE";
        let role = company ? user_schema_1.UserRole.EMPLOYEE : user_schema_1.UserRole.MANAGER;
        const pin = isCmsValid.pin;
        let shape;
        try {
            const user = await this.userService.create({
                email,
                password,
                company,
                name,
                surname: surName,
                role,
                phoneNumber,
                pin,
                shape: null,
            });
            if (!isCmsValid.company) {
                shape = await this.profileService.getProfileByPin(pin);
                if (!shape) {
                    const simpleProfile = await this.profileService.create(user._id, email, { email: email, pin: pin }, pin, cms);
                    shape = simpleProfile._id;
                }
            }
            else {
                const createCompanyDto = {
                    companyId: user._id,
                    email,
                    companyName: company,
                    contactNumber: '',
                    bio: 'A brief bio',
                    logo: '',
                    contacts: 'Contact Info'
                };
                const companyEntry = await this.companyService.create(createCompanyDto, cms, user._id);
                shape = companyEntry._id;
            }
            user.shape = shape;
            await user.save();
            const cmsEntry = {
                userId: user._id,
                cms,
                action: cms_schema_1.Action.REGISTRATION,
                createdAt: new Date(),
            };
            user.activityLogs.push(cmsEntry);
            await user.save();
            const token = this.jwtService.sign({ userId: user._id, roles: user.role, email: user.email, profileId: user.shape });
            return { token, role: user.role };
        }
        catch (error) {
            this.logger.error('Could not complete registration', error);
            throw new common_1.BadRequestException('Could not complete registration.');
        }
    }
    async login(loginDto) {
        const { identifier, password } = loginDto;
        let user = await this.userService.findByEmail(identifier) ||
            await this.userService.findByPhone(identifier);
        if (!user || !(await bcrypt.compare(password, user.password))) {
            this.logger.error('Invalid credntials');
            throw new common_1.UnauthorizedException('Invalid credentials');
        }
        const token = this.jwtService.sign({ userId: user._id, roles: user.role, email: user.email, profileId: user.shape });
        return { token, role: user.role };
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [users_service_1.UsersService,
        jwt_1.JwtService,
        cms_service_1.CMSService,
        logger_service_1.CustomLogger,
        profile_service_1.ProfileService,
        company_service_1.CompanyService])
], AuthService);
//# sourceMappingURL=auth.service.js.map