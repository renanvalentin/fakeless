# !Fakeless

Fake REST API with no code required.

![](https://media.giphy.com/media/SeTPXfY3RFPkQ/giphy.gif)

## Setup

In order to run the project locally and/or develop on it clone the repository to your machine and install the node dependencies. Make sure you have `node` and `npm` installed.

```
yarn add fakeless -g
```

## Quick start

Create a `fakeless.json` file:

```javascript
// fakeless.json

{
  "variables": {
    "host": "http://localhost:3000",
    "rootDir": "."
  },
  "templates": [
    {
      "variables": {
          "hero": "spider"
      },
      "method": "get",
      "route": "/heroes/<%= hero %>",
      "response": {
        "body": {
            "name": "<%= hero %>",
            "photos": "<%= host %>/<%= hero %>/photos", // http://localhost:3000/spider/photos
        },
        "status": 200
      }
    }
  ]
}
```

run

```
fakeless -f fakeless.json -p 3000
```

## Templates

You can define `global` and `local` variables by put them into the `variables` property.

```javascript
{
  "variables": {
    "rootDir": "I'm a global variable",
  },
  "templates": [
    {
      "variables": {
          "scope": "I only exist in this scope"
      },
      "route": "/heroes/<%= hero %>"
    }
  ]
}
```

## Success Response

The body response can be defined explicity on your json file or it can be exported from a different path.

### Directly on your json file:

```javascript
{
  "variables": {
    "host": "http://localhost:3000"
  },
  "templates": [
    {
      "variables": {
          "hero": "spider"
      },
      "method": "get",
      "route": "/heroes/<%= hero %>",
      "response": {
        "body": {
            "name": "<%= hero %>",
            "photos": "<%= host %>/<%= hero %>/photos",
        },
        "status": 200
      }
    }
  ]
}
```

### Load external template

```javascript
// ./fakeless.json
{
  "variables": {
    "host": "http://localhost:3000",
    "rootDir": "."
  },
  "templates": [
    {
      "variables": {
          "hero": "spider"
      },
      "method": "get",
      "route": "/heroes/<%= hero %>",
      "response": {
        "body": "<%= rootDir %>/hero.json",
        "status": 200
      },
      "validate": {
          "body": '<%= rootDir %>/body_validation.json',
          "headers": '<%= rootDir %>/headers_validation.json',
      },
    }
  ]
}

// ./hero.json
{
    "name": "<%= hero %>",
    "photos": "<%= host %>/<%= hero %>/photos",
}
```

## Error Response

```javascript
// ./fakeless.json
{
  "variables": {
    "host": "http://localhost:3000",
    "rootDir": "."
  },
  "templates": [
    {
      "variables": {
          "hero": "spider"
      },
      "method": "post",
      "route": "/heroes/<%= hero %>",
      "response": {
        "body": {
          "message": "Out of webs"
        },
        "status": 400
      }
    }
  ]
}
```

## Validations

It is possible to apply validations to the request body and headers.

### Header Validations

Fakeless will check if headers' values matches with those one specified on the configuration file.

```javascript
// ./fakeless.json
{
  "variables": {
    "host": "http://localhost:3000",
    "rootDir": "."
  },
  "templates": [
    {
      "variables": {
          "hero": "spider"
      },
      "method": "post",
      "route": "/heroes/<%= hero %>",
      "response": {
        "body": {},
        "status": 200
      },
      "validate": {
        "headers": {
          "content-type": {
            "toBe": "application/json",
            "error": {
              "message": "Out of webs"
            },
            "status": 400
          }
        }
      }
    }
  ]
}
```

### Body Validations

It is also possible to set which field is `required`:

```javascript
// ./fakeless.json
{
  "variables": {
    "host": "http://localhost:3000",
    "rootDir": "."
  },
  "templates": [
    {
      "variables": {
          "hero": "spider"
      },
      "method": "post",
      "route": "/heroes/<%= hero %>",
      "response": {
        "body": {},
        "error": {
            "message": "Out of webs"
        },
        "status": 400
      },
      "validate": {
        "body": {
          "reload": {
            "toBe": "required",
            "error": {
              "message": "Out of webs"
            },
            "status": 400
          }
        }
      }
    }
  ]
}
```

## Simulations

You can also change the response behaviour:

```javascript
// ./fakeless.json
{
  "variables": {
    "host": "http://localhost:3000",
    "rootDir": "."
  },
  "templates": [
    {
      "variables": {
          "hero": "spider"
      },
      "method": "post",
      "route": "/heroes/<%= hero %>",
      "response": {
        "body": {},
        "error": {},
        "status": 400
      },
      "simulate": {
        "timeout": 100
      }
    }
  ]
}
```
