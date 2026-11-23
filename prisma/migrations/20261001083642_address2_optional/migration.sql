-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Home" (
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
    "address2" TEXT,
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
INSERT INTO "new_Home" ("address1", "address2", "agentId", "basementsize", "built", "city", "cost", "createdAt", "description", "energylabel", "floorplanImgId", "gross", "id", "lat", "livingspace", "long", "lotsize", "netto", "payment", "postalcode", "price", "remodel", "rooms", "slug", "type") SELECT "address1", "address2", "agentId", "basementsize", "built", "city", "cost", "createdAt", "description", "energylabel", "floorplanImgId", "gross", "id", "lat", "livingspace", "long", "lotsize", "netto", "payment", "postalcode", "price", "remodel", "rooms", "slug", "type" FROM "Home";
DROP TABLE "Home";
ALTER TABLE "new_Home" RENAME TO "Home";
CREATE UNIQUE INDEX "Home_slug_key" ON "Home"("slug");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
