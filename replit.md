# TransEscorta - Premium TS-Escorts Platform

## Overview

TransEscorta is a modern, mobile-first escort platform specifically designed following the hunqz.com model. Trans* users serve as escorts/service providers whose profiles are displayed publicly in a browsable grid, while men register as customers to contact them. The platform features a one-way visibility system where only trans escorts appear in the browsing interface, real-time chat functionality, and location-based discovery.

## User Preferences

Preferred communication style: Simple, everyday language.

## Recent Changes (January 2025)

### Premium Subscription Integration - Verotel FlexPay (January 25, 2025)
- **Verotel Payment Gateway**: Integrated secure €9.99/month premium subscription via Verotel FlexPay
- **Premium Features**: Gold crown badge, separate "Premium Escorts" section on homepage, higher visibility
- **Payment Flow**: New tab opens to Verotel, processes payment, returns with premium status activated
- **Webhook Integration**: `/api/webhooks/verotel` handles payment confirmations and activates premium status
- **Premium Pages**: `/premium`, `/premium-success`, `/premium-declined` for complete payment flow
- **Navigation Update**: Premium tab added to trans escort navigation with crown icon
- **Database Integration**: `isPremium` flag automatically updated via webhook postback

### Complete Brand Rebrand - TransConnect → TransEscorta (January 25, 2025)
- **Brand Name Change**: All references changed from "TransConnect" to "TransEscorta" throughout application
- **Title Update**: Changed to "TransEscorta - Premium TS-Escorts" for professional escort positioning
- **Domain Ready**: Prepared for transescorta.com domain deployment with optimized SEO meta tags
- **Cloudinary Folders**: Updated cloud storage organization to transescorta/* folder structure
- **Email Templates**: Updated registration and verification emails with new TransEscorta branding
- **README & Documentation**: Fully updated project description and technical documentation

### Cloudinary Integration Complete (January 25, 2025) 
- **Cloud Storage Migration**: All image uploads moved from local storage to Cloudinary cloud infrastructure
- **Optimized Transformations**: Profile images auto-optimized to 800x800px with face detection cropping
- **Chat Images Enhanced**: Chat photos optimized to 1000x1000px with automatic compression  
- **Gallery Support**: Multiple image uploads for escort galleries with batch processing
- **Format Optimization**: Automatic WebP/AVIF conversion for improved performance and faster loading
- **Organized Structure**: Cloudinary folders: transescorta/profiles, transescorta/chat for clean asset management

### Profile System Complete Fix (January 24, 2025)
- **Image Upload FULLY FIXED**: Profile images now save correctly to database and display properly
- **ProfileDetailFixed Component**: Created unified profile view matching Profile.tsx exactly
- **Consistent Profile Display**: Both own profile (/my-profile) and public profiles (/profile) now identical
- **Complete Physical Details**: All fields (height, weight, bodyType, ethnicity, cockSize, circumcision, position) display
- **Error Handling Enhanced**: Added image load error detection with automatic fallback to placeholders
- **Debug Logging Added**: Form values logged before submission for troubleshooting
- **Storage Layer Fixed**: Explicit handling of profileImageUrl and profileImages arrays
- **Service Display**: All selected services show as badges, unlimited display instead of truncated
- **Gallery Support**: Additional profile images display in 3-column grid layout

### Profile System Overhaul (January 2025)
- **Unified Profile Editing**: Completely redesigned profile editing system with ProfileEditUnified component
- **Live Image Upload**: Profile images show immediately when uploaded with real-time feedback
- **Clean Profile Interface**: Removed confusing statistics (0 Matches, 0 Gegenseitig, 0 Fotos) from profile view
- **Fixed Navigation**: Profile editing now properly redirects to profile page after successful save
- **Physical Details Enhancement**: Added "Schwanzgröße" (penis size) and "Beschneidung" (circumcision) fields for trans escorts
- **GPS Location Detection**: Automatic city detection using browser GPS with manual override capability
- **Distance Calculation**: Single distance display on homepage cards (removed duplicate pink text)
- **Schema Updates**: Enhanced user schema with profileImageUrl and profileImages fields
- **Location-Based Features**: GPS coordinates stored with city names for precise distance calculations

### Custom Authentication System
- **Email/Password Auth**: Replaced Replit Auth with custom authentication using bcrypt password hashing
- **Registration System**: Users can register as Trans escorts or male customers with email verification
- **Secure Login**: JWT token-based authentication with session management and password reset functionality
- **Demo Data**: Initialized platform with 5 demo trans escort profiles for testing
- **Fixed Fetch API Error**: Replaced problematic fetch calls with XMLHttpRequest to resolve "Failed to execute 'fetch'" error during registration/login

### Public Browsing Experience (hunqz.com Style)
- **No-Login Browsing**: Homepage allows visitors to browse and filter escorts without authentication
- **Modal Authentication**: Seamless auth modal appears when trying to access profiles or contact features
- **Real-time Updates**: No page reloads when switching between browsing and authenticated features

### Enhanced Filter System
- **Active Filter Display**: Filter button now shows active filter content instead of generic "Filter aktiv" text
- **Smart Filter Summary**: Displays abbreviated filter details (age range, price, services count, etc.)
- **Visual Feedback**: Active filters highlight the button with brand color and truncated content display

### Improved Home Page Grid
- **Larger Tiles**: Escort cards now much larger with better spacing (gap-6) for improved visibility
- **Clean Design**: Removed cluttered overlays, showing only essential info: distance, online status, premium badge, age
- **Optimized Layout**: Grid scales from 2 columns on mobile to max 5 columns on desktop for larger tile size
- **Simple Information**: Clean card layout with name, age, and location below image
- **Minimal Badges**: Simple green dot for online, crown for premium, distance in bottom right corner

### Comprehensive Profile Management System
- **ProfileImageUpload Component**: Full-featured image upload system for trans escorts with main profile photo and up to 5 additional images
- **Profile Image Support**: Main profile image with circular display, additional gallery images in grid layout
- **PlaceholderImage Component**: Beautiful gradient placeholder images for users without photos, different styles for trans vs customers
- **Advanced Profile Editing**: Complete profile editing page with personal info, physical details, services offered, and pricing
- **Multi-Image Gallery**: Trans escorts can upload and manage multiple profile images with drag-and-drop interface
- **Image Management**: Delete, reorder, and set main profile images with instant preview

### Enhanced WhatsApp-Style Chat System
- **ChatBubble Component**: Animated message bubbles with read receipts, timestamps, and WhatsApp-style design
- **Photo Messaging**: Complete image sharing in chat with preview, full-screen view, and download capability
- **ChatInput Component**: Enhanced input with photo attachment, emoji support, and typing indicators
- **Real-time Messaging**: WebSocket integration for instant message delivery and read receipts
- **Message Types**: Support for text messages, image messages with optional captions, and file attachments
- **Chat Enhancement**: Better than hunqz.com with smooth animations, proper bubble styling, and professional UX
- **Visual Indicators**: Online status, typing indicators, message delivery and read confirmations

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