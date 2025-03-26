import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { CryptoUtils } from 'src/common/utils/crypto-utils';
import { UserDocument } from '../users/user.schema';
import { UsersService } from '../users/users.service';
import { LoginRequest } from './dto/login-request/login-request';
import { SignupRequest } from './dto/signup-request/signup-request';
import { SignupResponse } from './dto/signup-response/signup-response';
@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async login(body: LoginRequest) {
    const user = await this.usersService.findByEmail(body.email);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }
    if (!CryptoUtils.comparePassword(body.password, user.password)) {
      throw new UnauthorizedException('Invalid credentials');
    }
    return this.generateTokenAndResponse(user);
  }

  async signup(body: SignupRequest) {
    const user = await this.usersService.findByEmail(body.emailId);
    if (user) {
      throw new BadRequestException('User already exists');
    }
    const hashedPassword = CryptoUtils.hashPassword(body.password);
    const newUser = await this.usersService.create({
      ...body,
      password: hashedPassword,
      role: 'user',
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    return this.generateTokenAndResponse(newUser);
  }

  generateTokenAndResponse(user: UserDocument) {
    const payload = {
      id: user._id,
      emailId: user.emailId,
      sub: user._id,
      role: user.role,
    };
    const token = this.jwtService.sign(payload);
    const response: SignupResponse = {
      token,
      userProfile: {
        id: user.id,
        emailId: user.emailId,
        role: user.role,
        fullName: user.fullName,
        phoneNumber: user.phoneNumber,
        createdAt: user.createdAt,
      },
    };
    return response;
  }
}
