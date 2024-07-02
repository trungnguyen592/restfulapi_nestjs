import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { PostService } from './post.service';
import { CreatePostDto } from './dtos/createPost.dto';
import { CurrentUser } from 'src/user/decorators/currentUser.decorators';
import { User } from 'src/user/user.entity';
import { AuthGuard } from 'src/guards/auth.guard';
import { UpdatePostDto } from './dtos/updatePost.dto';

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

  @Get()
  getAllPosts() {
    return this.postService.getAll();
  }

  @Get('/:id')
  getPost(@Param('id', ParseIntPipe) id: number) {
    return this.postService.getById(id);
  }

  @Put('/:id')
  @UseGuards(AuthGuard)
  updatePost(
    @Param('id', ParseIntPipe) id: number,
    @Body() requestBody: UpdatePostDto,
    @CurrentUser() currentUser: User,
  ) {
    return this.postService.updatePost(id, requestBody, currentUser);
  }

  @Delete('/:id')
  @UseGuards(AuthGuard)
  deletePost(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() currentUser: User,
  ) {
    return this.postService.deleteById(id, currentUser);
  }
}
