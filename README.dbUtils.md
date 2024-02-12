directory -- src/utils/dbUtils/\*

# **Database Utilities Documentation**

This documentation covers the database utility functions used in our Express application. These utilities facilitate common database operations, such as inserting records, querying data, and handling complex queries with filters, joins, sorting, and pagination.

## **Topics**

- CRUD Functions Utilities
- Database Operations Utilities
- Database Query Utilities

- ## **`createOne` Function Documentation**

  This document details the `createOne` function, a high-level database operation utility designed to insert a new record into a specified table and then retrieve this newly created record, potentially with additional joined data, filtering, sorting, and aggregation.

  ## Overview

  The `createOne` function is part of our application's data access layer, allowing for the creation of records in a database table and immediate retrieval of the inserted record with extensive query customization capabilities. This function is especially useful for applications requiring confirmation or additional processing of data upon insertion.

## Functionality

- Insertion: Inserts a new record into the specified table.
- Retrieval: Retrieves the newly inserted record with options for joining other tables, sorting, filtering, and aggregation.

Parameters
The function accepts the following parameters:

- req: The HTTP request object (not used in the current implementation but included for potential request-based logic).
- res: The HTTP response object (not directly used but included for completeness and potential future enhancements).
- An options object containing:
  - tableName: Name of the database table to insert the new record into.
  - data: An object containing the data to be inserted.
  - returnFields: Fields to be returned in the select query, defaults to "\*".
  - excludeFields: Fields to exclude in the return result.
  - joins: Array of join operations to perform in the select query.
  - sortField: Field to sort the select query results by.
  - sortOrder: Order of the sorting (ASC or DESC).
  - aggregates: Aggregate functions to include in the select query.
  - groupByOptions: Options for grouping the select query results.

```
  const { createOne } = require('./path/to/this/function');

async function addNewUser(userData) {
  try {
    const newUser = await createOne(null, null, {
      tableName: 'users',
      data: userData,
      returnFields: 'id, name, email',
      joins: [],
      sortField: 'id',
      sortOrder: 'ASC',
    });

    console.log('New user created:', newUser);
    return newUser;
  } catch (error) {
    console.error('Error creating new user:', error);
  }
}
```

- ## **`updateOne` Function Documentation**
  This document outlines the `updateOne` function, designed to update a single record in a specified table and retrieve the updated record. This utility is essential for operations requiring immediate feedback on database updates, such as web applications with real-time data display.

## Overview

The `updateOne` function combines database update and select operations into a single, atomic action. It ensures that any update made to the database can be reviewed or processed right after the update, leveraging transaction-like behavior for consistency and reliability.

## Functionality

- Update: Modifies a record in the specified table based on provided filters and data.
- Retrieve: Fetches the updated record for immediate use, allowing for operations such as validation, logging, or response construction.

Parameters
The function accepts the following parameters:

- req: The HTTP request object. While not directly used, it allows for request-based dynamic behavior in future enhancements.
- res: The HTTP response object. Included for consistency with Express middleware patterns, though not used directly.
- An options object containing:
  - tableName: Name of the table where the record will be updated.
  - data: An object containing the new data for the record.
  - filters: Conditions to locate the record to be updated.
  - returnFields: Specifies which fields of the updated record should be returned.
  - joins: Specifies any joins for the select query post-update.
  - notFoundMessage: Custom message to return or log if the updated record cannot be found.
  - successMessage: Message indicating successful update operation.

Usage Example

```
const { updateOne } = require('./path/to/updateOne');

async function modifyUser(userId, updates) {
  try {
    const updatedUser = await updateOne(null, null, {
      tableName: 'users',
      data: updates,
      filters: [{ field: 'id', operator: '=', value: userId }],
      returnFields: 'id, name, email',
    });

    console.log(updatedUser ? 'User updated successfully' : 'User not found');
    return updatedUser;
  } catch (error) {
    console.error('Error updating user:', error);
    throw error; // Or handle error as needed
  }
}
```

- ## **`getOne` Function Documentation**
  This document details the `getOne` function, an essential utility for querying a single record from a specified table in a database. It supports complex queries, including filtering, sorting, and joining with other tables, tailored to efficiently fetch precisely the needed data.

## Overview

The `getOne` function streamlines the process of retrieving a single record from the database. It is optimized for scenarios where a specific item is targeted, such as fetching user details by ID or looking up a product by its unique identifier. This function is built to ensure flexibility and efficiency in data retrieval operations.

## Functionality

- Retrieval: Fetches a single record from the specified table, with options for customization.
- Customization: Supports specifying fields to retrieve, applying filters for precise querying, sorting results, and joining with other tables.

Parameters

The function is designed to accept a configuration object with the following properties:

- tableName: The name of the database table from which to retrieve the record.
- fields: Specifies which fields of the record should be returned. Defaults to "\*", indicating all fields.
- joins: An array of join configurations to include related data from other tables.
  filters: Conditions to narrow down the search to a specific record.
- additionalOptions: Any additional options for grouping or aggregate functions.
- sortField: Specifies which field to sort the results by. Useful in conjunction with limit: 1 to ensure the desired record is returned.
- sortOrder: Determines the order of sorting, either "asc" (ascending) or "desc" (descending).

