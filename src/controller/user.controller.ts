import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { User } from '../entity';
import { UserRepository } from '../repository';
import { AuthService } from '../service/auth.service';
import { UserRes } from '../model/user-res';
import { JwtAuthGuard } from '../jwt-auth.guard';
import { LoginDto, CreateUserDto, UpdateUserDto } from './user.dto';
import { UserId, UserToken } from 'src/jwt-auth.decorator';

@Controller()
export class UserController {
  constructor(
    private userRepository: UserRepository,
    private authService: AuthService,
  ) {}

  @Post('/api/users/login')
  async login(@Body() dto: LoginDto): Promise<UserRes> {
    const user = await this.userRepository.findOne({
      where: { email: dto.user.email },
    });
    if (user == null || user.password !== dto.user.password) {
      throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
    }
    return {
      user: {
        email: user.email,
        token: this.authService.sign(user),
        username: user.username,
        bio: user.bio || null,
        image: user.image || null,
      },
    };
  }

  @Post('/api/users')
  async createUser(@Body() dto: CreateUserDto): Promise<UserRes> {
    const user = User.forCreateUser(dto.user);
    user.bio ??= '';
    user.image ??= '';
    await this.userRepository.save(user);
    return {
      user: {
        email: user.email,
        token: this.authService.sign(user),
        username: user.username,
        bio: null,
        image: null,
      },
    };
  }

  @UseGuards(JwtAuthGuard)
  @Get('/api/user')
  async getCurrentUser(
    @UserId() userId: number,
    @UserToken() token: string,
  ): Promise<UserRes> {
    const user = await this.userRepository.findOne({
      where: { id: userId },
    });
    return {
      user: {
        email: user.email,
        token,
        username: user.username,
        bio: user.bio || null,
        image: user.image || null,
      },
    };
  }

  @UseGuards(JwtAuthGuard)
  @Put('/api/user')
  async updateCurrentUser(
    @Body() dto: UpdateUserDto,
    @UserId() userId: number,
    @UserToken() token: string,
  ): Promise<UserRes> {
    const user = await this.userRepository.findOne({
      where: { id: userId },
    });
    if (dto.user.email != null) {
      user.email = dto.user.email;
    }
    if (dto.user.username != null) {
      user.username = dto.user.username;
    }
    if (dto.user.password != null) {
      user.password = dto.user.password;
    }
    if (dto.user.image != null) {
      user.image = dto.user.image;
    }
    if (dto.user.bio != null) {
      user.bio = dto.user.bio;
    }
    await this.userRepository.save(user);
    return {
      user: {
        email: user.email,
        token,
        username: user.username,
        bio: user.bio || null,
        image: user.image || null,
      },
    };
  }
}
