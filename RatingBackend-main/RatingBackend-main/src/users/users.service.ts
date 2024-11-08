import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { User, UserRole } from './user.schema';
import * as bcrypt from 'bcrypt';
import { CustomLogger } from 'src/logger/logger.service';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) 
  private userModel: Model<User>, 
  private readonly logger: CustomLogger) {}

  async create(createUserDto: any): Promise<User> {
    const existingUser = await this.findByEmail(createUserDto.email);
    const existingUserByPhone = await this.findByPhone(createUserDto.phoneNumber)

    if (existingUser || existingUserByPhone) {
      this.logger.error(`User already exists`)

      throw new ConflictException('Email or phone number already in use');
    }

    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
    const newUser = new this.userModel({ ...createUserDto, password: hashedPassword });
    return newUser.save();
  }

  async findByPin(pin: string): Promise<User | null> {
    return this.userModel.findOne({pin})
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.userModel.findOne({ email });
  }

  async findByUserName(username: string): Promise<User | null> {
    return this.userModel.findOne({ username });
  }

  async getAllUsers(): Promise<User[]> {
    return this.userModel.find().exec();
  }

  async findById(userId: string): Promise<User> {
    const user = await this.userModel.findById(userId);
    if (!user) {
      this.logger.error(`User not found`)

      throw new NotFoundException('User not found');
    }

    return user
  }

  async promoteToAdmin(userId: string): Promise<User> {
    const user = await this.userModel.findById(userId);
    if (!user) {
      this.logger.error(`User not found`)

      throw new NotFoundException('User not found');
    }
    user.role = UserRole.ADMIN;
    return user.save();
  }

  async findByPhone(phoneNumber: string): Promise<User> {
    const user = await this.userModel.findOne({phoneNumber})
    return user
  }

  async delete(userId: Types.ObjectId): Promise<void> {
    await this.userModel.findByIdAndDelete(userId);
  }
}
