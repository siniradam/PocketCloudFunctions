# Pocket Cloud Functions

Clustered Express Server + Pocketbase

## What is this project exactly?
This is a miniature cloud functions app (`faas`) like firebase functions, trying to achieve what Pocketbase does for BaaS.

Under the hood, main process spawns [express](https://expressjs.com/) instance in [cluster](https://nodejs.dev/en/api/v18/cluster/) mode and exposes request types like `all`, `get`, `post`... and pocketbase methods. Along with these also I'm planning to [integrate with Pocketbase](https://github.com/siniradam/PocketbaseHooks) to trigger events like user creation and deletion.

It's written in TypeScript, but most definitions aren't completed since still trying to figure out how it's going to look like or work. If you like to test what's available so far, after installing packages, run `npm run dev` this will compile the typescript and run it.

There is a configuration file, you may make some changes there.

So far here is how it works; 
- There is a function in index.ts this spawns processes.
- This process has to be in /src/functions/ folder.
- There is a `server.ts` in /src/ folder, initiates the express.
- You gotta run this line below in your /src/functions/index.js

```js
import server from "../server.js";
```
 As soon as you import this, this will run the express server and will return you these objects;
```js
{
    http:{
        all:(req,res)=>{} // Express method
        get:(req,res)=>{} // Express method
        post:(req,res)=>{} // Express method
        delete:(req,res)=>{} // Express method
        put:(req,res)=>{} // Express method
        use:(req,res)=>{} // Express method
    },
    user:{
        onCreate:(user)=>{}, // Event to be called when a user is created
        onDelete:(user)=>{} // Event to be called when a user is deleted
    }   
}
```

## What's In It?
There are some middleware are bundled with it, these are;
- Cors
- Helmet
- Rate Limiter Flexible
- Pocketbase Middleware

Pocketbase middleware extends `req`uest object with these objects;
```js
    {
        // ...
        pb:{
            baseUrl,
            lang,
            admins,
            collections,
            files,
            settings,
        },
        user:{
            //...pb.authStore.model
        }
    }
```
So if any request contains `req.headers.authorization` this will be used to set pocketbase authstore so requests can be checked if sent by a specific user, or their data can be accessed.

## Plans
- I would like to add gRPC, if I can't; web requests to receive events from pocketbase server.
- Creating single executable, with a tool like `pkg`.

## Future of this project
This is a side hustle, may turn into something or not, feel free to fork, work on it, methodology here is might be wrong. If you are looking for something more robust and extendable check out [fn project](https://github.com/fnproject). Runs `node.js`, `.net`, `go`, `java` and `python` as serverless.

### TODO
- GitHub auto update 