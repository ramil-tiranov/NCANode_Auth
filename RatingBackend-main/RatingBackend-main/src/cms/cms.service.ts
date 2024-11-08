import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CMS } from './cms.schema';
import { CmsReturnDto, CreateCmsDto } from '../data/dto/cms.dto/cms.dto';
import axios from 'axios';
import { CustomLogger } from 'src/logger/logger.service';

@Injectable()
export class CMSService {
  viewContent(id: string): string | PromiseLike<string> {
    throw new Error('Method not implemented.');
  }
  constructor(@InjectModel(CMS.name) 
  private readonly cmsModel: Model<CMS>,
  private readonly logger: CustomLogger) {}

  async create(createCmsDto: CreateCmsDto): Promise<CMS> {
    const cms = new this.cmsModel(createCmsDto);
    if (!cms) {
      this.logger.error('Error while creating CMS')
      throw new NotFoundException('Error while creating CMS');
    }
    return await cms.save();
  }

  async findAll(): Promise<CMS[]> {
    return await this.cmsModel.find().populate('userId').exec();
  }

  async findById(id: string): Promise<CMS> {
    const cms = await this.cmsModel.findById(id).populate('userId').exec();
    if (!cms) {
      throw new NotFoundException(`CMS entry with ID ${id} not found`);
    }
    return cms;
  }

  async update(id: string, updateCmsDto: Partial<CMS>): Promise<CMS> {
    const cms = await this.cmsModel.findByIdAndUpdate(id, updateCmsDto, { new: true }).populate('userId').exec();
    if (!cms) {
      throw new NotFoundException(`CMS entry with ID ${id} not found`);
    }
    return cms;
  }

  async delete(id: string): Promise<CMS> {
    const cms = await this.cmsModel.findByIdAndDelete(id).exec();
    if (!cms) {
      throw new NotFoundException(`CMS entry with ID ${id} not found`);
    }
    return cms;
  }

  async decodeBase64(encodedData: string): Promise<string> {
    const buffer = Buffer.from(encodedData, 'base64');
    return buffer.toString('utf8');
  }

  async encodeBase64(decodedData: string): Promise<string> {
    const buffer = Buffer.from(decodedData, 'utf8');
    return buffer.toString('base64');
  }

  async cmsExtract(CMS: string): Promise<any> {
    try {
      const response = await axios.post('http://localhost:14579/cms/extract', { cms: CMS });
      
      if (!response.data) {
        this.logger.error('Empty response data from extraction')

        throw new Error('Empty response data');
      }
      
      return response.data;
    } catch (error) {
      this.logger.error(`CMS Extract Error: ${error.message}`)
      throw new NotFoundException('Failed to extract CMS data');
    }
  }
  
  async cmsVerify(CMS: string): Promise<CmsReturnDto> {
    try {
      const extractedData = await this.cmsExtract(CMS);
  
      if (!extractedData || !extractedData.data) {
        this.logger.error(`Data extraction from CMS if failed`)
        throw new BadRequestException('CMS extraction failed');
      }
  
      const response = await axios.post('http://localhost:14579/cms/verify', {
        revocationCheck: ["OCSP"],
        cms: CMS,
        data: extractedData.data,
      });
  
      const { valid, signers } = response.data;
    
      if (!Array.isArray(signers) || signers.length === 0) {
        this.logger.error(`Document wasn't signed properly`)
        throw new BadRequestException('No signers found in response');
      }
  
      const organizationFromResponse = 
        signers[0]?.certificates?.[0]?.subject?.organization || 
        signers[0]?.signers?.[0]?.subject?.organization;

      const nameFromRespone = 
        signers[0]?.certificates?.[0]?.subject?.commonName || 
        signers[0]?.signers?.[0]?.subject?.commonName;

      const pintFromResponse = signers[0]?.certificates?.[0]?.subject?.iin || 
      signers[0]?.signers?.[0]?.subject?.iin;

      if (valid && nameFromRespone) {
        this.logger.log(`CMS is valid for ${nameFromRespone} and company ${organizationFromResponse}`)
        return {
          valid: true,
          company: organizationFromResponse,
          name: nameFromRespone,
          pin: pintFromResponse
        };
      } else {
        this.logger.error(`CMS is invalid`)
        throw new BadRequestException('CMS data is invalid');
      }
    } catch (error) {

      this.logger.error(`CMS verify Error: ${error.message}`)
      throw new BadRequestException('Failed to verify CMS data');
    }
  }  
  
}
