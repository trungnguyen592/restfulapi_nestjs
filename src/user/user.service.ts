import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { UpdateUserDto } from './dtos/updateUser.dto';
import { RegisterUserDto } from './dtos/registerUser';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private usersRepository: Repository<User>,
  ) {}
  //CRUD
  create(requestBody: RegisterUserDto) {
    const user = this.usersRepository.create(requestBody);

    return this.usersRepository.save(user);
  }
  findAll() {
    return this.usersRepository.find();
  }

  findById(id: number) {
    return this.usersRepository.findOneBy({ id });
  }

  findByEmail(email: string) {
    return this.usersRepository.findOneBy({ email });
  }
  // 2 Đoạn code như nhau:
  // async updateById(id: number, requestBody: any) {
  // let user = await this.findById(id);
  // if (!user) {
  //   throw new NotFoundException('User does not exist!');
  // }
  // user = { ...user, ...requestBody };
  // return this.usersRepository.save(user);
  async updateById(id: number, requestBody: UpdateUserDto) {
    const user = await this.findById(id);

    if (!user) {
      throw new NotFoundException('User does not exist!');
    }
    // Cập nhật user với các thông tin trong requestBody
    Object.assign(user, requestBody);
    return this.usersRepository.save(user);
  }

  deleteById(id: number) {
    return this.usersRepository.delete({ id });
  }
}
