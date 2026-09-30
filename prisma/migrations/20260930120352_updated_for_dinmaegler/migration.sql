/*
  Warnings:

  - You are about to drop the `Post` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the column `altText` on the `Image` table. All the data in the column will be lost.
  - The primary key for the `Message` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `Subscriber` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "Post";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "Home" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "slug" TEXT NOT NULL,
    "energylabel" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "price" INTEGER NOT NULL,
    "gross" INTEGER NOT NULL,
    "netto" INTEGER NOT NULL,
    "payment" INTEGER NOT NULL,
    "cost" INTEGER NOT NULL,
    "rooms" TEXT NOT NULL,
    "livingspace" INTEGER NOT NULL,
    "basementsize" INTEGER NOT NULL,
    "lotsize" INTEGER NOT NULL,
    "address1" TEXT NOT NULL,
    "address2" TEXT NOT NULL,
    "postalcode" INTEGER NOT NULL,
    "city" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "built" INTEGER NOT NULL,
    "remodel" INTEGER NOT NULL,
    "lat" REAL NOT NULL,
    "long" REAL NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "floorplanImgId" TEXT NOT NULL,
    "agentId" TEXT NOT NULL,
    CONSTRAINT "Home_floorplanImgId_fkey" FOREIGN KEY ("floorplanImgId") REFERENCES "Image" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Home_agentId_fkey" FOREIGN KEY ("agentId") REFERENCES "Agent" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Agent" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "imageId" TEXT NOT NULL,
    CONSTRAINT "Agent_imageId_fkey" FOREIGN KEY ("imageId") REFERENCES "Image" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "_GalleryImages" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,
    CONSTRAINT "_GalleryImages_A_fkey" FOREIGN KEY ("A") REFERENCES "Home" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_GalleryImages_B_fkey" FOREIGN KEY ("B") REFERENCES "Image" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "_UserHomes" (
    "A" TEXT NOT NULL,
    "B" INTEGER NOT NULL,
    CONSTRAINT "_UserHomes_A_fkey" FOREIGN KEY ("A") REFERENCES "Home" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_UserHomes_B_fkey" FOREIGN KEY ("B") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Image" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "path" TEXT NOT NULL,
    "width" INTEGER NOT NULL,
    "height" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "new_Image" ("createdAt", "height", "id", "path", "width") SELECT "createdAt", "height", "id", "path", "width" FROM "Image";
DROP TABLE "Image";
ALTER TABLE "new_Image" RENAME TO "Image";
CREATE TABLE "new_Message" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "subject" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "new_Message" ("createdAt", "email", "id", "message", "name", "subject") SELECT "createdAt", "email", "id", "message", "name", "subject" FROM "Message";
DROP TABLE "Message";
ALTER TABLE "new_Message" RENAME TO "Message";
CREATE TABLE "new_Subscriber" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "email" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "new_Subscriber" ("createdAt", "email", "id") SELECT "createdAt", "email", "id" FROM "Subscriber";
DROP TABLE "Subscriber";
ALTER TABLE "new_Subscriber" RENAME TO "Subscriber";
CREATE UNIQUE INDEX "Subscriber_email_key" ON "Subscriber"("email");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE UNIQUE INDEX "_GalleryImages_AB_unique" ON "_GalleryImages"("A", "B");

-- CreateIndex
CREATE INDEX "_GalleryImages_B_index" ON "_GalleryImages"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_UserHomes_AB_unique" ON "_UserHomes"("A", "B");

-- CreateIndex
CREATE INDEX "_UserHomes_B_index" ON "_UserHomes"("B");
