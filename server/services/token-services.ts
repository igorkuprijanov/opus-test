import jwt from 'jsonwebtoken';
import { DataServices } from './data-services';

export module TokenService{
  export function generateTokens(payload:string){
    let accessToken = jwt.sign({ payload }, process.env.JWT_ACCESS_SECRET as string, { expiresIn: '5s' });
    let refreshToken = jwt.sign({ payload }, process.env.JWT_REFRESH_SECRET as string, { expiresIn: '30d' });
    return {
      accessToken,
      refreshToken,
    };
  }

  export async function removeToken(refreshToken:any){
    let token = DataServices.deleteRefreshToken(refreshToken);
    return token;
  }

  export function validateToken(token: string){
    try {
      let userData = jwt.verify(token, process.env.JWT_ACCESS_SECRET as string);
      return userData;
    } catch (e){
      return null;
    }
  }

  export function validateRefreshToken(token: string){
    try {
      let userData = jwt.verify(token, process.env.JWT_REFRESH_SECRET as string);
      return userData;
    } catch (e){
      return null;
    }
  }
}
