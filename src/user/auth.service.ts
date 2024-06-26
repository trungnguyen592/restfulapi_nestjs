import { BadRequestException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { RegisterUserDto } from './dtos/registerUser';
import { UserService } from './user.service';
import * as bcrypt from 'bcrypt';
import { LoginUserDto } from './dtos/loginUser.dto';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private userService: UserService,
  ) {}

  async register(requestBody: RegisterUserDto) {
    //check email exist
    const userByEmail = await this.userService.findByEmail(requestBody.email);
    if (userByEmail) {
      throw new BadRequestException('Email already exist!');
    }

    //hass pass
    const hashedPassword = await bcrypt.hash(requestBody.password, 10);

    requestBody.password = hashedPassword;

    //savetodtb
    const savedUser = await this.userService.create(requestBody);

    // generate jwt token
    const payload = {
      id: savedUser.id,
      firstName: savedUser.firstname,
      lastName: savedUser.lastname,
      email: savedUser.email,
      role: savedUser.role,
    };
    const access_token = await this.jwtService.signAsync(payload);

    return {
      msg: 'User has been created!',
      access_token,
    };
  }

  async login(requestBody: LoginUserDto) {
    const userByEmail = await this.userService.findByEmail(requestBody.email);
    if (!userByEmail) {
      throw new BadRequestException('Invalid Credentials!');
    }

    //checkpass
    const isMatchPass = await bcrypt.compare(
      requestBody.password,
      userByEmail.password,
    );
    if (!isMatchPass) {
      throw new BadRequestException('Invalid Credentials!');
    }

    const payload = {
      id: userByEmail.id,
      firstName: userByEmail.firstname,
      lastName: userByEmail.lastname,
      email: userByEmail.email,
      role: userByEmail.role,
    };
    const access_token = await this.jwtService.signAsync(payload);

    return {
      msg: 'User has been login succesfully!',
      access_token,
    };
  }
}
