import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { PrismaService } from '../src/prisma/prisma.service';
import { MediasModule } from '../src/medias/medias.module';
import { PostsModule } from '../src/posts/posts.module';
import { PublicationsModule } from '../src/publications/publications.module';
import { MediasFactory } from './factory/medias.factory';
import { PostsFactory } from './factory/posts.factory';
import { PublicationsFactory } from './factory/publications.factory';
import * as dayjs from 'dayjs'

describe('AppController (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule, MediasModule, PostsModule, PublicationsModule],
    })
      .overrideProvider(PrismaService)
      .useValue(prisma)
      .compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe())
    prisma = await moduleFixture.resolve(PrismaService);

    await prisma.publications.deleteMany();
    await prisma.medias.deleteMany();
    await prisma.posts.deleteMany();

    await app.init();
  });

  it('/health (GET)', () => {
    return request(app.getHttpServer())
      .get('/health')
      .expect(200)
      .expect("I’m okay!");
  });

  describe('Medias Test', () => {
    it('/medias (POST) faltando argumentos', async () => {
      await request(app.getHttpServer())
        .post('/medias')
        .send({
          username: "myusername"
        })
        .expect(400)

      const medias = await prisma.medias.findMany();
      expect(medias).toEqual([]);
    });

    it('/medias (POST) media já existente', async () => {
      const media = await MediasFactory.build(prisma);

      await request(app.getHttpServer())
        .post('/medias')
        .send({
          title: media.title,
          username: media.username
        })
        .expect(409)

      const medias = await prisma.medias.findMany();
      expect(medias).toHaveLength(1);
    });

    it('/medias (POST) com todos os argumentos', async () => {
      await request(app.getHttpServer())
        .post('/medias')
        .send({
          title: "Instagram",
          username: "myusername"
        })
        .expect(201)

      const medias = await prisma.medias.findMany();
      expect(medias).toHaveLength(1);
      const media = medias[0];
      expect(media).toEqual({
        id: expect.any(Number),
        title: "Instagram",
        username: "myusername"
      });
    });

    it('/medias (GET) com media no banco', async () => {
      const media = await MediasFactory.build(prisma);

      const saida = await request(app.getHttpServer())
        .get('/medias')
        .expect(200)
        .expect([media]);

      return saida;
    });

    it('/medias (GET) sem media no banco', async () => {
      const saida = await request(app.getHttpServer())
        .get('/medias')
        .expect(200)
        .expect([]);

      return saida;
    });

    it('/medias/:id (GET) sem media no banco', async () => {
      const saida = await request(app.getHttpServer())
        .get('/medias/1')
        .expect(404);

      return saida;
    });

    it('/medias/:id (GET) com id errado', async () => {
      const media = await MediasFactory.build(prisma);

      const saida = await request(app.getHttpServer())
        .get(`/medias/${media.id + 1}`)
        .expect(404);

      return saida;
    });

    it('/medias/:id (GET) com media no banco', async () => {
      const media = await MediasFactory.build(prisma);

      const saida = await request(app.getHttpServer())
        .get(`/medias/${media.id}`)
        .expect(200)
        .expect(media);

      return saida;
    });

    it('/medias/:id (PUT) alterando para dois medias iguais', async () => {
      const mediaCreate = await MediasFactory.build(prisma);
      const mediaCreate2 = await MediasFactory.build(prisma);

      await request(app.getHttpServer())
        .put(`/medias/${mediaCreate2.id}`)
        .send({
          title: mediaCreate.title,
          username: mediaCreate.username
        })
        .expect(409)

      const medias = await prisma.medias.findMany();
      expect(medias).toEqual([
        mediaCreate,
        mediaCreate2
      ]);
    });

    it('/medias/:id (PUT) mediaId não existente', async () => {
      const mediaCreate = await MediasFactory.build(prisma);

      await request(app.getHttpServer())
        .put(`/medias/${mediaCreate.id + 1}`)
        .send({
          title: "Instagram",
          username: "myusername"
        })
        .expect(404)


    });

    it('/medias/:id (PUT) Sucesso', async () => {
      const mediaCreate = await MediasFactory.build(prisma);

      await request(app.getHttpServer())
        .put(`/medias/${mediaCreate.id}`)
        .send({
          title: "Instagram2",
          username: mediaCreate.username
        })
        .expect(200)

      const medias = await prisma.medias.findMany();
      expect(medias).toHaveLength(1);
      const media = medias[0];
      expect(media).toEqual({
        id: mediaCreate.id,
        title: "Instagram2",
        username: mediaCreate.username
      });
    });

    it('/medias/:id (DELETE) mediaId não existente', async () => {
      const mediaCreate = await MediasFactory.build(prisma);

      await request(app.getHttpServer())
        .delete(`/medias/${mediaCreate.id + 1}`)
        .expect(404)

      const medias = await prisma.medias.findMany();
      expect(medias).toHaveLength(1);
      const media = medias[0];
      expect(media).toEqual(mediaCreate);
    });

    it('/medias/:id (DELETE) Sucesso', async () => {
      const mediaCreate = await MediasFactory.build(prisma);

      await request(app.getHttpServer())
        .delete(`/medias/${mediaCreate.id}`)
        .expect(200)

      const medias = await prisma.medias.findMany();
      expect(medias).toEqual([]);
    });
  })

  describe('Posts Test', () => {

    it('/posts (POST) faltando argumentos', async () => {
      await request(app.getHttpServer())
        .post('/posts')
        .send({
          title: "Why you should have a guinea pig?"
        })
        .expect(400)

      const posts = await prisma.posts.findMany();
      expect(posts).toEqual([]);
    });

    it('/posts (POST) com todos os argumentos', async () => {

      await request(app.getHttpServer())
        .post('/posts')
        .send({
          title: "Why you should have a guinea pig?",
          text: "https://www.guineapigs.com/why-you-should-guinea",
          image: "https://www.devnews.com/dead-dev.jpg"
        })
        .expect(201)

      const posts = await prisma.posts.findMany();
      expect(posts).toHaveLength(1);
      const post = posts[0];
      expect(post).toEqual({
        id: expect.any(Number),
        title: "Why you should have a guinea pig?",
        text: "https://www.guineapigs.com/why-you-should-guinea",
        image: "https://www.devnews.com/dead-dev.jpg"
      });
    });

    it('/posts (GET) com post no banco', async () => {
      const postCreate = await PostsFactory.build(prisma);

      const saida = await request(app.getHttpServer())
        .get('/posts')
        .expect(200)
        .expect([postCreate]);

      return saida;
    });

    it('/posts (GET) sem post no banco', async () => {
      const saida = await request(app.getHttpServer())
        .get('/posts')
        .expect(200)
        .expect([]);

      return saida;
    });

    it('/posts/:id (GET) sem post no banco', async () => {
      const saida = await request(app.getHttpServer())
        .get('/posts/1')
        .expect(404);

      return saida;
    });

    it('/posts/:id (GET) com postId errado', async () => {
      const postCreate = await PostsFactory.build(prisma);

      const saida = await request(app.getHttpServer())
        .get(`/posts/${postCreate.id + 1}`)
        .expect(404);

      return saida;
    });

    it('/posts/:id (GET) com post no banco', async () => {
      const postCreate = await PostsFactory.build(prisma);

      const saida = await request(app.getHttpServer())
        .get(`/posts/${postCreate.id}`)
        .expect(200)
        .expect(postCreate);

      return saida;
    });

    it('/posts/:id (PUT) postId não existente', async () => {
      const postCreate = await PostsFactory.build(prisma);

      await request(app.getHttpServer())
        .put(`/posts/${postCreate.id + 1}`)
        .send({
          title: "Why pig?",
          text: "https://www.guineapigs.com/why-you-should-guinea",
          image: "https://www.devnews.com/dead-dev.jpg"
        })
        .expect(404)

      const posts = await prisma.posts.findMany();
      expect(posts).toHaveLength(1);
      const post = posts[0];
      expect(post).toEqual(postCreate);
    });

    it('/posts/:id (PUT) Sucesso', async () => {
      const postCreate = await PostsFactory.build(prisma);

      await request(app.getHttpServer())
        .put(`/posts/${postCreate.id}`)
        .send({
          title: "Why pig?",
          text: "https://www.guineapigs.com/why-you-should-guinea",
          image: "https://www.devnews.com/dead-dev.jpg"
        })
        .expect(200)

      const posts = await prisma.posts.findMany();
      expect(posts).toHaveLength(1);
      const post = posts[0];
      expect(post).toEqual({
        id: postCreate.id,
        title: "Why pig?",
        text: "https://www.guineapigs.com/why-you-should-guinea",
        image: "https://www.devnews.com/dead-dev.jpg"
      });
    });

    it('/posts/:id (DELETE) postId não existente', async () => {
      const postCreate = await PostsFactory.build(prisma);

      await request(app.getHttpServer())
        .delete(`/posts/${postCreate.id + 1}`)
        .expect(404)

      const posts = await prisma.posts.findMany();
      expect(posts).toHaveLength(1);
      const post = posts[0];
      expect(post).toEqual(postCreate);
    });

    it('/posts/:id (DELETE) Sucesso', async () => {
      const postCreate = await PostsFactory.build(prisma);

      await request(app.getHttpServer())
        .delete(`/posts/${postCreate.id}`)
        .expect(200)

      const posts = await prisma.posts.findMany();
      expect(posts).toEqual([]);
    });
  })
  
  describe('Publications Test', () => {
    it('/publications (POST) faltando argumentos', async () => {
      const mediaCreate = await MediasFactory.build(prisma);
      const postCreate = await PostsFactory.build(prisma);

      await request(app.getHttpServer())
        .post('/publications')
        .send({
          mediaId: mediaCreate.id,
          date: "2023-08-21T13:25:17.352Z"
        })
        .expect(400)

      const publications = await prisma.publications.findMany();
      expect(publications).toEqual([]);
    });

    it('/publications (POST) com todos os argumentos', async () => {
      const mediaCreate = await MediasFactory.build(prisma);
      const postCreate = await PostsFactory.build(prisma);

      await request(app.getHttpServer())
        .post('/publications')
        .send({
          mediaId: mediaCreate.id,
          postId: postCreate.id,
          date: dayjs().add(4, 'day').toDate().toISOString()
        })
        .expect(201)

      const publications = await prisma.publications.findMany();
      expect(publications).toHaveLength(1);
      const post = publications[0];
      expect(post).toEqual({
        id: expect.any(Number),
        mediaId: mediaCreate.id,
        postId: postCreate.id,
        date: expect.any(String)
      });
    });

    it('/publications (GET) com publication no banco', async () => {
      const mediaCreate = await MediasFactory.build(prisma);
      const postCreate = await PostsFactory.build(prisma);
      const publicationCreate = await PublicationsFactory.build(prisma, mediaCreate.id, postCreate.id);

      const saida = await request(app.getHttpServer())
        .get('/publications')
        .expect(200)
        .expect([publicationCreate]);

      return saida;
    });

    it('/publications (GET) sem publication no banco', async () => {
      const saida = await request(app.getHttpServer())
        .get('/publications')
        .expect(200)
        .expect([]);

      return saida;
    });

    it('/publications/:id (GET) sem publication no banco', async () => {
      const saida = await request(app.getHttpServer())
        .get('/publications/1')
        .expect(404);

      return saida;
    });

    it('/publications/:id (GET) com publicationId errado', async () => {
      const mediaCreate = await MediasFactory.build(prisma);
      const postCreate = await PostsFactory.build(prisma);
      const publicationCreate = await PublicationsFactory.build(prisma, mediaCreate.id, postCreate.id);

      const saida = await request(app.getHttpServer())
        .get(`/publications/${publicationCreate.id + 1}`)
        .expect(404);

      return saida;
    });

    it('/publications/:id (GET) com publication no banco', async () => {
      const mediaCreate = await MediasFactory.build(prisma);
      const postCreate = await PostsFactory.build(prisma);
      const publicationCreate = await PublicationsFactory.build(prisma, mediaCreate.id, postCreate.id);

      const saida = await request(app.getHttpServer())
        .get(`/publications/${publicationCreate.id}`)
        .expect(200)
        .expect(publicationCreate);

      return saida;
    });

    it('/publications/:id (PUT) publicationId não existente', async () => {
      const mediaCreate = await MediasFactory.build(prisma);
      const postCreate = await PostsFactory.build(prisma);
      const publicationCreate = await PublicationsFactory.build(prisma, mediaCreate.id, postCreate.id);

      await request(app.getHttpServer())
        .put(`/publications/${publicationCreate.id + 1}`)
        .send({
          mediaId: 1,
          postId: 1,
          date: "2023-08-21T13:25:17.352Z"
        })
        .expect(404)

      const publications = await prisma.publications.findMany();
      expect(publications).toHaveLength(1);
      const post = publications[0];
      expect(post).toEqual(publicationCreate);
    });

    it('/publications/:id (PUT) Sucesso', async () => {
      const mediaCreate = await MediasFactory.build(prisma);
      const postCreate = await PostsFactory.build(prisma);
      const publicationCreate = await PublicationsFactory.build(prisma, mediaCreate.id, postCreate.id);

      await request(app.getHttpServer())
        .put(`/publications/${publicationCreate.id}`)
        .send({
          mediaId: mediaCreate.id,
          postId: postCreate.id,
          date: dayjs().add(4, 'day').toDate().toISOString()
        })
        .expect(200)

      const publications = await prisma.publications.findMany();
      expect(publications).toHaveLength(1);
      const post = publications[0];
      expect(post).toEqual({
        id: publicationCreate.id,
        mediaId: mediaCreate.id,
        postId: postCreate.id,
        date: expect.any(String)
      });
    });

    it('/publications/:id (DELETE) publicationId não existente', async () => {
      const mediaCreate = await MediasFactory.build(prisma);
      const postCreate = await PostsFactory.build(prisma);
      const publicationCreate = await PublicationsFactory.build(prisma, mediaCreate.id, postCreate.id);

      await request(app.getHttpServer())
        .delete(`/publications/${publicationCreate.id + 1}`)
        .expect(404)

      const publications = await prisma.publications.findMany();
      expect(publications).toHaveLength(1);
      const post = publications[0];
      expect(post).toEqual(publicationCreate);
    });

    it('/publications/:id (DELETE) Sucesso', async () => {
      const mediaCreate = await MediasFactory.build(prisma);
      const postCreate = await PostsFactory.build(prisma);
      const publicationCreate = await PublicationsFactory.build(prisma, mediaCreate.id, postCreate.id);

      await request(app.getHttpServer())
        .delete(`/publications/${publicationCreate.id}`)
        .expect(200)

      const publications = await prisma.publications.findMany();
      expect(publications).toEqual([]);
    });
  })
});
