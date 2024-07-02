import { Injectable, NotFoundException } from '@nestjs/common';
import { Post } from './post.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CreatePostDto } from './dtos/createPost.dto';
import { User } from 'src/user/user.entity';
import { UpdatePostDto } from './dtos/updatePost.dto';
import { Permission } from 'src/check.ts/checkPermission';

@Injectable()
export class PostService {
  constructor(
    @InjectRepository(Post) private postRepository: Repository<Post>,
  ) {}
  //CRUD
  create(requestBody: CreatePostDto, currentUser: User) {
    const post = this.postRepository.create(requestBody);
    post.user = currentUser;
    return this.postRepository.save(post);
  }
  getAll() {
    return this.postRepository.find();
  }

  getById(id: number) {
    return this.postRepository.findOneBy({ id });
  }

  async updatePost(id: number, requestBody: UpdatePostDto, currentUser: User) {
    let post = await this.getById(id);

    if (!post) {
      throw new NotFoundException('Not found post with this id');
    }
    post = { ...post, ...requestBody };
    return this.postRepository.save(post);
  }

  async deleteById(id: number, currentUser: User) {
    const post = await this.getById(id);

    if (!post) {
      throw new NotFoundException('User doesnt exist');
    }
    return this.postRepository.remove(post);
  }
}
