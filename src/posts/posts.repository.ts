import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';

@Injectable()
export class PostsRepository {

  constructor(private readonly prisma: PrismaService) { }

  async createPost(createPostDto: CreatePostDto) {
    return await this.prisma.posts.create({
      data: createPostDto
    });
  }

  async getPost() {
    return await this.prisma.posts.findMany({});
  }

  async getPostById(id: number) {
    return await this.prisma.posts.findFirst({
      where: {
        id
      }
    });
  }

  async updatePost(id: number, updatePostDto: UpdatePostDto){
    return await this.prisma.posts.update({
      data: updatePostDto,
      where:{ id }
    });
  }

  async deletePost(id: number) {
    return await this.prisma.posts.delete({
      where:{ id }
    });
  }
}
