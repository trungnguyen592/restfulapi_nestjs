import { Module } from '@nestjs/common';
import { PostService } from './post.service';
import { PostController } from './post.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Post } from './post.entity';
import { User } from 'src/user/user.entity';
import { UserService } from 'src/user/user.service';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Post]),
    JwtModule.register({
      secret: 'my_jwt_secret_key',
      signOptions: { expiresIn: '1d' },
    }),
  ],
  providers: [PostService, UserService],
  controllers: [PostController],
})
export class PostModule {}
