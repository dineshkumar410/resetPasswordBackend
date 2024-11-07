# Password Reset Application

## Overview

A Node.js application for user to create an accound and reset forgotten password via email.

## Tech Stack

- Node.js
- Express.js
- Nodemailer
- MongoDB with Mongoose
- Postman for API documentation

## Features

- Create an account providing email and password.
- Go to forgot password, enter your email and a token will be generated which will be valid for 1 hour.
- You'll recieve an email with a link to reset password.
- Enter a new password on that link and your password will be updated in db.
- Reset token and expiry time that was stored previously in db will be discarded.

## API Endpoints

- `POST /api/auth/user` - Register a user
- `POST /api/auth/forgot-password` - Youe email should be provided
- `POST /api/auth/reset-password` - Get user information by passing the token
