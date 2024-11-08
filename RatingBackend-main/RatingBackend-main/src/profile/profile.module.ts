import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ProfileController } from '../profile/profile.controllers';
import { ProfileService } from './profile.service';
import { Profile, ProfileSchema } from './profile.schema';
import { CMSService } from 'src/cms/cms.service';
import { CMSModule } from 'src/cms/cms.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Profile.name, schema: ProfileSchema }]),
    CMSModule
  ],
  controllers: [ProfileController],
  providers: [ProfileService],
  exports: [ProfileService]
})
export class ProfileModule {}
