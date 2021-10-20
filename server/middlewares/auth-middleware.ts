import { Errors } from '../exceptions/api-error';
import { TokenService } from '../services/token-services';

export module AuthMiddleware{
  export function handleAuth(req : any, res: any, next:any){
    try {
      let authorizationHeader = req.headers.authorization;
      if (!authorizationHeader){
        return next(Errors.ApiError.UnauthorizedError());
      }
      let accessToken = authorizationHeader.split(' ')[1];
      if (!accessToken){
        return next(Errors.ApiError.UnauthorizedError());
      }
      let userData = TokenService.validateToken(accessToken);
      if (!userData){
        return next(Errors.ApiError.UnauthorizedError());
      }
      req.user = userData;
      console.log('AUTHORIZED');
      next();
    } catch (e){
      return next(Errors.ApiError.UnauthorizedError());
    }
  }

}
