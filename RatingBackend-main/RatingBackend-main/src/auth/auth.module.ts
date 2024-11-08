import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from '../users/users.module';
import { JwtStrategy } from '../auth/jwt.strategy/jwt.strategy'; 
import { CMSModule } from '../cms/cms.module';
import { ProfileModule } from 'src/profile/profile.module';
import { CompanyModule } from 'src/company/company.module';
@Module({
    imports: [
        ProfileModule,
        ConfigModule,
        CMSModule,
        UsersModule,
        ProfileModule,
        CompanyModule,
        JwtModule.registerAsync({
            imports: [ConfigModule],
            useFactory: async (configService: ConfigService) => ({
                secret: configService.get<string>('JWT_SECRET'),
                signOptions: { expiresIn: '10h' },
            }),
            inject: [ConfigService],
        }),
               
    ],
    providers: [AuthService, JwtStrategy], 
    controllers: [AuthController],
})
export class AuthModule {}
