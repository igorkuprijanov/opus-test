import { Router } from 'express';
import { UserController } from '../controllers/user-controller';
import bodyParser from 'body-parser';
import { body } from 'express-validator';
import { AuthMiddleware } from '../middlewares/auth-middleware';


let jsonParser = bodyParser.json();

let router = Router();

router.post('/registration', jsonParser, body('email').isEmail(), body('password').isLength({ min: 8, max:32 }), UserController.registration);
router.post('/login', jsonParser, body('email').isEmail(), body('password').isLength({ min: 8, max:32 }), UserController.login);
router.post('/restore', jsonParser, body('email').isEmail(), UserController.restore);
router.post('/logout', jsonParser, UserController.logOut);
router.post('/refresh', jsonParser, UserController.refresh);
router.post('/addUser', jsonParser, AuthMiddleware.handleAuth, body('email').isEmail(), body('password').isLength({ min: 8, max:32 }), UserController.registration);
router.get('/activate/:link', jsonParser, UserController.activate);
router.get('/users', AuthMiddleware.handleAuth, jsonParser, UserController.getUsers);
router.delete('/delete', AuthMiddleware.handleAuth, jsonParser, UserController.deleteUser);

export default router;
