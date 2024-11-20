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
exports.UsersController = void 0;
const common_1 = require("@nestjs/common");
const users_service_1 = require("./users.service");
const roles_decorator_1 = require("./roles/roles.decorator");
const roles_guard_1 = require("./roles/roles.guard");
const passport_1 = require("@nestjs/passport");
const user_decorator_1 = require("../users/user.decorator");
const profile_service_1 = require("../profile/profile.service");
const company_service_1 = require("../company/company.service");
let UsersController = class UsersController {
    constructor(usersService, profileService, companyService) {
        this.usersService = usersService;
        this.profileService = profileService;
        this.companyService = companyService;
    }
    async createUser(createUserDto) {
        return this.usersService.create(createUserDto);
    }
    async getAllUsers() {
        return this.usersService.getAllUsers();
    }
    async promoteUser(userId) {
        return this.usersService.promoteToAdmin(userId);
    }
    async getUsersProfile(user) {
        const userProfile = await this.profileService.getProfileById(user.shape);
        const companyProfile = await this.companyService.getCompanyById(user.shape);
        if (userProfile) {
            return userProfile;
        }
        if (companyProfile) {
            return companyProfile;
        }
    }
};
exports.UsersController = UsersController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "createUser", null);
__decorate([
    (0, common_1.Get)(),
    (0, roles_decorator_1.Roles)('admin'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "getAllUsers", null);
__decorate([
    (0, common_1.Put)(':userId/promote'),
    (0, roles_decorator_1.Roles)('admin'),
    __param(0, (0, common_1.Param)('userId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "promoteUser", null);
__decorate([
    (0, common_1.Get)('profile'),
    __param(0, (0, user_decorator_1.Users)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "getUsersProfile", null);
exports.UsersController = UsersController = __decorate([
    (0, common_1.Controller)('users'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt'), roles_guard_1.RolesGuard),
    __metadata("design:paramtypes", [users_service_1.UsersService,
        profile_service_1.ProfileService,
        company_service_1.CompanyService])
], UsersController);
//# sourceMappingURL=users.controller.js.map