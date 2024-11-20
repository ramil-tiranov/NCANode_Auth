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
exports.CMSVerificationSchema = exports.CMSVerification = exports.CMSSchema = exports.CMS = exports.Action = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const class_validator_1 = require("class-validator");
var Action;
(function (Action) {
    Action["CREATEPROFILE"] = "createprofile";
    Action["UPDATEPROFILE"] = "updateprofile";
    Action["REGISTRATION"] = "registration";
    Action["FEEDBACK"] = "feedback";
    Action["UPDATECOMPANY"] = "UPDATECOMPANY";
    Action["DELETECOMPANY"] = "DELETECOMPANY";
    Action["CREATECOMPANY"] = "CREATECOMPANY";
    Action["FEEDBACK_REMOVED"] = "FEEDBACK_REMOVED";
})(Action || (exports.Action = Action = {}));
let CMS = class CMS extends mongoose_2.Document {
};
exports.CMS = CMS;
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: 'User', required: true }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], CMS.prototype, "userId", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, mongoose_1.Prop)({ type: String, required: true }),
    __metadata("design:type", String)
], CMS.prototype, "cms", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, mongoose_1.Prop)({ enum: Action, required: true }),
    __metadata("design:type", String)
], CMS.prototype, "action", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Date, default: Date.now }),
    __metadata("design:type", Date)
], CMS.prototype, "createdAt", void 0);
exports.CMS = CMS = __decorate([
    (0, mongoose_1.Schema)({ timestamps: true })
], CMS);
exports.CMSSchema = mongoose_1.SchemaFactory.createForClass(CMS);
let Revocation = class Revocation {
};
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", Boolean)
], Revocation.prototype, "revoked", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], Revocation.prototype, "by", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Date)
], Revocation.prototype, "revocationTime", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], Revocation.prototype, "reason", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Date, default: Date.now }),
    __metadata("design:type", Date)
], Revocation.prototype, "createdAt", void 0);
Revocation = __decorate([
    (0, mongoose_1.Schema)()
], Revocation);
const RevocationSchema = mongoose_1.SchemaFactory.createForClass(Revocation);
let SubjectIssuer = class SubjectIssuer {
};
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], SubjectIssuer.prototype, "commonName", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], SubjectIssuer.prototype, "lastName", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], SubjectIssuer.prototype, "surName", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], SubjectIssuer.prototype, "email", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], SubjectIssuer.prototype, "organization", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], SubjectIssuer.prototype, "gender", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], SubjectIssuer.prototype, "iin", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], SubjectIssuer.prototype, "bin", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], SubjectIssuer.prototype, "country", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], SubjectIssuer.prototype, "locality", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], SubjectIssuer.prototype, "state", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], SubjectIssuer.prototype, "dn", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Date, default: Date.now }),
    __metadata("design:type", Date)
], SubjectIssuer.prototype, "createdAt", void 0);
SubjectIssuer = __decorate([
    (0, mongoose_1.Schema)()
], SubjectIssuer);
const SubjectIssuerSchema = mongoose_1.SchemaFactory.createForClass(SubjectIssuer);
let Certificate = class Certificate {
};
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", Boolean)
], Certificate.prototype, "valid", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: [RevocationSchema], required: true }),
    __metadata("design:type", Array)
], Certificate.prototype, "revocations", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Date)
], Certificate.prototype, "notBefore", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Date)
], Certificate.prototype, "notAfter", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], Certificate.prototype, "keyUsage", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], Certificate.prototype, "serialNumber", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], Certificate.prototype, "signAlg", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: [String], required: true }),
    __metadata("design:type", Array)
], Certificate.prototype, "keyUser", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], Certificate.prototype, "publicKey", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], Certificate.prototype, "signature", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: SubjectIssuerSchema, required: true }),
    __metadata("design:type", SubjectIssuer)
], Certificate.prototype, "subject", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: SubjectIssuerSchema, required: true }),
    __metadata("design:type", SubjectIssuer)
], Certificate.prototype, "issuer", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Date, default: Date.now }),
    __metadata("design:type", Date)
], Certificate.prototype, "createdAt", void 0);
Certificate = __decorate([
    (0, mongoose_1.Schema)()
], Certificate);
const CertificateSchema = mongoose_1.SchemaFactory.createForClass(Certificate);
let TSP = class TSP {
};
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], TSP.prototype, "serialNumber", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Date)
], TSP.prototype, "genTime", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], TSP.prototype, "policy", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], TSP.prototype, "tsa", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], TSP.prototype, "tspHashAlgorithm", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], TSP.prototype, "hash", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Date, default: Date.now }),
    __metadata("design:type", Date)
], TSP.prototype, "createdAt", void 0);
TSP = __decorate([
    (0, mongoose_1.Schema)()
], TSP);
const TSPSchema = mongoose_1.SchemaFactory.createForClass(TSP);
let InnerSigner = class InnerSigner {
};
__decorate([
    (0, mongoose_1.Prop)({ type: [CertificateSchema], required: true }),
    __metadata("design:type", Array)
], InnerSigner.prototype, "certificates", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: TSPSchema, required: false }),
    __metadata("design:type", TSP)
], InnerSigner.prototype, "tsp", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Date, default: Date.now }),
    __metadata("design:type", Date)
], InnerSigner.prototype, "createdAt", void 0);
InnerSigner = __decorate([
    (0, mongoose_1.Schema)()
], InnerSigner);
const InnerSignerSchema = mongoose_1.SchemaFactory.createForClass(InnerSigner);
let Signer = class Signer {
};
__decorate([
    (0, mongoose_1.Prop)({ type: [InnerSignerSchema], required: true }),
    __metadata("design:type", Array)
], Signer.prototype, "signers", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Date, default: Date.now }),
    __metadata("design:type", Date)
], Signer.prototype, "createdAt", void 0);
Signer = __decorate([
    (0, mongoose_1.Schema)()
], Signer);
const SignerSchema = mongoose_1.SchemaFactory.createForClass(Signer);
let CMSVerification = class CMSVerification extends mongoose_2.Document {
};
exports.CMSVerification = CMSVerification;
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: 'User', required: true }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], CMSVerification.prototype, "userId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", Boolean)
], CMSVerification.prototype, "valid", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: [SignerSchema], required: true }),
    __metadata("design:type", Array)
], CMSVerification.prototype, "signers", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Date, default: Date.now }),
    __metadata("design:type", Date)
], CMSVerification.prototype, "createdAt", void 0);
exports.CMSVerification = CMSVerification = __decorate([
    (0, mongoose_1.Schema)()
], CMSVerification);
exports.CMSVerificationSchema = mongoose_1.SchemaFactory.createForClass(CMSVerification);
//# sourceMappingURL=cms.schema.js.map