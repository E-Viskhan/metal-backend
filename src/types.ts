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

export interface UserTokenData extends User{
  iat: number,
  exp: number
}
