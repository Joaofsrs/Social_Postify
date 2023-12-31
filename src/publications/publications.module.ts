import { Module } from '@nestjs/common';
import { PublicationsService } from './publications.service';
import { PublicationsController } from './publications.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { MediasModule } from '../medias/medias.module';
import { PostsModule } from '../posts/posts.module';
import { PublicationsRepository } from './publications.repository';
import { PostsRepository } from '../posts/posts.repository';
import { MediasRepository } from '../medias/medias.repository';

@Module({
  imports: [PrismaModule, MediasModule, PostsModule ],
  controllers: [PublicationsController],
  providers: [PublicationsService, PublicationsRepository, PostsRepository, MediasRepository],
})
export class PublicationsModule { }
