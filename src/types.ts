import {Request, Response} from 'express';

export interface Context {
  req: Request
  res: Response
  user: User
}

export interface User {
  id: number
  email: string
}

export interface UserTokenData {
  id: number,
  email: string,
  iat: number,
  exp: number
}
