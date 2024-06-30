import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { UpdateUserDto } from './dtos/updateUser.dto';
import { RegisterUserDto } from './dtos/registerUser';
import { Permission } from 'src/check.ts/checkPermission';
import * as bcrypt from 'bcrypt';

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
  // eslint-disable-next-line prettier/prettier

  async updateById(id: number, requestBody: UpdateUserDto, currentUser: User) {
    if (requestBody.role) {
      throw new BadRequestException('U cant change the role!');
    }

    let user = await this.findById(id);

    if (!user) {
      throw new NotFoundException('User does not exist!');
    }

    // thang co id=1 ko the update thang co id=2
    Permission.check(id, currentUser);
    // Cập nhật user với các thông tin trong requestBody
    //Object.assign(user, requestBody);
    user = { ...user, ...requestBody }; // cai tren cai duoi nhu nhau
    const updateUser = await this.usersRepository.save(user);

    //hass pass
    const hashedPassword = await bcrypt.hash(requestBody.password, 10);
    requestBody.password = hashedPassword;

    //chi tra ve 3 cai duoi
    return {
      firstName: updateUser.firstname,
      lastName: updateUser.lastname,
      email: updateUser.email,
    };
  }

  async deleteById(id: number, currentUser: User) {
    const user = await this.findById(id);

    Permission.check(id, currentUser);

    if (!user) {
      throw new NotFoundException('User doesnt exist');
    }
    return this.usersRepository.remove(user);
  }
}
