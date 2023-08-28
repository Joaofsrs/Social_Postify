import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { CreatePublicationDto } from './dto/create-publication.dto';
import { UpdatePublicationDto } from './dto/update-publication.dto';
import { PublicationsRepository } from './publications.repository';
import { PostsRepository } from 'src/posts/posts.repository';
import { MediasRepository } from 'src/medias/medias.repository';

@Injectable()
export class PublicationsService {

  constructor(
    private readonly publicatoinnRepository: PublicationsRepository,
    private readonly postsRepository: PostsRepository,
    private readonly mediasReposotory: MediasRepository
  ) { }

  async create(createPublicationDto: CreatePublicationDto) {
    const media = await this.mediasReposotory.getMediaById(createPublicationDto.mediaId);
    if(!media){
      throw new NotFoundException();
    }
    const post = await this.postsRepository.getPostById(createPublicationDto.postId);
    if(!post){
      throw new NotFoundException();
    }
    return await this.publicatoinnRepository.createPublication(createPublicationDto);
  }

  async findAll() {
    return await this.publicatoinnRepository.getPublication();
  }

  async findOne(id: number) {
    const publication = await this.publicatoinnRepository.getPublicationById(id);
    if(!publication){
      throw new NotFoundException();
    }
    return publication;
  }

  async update(id: number, updatePublicationDto: UpdatePublicationDto) {
    const publication = await this.publicatoinnRepository.getPublicationById(id);
    if(!publication){
      throw new NotFoundException();
    } 
    const timeElapsed = Date.now();
    const today = new Date(timeElapsed);
    const datePublication = new Date(publication.date);
    if(datePublication <= today){
      console.log("já foi publicado");
      throw new ForbiddenException();
    }
    const media = await this.mediasReposotory.getMediaById(updatePublicationDto.mediaId);
    if(!media){
      throw new NotFoundException();
    }
    const post = await this.postsRepository.getPostById(updatePublicationDto.postId);
    if(!post){
      throw new NotFoundException();
    }
    return await this.publicatoinnRepository.updatePublication(id, updatePublicationDto);
  }

  async remove(id: number) {
    const publication = await this.publicatoinnRepository.getPublicationById(id);
    if(!publication){
      throw new NotFoundException();
    }
    return await this.publicatoinnRepository.deletePublication(id);
  }
}
