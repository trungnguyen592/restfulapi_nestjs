import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { User } from './user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { Post } from 'src/post/post.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Post]),
    JwtModule.register({
      secret: 'my_jwt_secret_key',
      signOptions: { expiresIn: '1d' },
    }),
  ],
  providers: [UserService, AuthService],
  controllers: [UserController],
})
export class UserModule {}
