
# Kratos

Build super-fast & scalable RESTful APIs in minutes. For [Node.js](https://nodejs.org).

[![npm version](https://badge.fury.io/js/@kratosbase%2Fkratos.svg)](https://badge.fury.io/js/@kratosbase%2Fkratos) 

[![MIT License](https://img.shields.io/badge/License-MIT-green.svg)](https://choosealicense.com/licenses/mit/)


## Getting started

To install run:

```bash
npm i @kratosbase/kratos
```

To spin up an application, first you need to create a resource file.

Assuming you want to create an API containing a user resource. Your file should look like this:
```js
// resources/User.js
import { Joi } from 'kratos'

const commonRules = {
    username: Joi.string().trim().max(15).required(),
    picture: Joi.string().trim().required(),
    password: Joi.string().trim().required(),
    last_active: Joi.date()
}

const user = {
    schema: {
        username: { type: String, unique: true, required: true },
        picture: { type: String },
        password: { type: String, required: true }
        last_active: { type: Date, default: Date.now }
    },

    validationRules: {
        post: commonRules,
        patch: commonRules
    }
}

export default user
```

Now in your `index.js` file:
```js
import Kratos from 'Kratos'
import user from './resources/user.js'

const db_server = 'YOUR-DB-SERVER'

const app = new Kratos({
    port: 9000,
    db_server: db_server
})

const defaultRouter = app.router({
    users: user 
    user // this could also work but routes to /user instead of /users
}).getRoutes()

app.launch(defaultRouter)
```
Now run `node index.js` and fire up your browser/postman and make a request (POST/GET/PATCH/DELETE) request to `localhost:9000/api/v1/users` and you should get a response.

Depending on the request type, validation rules will be applied to match the rules in the resource file.

## Features
This project is being actively developed using [Stack Overflow's API design best practices](https://stackoverflow.blog/2020/03/02/best-practices-for-rest-api-design/)
- Focus on high performance and scalability
- Auto-routing
- Custom routing
- Data validation with [Joi](https://github.com/hapijs/joi)
- Auto-query database (for auto-routing)
- API versioning
- HTTP response handler
- CORS
- Authentication

## Roadmap

- Multiple database support (Planned)
- Authentication (WIP)
- Custom middlewares (Planned)
- Filtering (Planned)
- Sorting (Planned)
- Pagination (Planned)


## Documentation

### Base class initialization
#### example:
```js
const app = new Kratos({
    port: 9000,
    db_server: db_server,
    cors_origins: ['http://localhost:3000'] // URLs allowed to make requests to this API
})
```

#### This class accepts a `config` object with the following properties:
| Property | Type |Description           | Default
| :-------- | :------- | :------------------------- | ---- |
| `port` | `int` | Port to serve application on | Random
| `api_version` | `int` | Major app release version | 1
| `cors_origins` | `mixed` | Origins allowed to access api | ['localhost']
| `db_server` | `string` | MongoDB connection string | ***required***
| `disable_auth` | `boolean` | Whether to disable in-built auth or not | false
| `show_token` | `boolean` | Determines whether to enable /get-token route | false
| `maintenance` | `boolean` | Set maintenance mode | false

### Router class initialization
#### example:
```js
const defaultRouter = app.router({
    users: user, 
}).getRoutes()
```

#### This class accepts a `resources` object with the following properties:
| Properties | Type |Description           | Default
| :-------- | :------- | :------------------------- | ---- |
| `[dynamic value]` | `object` | resource object | ***required***

**note: Whatever name you give your resource object property is the same name that will be used as the resource endpoint. So according to `defaultRouter` in the example above. The `user` resource object will be consumable via `[host]:[port]/api/v[version-number]/users`.


### Custom routing
In a scenario when you want to interact with the database in a special way, like deleting multiple documents when a user requests to delete their account... you can make use of custom routing.

Custom resources are served at
```http
/api/v{version-number}/custom/:resource
```
#### Custom router example

```js
const customRouter = app.expressRouter()

customRouter.get('/delete-account', async (req, res) => {
    // Initialize a mongoose model
    const user = app.model('User').model

    const post = app.model('Post').model

    // delete user and user's posts
    ***

    // Return JSON response
    return app.respond(200, res)
})
```
Do note, that `app.model()` is a mongoose wrapper for `mongoose.model`. This is so you have more control over how the queries are formed.

### Authentication
To enable authentication you have to set `disable_auth: false` or remove it completely from your config object to use the default, which is also false.

You also have to set `show_token: true` in your config object to enable `/get-token` endpoint. This allows you to be able to access the endpoint and copy your token for use in client.

* To generate non-default role tokens, visit `/get-token?role={role}`... where `{role}` is the name of the role the token is being generated for.
* For security reasons... after copying your token, it is recommended that you remove `show_token: true` from your config object to hide the token endpoint.

#### Authentication config example

```js
const app = new Kratos({
    ...
    disable_auth: false // not compulsory to set this
    show_token: true
})
```

#### Restricting access to certain roles
You can restrict access to your endpoints and allow only certain roles to access them by updating your resource object `validationRules` to look like this:
```js
const User = {
    ...
    validationRules: {
        get: {
            single_roles: ['user', 'admin'], // Restrict GET access to /users/:id
            roles: ['admin'] // restrict GET access to /users
        }
    }
}
```
#### Default endpoints
| Property | Request Types |Description
| :-------- | :------- | :------------------------- |
| `/{resource}` | `GET/POST/PATCH/DELETE` | Resource base endpoint
| `/{resource}/{id}` | `GET/POST/PATCH/DELETE` | Resource single-item endpoint
| `/{resource}/count` | `GET` | Returns data containing total count of documents in resource's collection

## Philosophy
As an indie hacker, I didn't want to repeatedly write queries and routing + wanted something I could spin up quickly for any project (scalable and minimalistic) while I focus mostly on the frontend. The other frameworks I found were either too robust or had bad design patterns... that's how I ended up building this.

Kratos is built on top of the framework everyone loves... specifically for building APIs that meet the highest design standard. No compromise.


## Contributing [![contributions welcome](https://img.shields.io/badge/contributions-welcome-brightgreen.svg?style=flat)](https://github.com/dwyl/esta/issues)


Constructive contributions are always welcome!

See the [Contributing Guide](https://github.com/kratosbase/kratos/blob/master/CONTRIBUTING.md) for ways to get started.

### Security issues
If you discover a security vulnerability in Kratos, please see [Security Policies and Procedures](https://github.com/kratosbase/kratos/blob/master/Security.md).

## Support

For support, feel free to create an issue or reach out on [Twitter](https://x.com/lk4real_)


## Acknowledgements
 - [Stack Overflow](https://stackoverflow.blog/2020/03/02/best-practices-for-rest-api-design/)
 - [README.so](https://readme.so/)
## Authors
This project is currently being maintained by
- [@lkgit1 (author)](https://www.github.com/lkgit1)

[!["Buy Me A Coffee"](https://www.buymeacoffee.com/assets/img/custom_images/orange_img.png)](https://www.buymeacoffee.com/lk4real)

