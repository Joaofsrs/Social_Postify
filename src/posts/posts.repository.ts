import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';

@Injectable()
export class MediasRepository {

  constructor(private readonly prisma: PrismaService) { }

  async createMedia(createPostDto: CreatePostDto) {
    return await this.prisma.posts.create({
      data: createPostDto
    });
  }

  async getMedia() {
    return await this.prisma.posts.findMany({});
  }

  async getMediaById(id: number) {
    return await this.prisma.posts.findFirst({
      where: {
        id
      }
    });
  }

  async updateMedia(id: number, updatePostDto: UpdatePostDto){
    return await this.prisma.posts.update({
      data: updatePostDto,
      where:{ id }
    });
  }

  async deleteMedia(id: number) {
    return await this.prisma.posts.delete({
      where:{ id }
    });
  }
}
