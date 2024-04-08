import { Controller, Get, NotFoundException, Req, Post, Body } from '@nestjs/common';
import { UserService } from './user.service';

import { User } from './user.entity';
import { RegisterUserDto } from 'src/auth/dto/registerUser.dto';
import * as bcrypt from 'bcryptjs';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('/me')
  async getMe(@Req() req): Promise<User> {
    try {
      return req.user;
    } catch (error) {
      throw new NotFoundException(`Error`);
    }
  }

}
