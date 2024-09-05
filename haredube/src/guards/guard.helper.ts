import { instanceToPlain } from 'class-transformer';
import { decode } from 'jsonwebtoken';
export const getUserTokenByRequest = (request: any) => {
  try {
    const authHeader = request.headers['authorization'];
    const token = authHeader.split(/\s/)[1];
    const user = instanceToPlain(decode(token));
    return user;
  } catch (error) {
    return null;
  }
};
