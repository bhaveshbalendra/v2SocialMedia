# v2SocialMedia

A modern, full-stack social media platform built with cutting-edge technologies. This project features a React TypeScript frontend with a robust Node.js backend, real-time messaging capabilities, and a comprehensive notification system.

## 🚀 Features

### Core Social Features

- **User Authentication & Authorization** - Secure JWT-based authentication
- **User Profiles** - Customizable user profiles with avatars and bio
- **Posts & Content Sharing** - Create, edit, and share posts with media support
- **Social Interactions** - Like, comment, and share posts
- **Follow System** - Follow/unfollow users with follow requests
- **Real-time Messaging** - Direct messaging with Socket.IO
- **Notifications** - Comprehensive notification system for all social interactions

### Advanced Features

- **Real-time Updates** - Live updates for messages, notifications, and social interactions
- **Media Upload** - Image upload with Cloudinary integration
- **Rate Limiting** - API protection against abuse
- **Responsive Design** - Mobile-first responsive UI
- **Dark/Light Theme** - Theme switching capability
- **Settings Management** - User preferences and account settings

## 🛠️ Tech Stack

### Frontend

- **React 19** - Latest React with modern hooks and features
- **TypeScript** - Type-safe development
- **Vite** - Fast build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **shadcn/ui** - Modern UI components
- **Redux Toolkit** - State management
- **React Router** - Client-side routing
- **Socket.IO Client** - Real-time communication
- **React Hook Form** - Form handling
- **Zod** - Schema validation

### Backend

- **Node.js** - JavaScript runtime
- **Express.js** - Web application framework
- **TypeScript** - Type-safe server development
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB object modeling
- **Socket.IO** - Real-time communication
- **JWT** - Authentication tokens
- **Cloudinary** - Media storage and optimization
- **Multer** - File upload handling
- **bcryptjs** - Password hashing

## 📁 Project Structure

```
v2SocialMedia/
├── frontend/          # React TypeScript frontend
│   ├── src/
│   │   ├── components/    # Reusable UI components
│   │   ├── pages/         # Page components
│   │   ├── hooks/         # Custom React hooks
│   │   ├── store/         # Redux store and slices
│   │   ├── routes/        # Routing configuration
│   │   ├── types/         # TypeScript type definitions
│   │   ├── utils/         # Utility functions
│   │   └── config/        # Configuration files
│   ├── public/            # Static assets
│   └── package.json       # Frontend dependencies
├── backend/           # Node.js Express backend
│   ├── src/
│   │   ├── controller/    # API controllers
│   │   ├── models/        # Database models
│   │   ├── routes/        # API routes
│   │   ├── middleware/    # Custom middleware
│   │   ├── service/       # Business logic services
│   │   ├── types/         # TypeScript type definitions
│   │   ├── utils/         # Utility functions
│   │   └── config/        # Configuration files
│   └── package.json       # Backend dependencies
└── README.md          # This file
```

## 🚀 Quick Start

### Prerequisites

- Node.js (v18 or higher)
- MongoDB (local or MongoDB Atlas)
- npm or yarn

### Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd v2SocialMedia
   ```

2. **Backend Setup**

   ```bash
   cd backend
   npm install
   ```

3. **Frontend Setup**

   ```bash
   cd ../frontend
   npm install
   ```

4. **Environment Configuration**

   - Create `.env` file in the backend directory with required environment variables
   - Check backend README for detailed environment setup

5. **Start Development Servers**

   Backend (from backend directory):

   ```bash
   npm run dev
   ```

   Frontend (from frontend directory):

   ```bash
   npm run dev
   ```

6. **Access the Application**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:8000

## 📚 Documentation

- [Frontend Documentation](./frontend/README.md) - Detailed frontend setup and development guide
- [Backend Documentation](./backend/README.md) - API documentation and backend setup guide

## 🔗 API Endpoints

The backend provides a comprehensive REST API:

- `/api/v2/auth` - Authentication (login, signup, logout)
- `/api/v2/posts` - Post management (CRUD operations)
- `/api/v2/users` - User management
- `/api/v2/profiles` - User profiles
- `/api/v2/follows` - Follow/unfollow functionality
- `/api/v2/likes` - Post and comment likes
- `/api/v2/comments` - Comment management
- `/api/v2/notifications` - Notification system
- `/api/v2/settings` - User settings

## 🔄 Real-time Features

The application uses Socket.IO for real-time functionality:

- Live messaging
- Real-time notifications
- Online status tracking
- Live post updates

## 🎨 UI/UX

- Modern, clean design with shadcn/ui components
- Responsive layout for all screen sizes
- Dark/Light theme support
- Smooth animations and transitions
- Intuitive user experience

## 🔒 Security Features

- JWT-based authentication
- Password hashing with bcryptjs
- Rate limiting for API protection
- Input validation and sanitization
- CORS configuration
- Environment-based configuration

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the ISC License.

## 👥 Authors

- **Development Team** - Initial work and ongoing development

## 🚧 Development Status

This project is actively under development. New features and improvements are continuously being added.

## 📞 Support

For support, email [bhaveshbalendra@gmail.com] or create an issue in the repository.
