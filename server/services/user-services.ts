import bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';
import { EmailService } from './email-services';
import { TokenService } from './token-services';
import { DataServices } from './data-services';
import { Errors } from '../exceptions/api-error';

export module UserServices{
  export async function registration(email: string, password: string){
    let candidate = DataServices.getOneUser(email);
    if (candidate != null){
      throw Errors.ApiError.BadRequest({ head: 'User already exists', body: 'This email is already in use, either use another email or use the restore password form.' });
    } else {
      let hashPassword = await bcrypt.hash(password, 3);
      let activationLink = uuidv4();
      let user = { email, hashPassword, isActive: false, activationLink, logs: [`Registered: ${new Date()}`] };
      await EmailService.sendActivation(email, `${process.env.API_URL}/activate/${activationLink}`);
      DataServices.addUser(JSON.stringify({ user }));
      return { user };
    }
  }

  export async function login(email: string, password: string){
    let user = DataServices.getOneUser(email);
    if (!user){
      throw Errors.ApiError.BadRequest({ head: 'Error', body:'No such user found' });
    }
    let isPassEqual = await bcrypt.compare(password, user.user.hashPassword);
    if (!isPassEqual){
      throw Errors.ApiError.BadRequest({ head: 'Error', body:'Wrong password' });
    }
    let data = { email: user.user.email, isActive: user.user.isActive };
    let tokens = TokenService.generateTokens(email);
    DataServices.createTokens(user, tokens);
    return { ...tokens, status:true, data };
  }

  export async function activate(activationLink:string){
    try {
      DataServices.activateUser(activationLink);
    } catch (e:any){
      throw Errors.ApiError.BadRequest(e);
    }
  }

  export async function logOut(refreshToken: any){
    let token = await TokenService.removeToken(refreshToken);
    return token;
  }

  export async function refresh(refreshToken:string){
    if (!refreshToken){
      throw Errors.ApiError.UnauthorizedError();
    }
    let userData = TokenService.validateRefreshToken(refreshToken);
    let { user, tokens } = DataServices.findToken(refreshToken);
    if (!userData || !tokens.refreshToken){
      throw Errors.ApiError.UnauthorizedError();
    }
    let newTokens = TokenService.generateTokens(user.email);
    DataServices.refreshToken(refreshToken, newTokens);
    return { newTokens, user };

  }

  export async function getUsers(){
    let allUsers = DataServices.getAllUsers();
    let users: Array<{ name:string, logs:Array<string> }> = [];
    allUsers.forEach((user:any) => {
      users.push({ name: user.user.email, logs: user.user.logs });
    });
    return users;
  }

  function generateRandomPassword(){
    let result:string = '';
    let characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for (let i = 0; i < 10; i++ ) {
      result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
  }


  export async function restore(email: string){
    let newPassword = generateRandomPassword();
    await DataServices.changePassword(email, newPassword);
    EmailService.sendRestore(email, newPassword);
  }

  export async function deleteUser(email: string){
    DataServices.deleteUser(email);
    EmailService.userDeleted(email);
  }

}
