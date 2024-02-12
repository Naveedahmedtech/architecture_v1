# Response Handling and Custom Error Documentation
This document provides an overview of the utilities designed for handling API responses and errors in a consistent and informative manner. These utilities include mechanisms for generating standardized success and error responses, as well as a custom error class for enhanced error management.

## Overview
The response handling system is designed to standardize the structure of API responses, ensuring that both success and error states are communicated effectively to the client. It includes a mapping of HTTP status codes to custom codes, a method for creating error and success responses, and a custom error class for precise error throwing.

## Components
`statusCodeMap`

A dictionary object that maps HTTP status codes to custom message codes, enabling a more granular description of response states beyond the standard HTTP status messages.

## CustomError Class
A custom error class extending the native JavaScript Error. It includes a code for the error type and an originalError object for storing the original error data, if any.

### Constructor Parameters
- code: A string representing the custom error code.
- message: A descriptive message associated with the error.
- originalError: (Optional) The original error object.

`createErrorResponse`
Generates a standardized error response object.

### Parameters
- req: The HTTP request object.
- status: HTTP status code of the error.
- success: Boolean indicating the failure of the operation.
- message: A descriptive message of the error.
- details: (Optional) Additional details about the error.

`createSuccessResponse`
Generates a standardized success response object.

### Parameters
- req: The HTTP request object.
- status: HTTP status code of the response.
- success: Boolean indicating the success of the operation.
- message: A descriptive message of the success.
- result: The payload of the success response.

`responseHandler`
A unified function to handle and return either success or responses based on the status code and provided data.

### Parameters
- req: The HTTP request object.
- res: The HTTP response object.
- status: HTTP status code of the response.
- success: Boolean indicating the success or failure of the operation.
- message: A descriptive message of the response.
- result: (Optional) The payload for success responses.
- details: (Optional) Additional details for error responses.
