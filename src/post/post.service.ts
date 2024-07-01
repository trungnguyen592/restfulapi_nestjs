import { Injectable } from '@nestjs/common';
import { Post } from './post.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CreatePostDto } from './dtos/createPost.dto';
import { User } from 'src/user/user.entity';

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
  findAll() {
    return this.postRepository.find();
  }

  findById(title: string) {
    return this.postRepository.findOneBy({ title });
  }
}
