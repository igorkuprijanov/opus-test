import { Errors } from '../exceptions/api-error';

export module ErrMiddleware{
  export function handleError(err:any, req:any, res:any, next:any){ // eslint-disable-line
    console.log(err);
    if (err instanceof Errors.ApiError){
      return res.status(err.code).send(err);
    }
    return res.status(500).json({ head: 'server error', body:'internal server error' });
  }
}
