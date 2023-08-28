import { Injectable, NotFoundException } from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { PostsRepository } from './posts.repository';
import { NotFoundError } from 'rxjs';

@Injectable()
export class PostsService {

  constructor(private readonly postsRepository: PostsRepository) { }

  async create(createPostDto: CreatePostDto) {
    return await this.postsRepository.createPost(createPostDto);
  }

  async findAll() {
    return await this.postsRepository.getPost();
  }

  async findOne(id: number) {
    const posts = await this.postsRepository.getPostById(id);
    if (!posts) {
      throw new NotFoundException();
    }
    return posts;
  }

  async update(id: number, updatePostDto: UpdatePostDto) {
    const post = await this.postsRepository.getPostById(id);
    if (!post) {
      throw new NotFoundException();
    }
    return await this.postsRepository.updatePost(id, updatePostDto);
  }

  async remove(id: number) {
    const post = await this.postsRepository.getPostById(id);
    if (!post) {
      throw new NotFoundException();
    }
    return await this.postsRepository.deletePost(id);
  }
}
