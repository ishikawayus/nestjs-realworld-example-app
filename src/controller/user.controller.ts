import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Post,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import { User } from '../entity';
import { UserRepository } from '../repository';
import { AuthService } from '../service/auth.service';
import { UserRes } from '../model/user-res';
import { JwtAuthGuard } from '../jwt-auth.guard';
import { LoginDto, CreateUserDto, UpdateUserDto } from './user.dto';

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
        token: this.authService.sign({ email: user.email }),
        username: user.username,
        bio: user.bio || null,
        image: user.image || null,
      },
    };
  }

  @Post('/api/users')
  async createUser(@Body() dto: CreateUserDto): Promise<UserRes> {
    const user = new User(dto.user);
    user.bio ??= '';
    user.image ??= '';
    await this.userRepository.save(user);
    return {
      user: {
        email: user.email,
        token: this.authService.sign({ email: user.email }),
        username: user.username,
        bio: null,
        image: null,
      },
    };
  }

  @UseGuards(JwtAuthGuard)
  @Get('/api/user')
  async getCurrentUser(@Req() req: any): Promise<UserRes> {
    const { email } = this.authService.getCurrentUser(req);
    const user = await this.userRepository.findOne({
      where: { email },
    });
    return {
      user: {
        email: user.email,
        token: this.authService.getCurrentToken(req),
        username: user.username,
        bio: user.bio || null,
        image: user.image || null,
      },
    };
  }

  @UseGuards(JwtAuthGuard)
  @Put('/api/user')
  async updateCurrentUser(
    @Req() req: any,
    @Body() dto: UpdateUserDto,
  ): Promise<UserRes> {
    const { email } = this.authService.getCurrentUser(req);
    const user = await this.userRepository.findOne({
      where: { email },
    });
    if (dto.user.username != null) {
      user.username;
    }
    if (dto.user.password != null) {
      user.password;
    }
    if (dto.user.image != null) {
      user.image;
    }
    if (dto.user.bio != null) {
      user.bio;
    }
    await this.userRepository.save(user);
    return {
      user: {
        email: user.email,
        token: this.authService.getCurrentToken(req),
        username: user.username,
        bio: user.bio || null,
        image: user.image || null,
      },
    };
  }
}
