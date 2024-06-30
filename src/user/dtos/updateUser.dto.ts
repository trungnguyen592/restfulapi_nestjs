import { IsEmail, IsNotEmpty } from 'class-validator';
import { ROLES } from '../user.entity';

export class UpdateUserDto {
  @IsEmail()
  email: string;

  @IsNotEmpty()
  firstname: string;

  @IsNotEmpty()
  lastname: string;

  @IsNotEmpty()
  password: string;

  role: ROLES;
}
