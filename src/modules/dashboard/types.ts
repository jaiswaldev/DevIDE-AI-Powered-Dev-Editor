import { Playground as PrismaPlayground, User as PrismaUser } from "@prisma/client";

export type Playground = PrismaPlayground & {
  user: PrismaUser;
};

export type PlaygroundWithUser = Playground;

export enum Templates {
  REACT = "REACT",
  NEXTJS = "NEXTJS",
  EXPRESS = "EXPRESS",
  VUE = "VUE",
  HONO = "HONO",
  ANGULAR = "ANGULAR",
}

export interface FormattedPlayground {
  id: string;
  name: string;
  starred: boolean;
  icon: string;
}
