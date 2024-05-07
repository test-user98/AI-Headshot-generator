# AI-Headshot-generator
Add your prompt and generate a professional headshot of your face.

- Create training
    - https://replicate.com/blog/dreambooth-api
- Create ai photos
    - https://replicate.com/replicate/dreambooth/readme

## Overview

The project structure includes separate servers for training and testing data, along with a Replicate Service module for interacting with the Replicate API.

## Training Server (`train.js`)

- Handles the logic for training data.
- Exposes APIs for starting training, checking training status, and retrieving instance data.
- Utilizes the `multer` module for handling multipart/form-data to upload zip files.
- Relies on the Replicate API for training.

## Replicate Service (`replicateService.js`)

- Defines a class with methods for interacting with the Replicate API.
- Contains methods for fetching instance data and testing image data.

## Testing Server (`test.js`)

- Calls the Replicate Service to generate headshots using the testing API.
- Uses the instance data obtained from the training server for testing.

## Usage

To run the project:

1. Install dependencies: `npm install`
2. Start the training server: `node train.js`
3. Start the testing server: `node test.js`
4. Access the endpoints as described in each server file.

## Dependencies

- [Express](https://expressjs.com/): Fast, unopinionated, minimalist web framework for Node.js.
- [Multer](https://www.npmjs.com/package/multer): Middleware for handling multipart/form-data, used for uploading files.
- [Axios](https://axios-http.com/): Promise-based HTTP client for the browser and Node.js.
- [fs](https://nodejs.org/api/fs.html): File system module for interacting with the file system in Node.js.
- [FormData](https://www.npmjs.com/package/form-data): A FormData implementation for Node.js, useful for creating form-data payloads when making HTTP requests.

## Note

Ensure that you have the required API tokens and permissions to access the Replicate Dreambooth API and other necessary services.

## Contributors

- [Jai Sipani](https://github.com/test-user98)



