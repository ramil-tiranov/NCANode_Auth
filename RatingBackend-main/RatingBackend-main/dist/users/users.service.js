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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const user_schema_1 = require("./user.schema");
const bcrypt = __importStar(require("bcrypt"));
const logger_service_1 = require("../logger/logger.service");
let UsersService = class UsersService {
    constructor(userModel, logger) {
        this.userModel = userModel;
        this.logger = logger;
    }
    async create(createUserDto) {
        const existingUser = await this.findByEmail(createUserDto.email);
        const existingUserByPhone = await this.findByPhone(createUserDto.phoneNumber);
        if (existingUser || existingUserByPhone) {
            this.logger.error(`User already exists`);
            throw new common_1.ConflictException('Email or phone number already in use');
        }
        const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
        const newUser = new this.userModel({ ...createUserDto, password: hashedPassword });
        return newUser.save();
    }
    async findByPin(pin) {
        return this.userModel.findOne({ pin });
    }
    async findByEmail(email) {
        return this.userModel.findOne({ email });
    }
    async findByUserName(username) {
        return this.userModel.findOne({ username });
    }
    async getAllUsers() {
        return this.userModel.find().exec();
    }
    async findById(userId) {
        const user = await this.userModel.findById(userId);
        if (!user) {
            this.logger.error(`User not found`);
            throw new common_1.NotFoundException('User not found');
        }
        return user;
    }
    async promoteToAdmin(userId) {
        const user = await this.userModel.findById(userId);
        if (!user) {
            this.logger.error(`User not found`);
            throw new common_1.NotFoundException('User not found');
        }
        user.role = user_schema_1.UserRole.ADMIN;
        return user.save();
    }
    async findByPhone(phoneNumber) {
        const user = await this.userModel.findOne({ phoneNumber });
        return user;
    }
    async delete(userId) {
        await this.userModel.findByIdAndDelete(userId);
    }
};
exports.UsersService = UsersService;
exports.UsersService = UsersService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(user_schema_1.User.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        logger_service_1.CustomLogger])
], UsersService);
//# sourceMappingURL=users.service.js.map