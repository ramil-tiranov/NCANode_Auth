import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { IsNotEmpty } from 'class-validator';

export enum Action {
  CREATEPROFILE = 'createprofile',
  UPDATEPROFILE = 'updateprofile',
  REGISTRATION = 'registration',
  FEEDBACK = 'feedback',
  UPDATECOMPANY = "UPDATECOMPANY",
  DELETECOMPANY = "DELETECOMPANY",
  CREATECOMPANY = "CREATECOMPANY",
  FEEDBACK_REMOVED = "FEEDBACK_REMOVED"
}

@Schema({ timestamps: true })
export class CMS extends Document {
  @IsNotEmpty()
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  userId: Types.ObjectId;

  @IsNotEmpty()
  @Prop({ type: String, required: true })
  cms: string;

  @IsNotEmpty()
  @Prop({ enum: Action, required: true })
  action: Action;

  @Prop({ type: Date, default: Date.now })
  createdAt: Date;
}

export const CMSSchema = SchemaFactory.createForClass(CMS);

@Schema()
class Revocation {
  @Prop({ required: true })
  revoked: boolean;

  @Prop({ required: true })
  by: string;

  @Prop()
  revocationTime: Date | null;

  @Prop()
  reason: string | null;

  @Prop({ type: Date, default: Date.now })
  createdAt: Date;
}

const RevocationSchema = SchemaFactory.createForClass(Revocation);

@Schema()
class SubjectIssuer {
  @Prop({ required: true })
  commonName: string;

  @Prop()
  lastName: string;

  @Prop()
  surName: string;

  @Prop()
  email: string;

  @Prop()
  organization: string;

  @Prop()
  gender: string;

  @Prop()
  iin: string;

  @Prop()
  bin: string;

  @Prop()
  country: string;

  @Prop()
  locality: string;

  @Prop()
  state: string;

  @Prop()
  dn: string;

  @Prop({ type: Date, default: Date.now })
  createdAt: Date;
}

const SubjectIssuerSchema = SchemaFactory.createForClass(SubjectIssuer);

@Schema()
class Certificate {
  @Prop({ required: true })
  valid: boolean;

  @Prop({ type: [RevocationSchema], required: true })
  revocations: Revocation[];

  @Prop()
  notBefore: Date | null;

  @Prop()
  notAfter: Date | null;

  @Prop({ required: true })
  keyUsage: string;

  @Prop({ required: true })
  serialNumber: string;

  @Prop({ required: true })
  signAlg: string;

  @Prop({ type: [String], required: true })
  keyUser: string[];

  @Prop({ required: true })
  publicKey: string;

  @Prop({ required: true })
  signature: string;

  @Prop({ type: SubjectIssuerSchema, required: true })
  subject: SubjectIssuer;

  @Prop({ type: SubjectIssuerSchema, required: true })
  issuer: SubjectIssuer;

  @Prop({ type: Date, default: Date.now })
  createdAt: Date;
}

const CertificateSchema = SchemaFactory.createForClass(Certificate);

@Schema()
class TSP {
  @Prop()
  serialNumber: string;

  @Prop()
  genTime: Date | null;

  @Prop({ required: true })
  policy: string;

  @Prop()
  tsa: string | null;

  @Prop({ required: true })
  tspHashAlgorithm: string;

  @Prop({ required: true })
  hash: string;

  @Prop({ type: Date, default: Date.now })
  createdAt: Date;
}

const TSPSchema = SchemaFactory.createForClass(TSP);

@Schema()
class InnerSigner {
  @Prop({ type: [CertificateSchema], required: true })
  certificates: Certificate[];

  @Prop({ type: TSPSchema, required: false })
  tsp: TSP | null;

  @Prop({ type: Date, default: Date.now })
  createdAt: Date;
}

const InnerSignerSchema = SchemaFactory.createForClass(InnerSigner);

@Schema()
class Signer {
  @Prop({ type: [InnerSignerSchema], required: true })
  signers: InnerSigner[];

  @Prop({ type: Date, default: Date.now })
  createdAt: Date;
}

const SignerSchema = SchemaFactory.createForClass(Signer);

@Schema()
export class CMSVerification extends Document {
  @IsNotEmpty()
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  userId: Types.ObjectId;

  @Prop({ required: true })
  valid: boolean;

  @Prop({ type: [SignerSchema], required: true })
  signers: Signer[];

  @Prop({ type: Date, default: Date.now })
  createdAt: Date;
}

export const CMSVerificationSchema = SchemaFactory.createForClass(CMSVerification);
