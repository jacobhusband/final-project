set client_min_messages to warning;

-- DANGER: this is NOT how to do it in the real world.
-- `drop schema` INSTANTLY ERASES EVERYTHING.
drop schema "public" cascade;

create schema "public";

CREATE TABLE "public"."accounts" (
	"accountId" serial NOT NULL,
	"username" TEXT NOT NULL UNIQUE,
	"hashedPassword" TEXT NOT NULL,
	"email" TEXT NOT NULL UNIQUE,
	"isEmailVerified" BOOLEAN NOT NULL,
	"joinedAt" timestamp with time zone default CURRENT_TIMESTAMP,
	CONSTRAINT "accounts_pk" PRIMARY KEY ("accountId")
) WITH (
  OIDS=FALSE
);



CREATE TABLE "public"."posts" (
	"postId" serial NOT NULL,
	"runId" int NOT NULL,
	"postedAt" timestamp with time zone default CURRENT_TIMESTAMP,
	"caption" TEXT NOT NULL,
  "beforeImageUrlOrder" int NOT NULL,
  "routeImageUrlOrder" int NOT NULL,
  "afterImageUrlOrder" int NOT NULL,
  "beforeImageShowing" boolean NOT NULL,
  "routeImageShowing" boolean NOT NULL,
  "afterImageShowing" boolean NOT NULL,
	CONSTRAINT "posts_pk" PRIMARY KEY ("postId")
) WITH (
  OIDS=FALSE
);



CREATE TABLE "public"."comments" (
	"accountId" int NOT NULL,
	"postId" int NOT NULL,
	"content" TEXT NOT NULL,
	"commentedAt" timestamp with time zone default CURRENT_TIMESTAMP
) WITH (
  OIDS=FALSE
);



CREATE TABLE "public"."likes" (
	"accountId" int NOT NULL,
	"postId" int NOT NULL
) WITH (
  OIDS=FALSE
);



CREATE TABLE "public"."saves" (
	"accountId" int NOT NULL,
	"postId" int NOT NULL
) WITH (
  OIDS=FALSE
);



CREATE TABLE "public"."runs" (
	"runId" serial NOT NULL,
	"accountId" int NOT NULL,
	"beforeImageUrl" TEXT NOT NULL,
	"afterImageUrl" TEXT NOT NULL,
	"routeImageUrl" TEXT NOT NULL,
	"distance" DECIMAL NOT NULL,
	"time" TEXT NOT NULL,
	"arrayOfCoords" json NOT NULL,
  "ranAt" timestamp with time zone default CURRENT_TIMESTAMP,
  "pace" TEXT NOT NULL,
	CONSTRAINT "runs_pk" PRIMARY KEY ("runId")
) WITH (
  OIDS=FALSE
);




ALTER TABLE "posts" ADD CONSTRAINT "posts_fk0" FOREIGN KEY ("runId") REFERENCES "runs"("runId");

ALTER TABLE "comments" ADD CONSTRAINT "comments_fk0" FOREIGN KEY ("accountId") REFERENCES "accounts"("accountId");
ALTER TABLE "comments" ADD CONSTRAINT "comments_fk1" FOREIGN KEY ("postId") REFERENCES "posts"("postId");

ALTER TABLE "likes" ADD CONSTRAINT "likes_fk0" FOREIGN KEY ("accountId") REFERENCES "accounts"("accountId");
ALTER TABLE "likes" ADD CONSTRAINT "likes_fk1" FOREIGN KEY ("postId") REFERENCES "posts"("postId");

ALTER TABLE "saves" ADD CONSTRAINT "saves_fk0" FOREIGN KEY ("accountId") REFERENCES "accounts"("accountId");
ALTER TABLE "saves" ADD CONSTRAINT "saves_fk1" FOREIGN KEY ("postId") REFERENCES "posts"("postId");

ALTER TABLE "runs" ADD CONSTRAINT "runs_fk0" FOREIGN KEY ("accountId") REFERENCES "accounts"("accountId");
