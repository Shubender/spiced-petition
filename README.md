# Clean Air Petition

A server-rendered petition application from the SPICED Academy web-development bootcamp. The project combines user accounts, a hand-drawn signature, and a directory of signers supporting cleaner air in Berlin.

## Features

- Register and log in with hashed passwords and cookie sessions.
- Draw a signature on an HTML canvas and save it with the account.
- Display the signer list and filter it by city.
- Add or edit profile details such as city, age, and website.
- Update account information or remove a signature/account.

## Stack

Node.js, Express, Handlebars, PostgreSQL, JavaScript, HTML/CSS, bcryptjs, cookie-session, and Helmet. Jest and Supertest are declared for testing, with a cookie-session mock in the repository.

## Local setup

Requirements: Node.js/npm and PostgreSQL with `psql`. The original manifest records Node 14.15.1; review dependency compatibility before adopting a newer runtime.

```bash
git clone https://github.com/Shubender/spiced-petition.git
cd spiced-petition
npm ci
createdb petition
psql -d petition -f initial.sql
```

Use an empty local database: `initial.sql` drops and recreates tables. It contains the combined schema, so the separate `users.sql` and `users_profiles.sql` files do not need to be run afterward. Create a root `.env`:

```dotenv
DATABASE_URL=postgres://USER:PASSWORD@localhost:5432/petition
SESSION_SECRET=replace-with-a-long-random-local-value
PORT=8080
```

```bash
npm start
```

Open `http://localhost:8080`. The server supports an environment-provided port.

## Code guide

- [Request handlers](server.js) and [PostgreSQL queries](db.js)
- [Password helpers](encrypt.js) and [signature canvas](public/canvas.js)
- [Handlebars views](views) and [database schema](initial.sql)

## Project status

Educational project with historical dependencies. `npm test` invokes Jest, but a complete passing test suite is not established by the checked-in configuration. A full installation, account flow, and browser run have not been revalidated for this README update.
