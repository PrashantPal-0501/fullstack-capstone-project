# GiftLink Frontend

React app for the GiftLink capstone project. Talks to the `giftlink-backend` API.

## Setup

```bash
npm install
cp .env.sample .env    # set REACT_APP_API_URL to your backend URL
npm start                # runs on http://localhost:3000
```

## Routes

| Path                  | Component          | Description                          |
|------------------------|---------------------|---------------------------------------|
| `/app`                 | MainPage            | Browse all gift listings              |
| `/app/login`           | LoginPage           | Log in                                |
| `/app/register`        | RegisterPage        | Create an account                     |
| `/app/search`          | SearchPage          | Filter by category/condition/age      |
| `/app/product/:id`     | DetailsPage         | View a listing + comments             |
| `/app/profile`         | Profile             | Edit your account details             |
| `/app/my-listings`     | UserListingsPage    | Create/delete your own listings       |

## Structure

Matches the capstone architecture: `src/components/<Feature>/<Feature>.js` +
matching `.css`, a shared `AuthContext` for login state (JWT stored in
`sessionStorage`), and `config.js` for the backend base URL.
