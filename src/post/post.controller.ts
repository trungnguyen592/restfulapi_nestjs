import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Post,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { PostService } from './post.service';
import { CreatePostDto } from './dtos/createPost.dto';
import { CurrentUser } from 'src/user/decorators/currentUser.decorators';
import { User } from 'src/user/user.entity';
import { AuthGuard } from 'src/guards/auth.guard';

@Controller('api/v1/post')
@UseInterceptors(ClassSerializerInterceptor)
export class PostController {
  constructor(private postService: PostService) {}

  @Post()
  @UseGuards(AuthGuard)
  createPost(
    @Body() requetstBody: CreatePostDto,
    @CurrentUser() currentUser: User,
  ) {
    return this.postService.create(requetstBody, currentUser);
  }
}
