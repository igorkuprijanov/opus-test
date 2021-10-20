import express from 'express';
import cors from 'cors';
import router from './router/routes';
import 'dotenv/config';
import { ErrMiddleware } from './middlewares/error-middleware';
import { HeaderMiddleware } from './middlewares/header-middleware';

const app = express();

app.use(HeaderMiddleware.handleHeader);
app.use('/', router);
app.use(cors());
app.use(ErrMiddleware.handleError);

const start = async () =>{
  try {
    app.listen(process.env.PORT || 4000, ()=> console.log(`server is running on ${process.env.PORT}`));
  } catch (e){
    console.log(e);
  }
};
start();
