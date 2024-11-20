import { UsersService } from './users.service';
import { User } from './user.schema';
import { ProfileService } from 'src/profile/profile.service';
import { Profile } from 'src/profile/profile.schema';
import { CompanyProfile } from 'src/company/company.schema';
import { CompanyService } from 'src/company/company.service';
export declare class UsersController {
    private readonly usersService;
    private readonly profileService;
    private readonly companyService;
    constructor(usersService: UsersService, profileService: ProfileService, companyService: CompanyService);
    createUser(createUserDto: any): Promise<User>;
    getAllUsers(): Promise<User[]>;
    promoteUser(userId: string): Promise<User>;
    getUsersProfile(user: any): Promise<Omit<Profile, 'activityLogs'> | Omit<CompanyProfile, 'activityLogs'>>;
}
