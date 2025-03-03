# Library Management System

A comprehensive library management system with user roles, book management, and loan tracking.

## Features

- **User Management**

  - Multiple user roles (admin, staff, student)
  - User registration and authentication
  - Profile management

- **Book Management**

  - Add, edit, and delete books
  - Track book availability
  - Search and filter books
  - QR code generation for books

- **Loan Management**

  - Borrow and return books
  - Track due dates
  - Automatic overdue detection
  - Fine calculation

- **Reservation System**

  - Reserve unavailable books
  - Automatic notification when books become available
  - Reservation expiration management

- **Dashboard and Reports**
  - Overview of library statistics
  - Popular books tracking
  - User activity monitoring
  - Overdue loans reporting

## Tech Stack

- **Backend**: Node.js, Express.js
- **Database**: MySQL with Sequelize ORM
- **Authentication**: JWT (JSON Web Tokens)
- **Email**: Nodemailer for notifications
- **Utilities**: QR code generation

## API Endpoints

### Authentication

- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/profile` - Get current user profile
- `POST /api/auth/change-password` - Change password

### Users

- `GET /api/users` - Get all users (admin only)
- `GET /api/users/:id` - Get user by ID
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user (admin only)
- `GET /api/users/:id/loans` - Get user loan history

### Books

- `GET /api/books` - Get all books with filtering options
- `GET /api/books/:id` - Get book by ID with QR code
- `POST /api/books` - Create a new book (staff/admin only)
- `PUT /api/books/:id` - Update a book (staff/admin only)
- `DELETE /api/books/:id` - Delete a book (staff/admin only)
- `GET /api/books/:id/loans` - Get book loan history (staff/admin only)

### Loans

- `GET /api/loans` - Get all loans (staff/admin only)
- `GET /api/loans/:id` - Get loan by ID
- `POST /api/loans` - Create a new loan (borrow a book)
- `PUT /api/loans/:id/return` - Return a book
- `GET /api/loans/check-overdue` - Check for overdue loans (staff/admin only)
- `GET /api/loans/user/:userId?` - Get user's active loans

### Reservations

- `GET /api/reservations` - Get all reservations (staff/admin only)
- `GET /api/reservations/:id` - Get reservation by ID
- `POST /api/reservations` - Create a new reservation
- `PUT /api/reservations/:id/cancel` - Cancel a reservation
- `GET /api/reservations/check-expired` - Check for expired reservations (staff/admin only)
- `GET /api/reservations/user/:userId?` - Get user's active reservations

### Dashboard

- `GET /api/dashboard/stats` - Get dashboard statistics (staff/admin only)
- `GET /api/dashboard/books` - Get book statistics (staff/admin only)
- `GET /api/dashboard/users` - Get user statistics (staff/admin only)

## Setup and Installation

1. Clone the repository
2. Install dependencies:
   ```
   npm install
   ```
3. Configure environment variables in `.env` file
4. Initialize the database:
   ```
   npm run db:init
   ```
5. Start the server:
   ```
   npm run dev
   ```

## Environment Variables

Create a `.env` file in the root directory with the following variables:

```
# Server Configuration
PORT=3000
NODE_ENV=development

# JWT Secret
JWT_SECRET=your_jwt_secret_key_here
JWT_EXPIRATION=24h

# Database Configuration
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=password
DB_NAME=library_management
DB_PORT=3306

# Email Configuration
EMAIL_HOST=smtp.example.com
EMAIL_PORT=587
EMAIL_USER=your_email@example.com
EMAIL_PASS=your_email_password
EMAIL_FROM=library@example.com
```

## License

ISC
