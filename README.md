# Task Forge API

A NestJS + TypeORM based REST API with JWT authentication, user management, pagination, database migration, and seed support.

## Tech Stack

- NestJS 11
- TypeORM 0.3
- MySQL
- JWT (`@nestjs/jwt`)
- Bcrypt password hashing
- Class Validator / Class Transformer

## Core Features

- JWT login and token refresh flow
- Global auth guard (default: Bearer token required)
- Public auth routes using custom auth decorator
- User creation and paginated user list
- Global response interceptor with `apiVersion`
- TypeORM migration and seeding workflow
- Global validation pipe (`whitelist`, `forbidNonWhitelisted`, `transform`)

## Environment Variables

Create `.env` (or use `.env.development`) with:

```env
API_PORT=5001
DB_HOST=localhost
DB_PORT=3306
DB_USERNAME=root
DB_PASSWORD=root
DB_NAME=task_forge
DB_AUTOLOAD=true
DB_SYNC=false

JWT_SECRET=your_jwt_secret_key
JWT_TOKEN_AUDIENCE=localhost:3000
JWT_TOKEN_ISSUER=localhost
JWT_ACCESS_TOKEN_TTL=3600
JWT_REFRESH_TOKEN_TTL=86400

NODE_ENV=development
API_VERSION=1.00
```

## Installation

```bash
yarn install
```

## Run Project

```bash
# development (watch mode)
yarn start:dev

# normal
yarn start

# production
yarn build
yarn start:prod
```

API will run on `http://localhost:${API_PORT}` (default `5001`).

## Database Workflow

```bash
# run migrations
yarn migration:run

# revert last migration
yarn migration:revert

# generate new migration
yarn migration:generate MigrationName

# seed initial users
yarn seed
```

Default seed users:
- `admin@taskforge.com` / `Tf@123456`
- `rakib@taskforge.com` / `Tf@123456`
- `nusrat@taskforge.com` / `Tf@123456`

## Authentication Flow

1. Call `POST /auth/sign-in` with email/password
2. Get `accessToken` and `refreshToken`
3. Use `Authorization: Bearer <accessToken>` for protected routes
4. When access token expires, call `POST /auth/refresh-tokens` with refresh token

## API Endpoints

### Public

- `POST /auth/sign-in`
- `POST /auth/refresh-tokens`

### Protected (Bearer token required)

- `POST /user/create`
- `GET /user?limit=10&page=1`

## Request Examples

### Sign In

```http
POST /auth/sign-in
Content-Type: application/json

{
  "email": "admin@taskforge.com",
  "password": "Tf@123456"
}
```

### Refresh Tokens

```http
POST /auth/refresh-tokens
Content-Type: application/json

{
  "refreshToken": "<refresh_token>"
}
```

### Create User

```http
POST /user/create
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "firstName": "Pro",
  "lastName": "Roy",
  "email": "pro@example.com",
  "password": "Tf@123456"
}
```

### Get Users (Paginated)

```http
GET /user?limit=10&page=1
Authorization: Bearer <access_token>
```

## Response Shape

All responses are wrapped by interceptor:

```json
{
  "apiVersion": "1.00",
  "data": {}
}
```

Paginated user response inside `data` includes:
- `data` (users array)
- `meta` (`itemsPerPage`, `totalItems`, `currentPage`, `totalPages`)
- `links` (`first`, `last`, `current`, `next`, `previous`)

## Validation Rules (Highlights)

- `firstName`: required, min length 3
- `email`: required, valid email
- `password` (create user): min 8 chars, must include uppercase, lowercase, special char

## Useful Scripts

```bash
yarn lint
yarn format
yarn test
yarn test:e2e
yarn test:cov
```

## Project Structure (High-level)

```text
src/
  auth/        # login, refresh token, guards, jwt config
  user/        # user controller, service, providers, entity
  common/      # pagination and response interceptor
  database/    # data source, migrations, seeds
  config/      # app and database config
```
