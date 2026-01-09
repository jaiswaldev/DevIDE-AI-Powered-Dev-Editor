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


export interface User{
  id: string
  name: string
  email: string
  image: string
  role: string
  createdAt: Date
  updatedAt: Date

}

export interface Project{
   id: string
   title: string
   description: string
   template: string
   createdAt: Date
   updatedAt: Date
   userId: string
   user: User
   Starmark: {isMarked: boolean} []
}
