# v2SocialMedia Backend

A robust Node.js backend API for the v2SocialMedia platform. Built with Express.js, TypeScript, MongoDB, and Socket.IO to provide a scalable social media backend with real-time capabilities.

## 🚀 Features

### Core API Features

- **Authentication & Authorization** - JWT-based secure authentication
- **User Management** - Complete user CRUD operations
- **Posts Management** - Create, read, update, delete posts
- **Social Interactions** - Like, comment, share functionality
- **Follow System** - Follow/unfollow users with follow requests
- **Real-time Messaging** - Socket.IO powered messaging
- **Notifications** - Comprehensive notification system
- **Media Upload** - Image upload with Cloudinary integration

### Advanced Features

- **Rate Limiting** - Protection against API abuse
- **Data Validation** - Input validation with Joi
- **Error Handling** - Centralized error handling
- **File Upload** - Multer integration for file handling
- **Image Processing** - Sharp for image optimization
- **Socket Authentication** - Secure WebSocket connections

## 🛠️ Tech Stack

- **Node.js** - JavaScript runtime environment
- **Express.js** - Web application framework
- **TypeScript** - Type-safe JavaScript development
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB object modeling
- **Socket.IO** - Real-time bidirectional communication
- **JWT** - JSON Web Tokens for authentication
- **bcryptjs** - Password hashing
- **Cloudinary** - Cloud-based image storage
- **Multer** - File upload middleware
- **Sharp** - Image processing
- **Joi** - Data validation
- **CORS** - Cross-origin resource sharing

## 📁 Project Structure

```
backend/
├── src/
│   ├── config/           # Configuration files
│   │   ├── app.config.ts     # Application configuration
│   │   └── mongoDB.config.ts # Database configuration
│   ├── controller/       # API controllers
│   │   ├── auth.controller.ts
│   │   ├── post.controller.ts
│   │   ├── user.controller.ts
│   │   ├── notification.controller.ts
│   │   └── ...
│   ├── middleware/       # Custom middleware
│   │   ├── auth.middleware.ts
│   │   ├── error.middleware.ts
│   │   └── validation.middleware.ts
│   ├── models/          # Database models
│   │   ├── user.model.ts
│   │   ├── post.model.ts
│   │   ├── notification.model.ts
│   │   ├── message.model.ts
│   │   └── ...
│   ├── routes/          # API routes
│   │   ├── auth.routes.ts
│   │   ├── post.routes.ts
│   │   ├── user.route.ts
│   │   └── ...
│   ├── service/         # Business logic services
│   ├── types/           # TypeScript type definitions
│   ├── utils/           # Utility functions
│   │   ├── socket.util.ts
│   │   ├── rateLimiter.util.ts
│   │   └── ...
│   └── server.ts        # Application entry point
├── responses/           # API response examples
├── package.json
├── tsconfig.json
└── README.md
```

## 🚀 Quick Start

### Prerequisites

- Node.js (v18 or higher)
- MongoDB (local installation or MongoDB Atlas)
- npm or yarn

### Installation

