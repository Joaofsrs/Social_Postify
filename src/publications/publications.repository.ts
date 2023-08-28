import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePublicationDto } from './dto/create-publication.dto';
import { UpdatePublicationDto } from './dto/update-publication.dto';

@Injectable()
export class PublicationsRepository {

  constructor(private readonly prisma: PrismaService) { }

  async createPublication(createPublicationDto: CreatePublicationDto) {
    return await this.prisma.publications.create({
      data: createPublicationDto
    });
  }

  async getPublication() {
    return await this.prisma.publications.findMany({});
  }

  async getPublicationById(id: number) {
    return await this.prisma.publications.findFirst({
      where: {
        id
      }
    });
  }

  async updatePublication(id: number, updatePublicationDto: UpdatePublicationDto){
    return await this.prisma.publications.update({
      data: updatePublicationDto,
      where:{ id }
    });
  }

  async deletePublication(id: number) {
    return await this.prisma.publications.delete({
      where:{ id }
    });
  }
}
