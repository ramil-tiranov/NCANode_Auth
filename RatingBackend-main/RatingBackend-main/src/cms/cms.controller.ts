// src/document/cms.controller.ts

import { Controller, Post, Get, Put, Delete, Param, Body } from '@nestjs/common';
import { CMSService } from './cms.service';
import { CMS } from './cms.schema';
import { CreateCmsDto } from 'src/data/dto/cms.dto/cms.dto';

@Controller('cms')
export class CMSController {
  constructor(private readonly cmsService: CMSService) {}

  @Post()
  async create(@Body() createCmsDto: CreateCmsDto): Promise<CMS> {
    return await this.cmsService.create(createCmsDto);
  }

  @Get()
  async findAll(): Promise<CMS[]> {
    return await this.cmsService.findAll();
  }

  @Get(':id')
  async findById(@Param('id') id: string): Promise<CMS> {
    return await this.cmsService.findById(id);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() updateCmsDto: Partial<CreateCmsDto>): Promise<CMS> {
    return await this.cmsService.update(id, updateCmsDto);
  }

  @Delete(':id')
  async delete(@Param('id') id: string): Promise<CMS> {
    return await this.cmsService.delete(id);
  }

  @Post('view/:id')
  async viewContent(@Param('id') id: string): Promise<string> {
    return await this.cmsService.viewContent(id);
  }
}
