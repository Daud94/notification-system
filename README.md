# Distributed Notification System

A scalable notification system built with NestJS that supports multiple notification channels including email, SMS, and Firebase Cloud Messaging.

## Features

- 🔐 JWT-based Authentication
- 👤 User Management
- 📦 Product Management
- 📨 Multi-channel Notifications:
  - Email notifications
  - SMS notifications
  - Firebase Cloud Messaging
- 📊 Swagger API Documentation
- 🔄 Queue-based notification processing

## Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Redis (for queue management)

## Installation

```bash
# Install dependencies
npm install

# Configure environment variables
cp .env.example .env
```

Edit the `.env` file with your configuration settings.

## Running the Application

```bash
# Development mode
npm run start:dev


## API Documentation

Once the application is running, you can access the Swagger API documentation at:
```
http://localhost:3000/api
```

## Project Structure

```
src/
├── auth/                 # Authentication related modules
├── interfaces/          # TypeScript interfaces
├── notifications/       # Notification system
│   └── providers/      # Different notification providers
├── products/           # Product management
└── users/              # User management
```

## Scripts

- `npm run start:dev` - Run in development mode with hot reload
- `npm run build` - Build the application

## API Endpoints

### Authentication
- POST /auth/signin - User login
- POST /auth/signup - User registration

### Users
- PUT /users/notification-preeferences - Update user notification preferences
- PUT /users/fcm-token - Update user's Firebase Cloud Messaging token

### Products
- POST /products - Create product
- GET /products - List products
- GET /products/:id - Get product details
- PUT /products/:id - Update product
- DELETE /products/:id - Delete product


