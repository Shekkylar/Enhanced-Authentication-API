# Enhanced Authentication API

This repository contains the documentation for the Enhanced Authentication API.

## Overview

The Enhanced Authentication API provides endpoints for user management, authentication, and profile viewing.

### Base URL

The base URL for the API is: `https://enhanced-authentication-api.onrender.com/api`

### Endpoints

1. **Create User**
   Create a new user account.
   
   - **URL**: `/users`
   - **Method**: `POST`
   - **Request Body**:
     ```json
     {
         "username": "newuser",
         "email": "newuser5@example.com",
         "password": "password123",
         "phone": "1234567890",
         "isPublic": false,
         "role": "user"
     }
     ```
   - **Response**:
     - `200 OK` if user created successfully
     - `400 Bad Request` if request parameters are invalid
     - `409 Conflict` if email already exists

2. **User Login**
   Log in user and generate JWT token.
   
   - **URL**: `/login`
   - **Method**: `POST`
   - **Request Body**:
     ```json
     {
         "email": "newuser1@example.com",
         "password": "password123"
     }
     ```
   - **Response**:
     - `200 OK` if login successful, JWT token generated
     - `401 Unauthorized` if invalid credentials

3. **Retrieve User Profile**
   Retrieve user's own profile.
   
   - **URL**: `/myprofile`
   - **Method**: `GET`
   - **Request Headers**:
     ```plaintext
     Authorization: <JWT Token>
     ```
   - **Response**:
     - `200 OK` if profile retrieved successfully
     - `401 Unauthorized` if invalid or missing JWT token

4. **Retrieve All Profiles**
   Retrieve all profiles based on user's role.
   
   - **URL**: `/profiles/all`
   - **Method**: `GET`
   - **Request Headers**:
     ```plaintext
     Authorization: <JWT Token>
     ```
   - **Response**:
     - `200 OK` if profiles retrieved successfully
     - `401 Unauthorized` if invalid or missing JWT token

## Examples

### Postman
You can import the provided [Postman collection](#) to test the API endpoints.

### cURL Examples

# Create User
curl --location 'https://enhanced-authentication-api.onrender.com/api/users' \
--header 'Content-Type: application/json' \
--data-raw '{
    "username": "newuser",
    "email": "newuser5@example.com",
    "password": "password123",
    "phone": "1234567890",
    "isPublic": false,
    "role": "user"
}'

# User Login
curl --location 'https://enhanced-authentication-api.onrender.com/api/login' \
--header 'Content-Type: application/json' \
--data-raw '{
    "email": "newuser1@example.com",
    "password": "password123"
}'

# Retrieve User Profile
curl --location 'https://enhanced-authentication-api.onrender.com/api/myprofile' \
--header 'Authorization: <JWT Token>'

# Retrieve All Profiles
curl --location 'https://enhanced-authentication-api.onrender.com/api/profiles/all' \
--header 'Authorization: <JWT Token>'


Replace <JWT Token> with the actual JWT token obtained after logging in for requests that require authorization.
