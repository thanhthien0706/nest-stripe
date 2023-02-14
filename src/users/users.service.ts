import { ConflictException, Injectable } from '@nestjs/common';
import { UserRepository } from './user.repository';
import { CreateUserDto } from './dto/create-user.dto';
import { UserEntity } from '@/common/database/entities/user.entity';
import { BaseService, Pagination } from '@/common/base.service';
import { MessageName } from '@/common/message';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService extends BaseService<
  UserEntity,
  CreateUserDto,
  UpdateUserDto
> {
  constructor(private readonly userRepository: UserRepository) {
    super(MessageName.USER, userRepository);
  }

  async findAll(
    filterDto?: any,
  ): Promise<Pagination<UserEntity> | UserEntity[]> {
    throw new Error('Method not implemented.');
  }

  async checkExistByEmail(email: string): Promise<boolean> {
    return await this.userRepository.existByEmail(email);
  }

  async createUser(userCreate: CreateUserDto): Promise<UserEntity> {
    const user = await this.userRepository.save(userCreate);

    if (!user) throw new ConflictException(`Not Create User`);

    return user;
  }

  async findByEmail(email: string): Promise<UserEntity> {
    return this.userRepository.findOneBy({ email });
  }

  async getUserByEmail(email: string): Promise<UserEntity> {
    const user = await this.userRepository.findByEmail(email);

    if (!user)
      throw new ConflictException(`User with email: ${email} does not exist`);

    delete user.password;

    return user;
  }
}
