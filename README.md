# Library API

A REST API for managing books, users, and rentals, built with Node.js, Express 5, and MongoDB.

> This project started as a plain Node.js (`http` module) API and was later rebuilt on Express. The original version is kept in the Git history.

## Features

- CRUD for books, with pagination and a case-insensitive unique title + author rule
- User registration with bcrypt-hashed passwords and JWT login (tokens expire after 1 hour)
- Role-based access control: public, authenticated user, and admin routes
- Rent and return workflow with atomic state changes, so two requests can never rent the same book
- Rent history with filters (`userId`, `bookId`, `active`) and pagination
- Input validation with [fastest-validator](https://github.com/icebob/fastest-validator), including a bcrypt-safe password length check
- Security middleware: `helmet`, `cors`, 1 MB JSON body limit, and `x-powered-by` disabled
- Consistent JSON error responses

## Tech stack

Node.js, Express 5, MongoDB (native driver), bcrypt, jsonwebtoken, fastest-validator, helmet, cors, morgan, multer, dotenv

## Project structure

```
configs/       database connection
routes/        route tables (books, users, rents), mounted under /api
middlewares/   auth (JWT + roles), HTTP helpers (errors, 404, JSON body check)
controllers/   HTTP only: read the request, call a validator/service/model, send the response
services/      multi-step workflows (rent / return, with rollback)
validators/    input validation, normalization and field whitelisting
models/        MongoDB access and data rules (indexes, atomic updates)
helpers/       shared utilities: errors, validation, token signing
views/         landing page served at /api
public/        static files
server.js      app setup and startup
```

Each layer has one responsibility: validators decide what valid input is, models persist it and trust it, and controllers translate between HTTP and the rest.

## Getting started

Requirements: Node.js 18+ and a running MongoDB instance.

```bash
git clone https://github.com/leva-ghanavatian/vanilla-node-library-api.git
cd vanilla-node-library-api
npm install
cp .env.example .env     # on Windows PowerShell: Copy-Item .env.example .env
```

Edit `.env` and fill in the values:

| Variable          | Description                                  |
| ----------------- | -------------------------------------------- |
| `PORT`            | Port the server listens on (e.g. `3000`)     |
| `JWT_SECRET`      | Long random string used to sign tokens       |
| `dbConnectionUrl` | MongoDB connection string                    |
| `dbName`          | Database name                                |

Start the server:

```bash
npm run dev
```

Indexes are created automatically on startup.

## Authentication

Register a user, log in, then send the returned token on protected routes:

```
Authorization: Bearer <token>
```

New users get the `USER` role. An admin can promote a user with `PATCH /api/users/:id/upgrade`.

## API

All routes are prefixed with `/api`. Ids go in the URL path; filters and pagination go in the query string. Request bodies are JSON.

**Access levels:** 🌐 public, 🔑 logged-in user, 🛡️ admin

### Books

| Method | Endpoint         | Access | Description                                           |
| ------ | ---------------- | ------ | ----------------------------------------------------- |
| GET    | `/books`         | 🌐     | List books (`?page=1&limit=20`)                       |
| GET    | `/books/:id`     | 🌐     | Get one book                                          |
| POST   | `/books`         | 🔑     | Create a book (`title`, `author`, `price`)            |
| PATCH  | `/books/:id`     | 🔑     | Update any of `title`, `author`, `price`              |
| DELETE | `/books/:id`     | 🛡️     | Delete a book (409 if it is currently rented)         |

### Users

| Method | Endpoint              | Access | Description                                          |
| ------ | --------------------- | ------ | ---------------------------------------------------- |
| POST   | `/users`              | 🌐     | Register (`name`, `username`, `email`, `password`)   |
| POST   | `/users/login`        | 🌐     | Log in (`email`, `password`), returns a JWT          |
| GET    | `/users/me`           | 🔑     | Get the current user                                 |
| GET    | `/users`              | 🛡️     | List users (`?page=1&limit=20`)                      |
| GET    | `/users/:id`          | 🛡️     | Get one user                                         |
| PATCH  | `/users/:id/upgrade`  | 🛡️     | Make a user an admin                                 |
| PATCH  | `/users/:id`          | 🛡️     | Update a user's `crime` count                        |
| DELETE | `/users/:id`          | 🛡️     | Delete a user                                        |

### Rents

| Method | Endpoint                | Access | Description                                                        |
| ------ | ----------------------- | ------ | ------------------------------------------------------------------ |
| GET    | `/rents`                | 🛡️     | List rents (`?userId=&bookId=&active=true&page=1&limit=20`)        |
| POST   | `/rents`                | 🔑     | Rent a book: body `{ "userId": "<id>", "bookId": "<id>" }` (409 if already rented) |
| PUT    | `/rents/return`         | 🔑     | Return a book: `?bookId=<id>` (409 if not rented)                  |

### Errors

Errors are always JSON: `{ "error": "message" }`. Common statuses: `400` invalid input, `401` missing or invalid token, `403` not allowed, `404` not found, `409` conflict (duplicate or already rented).

## Roadmap

- Automated tests
