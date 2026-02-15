# Learning Backend

A Node.js Express backend application for learning backend development with MongoDB, user authentication, and file upload capabilities.

## 📋 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Installation](#installation)
- [Environment Variables](#environment-variables)
- [Running the Application](#running-the-application)
- [API Endpoints](#api-endpoints)

## ✨ Features

- User registration with avatar and cover image upload
- User authentication (login/logout) with JWT
- Password management (change password)
- Profile management (update user details, avatar, cover image)
- User channel profile retrieval
- Watch history tracking
- Secure routes with JWT verification
- File upload to Cloudinary
- MongoDB database integration

## 🛠 Tech Stack

- **Node.js** - JavaScript runtime
- **Express.js** (v5.2.1) - Web framework
- **MongoDB** - Database
- **Mongoose** (v9.2.1) - ODM for MongoDB
- **JWT** - Authentication tokens
- **Bcrypt** - Password hashing
- **Multer** - File upload handling
- **Cloudinary** - Cloud image storage
- **CORS** - Cross-origin resource sharing
- **Cookie-parser** - Cookie parsing
- **Dotenv** - Environment variable management

## 📁 Project Structure

```
backEnd/
├── public/                 # Static files
├── src/
│   ├── app.js             # Express app configuration
│   ├── constants.js       # Application constants
│   ├── index.js           # Application entry point
│   ├── DB/
│   │   └── index.js       # Database connection
│   ├── contollers/
│   │   └── user.controller.js  # User business logic
│   ├── middelware/
│   │   ├── aouth.middelware.js # JWT verification
│   │   └── multer.middelware.js # File upload handling
│   ├── models/
│   │   ├── subscription.model.js
│   │   ├── user.model.js
│   │   └── video.model.js
│   ├── routes/
│   │   └── user.routes.js  # User API routes
│   └── utilities/
│       ├── apiErr.js       # API error handling
│       ├── apiRes.js       # API response formatting
│       ├── asyncHandler.js # Async error wrapper
│       └── clodinary.js    # Cloudinary configuration
├── .env                   # Environment variables
├── .gitignore
├── package.json
└── readme.md
```

## 🚀 Installation

1. Clone the repository
```bash
git clone https://github.com/chirag-6911/learning-backend.git
cd backEnd
```

2. Install dependencies
```bash
npm install
```

3. Create a `.env` file in the root directory and add your environment variables (see below)

## ⚙️ Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
# MongoDB Connection String
mongoDb=mongodb://localhost:27017

# Port Number
port=8000



# Other environment variables as needed
```

## 🏃 Running the Application

### Development Mode
```bash
npm run dev
```

The server will start on the port specified in your `.env` file (default: 8000).

The application will:
1. Connect to MongoDB database named "learning"
2. Start the Express server
3. Log connection status to console

## 📡 API Endpoints

### User Routes (`/api/v1/user`)

#### Public Routes

- **POST** `/register` - Register a new user
  - Body: user details, avatar, coverimage
  - Multer middleware handles file uploads

- **POST** `/login` - Login user
  - Body: email, password

- **POST** `/refresh-token` - Refresh access token
  - Body: refresh token

- **GET** `/c/:username` - Get user channel profile
  - Params: username

#### Secured Routes (Require JWT Token)

- **POST** `/logout` - Logout user
  - Headers: Authorization: Bearer <access_token>

- **POST** `/changePassword` - Change user password
  - Headers: Authorization: Bearer <access_token>
  - Body: oldPassword, newPassword

- **GET** `/current-user` - Get current user details
  - Headers: Authorization: Bearer <access_token>

- **PATCH** `/update-userdetails` - Update user details
  - Headers: Authorization: Bearer <access_token>
  - Body: fields to update

- **PATCH** `/update-avatar` - Update user avatar
  - Headers: Authorization: Bearer <access_token>
  - Body: avatar file

- **PATCH** `/update-coverimage` - Update cover image
  - Headers: Authorization: Bearer <access_token>
  - Body: coverimage file

- **GET** `/history` - Get user watch history
  - Headers: Authorization: Bearer <access_token>



used postman to chech the api's

## 🔐 Authentication

The application uses JWT (JSON Web Tokens) for authentication:

1. Login endpoint returns an access token and a refresh token
2. Access tokens are stored in HTTP-only cookies
3. Protected routes require a valid JWT token in the Authorization header
4. Access tokens can be refreshed using the `/refresh-token` endpoint

## 📝 Notes

- The database name is set to "learning" (defined in `src/constants.js`)
- DNS servers are configured to use Cloudflare (1.1.1.1) and Google (8.8.8.8) for MongoDB connection
- File uploads are handled by Multer middleware
- Images are stored on Cloudinary
- CORS is configured to allow requests from the specified origin


 👤 Author
Chirag