# TransEscorta - Premium TS-Escorts Platform

Eine moderne, mobile-first Escort-Plattform speziell für Trans-Escorts mit Real-time Chat, Premium-Features und professioneller Präsentation.

## 🌟 Features

### 💕 Kernfunktionen
- **Benutzer-Authentifizierung** mit Replit Auth (OAuth)
- **Profile erstellen & bearbeiten** mit Fotos, Bio, Interessen und Standort
- **Grid-Ansicht** zum Durchstöbern von Profilen
- **Swipe-Funktionalität** im Tinder-Style mit Animationen
- **Real-time Chat** mit Socket.io und WhatsApp-ähnlicher UI
- **Location-basierte Nutzersuche** mit Entfernungsfiltern
- **Match-System** mit gegenseitigen Likes

### 👑 Premium Features
- **Stripe-Integration** für Abonnements
- **Unbegrenzte Likes** pro Tag
- **Erweiterte Filter** (Alter, Entfernung, Interessen)
- **Profil-Boost** für bessere Sichtbarkeit
- **Premium-Badge** und Hervorhebung
- **Wer hat mich geliked?** Funktion

### 🎨 Design & UX
- **Dark/Light Mode** mit animiertem Toggle
- **Mobile-first** responsive Design
- **Fixierte Bottom-Navigation** mit deutschen Labels
- **Framer Motion** Animationen
- **WhatsApp-style Chat-Bubbles**
- **Premium-Glow-Effekte**

## 🚀 Tech Stack

### Frontend
- **Next.js** (React Framework)
- **Tailwind CSS** für Styling
- **Framer Motion** für Animationen
- **Shadcn/ui** Komponenten-Bibliothek
- **React Query** für State Management
- **Socket.io Client** für Real-time Features

### Backend
- **Express.js** Server
- **PostgreSQL** mit Drizzle ORM
- **Socket.io** für Real-time Chat
- **Stripe** für Zahlungsabwicklung
- **JWT** Authentication via Replit Auth

## 📱 Setup & Installation

### 1. Environment Variables
Kopiere `.env.example` zu `.env` und fülle die benötigten Werte aus:

```bash
cp .env.example .env
