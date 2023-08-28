import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { PrismaService } from '../src/prisma/prisma.service';

describe('AppController (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

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

  //-----MEDIAS------
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
    const media = await prisma.medias.create({
      data: {
        title: "Instagram",
        username: "myusername"
      }
    })

    await request(app.getHttpServer())
      .post('/medias')
      .send({
        title: "Instagram",
        username: "myusername"
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
    const media = await prisma.medias.create({
      data: {
        title: "Instagram",
        username: "myusername"
      }
    })
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
    const media = await prisma.medias.create({
      data: {
        title: "Instagram",
        username: "myusername"
      }
    })
    const saida = await request(app.getHttpServer())
      .get(`/medias/${media.id + 1}`)
      .expect(404);
      
    return saida;      
  });

  it('/medias/:id (GET) com media no banco', async () => {
    const media = await prisma.medias.create({
      data: {
        title: "Instagram",
        username: "myusername"
      }
    })
    const saida = await request(app.getHttpServer())
      .get(`/medias/${media.id}`)
      .expect(200)
      .expect(media);
      
    return saida;      
  });

  it('/medias/:id (PUT) alterando para dois medias iguais', async () => {
    const mediaCreate = await prisma.medias.create({
      data: {
        title: "Instagram",
        username: "myusername"
      }
    })

    const mediaCreate2 = await prisma.medias.create({
      data: {
        title: "Instagram2",
        username: "myusername2"
      }
    })

    await request(app.getHttpServer())
      .put(`/medias/${mediaCreate2.id}`)
      .send({
        title: "Instagram",
        username: "myusername"
      })
      .expect(409)
    
    const medias = await prisma.medias.findMany();
    expect(medias).toEqual([
      mediaCreate, 
      mediaCreate2
    ]);
  });

  it('/medias/:id (PUT) mediaId não existente', async () => {
    const mediaCreate = await prisma.medias.create({
      data: {
        title: "Instagram",
        username: "myusername"
      }
    })

    await request(app.getHttpServer())
      .put(`/medias/${mediaCreate.id + 1}`)
      .send({
        title: "Instagram",
        username: "myusername"
      })
      .expect(404)
    
    
  });

  it('/medias/:id (PUT) Sucesso', async () => {
    const mediaCreate = await prisma.medias.create({
      data: {
        title: "Instagram",
        username: "myusername"
      }
    })

    await request(app.getHttpServer())
      .put(`/medias/${mediaCreate.id}`)
      .send({
        title: "Instagram2",
        username: "myusername"
      })
      .expect(200)
    
    const medias = await prisma.medias.findMany();
    expect(medias).toHaveLength(1);
    const media = medias[0];
    expect(media).toEqual({
      id: mediaCreate.id,
      title: "Instagram2",
      username: "myusername"
    });
  });

  it('/medias/:id (DELETE) mediaId não existente', async () => {
    const mediaCreate = await prisma.medias.create({
      data: {
        title: "Instagram",
        username: "myusername"
      }
    })

    await request(app.getHttpServer())
      .delete(`/medias/${mediaCreate.id +1}`)
      .expect(404)
    
    const medias = await prisma.medias.findMany();
    expect(medias).toHaveLength(1);
    const media = medias[0];
    expect(media).toEqual(mediaCreate);
  });

  it('/medias/:id (DELETE) Sucesso', async () => {
    const mediaCreate = await prisma.medias.create({
      data: {
        title: "Instagram",
        username: "myusername"
      }
    })

    await request(app.getHttpServer())
      .delete(`/medias/${mediaCreate.id}`)
      .expect(200)
    
    const medias = await prisma.medias.findMany();
    expect(medias).toEqual([]);
  });

});
