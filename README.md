
# Delivery Management System (DMS)

A scalable, production-ready microservices-based backend system for managing users and deliveries in real-time. Built with TypeScript, Node.js, Express.js, Redis, and Prisma ORM.

---

## 🚀 Project Overview

The Delivery Management System (DMS) is a backend system designed for real-world delivery operations. It includes microservices for user authentication and delivery operations, supporting role-based access control, rate limiting, and real-time delivery tracking.

---

## 🧰 Tech Stack

- **Language:** TypeScript
- **Framework:** Node.js + Express.js
- **ORM:** Prisma (PostgreSQL)
- **Database:** PostgreSQL
- **Cache/Rate Limiting:** Redis
- **Authentication:** JWT
- **Architecture:** Microservices
- **Deployment Ready:** Docker-compatible

---

## 🔐 Features

### UserService
- User registration and login (JWT-based)
- Role-based access control (ADMIN, USER, DRIVER)
- Prisma schema with migrations
- Redis-based rate limiting
- Middleware-based exception handling
- Centralized error logging and response formatting

### Delivery Service (Planned/Partial)
- Delivery creation and assignment
- Real-time tracking (WebSockets or Redis Pub/Sub)
- Role-aware delivery views and access

---

## 📁 Folder Structure

```
DMS-main/
│
├── UserService/
│   ├── prisma/                 # Prisma schema and migrations
│   ├── src/
│   │   ├── config/             # Prisma and Redis client setup
│   │   ├── controllers/        # Route controllers
│   │   ├── middlewares/       # Authentication, validation, error handlers
│   │   ├── repository/         # Database abstraction
│   │   ├── routes/             # API route definitions
│   │   ├── services/           # Business logic
│   │   ├── types/              # Custom types and role enums
│   │   └── utils/              # Helpers, schemas, and wrappers
│   ├── package.json            # Project metadata
│   └── tsconfig.json           # TypeScript configuration
│
├── delivery-service/           # Delivery microservice (in progress)
```

---

## ⚙️ Setup Instructions

### Prerequisites
- Node.js (v18+)
- PostgreSQL
- Redis

### Installation

```bash
# Navigate to UserService
cd UserService

# Install dependencies
npm install

# Set environment variables
cp .env.example .env

# Apply Prisma migrations
npx prisma migrate dev

# Start the service
npm run dev
```

---

## 🔗 API Endpoints

| Method | Endpoint                | Description                   | Access        |
|--------|-------------------------|-------------------------------|---------------|
| POST   | `/auth/register`        | Register a new user           | Public        |
| POST   | `/auth/login`           | Login and receive JWT         | Public        |
| GET    | `/users/profile`        | Get current user profile      | Authenticated |
| POST   | `/delivery/create`      | Create a delivery order       | USER Only     |
| POST   | `/delivery/accept`      | Accept a delivery (driver)    | DRIVER Only   |
| GET    | `/delivery/:id/status`  | Get delivery status           | Authenticated |

> ✅ Full Swagger/OpenAPI docs coming soon.

---

## 🧪 Testing

- Unit and integration tests to be added using `Jest` or `Mocha`
- Recommended: Postman collection for local testing

---

## 🚀 Deployment

- Docker-compose setup (coming soon)
- PM2 or container orchestration (Kubernetes) ready
- Cloud-ready with environment-specific config support

---

## 👨‍💻 Contributing

1. Fork the repo
2. Create your feature branch: `git checkout -b feature/YourFeature`
3. Commit your changes: `git commit -m 'Add YourFeature'`
4. Push to the branch: `git push origin feature/YourFeature`
5. Open a pull request

---

## 📄 License

This project is licensed under the MIT License.

---

## 🙋‍♂️ Contact

Monish Reddy  
[LinkedIn](https://www.linkedin.com/in/monish-reddy-bonthu/) • [GitHub](https://github.com/MonishReddyDev) • monishreddy9991@gmail.com
