import * as jwt from 'jsonwebtoken';
import * as express from 'express';

interface ExpressRequest extends express.Request {
  user?: any;
}

// Middleware function to check if the request is authorized
export const authenticateJWT = (
  req: ExpressRequest,
  res: express.Response,
  next: express.NextFunction
) => {
  const authHeader = req.headers.authorization;

  if (authHeader) {
    const token = authHeader.split(' ')[1]; // Bearer <token>
    const secretKey = 'your_secret_key';

    jwt.verify(token, secretKey, (err: any, user: any) => {
      if (err) {
        return res.sendStatus(403); // Forbidden
      }

      req.user = user;
      next();
    });
  } else {
    res.sendStatus(401); // Unauthorized
  }
};

// Generate a new JWT token
export const generateToken = (user: any) => {
  const secretKey = 'your_secret_key';

  return jwt.sign(user, secretKey);
};


