import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  ParseIntPipe,
  ClassSerializerInterceptor,
  UseInterceptors,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { UpdateUserDto } from './dtos/updateUser.dto';
import { RegisterUserDto } from './dtos/registerUser';
import { AuthService } from './auth.service';
import { LoginUserDto } from './dtos/loginUser.dto';
import { CurrentUser } from './decorators/currentUser.decorators';
import { User } from './user.entity';
import { AuthGuard } from 'src/guards/auth.guard';
import { RoleGuard } from 'src/guards/role.guard';

@Controller('/api/v1/user')
@UseInterceptors(ClassSerializerInterceptor)
export class UserController {
  constructor(
    private userService: UserService,
    private authService: AuthService,
  ) {}

  @Get()
  @UseGuards(new RoleGuard(['user', 'admin']))
  @UseGuards(AuthGuard)
  getAllUser() {
    return this.userService.findAll();
  }

  @Get('/current-user')
  @UseGuards(AuthGuard)
  getCurrentUser(@CurrentUser() currentUser: User) {
    return currentUser;
  }

  @Get('/:id')
  getUser(@Param('id', ParseIntPipe) id: number) {
    return this.userService.findById(id);
  }

  @Put('/:id')
  @UseGuards(new RoleGuard(['user', 'admin', 'mod']))
  @UseGuards(AuthGuard)
  async updateUser(
    @Param('id', ParseIntPipe) id: number,
    @Body() requestBody: UpdateUserDto,
    @CurrentUser() currentUser: User,
  ) {
    return this.userService.updateById(id, requestBody, currentUser);
  }

  @Delete('/:id')
  @UseGuards(new RoleGuard(['user', 'admin', 'mod']))
  @UseGuards(AuthGuard)
  deleteUser(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() currentUser: User,
  ) {
    return this.userService.deleteById(id, currentUser);
  }

  @Post('/register')
  registerUser(@Body() requestBody: RegisterUserDto) {
    return this.authService.register(requestBody);
  }

  @Post('/login')
  loginUser(@Body() requestBody: LoginUserDto) {
    return this.authService.login(requestBody);
  }
}
