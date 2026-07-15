# GiftLink Backend

Node.js/Express + MongoDB API for the GiftLink capstone project.

## Setup

```bash
npm install
cp .env.sample .env   # then fill in MONGO_URL / JWT_SECRET
npm run dev            # or: npm start
```

## API Endpoints

| Method | Route                     | Auth | Description                     |
|--------|---------------------------|------|----------------------------------|
| POST   | /api/auth/register        | No   | Create a new user                |
| POST   | /api/auth/login           | No   | Log in, returns JWT              |
| PUT    | /api/auth/update          | Yes  | Update profile / password        |
| GET    | /api/gift                 | No   | List all gift listings           |
| GET    | /api/gift/:id             | No   | Get one listing                  |
| POST   | /api/gift                 | Yes  | Create a listing                 |
| PUT    | /api/gift/:id             | Yes  | Edit own listing                 |
| DELETE | /api/gift/:id             | Yes  | Delete own listing               |
| GET    | /api/gift/:id/comments    | No   | List comments on a listing       |
| POST   | /api/gift/:id/comments    | Yes  | Add a comment (concurrency-safe) |
| GET    | /api/search               | No   | Search with category/condition/age/name filters |

## Docker

```bash
docker build -t giftlink-backend .
docker run -p 3060:3060 --env-file .env giftlink-backend
```

## Tests

```bash
npm test
```
