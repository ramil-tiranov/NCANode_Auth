import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CMSController } from './cms.controller';
import { CMSService } from './cms.service';
import { CMS, CMSSchema } from './cms.schema';
import { CustomLogger } from 'src/logger/logger.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: CMS.name, schema: CMSSchema }]),
  ],
  controllers: [CMSController],
  providers: [CMSService,CustomLogger],
  exports: [CMSService],
})
export class CMSModule {}
