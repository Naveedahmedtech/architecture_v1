# __Comprehensive CRUD Operations and Cloud Image Management Documentation__
This document details the application's approach to handling CRUD operations, cloud image management, and response handling. It describes how various utilities are employed to perform database interactions, manage images on Cloudinary, and ensure uniform response structures.

## Overview

Our application leverages a suite of helper utilities to facilitate:

- __CRUD Operations__: Creating, reading, updating, and deleting records within the database.

- __Cloud Image Management__: Uploading, updating, and deleting images associated with records.

- __Standardized Response Handling__: Providing consistent success and error responses across API endpoints.

## CRUD Operations

### Creating Records

- Utility Used: createRecord
#### Process:
Build a data object from the request body using buildDataObject.
Optionally handle file uploads with uploadFile if an image or file is part of the record.
Create a new record in the specified table with createRecord.
Send a success response using sendSuccessResponse.
Updating Records

- Utility Used: updateRecord

#### Process:
Build an update data object, excluding the ID from the request body using buildUpdateDataObject.
Check the existence of the record with checkRecord.
If a file is provided, update or upload the image using uploadImage.
Apply updates to the record with updateRecord.
Send a success response using sendUpdateSuccessResponse.
Reading Records

- Utility Used: getOneRecord, getAllRecords
#### Process:
Retrieve a single record with getOneRecord or multiple records with getAllRecords, based on request parameters.
Send a success response with the retrieved data using sendUpdateSuccessResponse.
Deleting Records

- Utility Used: deleteRecord, deleteAllRecord
#### Process:
For single record deletion, optionally delete associated cloud images with deleteCloudImage.
Delete the record(s) using deleteRecord or deleteAllRecord for bulk deletion.
Send a success response upon successful deletion using sendUpdateSuccessResponse.
Cloud Image Management
Image Upload and Update

- Utility Used: uploadImage
#### Process:
During record creation or update, check if a file is provided.
Upload a new image or update an existing one on Cloudinary.
Attach the image reference to the record's data object.
Image Deletion

- Utility Used: deleteCloudImage, deleteAllCloudImages
#### Process:
Before deleting a record, remove the associated image from Cloudinary with deleteCloudImage.
For bulk deletion, use deleteAllCloudImages to remove all related images.

- Response and Error Handling
  - Success Response: Utilize sendSuccessResponse to send back a uniform success message along with the data.
  - Error Handling: Employ handleAddError, handleUpdateError, handleGetOneError, and handleDeleteError to manage errors specific to each operation, ensuring detailed and appropriate feedback is provided for failures.
