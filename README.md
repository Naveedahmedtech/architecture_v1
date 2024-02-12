# **Project Setup Guide**

Welcome to our Express server starter template. This guide is designed to help new developers understand the architecture of our Express server, including its configuration, dependencies, and how to get started with development.

## Overview

Our server is built with Node.js and Express, and it's designed to serve as a foundation for web applications. It includes configurations for environmental variables, session management, logging, rate limiting, database connection, and API routing.

## Getting Started

Prerequisites

- Node.js (version 18)   
- npm (comes with Node.js)
- PostgreSQL (for the database)

## Run Locally

Clone the project

```bash
  git clone https://link-to-project
```

Go to the project directory

Install dependencies

```bash
  npm install
```

Start the server

```bash
  npm run start
```

## Environment Variables

To run this project, you will need to add the following environment variables to your .env file

`API_KEY`

`ANOTHER_API_KEY`

`HOST`

`DB_PORT`

`PASSWORD`

`DATABASE`

`MAX`

`USER_NAME`

`JWT_SECRET`

`EXPRESS_SESSION_KEY`

## Features

- Rate Limiting: Protects the API from excessive requests.
- Session Management: Supports user sessions with express-session.
- Logging: Integrated request logging using express-pino-logger.
- Authentication: User authentication setup with passport.
- Static Files: Serves static files from the public directory.
