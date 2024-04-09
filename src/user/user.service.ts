import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { User } from './user.entity';
import { UserResponse } from './type/userResponse';
import { RegisterUserDto } from 'src/auth/dto/registerUser.dto';
import { UpdateUserDto } from './dto/updateUser.dto';

@Injectable()
export class UserService {

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>
  ) { }

  async findAll(): Promise<User[]> {
    return await this.userRepository.find();
  }

  async findOneByPhone(phone: string, code: string): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { phone },
    });
    if (user) {
      user.code = code;
      return await this.userRepository.save(user)
    }
    return null

  }

  async findOneById(id: number): Promise<UserResponse> {
    return await this.userRepository.findOne({
      where: { id },
    });
  }

  async create(user: RegisterUserDto): Promise<UserResponse> {
    return this.userRepository.save(user);
  }

  async getCode(id: number) {
    return (await this.userRepository.findOne({ where: { id } })).code
  }

  async update(id: number, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      return null;
    }
    // Например, используйте Object.assign или {...user, ...updateUserDto}, чтобы объединить поля
    Object.assign(user, updateUserDto);
    return this.userRepository.save(user); // сохраните обновленные данные пользователя
  }
}
