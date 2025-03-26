import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model } from 'mongoose';
import { Role } from 'src/common/decorators/roles/roles.enum';
import { PaginatedResponse } from 'src/modules/shared/dto/paginated-response';
import { UserProfile } from './dto/user-profile/user-profile';
import { User, UserDocument } from './user.schema';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async findByEmail(email: string): Promise<UserDocument | null> {
    return this.userModel.findOne({ emailId: email });
  }

  async findById(id: string): Promise<UserDocument | null> {
    return this.userModel.findById(id);
  }

  async findProfile(id: string): Promise<UserProfile | null> {
    const user = await this.userModel.findById(id);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    return {
      id: user._id as string,
      fullName: user.fullName,
      emailId: user.emailId,
      createdAt: user.createdAt,
      phoneNumber: user.phoneNumber,
      role: user.role,
    };
  }

  async create(user: User): Promise<UserDocument> {
    return this.userModel.create(user);
  }

  async update(id: string, user: User): Promise<UserDocument | null> {
    return this.userModel.findByIdAndUpdate(id, user, { new: true });
  }

  async delete(id: string): Promise<UserDocument | null> {
    return this.userModel.findByIdAndDelete(id);
  }

  async findAll(): Promise<UserProfile[]> {
    const users = await this.userModel.find();
    return users.map<UserProfile>((user) => ({
      id: user._id as string,
      fullName: user.fullName,
      emailId: user.emailId,
      createdAt: user.createdAt,
      phoneNumber: user.phoneNumber,
      role: user.role,
    }));
  }

  async findAllWithPagination(
    page: number,
    limit: number,
    filters?: {
      search?: string;
      createdAt?: {
        startDate?: Date;
        endDate?: Date;
      };
    },
  ): Promise<PaginatedResponse<UserProfile>> {
    const query: FilterQuery<UserProfile> = {};

    if (filters?.search) {
      query.$or = [
        { fullName: { $regex: filters.search, $options: 'i' } },
        { emailId: { $regex: filters.search, $options: 'i' } },
      ];
    }

    if (filters?.createdAt) {
      query.createdAt = {
        $gte: filters.createdAt.startDate,
        $lte: filters.createdAt.endDate,
      };
    }

    const users = await this.userModel
      .find(query)
      .skip((page - 1) * limit)
      .limit(limit);

    const total = await this.userModel.countDocuments(query);

    return {
      data: users.map<UserProfile>((user) => ({
        id: user._id as string,
        fullName: user.fullName,
        emailId: user.emailId,
        createdAt: user.createdAt,
        phoneNumber: user.phoneNumber,
        role: user.role,
      })),
      total,
      page,
      limit,
    };
  }

  async updateRole(
    loggedInUserId: string,
    id: string,
    role: Role,
  ): Promise<UserProfile | null> {
    if (id === loggedInUserId) {
      throw new ForbiddenException('You are not allowed to update this user');
    }
    const user = await this.userModel.findByIdAndUpdate(
      id,
      { role },
      { new: true },
    );
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return {
      id: user._id as string,
      fullName: user.fullName,
      emailId: user.emailId,
      createdAt: user.createdAt,
      phoneNumber: user.phoneNumber,
      role: user.role,
    };
  }
}
