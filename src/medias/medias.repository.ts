import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateMediaDto } from './dto/create-media.dto';
import { UpdateMediaDto } from './dto/update-media.dto';

@Injectable()
export class MediasRepository {

  constructor(private readonly prisma: PrismaService) { }

  async createMedia(createMediaDto: CreateMediaDto) {
    return await this.prisma.medias.create({
      data: createMediaDto
    });
  }

  async getMedia() {
    return await this.prisma.medias.findMany({});
  }

  async getMediaById(id: number) {
    return await this.prisma.medias.findFirst({
      where: {
        id
      }
    });
  }

  async updateMedia(id: number, updateMediaDto: UpdateMediaDto) {
    return await this.prisma.medias.update({
      data: updateMediaDto,
      where:{ id }
    });
  }

  async deleteMedia(id: number) {
    return await this.prisma.medias.delete({
      where:{ id }
    });
  }

  async getMediaByUsername(username: string) {
    return await this.prisma.medias.findFirst({
      where: {
        username
      }
    });
  }
}
