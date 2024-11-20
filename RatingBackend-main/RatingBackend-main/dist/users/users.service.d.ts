import { Model, Types } from 'mongoose';
import { User } from './user.schema';
import { CustomLogger } from 'src/logger/logger.service';
export declare class UsersService {
    private userModel;
    private readonly logger;
    constructor(userModel: Model<User>, logger: CustomLogger);
    create(createUserDto: any): Promise<User>;
    findByPin(pin: string): Promise<User | null>;
    findByEmail(email: string): Promise<User | null>;
    findByUserName(username: string): Promise<User | null>;
    getAllUsers(): Promise<User[]>;
    findById(userId: string): Promise<User>;
    promoteToAdmin(userId: string): Promise<User>;
    findByPhone(phoneNumber: string): Promise<User>;
    delete(userId: Types.ObjectId): Promise<void>;
}
