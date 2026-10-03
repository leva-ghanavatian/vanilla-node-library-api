# Vanilla Node Library API

A REST API for managing books, users, and rentals, built with plain Node.js (the built-in `http` module, no web framework) and MongoDB.

## Features

- CRUD for books, with pagination and a case-insensitive unique title + author rule
- User registration with bcrypt-hashed passwords and JWT login
- Rent and return workflow with atomic state changes, so two requests can never rent the same book
- Rent history with filters (`userId`, `bookId`, `active`)
- Consistent JSON error responses

## Project structure

```
configs/       database connection
controllers/   HTTP only: read the request, call a validator/service/model, send the response
services/      multi-step workflows (rent / return, with rollback)
validators/    input validation, normalization and field whitelisting
models/        MongoDB access and data rules (indexes, atomic updates)
helpers/       shared utilities: responses, errors, pagination, ids, auth
server.js      route table and startup
```

Each layer has one responsibility: validators decide what valid input is, models persist it and trust it, and controllers translate between HTTP and the rest.

## Getting started

Requirements: Node.js 18+ and a running MongoDB instance.

```bash
git clone <your-repo-url>
cd <repo-folder>
npm install
cp .env.example .env     # on Windows PowerShell: Copy-Item .env.example .env
```

Edit `.env` and fill in the values (see `.env.example` for the variable names), then start the server:

```bash
npm start
```

## API

Query parameters are used for ids and filters. Request bodies are JSON.

### Books

| Method | Endpoint | Description |
| --- | --- | --- |
| GET | `/api/books` | List books (`?page=1&limit=20`) |
| GET | `/api/books?id=<id>` | Get one book |
| POST | `/api/books` | Create a book (`title`, `author`, `price`) |
| PATCH | `/api/books?id=<id>` | Update any of `title`, `author`, `price` |
| DELETE | `/api/books?id=<id>` | Delete a book (409 if it is currently rented) |

### Users

| Method | Endpoint | Description |
| --- | --- | --- |
| GET | `/api/users` | List users (`?page=1&limit=20`) |
| GET | `/api/users?id=<id>` | Get one user |
| POST | `/api/users` | Register (`name`, `username`, `email`, `password`) |
| POST | `/api/users/login` | Log in (`email`, `password`), returns a JWT |
| PUT | `/api/users/upgrade?id=<id>` | Make a user an admin |
| PUT | `/api/users?id=<id>` | Update a user's `crime` count |

### Rents

| Method | Endpoint | Description |
| --- | --- | --- |
| GET | `/api/rents` | List rents (`?userId=&bookId=&active=true&page=1&limit=20`) |
| POST | `/api/rents?userId=<id>&bookId=<id>` | Rent a book (409 if already rented) |
| PUT | `/api/rents/return?bookId=<id>` | Return a book (409 if not rented) |

A Postman collection with example requests is included: `Library.postman_collection.json`.

## Roadmap

- Verify the JWT on protected routes and restrict admin-only actions (such as `upgrade`)
- Automated tests