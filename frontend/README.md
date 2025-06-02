# v2SocialMedia Frontend

A modern React TypeScript frontend for the v2SocialMedia platform. Built with cutting-edge technologies including React 19, Vite, Tailwind CSS, and shadcn/ui components to deliver a beautiful and responsive social media experience.

## 🚀 Features

### Core UI Features

- **Modern React 19** - Latest React with concurrent features
- **TypeScript** - Full type safety throughout the application
- **Responsive Design** - Mobile-first approach with Tailwind CSS
- **Component Library** - shadcn/ui components for consistent design
- **Dark/Light Theme** - Theme switching with next-themes
- **Redux State Management** - Centralized state with Redux Toolkit
- **Form Handling** - React Hook Form with Zod validation

### Social Media Features

- **User Authentication** - Login, signup, and logout flows
- **User Profiles** - Profile viewing and editing
- **Post Management** - Create, view, and interact with posts
- **Real-time Chat** - Live messaging with Socket.IO
- **Notifications** - Real-time notification system
- **Settings** - User preferences and account settings
- **Follow System** - Follow/unfollow users

### Advanced Features

- **Real-time Updates** - Live updates for messages and notifications
- **Image Upload** - Profile and post image upload
- **Search** - User and content search functionality
- **Infinite Scroll** - Optimized content loading
- **Error Boundaries** - Graceful error handling
- **Loading States** - Smooth loading experiences

## 🛠️ Tech Stack

### Core Technologies

- **React 19** - Latest React with modern features
- **TypeScript** - Type-safe development
- **Vite** - Fast build tool and development server
- **Tailwind CSS** - Utility-first CSS framework

### UI Components & Design

- **shadcn/ui** - High-quality React components
- **Radix UI** - Accessible UI primitives
- **Lucide React** - Beautiful SVG icons
- **Framer Motion** - Smooth animations
- **next-themes** - Theme management

### State Management & Forms

- **Redux Toolkit** - State management
- **React Redux** - React bindings for Redux
- **React Hook Form** - Form handling
- **Zod** - Schema validation

### Routing & Real-time

- **React Router** - Client-side routing
- **Socket.IO Client** - Real-time communication

### Development Tools

- **ESLint** - Code linting
- **TypeScript ESLint** - TypeScript-specific linting
- **Vite** - Development server and build tool

## 📁 Project Structure

```
frontend/
├── public/              # Static assets
│   ├── vite.svg
│   └── favicon.ico
├── src/
│   ├── components/      # Reusable UI components
│   │   ├── ui/              # shadcn/ui components
│   │   ├── layouts/         # Layout components
│   │   ├── forms/           # Form components
│   │   └── common/          # Common components
│   ├── pages/           # Page components
│   │   ├── LoginPage.tsx
│   │   ├── SignupPage.tsx
│   │   ├── ProfilePage.tsx
│   │   ├── SettingPage.tsx
│   │   └── ...
│   ├── hooks/           # Custom React hooks
│   │   ├── auth/            # Authentication hooks
│   │   ├── api/             # API hooks
│   │   └── ...
│   ├── store/           # Redux store
│   │   ├── slices/          # Redux slices
│   │   ├── store.ts         # Store configuration
│   │   └── ...
│   ├── routes/          # Routing configuration
│   │   └── AppRoutes.tsx
│   ├── types/           # TypeScript type definitions
│   ├── utils/           # Utility functions
│   ├── validations/     # Zod validation schemas
│   ├── config/          # Configuration files
│   ├── lib/             # Library configurations
│   ├── App.tsx          # Main App component
│   ├── main.tsx         # Application entry point
│   └── index.css        # Global styles
├── components.json      # shadcn/ui configuration
├── tailwind.config.js   # Tailwind CSS configuration
├── vite.config.ts       # Vite configuration
├── tsconfig.json        # TypeScript configuration
├── package.json         # Dependencies and scripts
└── README.md           # This file
```

## 🚀 Quick Start

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn

### Installation

