# __CRUD HELPER and Error Handling Documentation__
This documentation encompasses a broad array of utilities designed to streamline CRUD operations, cloud-based image management, and consistent API response handling within the application. These utilities ensure efficient data manipulation, effective error handling, and seamless integration with cloud storage services.

## Overview

Our application's backend utilities are structured to support:

- __CRUD Operations__: Facilitating create, read, update, and delete functionalities with support for complex queries and transactions.
- __Cloud Image Management__: Handling image uploads and updates through Cloudinary, including bulk deletion and record-associated image management.
- __Standardized Responses and Error Handling__: Offering a unified approach to API responses and custom error management, enhancing the API's reliability and usability.


## Cloud Image Management Utilities

`uploadImage`

Handles the upload of new images to Cloudinary or updates existing ones, attaching the image reference to the specified record.

`deleteCloudImage`

Removes a specific image associated with a record from Cloudinary, ensuring data consistency and efficient storage usage.

`deleteAllCloudImages`

Facilitates the bulk deletion of images within a specified table and column from Cloudinary, ideal for cleanup operations.


## CRUD Operation Utilities
`buildDataObject`

Constructs a data object for insertion into the database from the HTTP request body.

Parameters

- req: The HTTP request object.
- tableName: The name of the database table. (Currently unused but included for potential future enhancements.)

Usage Example

```
let data = await buildDataObject(req, 'users', 'profile_picture');
```

### `createRecord`

Inserts new records into the database with optional data structuring and real-time feedback upon successful creation.

### `updateRecord`

Updates records based on provided criteria, supporting dynamic data changes and immediate reflection of updates.

### `getOneRecord` & `getAllRecords`

Retrieves individual or multiple records with extensive support for filtering, sorting, and pagination.

### `deleteRecord` & `deleteAllRecords`

Enables the deletion of single or multiple records, with optional cloud image deletion to maintain storage integrity.

### Response and Error Handling Utilities

`sendSuccessResponse` & `handleAddError`

- Ensures consistent API success responses and comprehensive error handling across various operation outcomes.

`handleGetOneError` & `handleGetAllError`

- Specialized error handling for record retrieval operations, providing clear feedback on operation results
