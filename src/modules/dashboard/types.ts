import { Playground as PrismaPlayground, User as PrismaUser, StarMark as PrismaStarMark } from "@prisma/client";

export type Playground = PrismaPlayground & {
  user: PrismaUser;
  StarMark?: PrismaStarMark[];
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


export interface User{
  id: string
  name: string | null
  email: string
  image: string | null
  role: string
  createdAt: Date
  updatedAt: Date

}

export interface Project{
   id: string
   title: string
   description: string | null
   template: string
   createdAt: Date
   updatedAt: Date
   userId: string
   user: User
   Starmark?: {isMarked: boolean} []
}