Usage Example

```
const { getOne } = require('./path/to/getOne');

   const userDetails = await getOne(null, null, {
      tableName: 'users',
      fields: 'id, name, email',
      filters: [{ field: 'id', operator: '=', value: userId }],
      sortOrder: 'asc',
    });
```

- ## **`getAll` Function Documentation**
  This document provides a comprehensive overview of the `getAll` function, which facilitates retrieving paginated and optionally filtered and sorted records from a database table. It's designed to support scalable data access patterns in web applications, APIs, and services requiring efficient data retrieval mechanisms.

## Overview

The `getAll` function is a versatile utility for querying multiple records with support for pagination, sorting, and filtering. It is built to ensure that applications can handle large datasets effectively by fetching only a subset of records at a time, according to the pagination parameters provided by the client.

## Functionality

- Pagination: Supports fetching a specific page of records with a defined number of items per page.
- Sorting: Allows sorting the results based on any field in ascending or descending order.
- Filtering and Joins: Facilitates complex queries with filters and joining related tables.
- Aggregation: Supports aggregate functions and grouping.

Parameters

The function is designed to dynamically handle query parameters based on the request:

- tableName: The name of the table from which records are fetched.
- fields: Specifies which fields of the records should be returned.
- aggregates: Specifies aggregate functions to include in the query.
- joins: Details of any tables to join.
- filters: Conditions to filter the records.
- additionalOptions: Any additional options for the query, such as group by clauses

The pagination and sorting parameters are extracted from the request query parameters:

- page: The current page number.
- limit: The number of records per page.
- sortField: The field by which to sort the records.
- sortOrder: The order of sorting, either asc or desc.

Usage Example

```
const { getAll } = require('./path/to/getAll');

const result = await getAll(req, res, {
      tableName: 'users',
      fields: 'id, name, email',
      filters: [{ field: 'status', operator: '=', value: 'active' }],
      sortField: 'created_at',
      sortOrder: 'desc',
    });
```

- ## **`deleteAll` `deleteOne` Function Documentation**
  This document details the implementation, usage, and error handling of two key data deletion functions: `deleteOne` and `deleteAll`. These functions provide the capability to delete records from a specified table in a database, supporting conditional deletion based on provided filters.

## Overview (`deleteOne`)

`deleteOne` is designed to delete a single record from a specified table, identified by a set of filters. It's particularly useful for deleting records by unique identifiers or specific criteria ensuring that only one record is affected.

Parameters

- tableName: The name of the table from which the record is to be deleted.
- filters: An array of filter objects specifying the criteria to identify the record to delete.

Usage Example

```
const { deleteOne } = require('./path/to/deleteOne');

  const deletedUser = await deleteOne(null, null, {
      tableName: 'users',
      filters: [{ field: 'id', operator: '=', value: userId }],
    });
```



## Overview (`deleteAll`)
`deleteAll` allows for the deletion of multiple records from a specified table, based on a set of filtering criteria. This function is useful for bulk deletion operations, such as removing all records that match certain conditions.


Parameters

- tableName: The name of the table from which the record is to be deleted.
- filters: An array of filter objects specifying the criteria to identify the record to delete. 

## Important Note on Using deleteAll Function
The deleteAll function provides flexibility in deleting records from a specified database table, allowing operations both with and without the use of filters.

- With Filters:
When filters are provided, deleteAll targets and deletes records that match the specified conditions. This is particularly useful for selectively removing records based on criteria such as status, date ranges, or any other field values.

Usage Example with Filters:


```
const { deleteAll } = require('./path/to/deleteAll');

// Deletes only 'inactive' users
const { deletedCount, deletedRecords } = await deleteAll(null, null, {
  tableName: 'users',
  filters: [{ field: 'status', operator: '=', value: 'inactive' }],
});
```
This approach ensures that only records meeting the filter criteria are removed, leaving other records in the table unaffected.

- Without Filters:
Omitting the filters parameter instructs deleteAll to remove all records from the specified table. Use this feature with caution, as it will clear the table entirely, which might be irreversible depending on your data backup and recovery strategies.

Usage Example without Filters:

```
const { deleteAll } = require('./path/to/deleteAll');

// Deletes all users from the 'users' table
const { deletedCount, deletedRecords } = await deleteAll(null, null, {
  tableName: 'users'
});
```
This functionality is suitable for scenarios requiring a complete reset of a table's data, such as initializing state for testing or clearing temporary data.

- Caution:
Be mindful when using deleteAll without filters, as it will irrevocably remove all records from the targeted table. Always ensure you have adequate backups or recovery mechanisms in place, especially in production environments.


- ## **Database Operations Documentation**
  This document outlines the functionality and usage of key database operation utilities within our application. These utilities are designed to abstract and simplify common database interactions such as creating, updating, querying, deleting, and counting records.

## Overview

Our database operation utilities are part of a larger framework to facilitate interaction with PostgreSQL databases. They leverage the pg module's pool for database connection pooling and execute SQL queries safely using parameterized queries.

### Installation

