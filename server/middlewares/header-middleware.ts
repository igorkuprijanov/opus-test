export module HeaderMiddleware{
  export function handleHeader(req:any, res:any, next:any){
    res.setHeader('Access-Control-Allow-Origin', process.env.CLIENT_URL as string);
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Authorization, Content-Type');
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    next();
  }
}
