import { PrismaClient } from "@prisma/client"
import { Request, Response } from 'express';

export interface Context {
  prisma: PrismaClient
  req: Request
  res: Response
  user: User
}

export interface User {
  id: number,
  email: string
}
