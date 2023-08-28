import * as dayjs from 'dayjs'
import { PrismaService } from '../../src/prisma/prisma.service';

export class PublicationsFactory {
    static async build(prisma: PrismaService, mediaId: number, postId: number) {
        return await prisma.publications.create({
            data: {
                mediaId,
                postId,
                date: dayjs().add(4, 'day').toDate().toISOString(),
            },
        });
    }
}