1. **Navigate to backend directory**

   ```bash
   cd backend
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Environment Setup**
   Create a `.env` file in the backend root directory:

   ```env
   # Database
   MONGODB_URI=mongodb://localhost:27017/v2socialmedia
   # or for MongoDB Atlas:
   # MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/v2socialmedia

   # JWT
   JWT_SECRET=your-super-secret-jwt-key
   JWT_EXPIRES_IN=7d

   # Server
   PORT=8000
   NODE_ENV=development

   # Cloudinary (for image uploads)
   CLOUDINARY_CLOUD_NAME=your-cloud-name
   CLOUDINARY_API_KEY=your-api-key
   CLOUDINARY_API_SECRET=your-api-secret

   # CORS
   ALLOWED_ORIGINS=http://localhost:5173,http://localhost:3000
   ```

4. **Start the development server**

   ```bash
   npm run dev
   ```

5. **Build for production**
   ```bash
   npm run build
   npm start
   ```

## 📚 API Documentation

### Base URL

```
Development: http://localhost:8000/api/v2
Production: https://your-domain.com/api/v2
```

### Authentication Endpoints

#### POST `/auth/signup`

Register a new user

```json
{
  "username": "bhavesh",
  "email": "bhavesh@example.com",
  "password": "securePassword123",
  "firstName": "bhavesh",
  "lastName": "balendra"
}
```

#### POST `/auth/login`

Login user

```json
{
  "email": "bhavesh@example.com",
  "password": "securePassword123"
}
```

#### POST `/auth/logout`

Logout user (requires authentication)

### Posts Endpoints

#### GET `/posts`

Get all posts (with pagination)

- Query params: `page`, `limit`, `userId`

#### POST `/posts`

Create a new post (requires authentication)

```json
{
  "content": "This is my new post!",
  "images": ["image_url_1", "image_url_2"]
}
```

#### GET `/posts/:id`

Get specific post by ID

#### PUT `/posts/:id`

Update post (requires authentication)

#### DELETE `/posts/:id`

Delete post (requires authentication)

### Users Endpoints

#### GET `/users/profile/:id`

Get user profile

#### PUT `/users/profile`

Update user profile (requires authentication)

#### GET `/users/search`

Search users

- Query params: `q` (search query)

### Follow Endpoints

#### POST `/follows/follow/:userId`

Follow a user (requires authentication)

#### POST `/follows/unfollow/:userId`

Unfollow a user (requires authentication)

#### GET `/follows/followers/:userId`

Get user's followers

#### GET `/follows/following/:userId`

Get users that user is following

### Likes Endpoints

#### POST `/likes/post/:postId`

Like/unlike a post (requires authentication)

#### POST `/likes/comment/:commentId`

Like/unlike a comment (requires authentication)

### Comments Endpoints

#### GET `/comments/post/:postId`

Get comments for a post

#### POST `/comments`

Create a comment (requires authentication)

```json
{
  "postId": "post_id",
  "content": "Great post!"
}
```

#### DELETE `/comments/:id`

Delete comment (requires authentication)

### Notifications Endpoints

#### GET `/notifications`

Get user notifications (requires authentication)

#### PUT `/notifications/:id/read`

Mark notification as read (requires authentication)

#### PUT `/notifications/mark-all-read`

Mark all notifications as read (requires authentication)

## 🔄 Real-time Features (Socket.IO)

### Events

#### Client to Server

- `join_room` - Join a chat room
- `send_message` - Send a message
- `typing_start` - Start typing indicator
- `typing_stop` - Stop typing indicator

#### Server to Client

- `message_received` - New message received
- `notification_received` - New notification
- `user_online` - User came online
- `user_offline` - User went offline
- `typing_start` - Someone started typing
- `typing_stop` - Someone stopped typing

### Authentication

Socket connections are authenticated using JWT tokens passed during connection.

## 🔒 Security Features

### Authentication

- JWT tokens with configurable expiration
- Password hashing with bcryptjs
- Protected routes requiring authentication

### Rate Limiting

- Global rate limiting (configurable)
- Endpoint-specific rate limits
- IP-based request tracking

### Validation

- Input validation with Joi schemas
- Type checking with TypeScript
- Sanitization of user inputs

### CORS

- Configurable allowed origins
- Credential support
- Method restrictions

## 🗄️ Database Models

### User Model

- Authentication information
- Profile data (name, bio, avatar)
- Account settings
- Timestamps

### Post Model

- Content and media
- Author reference
- Like and comment counts
- Timestamps

### Comment Model

- Comment content
- Post and author references
- Like counts
- Timestamps

### Notification Model

- Recipient and sender
- Notification type and content
- Entity references
- Read status

### Message Model

- Conversation and sender references
- Message content
- Timestamps

### Follow Request Model

- Requester and requested user
- Request status
- Timestamps

## 🧪 Testing

Run tests (when implemented):

```bash
npm test
```

## 📝 Environment Variables

| Variable                | Description               | Required | Default               |
| ----------------------- | ------------------------- | -------- | --------------------- |
| `MONGODB_URI`           | MongoDB connection string | Yes      | -                     |
| `JWT_SECRET`            | JWT signing secret        | Yes      | -                     |
| `JWT_EXPIRES_IN`        | JWT expiration time       | No       | 7d                    |
| `PORT`                  | Server port               | No       | 8000                  |
| `NODE_ENV`              | Environment mode          | No       | development           |
| `CLOUDINARY_CLOUD_NAME` | Cloudinary cloud name     | Yes\*    | -                     |
| `CLOUDINARY_API_KEY`    | Cloudinary API key        | Yes\*    | -                     |
| `CLOUDINARY_API_SECRET` | Cloudinary API secret     | Yes\*    | -                     |
| `ALLOWED_ORIGINS`       | CORS allowed origins      | No       | http://localhost:3000 |

\*Required for image upload functionality

## 🚀 Deployment

### Production Build

```bash
npm run build
```

### Production Start

```bash
npm start
```

### Docker (if implemented)

```bash
docker build -t v2socialmedia-backend .
docker run -p 8000:8000 v2socialmedia-backend
```

## 🤝 Contributing

1. Follow TypeScript best practices
2. Add proper error handling
3. Include input validation
4. Write meaningful commit messages
5. Update documentation for new endpoints

## 📞 Support

For backend-specific issues:

- Check server logs for errors
- Verify environment variables
- Ensure MongoDB connection
- Check API endpoint documentation

## 🔗 Related

- [Frontend Documentation](../frontend/README.md)
- [Project Overview](../README.md)
