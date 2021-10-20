import { UserServices } from '../services/user-services';
import { validationResult } from 'express-validator';
import { Errors } from '../exceptions/api-error';

export module UserController{
  const restorePasswordMessage = { status:true, data:{ head: 'Success', body: 'A new password has been sent to your email' } };
  const userDeletedMessage = { status:true, data:{ head: 'Success', body: 'User has been deleted' } };
  const registrationMessage = { status: true, data: { head: 'Success', body: 'User has been created, a conformation message has been sent to your email. Please confirm the registration and log in.' } };

  export async function registration(req:any, res:any, next:any){
    try {
      let errors = validationResult(req);
      if (!errors.isEmpty()){
        return next(Errors.ApiError.BadRequest({ head: 'Error', body:'Check the form correctenss' }, errors.array()));
      }
      let { email, password } = req.body;
      await UserServices.registration(email, password);
      return res.send(registrationMessage);
    } catch (e){
      next(e);
    }
  }

  export async function login(req:any, res:any, next:any){
    try {
      let { email, password } = req.body;
      let userData = await UserServices.login(email, password);
      return res.send(userData);
    } catch (e){
      next(e);
    }
  }

  export async function activate(req:any, res:any, next:any){
    try {
      let activationLink = req.params.link;
      UserServices.activate(activationLink);
      return res.redirect(process.env.CLIENT_URL);
    } catch (e){
      next(e);
    }
  }

  export async function logOut(req:any, res:any, next:any){
    try {
      let { refreshToken } = req.body;
      let token = await UserServices.logOut(refreshToken);
      return res.json(token);
    } catch (e){
      next(e);
    }
  }

  export async function refresh(req:any, res:any, next:any){
    try {
      const { refreshToken } = req.body;
      const userData = await UserServices.refresh(refreshToken);

      return res.json(userData);
    } catch (e){
      next(e);
    }
  }

  export async function getUsers(req:any, res:any, next:any){
    try {
      let allUsers = await UserServices.getUsers();
      return res.json(allUsers);
    } catch (e){
      next(e);
    }
  }

  export async function deleteUser(req:any, res:any, next:any){
    try {
      let email = req.body.email;
      UserServices.deleteUser(email);
      return res.send(userDeletedMessage);
    } catch (e){
      next(e);
    }
  }

  export async function restore(req:any, res:any, next:any){
    try {
      let email = req.body.email;
      await UserServices.restore(email);
      return res.send(restorePasswordMessage);
    } catch (e){
      next(e);
    }
  }
}
