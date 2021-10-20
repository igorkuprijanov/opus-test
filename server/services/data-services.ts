import fs from 'fs';
import path from 'path';
import { Errors } from '../exceptions/api-error';
import bcrypt from 'bcrypt';


//write new data function would be nice


let file = path.resolve(__dirname, '../userData.json');
if (!fs.existsSync(file)){
  fs.appendFileSync(path.resolve(__dirname, '../userData.json'), '{"users":[]}');
}


export module DataServices{
  let rawData = fs.readFileSync(path.resolve(__dirname, '../userData.json'));
  let userData: any = JSON.parse(rawData.toString('utf8'));

  export function getOneUser(email:string){
    let user = userData.users.find((user:any)=>{return user.user.email === email ? user : null;});
    return user;
  }

  export function getAllUsers(){
    return userData.users;
  }
  export function addUser(newUser: string){
    userData.users.push(JSON.parse(newUser));
    let newRawData = Buffer.from(JSON.stringify(userData));
    fs.writeFileSync(path.resolve(__dirname, '../userData.json'), newRawData, { encoding: 'utf8' });
  }

  export function activateUser(activationLink:string){
    let modifiableUser = userData.users.find((user:any) => {return user.user.activationLink === activationLink ? user : null;});
    if (!modifiableUser){
      throw Errors.ApiError.BadRequest({ head: 'Error', body:'No user with such validation link' });
    } else if (modifiableUser.user.isActive){
      throw Errors.ApiError.BadRequest({ head: 'Error', body: 'User already active' });
    }
    modifiableUser.user.isActive = true;
    modifiableUser.user.logs.push(`Activated: ${new Date()}`);
    userData.users.splice(userData.users.indexOf(modifiableUser), 1);
    userData.users.push(modifiableUser);
    let newRawData = Buffer.from(JSON.stringify(userData));
    fs.writeFileSync(path.resolve(__dirname, '../userData.json'), newRawData, { encoding: 'utf8' });
  }

  export function deleteUser(email:string){
    let target = getOneUser(email);
    if (!target){
      throw Errors.ApiError.BadRequest({ head: 'Error', body:'User does not exist' });
    }
    userData.users.splice(userData.users.indexOf(target), 1);
    let newRawData = Buffer.from(JSON.stringify(userData));
    fs.writeFileSync(path.resolve(__dirname, '../userData.json'), newRawData, { encoding: 'utf8' });
  }

  export async function changePassword(email:string, newPassword:string){
    let user = getOneUser(email);
    if (!user){
      throw Errors.ApiError.BadRequest({ head: 'Error', body:'No user with this email found' });
    }
    user.user.hashPassword = await bcrypt.hash(newPassword, 3);
    user.user.logs.push(`Password changed: ${new Date()}`);
    userData.users.splice(userData.users.indexOf(user), 1);
    userData.users.push(user);
    let newRawData = Buffer.from(JSON.stringify(userData));
    fs.writeFileSync(path.resolve(__dirname, '../userData.json'), newRawData, { encoding: 'utf8' });
  }

  export function createTokens(target:any, tokens:any){
    userData.users.splice(userData.users.indexOf(target), 1);
    target.user.logs.push(`Login: ${new Date()}`);
    userData.users.push({ ...target, tokens });
    let newRawData = Buffer.from(JSON.stringify(userData));
    fs.writeFileSync(path.resolve(__dirname, '../userData.json'), newRawData, { encoding: 'utf8' });
  }

  export function deleteRefreshToken(refreshToken:any){
    let user = userData.users.find((user: any) => {return user.tokens?.refreshToken === refreshToken ? user : null;});
    if (!refreshToken){
      throw Errors.ApiError.BadRequest({ head: 'Error', body:'User with this token not found' });
    }
    let { tokens, ...newUser } = userData.users[userData.users.indexOf(user)];
    newUser.user.logs.push(`Logout: ${new Date()}`);
    userData.users.splice(userData.users.indexOf(user), 1);
    userData.users.push(newUser);
    let newRawData = Buffer.from(JSON.stringify(userData));
    fs.writeFileSync(path.resolve(__dirname, '../userData.json'), newRawData, { encoding: 'utf8' });
    return (tokens.refreshToken);
  }

  export function findToken(token:string){
    let data = userData.users.find((user:any)=>{return user.tokens?.refreshToken === token ? user : null;});
    return data;
  }

  export function refreshToken(token:string, newTokens:any){
    let user = userData.users.find((user:any)=>{return user.tokens?.refreshToken === token ?  user : null;});
    let tokens = newTokens;
    userData.users.splice(userData.users.indexOf(user), 1);
    userData.users.push({ user: user.user, tokens: tokens });
    let newRawData = Buffer.from(JSON.stringify(userData));
    fs.writeFileSync(path.resolve(__dirname, '../userData.json'), newRawData, { encoding: 'utf8' });
  }
}
