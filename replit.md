# TransConnect - Trans* Escort Platform

## Overview

TransConnect is a modern, mobile-first escort platform specifically designed following the hunqz.com model. Trans* users serve as escorts/service providers whose profiles are displayed publicly in a browsable grid, while men register as customers to contact them. The platform features a one-way visibility system where only trans escorts appear in the browsing interface, real-time chat functionality, and location-based discovery.

## User Preferences

Preferred communication style: Simple, everyday language.

## Recent Changes (January 2025)

### Enhanced Filter System
- **Active Filter Display**: Filter button now shows active filter content instead of generic "Filter aktiv" text
- **Smart Filter Summary**: Displays abbreviated filter details (age range, price, services count, etc.)
- **Visual Feedback**: Active filters highlight the button with brand color and truncated content display

### Improved Home Page Grid
- **Larger Images**: Escort profile images now use 3:4 aspect ratio for better visual impact
- **Enhanced Responsiveness**: Grid adapts from 2 columns on mobile to 7 columns on ultrawide screens
- **Overlay Information**: Profile details displayed as overlay on images with gradient background
- **Service Preview**: Shows first 2 services with overflow counter for additional services
- **Modern Design**: Rounded corners, hover effects, and improved spacing for professional appearance

## System Architecture

### Frontend Architecture
- **Framework**: Next.js with React for component-based UI development
- **Styling**: Tailwind CSS for utility-first styling with custom color scheme
- **UI Components**: Shadcn/ui for consistent, accessible component library
- **Animations**: Framer Motion for smooth transitions and interactions
- **State Management**: React Query (TanStack Query) for server state management
- **Routing**: Wouter for lightweight client-side routing
- **Theme System**: Custom context-based theme provider supporting dark/light modes

### Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Database**: PostgreSQL with Drizzle ORM for type-safe database operations
- **Authentication**: Replit Auth (OAuth) with JWT tokens and session management
- **Real-time Communication**: WebSocket implementation for live chat
- **Payment Processing**: Stripe integration for premium subscriptions
- **File Storage**: Profile image handling through integrated storage system

### Mobile-First Design
- **Responsive Layout**: Mobile-optimized interface with fixed bottom navigation
- **PWA Features**: Progressive Web App capabilities for app-like experience
- **Touch Interactions**: Swipe gestures and touch-friendly UI elements
- **Performance**: Optimized for mobile networks and devices

## Key Components

### Authentication System
- **OAuth Integration**: Replit Auth for secure user authentication
- **Session Management**: PostgreSQL-backed session storage with connect-pg-simple
- **JWT Tokens**: Secure token-based authentication for API requests
- **User Profile Management**: Complete profile creation and editing workflow

### Escort Platform Features
- **Public Discovery**: Grid and swipe views showing only trans escort profiles
- **One-Way Visibility**: Trans escorts are publicly visible, men (customers) are hidden
- **Contact System**: Men can register to message trans escorts directly
- **Location Services**: GPS-based escort discovery with automatic city detection
- **Profile System**: Rich escort profiles with photos, bio, services, and location data

### Real-time Chat
- **WebSocket Integration**: Live messaging between matched users
- **WhatsApp-style UI**: Familiar chat bubble interface with read receipts
- **Message History**: Persistent chat history with pagination
- **Online Status**: Real-time user presence indicators

### Premium Features
- **Stripe Integration**: Subscription-based premium memberships
- **Enhanced Visibility**: Profile boosting and priority placement
- **Advanced Filters**: Extended search and filtering capabilities
- **Premium Badges**: Visual indicators for premium users

### Mobile Navigation
- **Bottom Navigation**: Fixed navigation bar with five main sections
- **German Localization**: All UI elements translated to German
- **Icon-based Design**: Intuitive icons for navigation and actions

## Data Flow

### User Registration & Profile Creation
1. User authenticates through Replit OAuth
2. Profile data stored in PostgreSQL users table
3. Profile images uploaded and stored
4. Location data captured and stored for matching

### Matching Process
1. Users browse profiles through grid or swipe interface
2. Like/dislike actions create match records
3. Mutual likes trigger match notifications
4. Chat rooms automatically created for matches

### Real-time Chat
1. WebSocket connection established on chat page load
2. Messages sent through WebSocket and stored in database
3. Real-time delivery to connected users
4. Message history loaded from database on chat open

### Premium Subscriptions
1. Stripe payment flow initiated from subscription page
2. Successful payments update user premium status
3. Premium features unlocked based on subscription status
4. Webhooks handle subscription lifecycle events

## External Dependencies

### Core Infrastructure
- **Database**: PostgreSQL (via DATABASE_URL environment variable)
- **Authentication**: Replit Auth service
- **Payment Processing**: Stripe (requires STRIPE_SECRET_KEY and VITE_STRIPE_PUBLIC_KEY)
- **Session Storage**: PostgreSQL with connect-pg-simple

### Frontend Libraries
- **UI Framework**: React with Next.js
- **Styling**: Tailwind CSS with custom design system
- **Component Library**: Radix UI primitives via Shadcn/ui
- **Animation**: Framer Motion for interactive animations
- **State Management**: TanStack Query for server state
- **Form Handling**: React Hook Form with Zod validation

### Backend Libraries
- **Server Framework**: Express.js
- **Database ORM**: Drizzle ORM with PostgreSQL adapter
- **Real-time**: WebSocket (ws) library
- **Authentication**: Passport.js with OpenID Connect
- **Payment**: Stripe SDK

## Deployment Strategy

### Development Environment
- **Replit Integration**: Configured for Replit development environment
- **Hot Reloading**: Vite development server with HMR
- **Environment Variables**: Configured through .env files
- **Database**: Automatic PostgreSQL provisioning in Replit

### Production Build
- **Build Process**: Vite bundling for frontend, esbuild for backend
- **Static Assets**: Served through Express static middleware
- **Database Migrations**: Drizzle migrations with push command
- **Environment Configuration**: Production environment variables required

### Required Environment Variables
- `DATABASE_URL`: PostgreSQL connection string
- `STRIPE_SECRET_KEY`: Stripe API secret key
- `VITE_STRIPE_PUBLIC_KEY`: Stripe publishable key (client-side)
- `SESSION_SECRET`: Session encryption secret
- `REPL_ID`: Replit environment identifier

### Scaling Considerations
- **Database**: PostgreSQL with connection pooling
- **WebSocket**: Single server instance for real-time features
- **Static Assets**: CDN-ready static file serving
- **Premium Features**: Stripe webhook handling for subscription management

The application is designed to run seamlessly in Replit's environment while maintaining production-ready architecture patterns for potential deployment to other platforms.