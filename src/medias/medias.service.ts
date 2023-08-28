import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateMediaDto } from './dto/create-media.dto';
import { UpdateMediaDto } from './dto/update-media.dto';
import { MediasRepository } from './medias.repository';

@Injectable()
export class MediasService {

  constructor(private readonly mediasRepository: MediasRepository) { }

  async create(createMediaDto: CreateMediaDto) {
    const media = await this.mediasRepository.getMediaByUsername(createMediaDto.username);
    if (media.title === createMediaDto.title) {
      throw new ConflictException();
    }
    return await this.mediasRepository.createMedia(createMediaDto);
  }

  async findAll() {
    return await this.mediasRepository.getMedia();
  }

  async findOne(id: number) {
    const media = await this.mediasRepository.getMediaById(id);
    if (!media) {
      throw new NotFoundException();
    }
    return media;
  }

  async update(id: number, updateMediaDto: UpdateMediaDto) {
    const media = await this.mediasRepository.getMediaById(id);
    if (!media) {
      throw new NotFoundException();
    }
    const mediaByUsername = await this.mediasRepository.getMediaByUsername(updateMediaDto.username);
    if (mediaByUsername.title === updateMediaDto.title) {
      throw new ConflictException();
    }
    return this.mediasRepository.updateMedia(id, updateMediaDto);
  }

  async remove(id: number) {
    const media = await this.mediasRepository.getMediaById(id);
    if (!media) {
      throw new NotFoundException();
    }
    return this.mediasRepository.deleteMedia(id);
  }
}
