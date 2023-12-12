
# Kratos

Build super-fast & scalable RESTful APIs in minutes. For [Node.js](https://nodejs.org).

[![npm version](https://badge.fury.io/js/@kratosbase%2Fkratos.svg)](https://badge.fury.io/js/@kratosbase%2Fkratos) 

[![MIT License](https://img.shields.io/badge/License-MIT-green.svg)](https://choosealicense.com/licenses/mit/)


## Getting started

To install run:

```bash
npm i @kratosbase/kratos
```

To spin up an application, first you need to create a schema file.

Assuming you want to create an API containing a user resource. Your schema file should look like this:
```js
// schemas/User.js
import { Joi } from 'kratos'

const commonRules = {
    username: Joi.string().trim().max(15).required(),
    picture: Joi.string().trim().required(),
    password: Joi.string().trim().required(),
    last_active: Joi.date()
}

const User = {
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

export default User
```

Now in your `index.js` file:
```js
import Kratos from 'Kratos'
import User from './schemas/User.js'

const dbServer = 'YOUR-DB-SERVER'

const app = new Kratos({
    port: 9000,
    db_server: dbServer
})

const defaultRouter = app.router({
    users: User
}).getRoutes()

app.launch(defaultRouter)
```
Now fire up your browser/postman and make a POST/GET/PATCH/DELETE request to localhost:9000/api/v1/users and you should get a response.

Depending on the request type, validation rules will be applied to match the rules in the schema file.
## Features
This project is being actively developed using [Stack Overflow's API design best practices](https://stackoverflow.blog/2020/03/02/best-practices-for-rest-api-design/)
- Focus on high performance and scalability
- Auto-routing
- Custom routing
- Auto-query database (for auto-routing)
- API versioning
- HTTP response handler
- CORS


## Roadmap

- Multiple database support (Planned)
- Authentication (WIP)
- Custom middlewares (Planned)
- Filtering (Planned)
- Sorting (Planned)
- Pagination (Planned)


## Documentation

WIP


## Philosophy
As an indie hacker, I didn't want to repeatedly write queries and routing + wanted something I could spin up quickly for any project (scalable and minimalistic) while I focus mostly on the frontend. The other frameworks I found were either too robust or had bad design patterns... that's how I ended up building this.

Kratos is built on top of the framework everyone loves... specifically for building APIs that meet the highest design standard. No compromise.


## Contributing

Constructive contributions are always welcome!

See the [Contributing Guide](https://github.com/kratosbase/kratos/blob/master/Contributing.md) for ways to get started.

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

