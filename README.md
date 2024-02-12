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

# __Features__

In addition to the foundational features, our application is equipped with comprehensive CRUD functionalities for managing data, ensuring robust and dynamic interactions with the database.

## Create
- Dynamic Record Insertion: Our createOne function allows for the insertion of new records into any specified table, with immediate retrieval of the inserted record. This feature supports dynamic data models and real-time data processing needs.

## Read
- Flexible Data Retrieval: With functions like getOne and getAll, the application offers versatile data fetching capabilities. getOne is optimized for retrieving a single record based on specific criteria, while getAll supports fetching paginated lists of records, complete with sorting, filtering, and aggregation for comprehensive data queries.

## Update
- Efficient Record Updates: The updateOne function provides a mechanism for updating specific records identified by filters, with the capability to immediately fetch the updated record. This ensures that data modifications are accurately reflected in real-time applications.

## Delete
- Selective and Bulk Deletion: Our deletion functionalities include both deleteOne for removing a specific record based on given criteria and deleteAll for bulk deletion operations. deleteAll can be used with filters for targeted deletions or without for complete table clearance, offering flexibility in data management practices.

## Additional Features
- Custom Error Handling: Integrated custom error handling through the CustomError class enhances the robustness of CRUD operations, allowing for precise error management and improved debugging.

- Advanced Query Support: Joins, filters, sorting, and pagination capabilities ensure that CRUD operations can be tailored to complex business requirements, enabling efficient data access patterns and user experiences.

## Security and Performance
- Rate Limiting and Session Management: Built-in rate limiting and session management protect against abuse and unauthorized access, ensuring the application remains secure and performant even under heavy load.

- Logging and Authentication: Comprehensive logging with express-pino-logger and flexible authentication using passport facilitate secure and maintainable application development, with detailed insights into operations and user activities.
