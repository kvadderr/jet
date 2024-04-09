import { Controller, Get, NotFoundException, Req, Patch, Body, Put } from '@nestjs/common';
import { UserService } from './user.service';

import { User } from './user.entity';
import { RegisterUserDto } from 'src/auth/dto/registerUser.dto';
import * as bcrypt from 'bcryptjs';
import { UpdateUserDto } from './dto/updateUser.dto';

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

  @Patch('/update')
  async updateUser(@Req() req, @Body() updateUserDto: UpdateUserDto): Promise<User> {
    const updatedUser = await this.userService.update(req.user.id, updateUserDto);
    if (!updatedUser) {
      throw new NotFoundException(`User with ID not found`);
    }
    return updatedUser;
  }

}
