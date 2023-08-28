import { PrismaService } from '../../src/prisma/prisma.service';
import { faker } from '@faker-js/faker';

export class PostsFactory {
    static async build(prisma: PrismaService) {
        return await prisma.posts.create({
            data: {
                title: faker.company.name(),
                text: faker.lorem.sentence(),
                image: faker.image.avatarLegacy()
            },
        });
    }
}