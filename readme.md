# User Manager

User Manager is a test project written fully in TypeScript. It includes a React front-end in 'client' folder and Node.js back-end in 'server' folder.

## _Table of Contents_
- [Features](#features)
- [Front-end](#front-end)
  - [Overview](#client-overview)
  - [Running the client](#running-the-client)
  - [Scripts](#front-end-scripts)
- [Back-end](#back-end)
  - [Overview](#server-overview)
  - [Endpoints](#end-points)
  - [Running the server](#running-the-server)
  - [Scripts](#server-script)


## Features and requierments

### General
- Backend - Node.js REST API with Express.js framework
- Frontend - React application
- Tokens - JSON Web Tokens used for user authorization
- Email service - Sends email to users when user is created, when user is deleted and when new password is issued using [handlebars](https://www.npmjs.com/package/handlebars) email templates

>**NB!**
I was not able to use [Postmark](https://postmarkapp.com/) API, since it does not allow emails on public domains and I do not have a private domain email, so I used [Nodemailer](https://www.npmjs.com/package/nodemailer) instead

### Unauthenticated user
- Can create new user through 'Create account' form
- Can log in through 'Log in' form
- Can restore password through 'Restore password' form

### Authenticated user
- Can see list of all users - **requires user to be authorized**
- Can add new users - **requires user to be authorized**
- Can see each users detailed view with logs- **requires user to be authorized**
- Can delete users - **requires user to be activated and authorized**

### Extra
- All password are hashed
- Automatically refreshes tokens if accessToken expires
- Linting with Aribnb configurations
- All the sensetive data is held in .env file
- Logs of every user (registration, login, logout)
- Instead of a database I used a simple JSON file in back-end directory

## Front-end

### _Client overview_
Client part of the application is made from a ``create-react-app name --template typescript `` boilerplate. It does not use any type of a global store nor a http client for simplicity reasons, since state managers can be quite verbous and it is not necceray for a small app like this. Instead the state is managed locally and all API requests are handled by the http layer. Also for simplicity reasons I used [React Bootstrap](https://react-bootstrap.github.io/) front end library.

### _Running the client_

**By default client runs on http://localhost:3000** and no changes to the code are requiered unless the server url is changed.


### _Client scripts_

##### As usual for react apps:
To start the client on local server
```
npm start
```
To build for deployment
```
npm run build
```

To run ESlint
```
npm run lint
```



## Back-end

### _Server overview_
Back-end part of the application is made using Node.js and Express.js framework. For simplicity's sake I used a JSON file instead of a database, which of course is not feasible in production but here it serves the purpose.

Currently accessToken and refreshToken are configured to expire in 5 seconds and 30 days respectively, this can be changed in [token-services.ts](./server/services/token-services.ts)
```typescript
let accessToken = jwt.sign({payload}, process.env.JWT_ACCESS_SECRET as string, {expiresIn: '5s'})
let refreshToken = jwt.sign({payload}, process.env.JWT_REFRESH_SECRET as string, {expiresIn: '30d'})
```

##### Packages in use:
- [express-validator](https://www.npmjs.com/package/express-validator) - to validate user input
- [dotenv](https://www.npmjs.com/package/dotenv) - to access environmental variables
- [hadlebars](https://www.npmjs.com/package/handlebars) - to create email templates
- [nodemailer](https://www.npmjs.com/package/nodemailer) - to send out emails
- [bcrypt](https://www.npmjs.com/package/bcrypt) - to hash user passowrds
- [jsonwebtokens](https://www.npmjs.com/package/jsonwebtoken) - to create and validate JWTs
- [body-parser](https://www.npmjs.com/package/body-parser) - to parse data from front-end
- [cors](https://www.npmjs.com/package/cors) - for cross-origin requests
- [uuid](https://www.npmjs.com/package/uuid) - to create random user activation links

### _End-points_
All API endpoints go through router in ./router/router.ts

``/registration`` - register new user

``/login`` - login into an account and issue JWT

``/restore`` - restore users password

``/logout`` - log out of an account and remove JWT

``/refresh`` - refresh JWT with refreshToken, happens automaticly if accessToken expires and refreshToken is present

``/addUser`` - register new user through user interface - **requiers user to be authorized**

``/acitvate/:link`` - activate a user through the link sent by email

``/users`` - get all users - **requiers user to be authorized**

``/delete`` - delete user through user interface - **requiers user to be authorized**


### _Running the server_
**By default client runs on http://localhost:4000** and to for the server to run correctly two variables in [.env](./server/.env) file must be changed

``
SMTP_USER = "youEmail@gmail.com"
``

``
SMTP_USER = "yourEmailPassword"
``

Nodemailer is configured to use Gmail, so if you are useing some other email service make sure to change it accordingly in [email-services.ts](./server/services/email-services.ts)
**Make sure that POP/IMAP forwarding is allowed on your email account**


### _Server scripts_
To run the server use
```
npm start
```
To run ESlint
```
npm run lint
```
