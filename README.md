# Cindro - Business Deal Tracker & Profit Calculator

A modern, high-performance web application to track business deals and calculate profits, built on the **PERN** stack (PostgreSQL, Express.js, React/Next.js, Node.js) with **Prisma ORM** and **Docker**.

## Project Structure

This is a monorepo containing both the frontend and backend applications:

### `/frontend`
The frontend is built using Next.js 14 and Tailwind CSS.
- **`src/app/`**: Next.js App Router pages (Dashboard, Deals, Reports, etc.)
- **`src/components/`**: Reusable UI elements strictly following the Cindro design system.
- **`src/context/`**: React Context providers for global state.
- **`src/hooks/`**: Custom React hooks.
- **`src/layouts/`**: Shared layout wrappers (Sidebar, TopNav, MobileNav).
- **`src/services/`**: API client functions to communicate with the backend.
- **`src/styles/`**: Global styles and Tailwind configuration.
- **`src/utils/`**: Helper functions and formatters.

### `/backend`
The backend is a Node.js REST API using Express.js and Prisma ORM.
- **`src/config/`**: Configuration files (e.g., Environment variables, external service setups).
- **`src/controllers/`**: Request handlers for routes (e.g., DealController, AuthController).
- **`src/middleware/`**: Express middleware (e.g., Error handling, JWT Authentication).
- **`src/routes/`**: Express route definitions mapping URLs to Controllers.
- **`src/services/`**: Core business logic and database interactions.
- **`src/utils/`**: Shared utilities (e.g., custom error classes, calculators).
- **`prisma/`**: Prisma schema definition and database migrations.
- **`src/index.js`**: Application entry point.

### Root Files
- **`docker-compose.yml`**: Docker configuration for running the PostgreSQL database and Adminer.
- **`.env.example`**: Example environment variables required for the project.
- **`/docs`**: Documentation folder for design systems and SRS files.

## Getting Started with Docker

To run the entire stack (Frontend, Backend, PostgreSQL, and pgAdmin) seamlessly, follow these steps:

### 1. Configure Environment Variables
Copy the `.env.example` file in the root folder to `.env`:
```bash
cp .env.example .env
```
*(Make sure to review the `.env` values, though the defaults will work out-of-the-box for local testing).*

### 2. Run Docker Compose
In the root directory, run the following command to build the images and start all services in detached mode:
```bash
docker-compose up --build -d
```

### 3. Access the Application
Once the containers are successfully running, you can access the services here:
- **Frontend App**: [http://localhost:3000](http://localhost:3000)
- **Backend API Server**: [http://localhost:5000](http://localhost:5000)
- **pgAdmin (Database Manager)**: [http://localhost:5050](http://localhost:5050)
  - *Login*: `admin@cindro.com`
  - *Password*: `admin123`

### Stopping the App
To stop the application and database, run:
```bash
docker-compose down
```
