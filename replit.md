# TransEscorta - Premium TS-Escorts Platform

## Overview

TransEscorta is a modern, mobile-first escort platform designed for trans* escorts to display their profiles publicly in a browsable grid, and for men to register as customers to contact them. The platform features a one-way visibility system (only trans escorts are visible), real-time chat functionality, location-based discovery, and premium subscription options. Its business vision is to become a leading platform in the TS-escort market, offering a professional and discreet experience.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: Next.js with React.
- **Styling**: Tailwind CSS with a custom color scheme.
- **UI Components**: Shadcn/ui for consistent, accessible components.
- **Animations**: Framer Motion for smooth transitions.
- **State Management**: React Query (TanStack Query) for server state management.
- **Routing**: Wouter for lightweight client-side routing.
- **Theme System**: Custom context-based theme provider supporting dark/light modes.
- **UI/UX Decisions**: Mobile-first design with a responsive layout, larger escort tiles, clean design, and a fixed bottom navigation bar. Icons are intuitive, and the interface is optimized for touch. All UI elements are localized to German.

### Backend Architecture
- **Runtime**: Node.js with Express.js framework.
- **Database**: PostgreSQL with Drizzle ORM for type-safe operations.
- **Authentication**: Custom authentication system using bcrypt for password hashing and JWT for token-based authentication.
- **Real-time Communication**: WebSocket implementation for live chat.

### Key Features and Design Patterns
- **User Types**: Trans escorts (service providers) and male customers.
- **Public Browsing**: Homepage allows browsing and filtering escorts without authentication; an auth modal appears upon attempting to access contact features.
- **Profile System**: Comprehensive profile management for escorts, including image uploads (main profile photo and gallery), physical details, services offered, and pricing. Images are optimized and stored in Cloudinary.
- **Real-time Chat**: WhatsApp-style chat system with animated message bubbles, read receipts, timestamps, photo messaging, and typing indicators.
- **Premium Features**: Integration of premium subscriptions for enhanced visibility and access to exclusive features, identified by a gold crown badge and a separate "Premium Escorts" section.
- **Location-Based Services**: Automatic city detection using browser GPS with manual override, and distance calculation displayed on escort cards.
- **Image Handling**: All images are uploaded to Cloudinary, with automatic optimization, compression, and format conversion (WebP/AVIF).
- **Branding**: Complete rebrand to "TransEscorta" with consistent branding across the application, email templates, and documentation.

## External Dependencies

- **Database**: PostgreSQL (via `DATABASE_URL` environment variable).
- **Payment Processing**: Verotel FlexPay for one-time premium payments.
- **Cloud Storage**: Cloudinary for all image uploads and management.
- **Frontend Libraries**: React, Next.js, Tailwind CSS, Shadcn/ui, Framer Motion, TanStack Query, Wouter, React Hook Form, Zod.
- **Backend Libraries**: Express.js, Drizzle ORM, `ws` (WebSocket library), Passport.js (for OpenID Connect).