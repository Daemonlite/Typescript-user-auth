
import { Request, Response, NextFunction } from 'express';
import jwt, { VerifyCallback } from 'jsonwebtoken';

const verifyToken = (req: Request, res: Response, next: NextFunction): void => {
  const authHeader = req.headers.token as string;
  if (authHeader) {
    const token = authHeader.split(' ')[1];
    jwt.verify(token, process.env.SECRET || 'hesdfuytdrtjryjy', (err: any, user: any) => {
      if (err) {
        res.status(403).json('Token is not valid!');
      } else {
        req.user  = user;
        next();
      }
    });
  } else {
    res.status(401).json('You are not authenticated!');
  }
};

export { verifyToken };
