# mock-api-middleware
Middleware for NodeJS, BrowserSync ect. for creating API Mock's fast.
You can shorten it MAM, like the sound you say when food is delicious.

## Installation

`npm install --save-dev mock-api-middleware`

## Usage

`mam(route, [options])`

### Use with BrowserSync
```javascript

const mam = require('mock-api-middleware');

// You could put this directly in the middleware array of browserSync
const mockApi = mam('/mockapi', { // <--- Route where to mount the API
	mockPath: './mocks/' // <--- Where to find the API files
});

browserSync.init({
	server: './dist',
	middleware: [
		mockApi // <--- Just put it here like anyother middleware
	]
});
```
## Options

This module accepts the following options

- **mockPath**: Path to mock files
- **dataset**: Override datasets with this, accepts an object. Will only override if the sames keys are defined.
- **helpers**: Your own helpers which are described in "[writing-your-own-helpers](https://github.com/webroo/dummy-json#writing-your-own-helpers)" of [dummy-json](https://github.com/webroo/dummy-json)

## Mocking
To mock an API or a service. All you need is a folder and some files.

```
mocks
│   users.GET.json
└───users
│       │   _.GET.json
│       │   admin.GET.json
│       │   ...
│
│   products.GET.json
└───products
        │   theonlyproduct.GET.json
```

The latter folder example would create an API with endpoints like this:

`/mockapi/users`   
`/mockapi/users/admin`   
`/mockapi/users/*`   
`/mockapi/products`   
`/mockapi/products/theonlyproduct`   

The only magic thing about this is the `_.GET.json` this is a CATCH-ALL that will be a fallback for all "missing files" in the current folder.

### Generate JSON
Another smart trick is that you can generate JSON.
This enables you to make a list of users fast without typing all the data yourself.

For more information head over to the [dummy-json](https://github.com/webroo/dummy-json) repo. MAM uses this under the hood with some extentions and modifications.

<table width="100%">
<thead><tr><td width="50%">Template string</td><td width="50%">Output string</td></tr></thead>
<tbody><tr><td align="left" valign="top">
<pre style="padding: 0">
{
  "users": [
    {{#repeat 2}}
    {
      "id": {{@index}},
      "name": "{{firstName}} {{lastName}}",
      "email": "{{email}}"
    }
    {{/repeat}}
  ]
}
</pre>
</td><td align="left" valign="top">
<pre style="padding: 0">
{
  "users": [
    {
      "id": 0,
      "name": "Allan Kimmer Jensen",
      "email": "allankimmerjensen@example.com"
    },
	{
      "id": 1,
      "name": "John Doe",
      "email": "john.doe@nsa.gov"
    }
  ]
}
</pre>
</td></tr></tbody></table>
