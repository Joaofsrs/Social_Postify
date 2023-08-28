-- CreateTable
CREATE TABLE "Medias" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "username" TEXT NOT NULL,

    CONSTRAINT "Medias_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Posts" (
    "id" SERIAL NOT NULL,
    "text" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "image" TEXT,

    CONSTRAINT "Posts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Publications" (
    "id" SERIAL NOT NULL,
    "mediaId" INTEGER NOT NULL,
    "postId" INTEGER NOT NULL,
    "date" TEXT NOT NULL,

    CONSTRAINT "Publications_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Publications" ADD CONSTRAINT "Publications_mediaId_fkey" FOREIGN KEY ("mediaId") REFERENCES "Medias"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Publications" ADD CONSTRAINT "Publications_postId_fkey" FOREIGN KEY ("postId") REFERENCES "Posts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
