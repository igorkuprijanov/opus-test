export module Errors{

  export class ApiError extends Error{

    code:number;

    errors:string;

    data:{ head:string, body:string };

    status: boolean;

    constructor(code:number, status:boolean, data:{ head: string, body:string }, errors?:any){
      super();
      this.code = code;
      this.data = data;
      this.errors = errors;
      this.status = status;
    }

    static UnauthorizedError(){
      return new ApiError(401, false, { head: 'Authorization error', body:'User is not authorized' });
    }

    static BadRequest(data:{ head:string, body:string }, errors?:any){
      return new ApiError(400, false, data, errors);
    }
  }

}
