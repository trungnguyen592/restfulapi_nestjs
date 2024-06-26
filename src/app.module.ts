import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user/user.entity';
import { PostModule } from './post/post.module';
import { Post } from './post/post.entity';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: '05092002',
      database: 'learn',
      entities: [User, Post],
      synchronize: true, // Chỉ nên đồng bộ hóa trong môi trường development
      // Chỉ định các phụ thuộc để NestJS tiêm vào useFactory
    }),
    TypeOrmModule.forFeature([User]), // Đảm bảo module này biết về thực thể User
    UserModule,
    PostModule,
    JwtModule.register({
      secret: 'my_jwt_secret_key',
      signOptions: { expiresIn: '1d' },
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
