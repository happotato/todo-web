# Todo app frontend

## Dependencies

- [NodeJS](https://nodejs.org/)
- [Yarn](https://yarnpkg.com/)

## Setup

### Install

``` sh
# Clone repository
git clone https://github.com/happotato/todo-web.git

# Change directory
cd todo-web

# Install dependencies
yarn install
```

### Environment

- setup `.development.env` and `.production.env` files using the [template](.template.env).

## Running

``` sh
# Create development build
yarn build:dev 

# Run server
yarn server
```

## Running with Docker

``` sh
# Build 
docker build -t todo-web .

# Run
docker run -d -p <port>:80 todo-web
```

## License

[MIT](LICENSE.txt)
