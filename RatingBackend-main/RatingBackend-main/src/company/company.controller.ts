import { Controller, Get, Post, Put, Delete, Body, UseGuards, BadRequestException, Param, Query } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { CompanyService } from './company.service';
import { CreateCompanyDto, UpdateCompanyDto } from 'src/data/dto/company.dto/company.dto';
import { CompanyProfile, FeedbackEntry } from './company.schema';
import { RolesGuard } from 'src/users/roles/roles.guard';
import { Users } from '../users/user.decorator';
import { Types } from 'mongoose';

@Controller('company')
@UseGuards(AuthGuard('jwt'), RolesGuard)
export class CompanyController {
  constructor(private readonly companyService: CompanyService) {}

  @Get()
  async getAllCompanies(): Promise<Omit<CompanyProfile, 'activityLogs'>[]> {
    return await this.companyService.findAll();
  }

  @Get(':id')
  async getCompanyById(@Param('id') id: string): Promise<Omit<CompanyProfile, 'activityLogs'>> {
    try {
      return await this.companyService.findOne(id);
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw new BadRequestException(error.message);
      }
      throw error;
    }
  }
  

  @Put('')
  async updateCompany(
    @Body() updateCompanyDto: UpdateCompanyDto,
    @Users() user: any,
   ): Promise<Omit<CompanyProfile, 'activityLogs'>> {
    try {
      return await this.companyService.update(user.shape, updateCompanyDto, updateCompanyDto.cms, user._id);
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw new BadRequestException(error.message);
      }
      throw error;
    }
  }

  @Post(':companyId/feedback')
  async addFeedback(
    @Users() user: any, 
    @Body() feedback: FeedbackEntry, @Body('cms') cms : string,
    @Param('companyId') companyId: string
  ): Promise<Omit<CompanyProfile, 'activityLogs'>> {
    try {
      return await this.companyService.addFeedback(user._id, companyId, feedback, cms);
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw new BadRequestException(error.message);
      }
      throw error;
    }
  }
  

  @Get(':companyId/feedback')
  async getFeedbacks(@Param('companyId') companyId: string): Promise<any[]> {
    return await this.companyService.getFeedbacks(companyId);
  }

  @Delete(':companyId/feedback/:feedbackId')
  async removeFeedback(
    @Param('companyId') companyId: string,
    @Param('feedbackId') feedbackId: string
  ): Promise<Omit<CompanyProfile, 'activityLogs'>> {
    try {
      return await this.companyService.removeFeedback(companyId, feedbackId);
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw new BadRequestException(error.message);
      }
      throw error;
    }
  }
}

