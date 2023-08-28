import { PrismaService } from '../../src/prisma/prisma.service';
import { faker } from '@faker-js/faker';

export class MediasFactory {
    static async build(prisma: PrismaService) {
        return await prisma.medias.create({
            data: {
                title: faker.company.name(),
                username: faker.company.catchPhrase(),
            },
        });
    }
}