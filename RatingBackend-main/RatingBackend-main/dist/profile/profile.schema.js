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
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProfileSchema = exports.Profile = exports.FeedbackEntry = exports.Rating = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const class_validator_1 = require("class-validator");
const mongoose_2 = require("mongoose");
const cms_schema_1 = require("../cms/cms.schema");
var Rating;
(function (Rating) {
    Rating[Rating["POOR"] = 1] = "POOR";
    Rating[Rating["AVERAGE"] = 2] = "AVERAGE";
    Rating[Rating["GOOD"] = 3] = "GOOD";
    Rating[Rating["EXCELLENT"] = 4] = "EXCELLENT";
    Rating[Rating["AMAZING"] = 5] = "AMAZING";
})(Rating || (exports.Rating = Rating = {}));
let FeedbackEntry = class FeedbackEntry {
};
exports.FeedbackEntry = FeedbackEntry;
__decorate([
    (0, mongoose_1.Prop)({ required: true, enum: Rating }),
    __metadata("design:type", Number)
], FeedbackEntry.prototype, "rating", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: false }),
    __metadata("design:type", String)
], FeedbackEntry.prototype, "feedback", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: Date.now }),
    __metadata("design:type", Date)
], FeedbackEntry.prototype, "createdAt", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: 'User', required: true }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], FeedbackEntry.prototype, "companyId", void 0);
exports.FeedbackEntry = FeedbackEntry = __decorate([
    (0, mongoose_1.Schema)({ _id: false })
], FeedbackEntry);
let Profile = class Profile extends mongoose_2.Document {
};
exports.Profile = Profile;
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: 'User', required: true }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], Profile.prototype, "companyId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, unique: true }),
    (0, class_validator_1.IsEmail)(),
    __metadata("design:type", String)
], Profile.prototype, "email", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, unique: true }),
    __metadata("design:type", String)
], Profile.prototype, "pin", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: false }),
    __metadata("design:type", String)
], Profile.prototype, "firstName", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: false }),
    __metadata("design:type", String)
], Profile.prototype, "lastName", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: false }),
    __metadata("design:type", String)
], Profile.prototype, "bio", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: false }),
    __metadata("design:type", String)
], Profile.prototype, "profilePicture", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: false }),
    __metadata("design:type", String)
], Profile.prototype, "contacts", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: [FeedbackEntry], default: [] }),
    __metadata("design:type", Array)
], Profile.prototype, "feedbacks", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: [cms_schema_1.CMSSchema], default: [], required: true }),
    __metadata("design:type", Array)
], Profile.prototype, "activityLogs", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Date, default: Date.now }),
    __metadata("design:type", Date)
], Profile.prototype, "createdAt", void 0);
exports.Profile = Profile = __decorate([
    (0, mongoose_1.Schema)()
], Profile);
exports.ProfileSchema = mongoose_1.SchemaFactory.createForClass(Profile);
//# sourceMappingURL=profile.schema.js.map