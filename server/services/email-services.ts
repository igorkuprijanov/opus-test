import SMTPTransport from 'nodemailer';
import 'dotenv/config';
import Handlebars from 'handlebars';
import fs from 'fs';
import path from 'path';

export module EmailService{

  let activationMail = Handlebars.compile(fs.readFileSync(path.join(__dirname, './emailTemplates/activation-template.hbs'), 'utf8'));
  let resetPasswordMail = Handlebars.compile(fs.readFileSync(path.join(__dirname, './emailTemplates/password-reset.hbs'), 'utf8'));
  let userDeletedMail = Handlebars.compile(fs.readFileSync(path.join(__dirname, './emailTemplates/user-deleted.hbs'), 'utf8'));

  const transporter = SMTPTransport.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    service:'gmail',
    secure: false,
    auth: {
      user: process.env.SMTP_USER as string,
      pass: process.env.SMTP_PASSWORD as string,
    },
    debug: false,
  });


  const options = (to: string, subject:string, template:any, locals:any) =>{
    return {
      from: 'SpaR8ZnwST@gmail.com',
      to: to,
      subject: subject,
      html: template(locals),
    };
  };



  export async function sendActivation(to: string, link: string){
    transporter.sendMail(options(to, 'Account activation', activationMail, { link }), (error) =>{
      if (error){
        console.log(error);
      }
    });
  }

  export async function sendRestore(to: string, pass:string){
    transporter.sendMail(options(to, 'Restore password', resetPasswordMail, { pass }), (error) =>{
      if (error){
        console.log(error);
      }
    });
  }

  export async function userDeleted(to: string){
    transporter.sendMail(options(to, 'User deleted', userDeletedMail, { to }), (error) =>{
      if (error){
        console.log(error);
      }
    });
  }
}
