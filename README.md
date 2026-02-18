# TaskMaster Frontend

The frontend of the TaskMaster application built with Next.js 16+, TypeScript, and Tailwind CSS.

## Features

- **User Authentication**: Secure registration and login with JWT tokens
- **Task Management**: Create, read, update, and delete tasks
- **User Isolation**: Users can only access their own tasks
- **Responsive Design**: Works on desktop, tablet, and mobile devices
- **Real-time Updates**: Tasks update immediately after changes
- **Filtering**: Filter tasks by status (all, active, completed)
- **Animations**: Smooth transitions and micro-interactions using Framer Motion

## Tech Stack

- **Framework**: Next.js 16+ with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State Management**: React Context API
- **Animations**: Framer Motion
- **Authentication**: Better Auth
- **UI Components**: Custom-built with Tailwind CSS

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

1. Install dependencies:
```bash
npm install
```

2. Set up environment variables:
```bash
cp .env.local.example .env.local
```
Then update the values in `.env.local` with your specific configuration.

### Running the Application

1. Start the development server:
```bash
npm run dev
```

2. Access the application at http://localhost:3000

### Building for Production

```bash
npm run build
```

## Project Structure

```
frontend/
├── public/                  # Static assets
├── src/
│   ├── app/                 # Next.js app router pages
│   │   ├── layout.tsx       # Root layout with navbar and providers
│   │   ├── page.tsx         # Home page
│   │   ├── auth/            # Authentication pages
│   │   │   ├── login/       # Login page
│   │   │   └── register/    # Registration page
│   │   ├── dashboard/       # Dashboard page
│   │   ├── tasks/           # Task management pages
│   │   │   └── [id]/        # Task detail page
│   │   └── profile/         # User profile page
│   ├── components/          # Reusable UI components
│   │   ├── ui/              # Base UI components (Button, Input, etc.)
│   │   ├── AuthForm.tsx     # Authentication form
│   │   ├── Navbar.tsx       # Navigation bar
│   │   ├── TaskCard.tsx     # Task display component
│   │   ├── TaskForm.tsx     # Task creation/editing form
│   │   ├── TaskList.tsx     # Task listing component
│   │   ├── TaskDetail.tsx   # Task detail component
│   │   ├── ProtectedRoute.tsx # Route protection component
│   │   ├── UserProfileDropdown.tsx # User profile dropdown
│   │   ├── ErrorBoundary.tsx # Error boundary component
│   │   └── TaskSkeleton.tsx # Loading skeleton for tasks
│   ├── contexts/            # React contexts
│   │   └── TaskContext.tsx  # Task state management
│   ├── providers/           # Context providers
│   │   └── AuthProvider.tsx # Authentication context provider
│   ├── lib/                 # Utilities and API client
│   │   ├── api.ts           # API client for backend communication
│   │   ├── types.ts         # TypeScript type definitions
│   │   ├── utils.ts         # Utility functions
│   │   ├── constants.ts     # Application constants
│   │   └── validation.ts    # Validation functions
│   ├── hooks/               # Custom React hooks
│   │   ├── useAuth.ts       # Authentication hook
│   │   └── useTasks.ts      # Task management hook
│   └── styles/              # Global styles
│       └── globals.css      # Global CSS styles
├── .env.local.example       # Environment variables example
├── next.config.js           # Next.js configuration
├── postcss.config.js        # PostCSS configuration
├── tailwind.config.js       # Tailwind CSS configuration
├── tsconfig.json            # TypeScript configuration
├── package.json             # Node.js dependencies
└── README.md                # This file
```

## Environment Variables

- `NEXT_PUBLIC_API_BASE_URL`: Base URL for the backend API
- `NEXT_PUBLIC_BETTER_AUTH_URL`: URL for Better Auth

## API Client

The application uses a centralized API client in `src/lib/api.ts` that handles:
- Automatic attachment of authentication tokens
- Base URL configuration
- 401 response interception (redirect to login)
- Error handling and response parsing

## Components

### UI Components
- `Button`: Reusable button component with variants and sizes
- `Input`: Form input with label and error handling
- `Card`: Container with header, body, and footer sections
- `Modal`: Overlay modal component with backdrop
- `Badge`: Status indicator component
- `Spinner`: Loading indicator component

### Feature Components
- `AuthForm`: Handles user registration and login
- `TaskCard`: Displays individual tasks with status and actions
- `TaskForm`: Handles task creation and editing
- `TaskList`: Displays multiple tasks with filtering options
- `TaskDetail`: Shows detailed view of a single task with editing capabilities
- `Navbar`: Navigation bar with user profile dropdown
- `ProtectedRoute`: Wrapper component to protect routes requiring authentication

## Styling

The application uses Tailwind CSS for styling with:
- A custom color palette defined in `tailwind.config.js`
- Responsive design patterns
- Consistent spacing and typography
- Predefined component classes in `globals.css`
- Smooth animations using Framer Motion

## Authentication

The application uses Better Auth for authentication with:
- Centralized session management in `AuthProvider`
- Protected route component to restrict access to authenticated users
- User profile dropdown for account management

## State Management

The application uses multiple state management approaches:
- React Context API for authentication state
- Custom React hooks for task management
- TaskContext for global task state management

## Validation

The application includes validation utilities in `src/lib/validation.ts` for:
- Email format validation
- Password strength validation
- Task title and description validation

## Hooks

Custom hooks in `src/hooks/`:
- `useAuth`: Manages authentication state and operations
- `useTasks`: Handles task operations (fetch, create, update, delete)

## Testing

To run tests:
```bash
npm test
```

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License.