Before using these utilities, ensure you have configured your PostgreSQL database and the pg module is installed and set up correctly in your project.

## **Functions**

### `insertRecord(tableName, data)`

Parameters:

- tableName: The name of the table where the record will be inserted.
- data: An object containing key-value pairs representing the - columns and their values to be inserted.
- Returns: The id of the inserted record.

Usage Example:

```
const { insertRecord } = require('./path/to/dbOperations');
await insertRecord('users', { name: 'Jane Doe', email: 'jane@example.com' });
```

### `updateRecord(tableName, data, filters)`

Updates records in the specified table based on provided filters.

Parameters:

- tableName: The name of the table to update.
- data: An object with the fields to update and their new values.
- filters: An array of filter objects to specify which records to update.
- Returns: The first updated record.

Usage Example:

```
const { updateRecord } = require('./path/to/dbOperations');
await updateRecord('users', { email: 'newemail@example.com' }, [{ field: 'name', operator: '=', value: 'Jane Doe' }]);
```

### `selectQuery(options)`

Performs a select query with various options for customization.

Parameters:

- options: An object containing various options to customize the SELECT query, such as tableName, fields, filters, sorting, and pagination.
- Returns: An array of records that match the query criteria.

Usage Example:

```
const { selectQuery } = require('./path/to/dbOperations');
const users = await selectQuery({
  tableName: 'users',
  fields: 'name, email',
  filters: [{ field: 'name', operator: '=', value: 'Jane Doe' }],
  sortField: 'created_at',
  sortOrder: 'DESC',
});

```

### deleteRecords(tableName, filters, returnDeleted)

Deletes records from the specified table based on filters.

Parameters:

- tableName: The name of the table from which records will be deleted.
- filters: An array of filter objects to specify which records to delete.
- returnDeleted: A boolean indicating whether to return the deleted records.
- Returns: An array of deleted records if returnDeleted is true; otherwise, an empty array.

Usage Example:

```
const { deleteRecords } = require('./path/to/dbOperations');
const deletedUsers = await deleteRecords('users', [{ field: 'name', operator: '=', value: 'Jane Doe' }], true);
```

### `countRecords(tableName, filters, joins)`

Counts the number of records in the specified table, optionally applying filters and joins.

Parameters:

- tableName: The name of the table to count records from.
- filters: An array of filter objects to apply.
  joins: An array of join objects to include in the count query.
- Returns: The count of records.

Usage Example:

```
const { countRecords } = require('./path/to/dbOperations');
const userCount = await countRecords('users', [{ field: 'active', operator: '=', value: true }]);
```

- ## **SQL Query Helper Functions Documentation**

This document provides detailed information about the utility functions designed to facilitate the building of dynamic SQL queries. These utilities help construct parts of SQL queries such as JOIN clauses, WHERE clauses, ORDER BY clauses, aggregate functions, and GROUP BY clauses.

## Overview

The SQL query helper functions abstract the complexity of constructing SQL queries with conditional logic, multiple joins, filters, sorting, aggregations, and grouping. They are designed to be modular and reusable across various parts of the application that interact with the database.

### **Functions**

- ### `buildJoinClause(joins)`
  Constructs the JOIN part of an SQL query.

Parameters:

- joins: An array of objects, each representing a join. Each object must have type (optional), table, and condition properties.
  -Returns: A string representing the JOIN clause of an SQL query.

Usage Example:

```
const joins = [
  { type: 'LEFT JOIN', table: 'departments', condition: 'users.department_id = departments.id' }
];
const joinClause = buildJoinClause(joins);
```

- ### `buildWhereClause(filters, startIndex)`

Builds the WHERE part of an SQL query.

Parameters:

- filters: An array of filter objects, each with field, operator, and value properties.
- startIndex: An optional integer to offset the parameter placeholders.
- Returns: An object with clause (string) and values (array) properties for the WHERE clause.

Usage Example:

```
const filters = [{ field: 'name', operator: '=', value: 'John Doe' }];
const { clause, values } = buildWhereClause(filters);
```

- ### `getSortClause(sortField, sortOrder)`

Generates the ORDER BY part of an SQL query.

Parameters:

- sortField: The column name to sort by.
  sortOrder: The direction of sorting (ASC or DESC).
- Returns: A string representing the ORDER BY clause of an SQL query.

```
const sortClause = getSortClause('created_at', 'desc');
```

- ### `buildAggregateClause(aggregates)`

Creates the SQL for aggregate functions.

Parameters:

- aggregates: An array of objects, each with function, field, and alias properties.
- Returns: A string representing the aggregate functions to include in the SELECT part of an SQL query.

Usage Example:

```
const aggregates = [{ function: 'COUNT', field: '*', alias: 'total_users' }];
const aggregateClause = buildAggregateClause(aggregates);
```

- ### `buildGroupByClause(options)`

Generates the GROUP BY part of an SQL query.

Parameters:

- options: An object with a groupBy property specifying the column names to group by.
- Returns: A string representing the GROUP BY clause of an SQL query.

Usage Example:

```
const options = { groupBy: 'department_id' };
const groupByClause = buildGroupByClause(options);
```