1. **Navigate to frontend directory**

   ```bash
   cd frontend
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Environment Setup**
   Create a `.env` file in the frontend root directory:

   ```env
   # API Configuration
   VITE_API_BASE_URL=http://localhost:8000/api/v2
   VITE_SOCKET_URL=http://localhost:8000

   # Firebase (if using Firebase for additional features)
   VITE_FIREBASE_API_KEY=your-firebase-api-key
   VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
   VITE_FIREBASE_PROJECT_ID=your-project-id
   VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
   VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
   VITE_FIREBASE_APP_ID=your-app-id
   ```

4. **Start the development server**

   ```bash
   npm run dev
   ```

5. **Build for production**

   ```bash
   npm run build
   ```

6. **Preview production build**
   ```bash
   npm run preview
   ```

## 🎨 UI Components

### shadcn/ui Components

The project uses shadcn/ui components for consistent design:

- Buttons, Inputs, Forms
- Dialogs, Modals, Dropdowns
- Navigation, Tabs, Accordions
- Cards, Avatars, Badges
- Toast notifications
- Loading spinners

### Custom Components

- **Layout Components** - Header, Sidebar, Footer
- **Form Components** - Login, Signup, Profile forms
- **Post Components** - Post card, Comment, Like button
- **Chat Components** - Message list, Chat input
- **Common Components** - Loading states, Error boundaries

## 🔧 Configuration

### Tailwind CSS

Tailwind is configured with:

- Custom color palette
- Dark mode support
- Animation utilities
- Responsive breakpoints

### ESLint

ESLint is configured with:

- TypeScript support
- React-specific rules
- Accessibility rules
- Code formatting rules

### Vite

Vite configuration includes:

- React plugin
- TypeScript support
- Path aliases
- Environment variables
- Build optimizations

## 🔐 State Management

### Redux Store Structure

```
store/
├── slices/
│   ├── authSlice.ts      # Authentication state
│   ├── userSlice.ts      # User profile state
│   ├── postSlice.ts      # Posts and feed state
│   ├── chatSlice.ts      # Chat and messages state
│   ├── notificationSlice.ts # Notifications state
│   └── themeSlice.ts     # Theme preferences
└── store.ts              # Store configuration
```

### State Features

- **Persistent Auth** - Authentication state persists across sessions
- **Real-time Updates** - Socket.IO integration with Redux
- **Optimistic Updates** - Immediate UI updates with rollback
- **Caching** - Efficient data caching and invalidation

## 🌐 API Integration

### HTTP Requests

- Axios or Fetch for API calls
- Request/response interceptors
- Error handling
- Loading states

### Real-time Communication

- Socket.IO client integration
- Event handling for real-time updates
- Connection state management
- Reconnection handling

## 🎯 Routing

### Protected Routes

- Authentication-required pages
- Role-based access control
- Redirect handling

### Public Routes

- Login/Signup pages
- Public profiles
- Landing pages

## 📱 Responsive Design

### Breakpoints

- Mobile: 640px and below
- Tablet: 641px - 1024px
- Desktop: 1025px and above

### Mobile Features

- Touch-friendly interactions
- Optimized layouts
- Performance optimizations

## 🧪 Development

### Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint
```

### Code Quality

- TypeScript for type safety
- ESLint for code quality
- Prettier for code formatting
- Husky for pre-commit hooks (if configured)

## 🚀 Deployment

### Build Output

```bash
npm run build
```

Creates optimized production build in `dist/` directory.

### Deployment Platforms

- **Vercel** - Configured with `vercel.json`
- **Netlify** - Static site deployment
- **AWS S3** - Static hosting
- **Firebase Hosting** - Google Cloud hosting

### Environment Variables

Ensure all `VITE_*` environment variables are configured in your deployment platform.

## 🎨 Theming

### Dark/Light Mode

- Automatic system preference detection
- Manual theme switching
- Persistent theme selection
- Smooth theme transitions

### Customization

- CSS custom properties
- Tailwind theme extension
- Component-level theming

## 📞 Troubleshooting

### Common Issues

1. **Environment Variables** - Ensure `VITE_` prefix for all env vars
2. **CORS Issues** - Check backend CORS configuration
3. **Build Errors** - Verify TypeScript types and imports
4. **Socket Connection** - Check WebSocket URL and authentication

### Development Tips

- Use React DevTools for debugging
- Monitor network requests in browser
- Check console for errors and warnings
- Use TypeScript strict mode

## 🤝 Contributing

### Development Guidelines

1. Follow TypeScript best practices
2. Use provided UI components
3. Implement responsive design
4. Add proper error handling
5. Write meaningful commit messages

### Component Development

1. Use TypeScript interfaces
2. Implement proper prop validation
3. Add JSDoc comments
4. Handle loading and error states

## 🔗 Related

- [Backend Documentation](../backend/README.md)
- [Project Overview](../README.md)

## 📞 Support

For frontend-specific issues:

- Check browser console for errors
- Verify environment variables
- Check component props and state
- Review network requests
