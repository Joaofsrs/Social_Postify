import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MediasModule } from './medias/medias.module';
import { PublicationsModule } from './publications/publications.module';
import { PostsModule } from './posts/posts.module';
import { TesteModule } from './teste/teste.module';
import { MediasModule } from './medias/medias.module';

@Module({
  imports: [MediasModule, TesteModule, PostsModule, PublicationsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
