# Task Manager

> **Status**: 🚧 Work in Progress

A modern task management application built with Angular 18, Spring Boot 3.5, and NgRx.

---

## 📋 Table of Contents

<!-- TOC can be auto-generated as you expand sections -->

- [Overview](#overview)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Backend Setup](#backend-setup)
  - [Frontend Setup](#frontend-setup)
- [Development](#development)
- [Architecture](#architecture)
  - [Backend Architecture](#backend-architecture)
  - [Frontend Architecture](#frontend-architecture)
- [API Documentation](#api-documentation)
- [Testing](#testing)
- [Deployment](#deployment)
- [Contributing](#contributing)
- [Roadmap](#roadmap)

---

## Overview

Task Manager is a full-stack application for managing tasks using a Kanban board interface.

**Key Features:**
- ✅ Task CRUD operations
- ✅ Kanban board view
- 🚧 [Add more features as they're implemented]

---

## Tech Stack

### Backend
- **Framework**: Spring Boot 3.5.9
- **Java**: 17
- **Database**: PostgreSQL
- **ORM**: Spring Data JPA
- **Mapping**: MapStruct 1.6.3
- **Build Tool**: Maven
- **Other**: Lombok, Bean Validation

### Frontend
- **Framework**: Angular 18.2
- **State Management**: NgRx 18.1 (Store, Effects)
- **Styling**: Tailwind CSS 3.4
- **SSR**: Angular SSR
- **Build Tool**: Angular CLI

---

## Project Structure

### Backend Structure

```
backend/
├── src/
│   ├── main/
│   │   ├── java/com/taskmanager/
│   │   │   ├── common/              # Shared utilities
│   │   │   │   ├── exception/       # Global exception handling
│   │   │   │   └── response/        # API response models
│   │   │   ├── config/              # Configuration classes
│   │   │   └── {feature}/           # Feature modules
│   │   │       ├── api/             # REST controllers
│   │   │       ├── application/     # Service layer
│   │   │       ├── domain/          # Domain entities & repositories
│   │   │       ├── dto/             # Data Transfer Objects
│   │   │       └── mapper/          # MapStruct mappers
│   │   └── resources/
│   │       └── application.properties
│   └── test/                        # Test classes
└── pom.xml
```

**Best Practices:**
- ✅ Layered architecture (API → Application → Domain)
- ✅ DTOs for request/response separation
- ✅ MapStruct for type-safe mapping
- ✅ Global exception handling
- ✅ CORS configuration

### Frontend Structure

```
frontend/
├── src/
│   └── app/
│       ├── core/                    # Singleton services, interceptors
│       │   ├── api/                 # API services
│       │   ├── interceptor/         # HTTP interceptors
│       │   ├── models/              # Core domain models
│       │   └── services/            # Core services
│       ├── features/                # Feature modules
│       │   └── {feature}/
│       │       ├── components/      # Feature components
│       │       ├── pages/           # Page/container components
│       │       └── store/           # NgRx store (actions, effects, reducers, selectors)
│       ├── shared/                  # Shared components, directives, pipes
│       └── app.config.ts            # Application configuration
└── angular.json
```

**Best Practices:**
- ✅ Feature-based architecture
- ✅ Core vs Shared separation
- ✅ NgRx store per feature
- ✅ Standalone components
- ✅ Barrel exports (add as needed)

---

## Getting Started

### Prerequisites

**Backend:**
- JDK 17 or higher
- Maven 3.6+
- PostgreSQL (version to be specified)
- [Docker] (optional, for containerized PostgreSQL)

**Frontend:**
- Node.js 18+ and npm
- Angular CLI 18+ (`npm install -g @angular/cli`)

### Backend Setup

1. **Configure Database**
   ```properties
   # Update backend/src/main/resources/application.properties
   spring.datasource.url=jdbc:postgresql://localhost:5432/taskmanager
   spring.datasource.username=your_username
   spring.datasource.password=your_password
   ```

2. **Create Database**
   ```sql
   CREATE DATABASE taskmanager;
   ```

3. **Run Backend**
   ```bash
   cd backend
   ./mvnw spring-boot:run
   # Or on Windows:
   mvnw.cmd spring-boot:run
   ```

   Backend will start on `http://localhost:8080` (default)

**Environment Profiles:**
- Default: `application.properties`
- Development: `application-dev.properties` (add as needed)

### Frontend Setup

1. **Install Dependencies**
   ```bash
   cd frontend
   npm install
   ```

2. **Configure Environment**
   ```typescript
   // Update frontend/src/environments/environment.ts
   export const environment = {
     apiUrl: 'http://localhost:8080/api'  // Adjust as needed
   };
   ```

3. **Run Frontend**
   ```bash
   npm start
   # Or: ng serve
   ```

   Frontend will start on `http://localhost:4200` (default)

---

## Development

### Backend Development

**Running Tests:**
```bash
cd backend
./mvnw test
```

**Build:**
```bash
./mvnw clean package
```

**Code Style:**
- [Add checkstyle/spotless configuration as needed]

### Frontend Development

**Running Tests:**
```bash
cd frontend
npm test
```

**Build:**
```bash
npm run build
```

**Linting:**
```bash
ng lint
```

**Code Style:**
- Follow Angular Style Guide
- Use Prettier (add configuration as needed)
- Use ESLint (add configuration as needed)

---

## Architecture

### Backend Architecture

**Layered Architecture Pattern:**
1. **API Layer** (`api/`)
   - REST controllers
   - Request validation
   - Response formatting

2. **Application Layer** (`application/`)
   - Business logic
   - Transaction management
   - Orchestration

3. **Domain Layer** (`domain/`)
   - Entity models
   - Repository interfaces
   - Domain enums

4. **DTO Layer** (`dto/`)
   - Request DTOs
   - Response DTOs
   - Validation annotations

**Additional:**
- Global exception handler (`GlobalExceptionHandler`)
- CORS configuration (`CorsConfig`)
- Standardized API responses (`ApiResponse<T>`)

### Frontend Architecture

**Feature-Based Architecture:**
- Each feature is self-contained with components, pages, and store
- Features communicate through NgRx store or shared services

**NgRx Pattern:**
- **Actions**: Define events/dispatches
- **Effects**: Handle side effects (API calls)
- **Reducers**: Pure functions for state updates
- **Selectors**: Memoized state queries

**Core Services:**
- API services (feature-agnostic HTTP calls)
- Interceptors (auth, headers, etc.)
- User context service

**Shared:**
- Reusable components (toast, buttons, etc.)
- Directives and pipes
- Utilities

---

## API Documentation

<!-- Add API documentation as endpoints are defined -->

### Base URL
```
http://localhost:8080/api
```

### Endpoints

#### Tasks
- `GET /tasks` - Get all tasks
- `POST /tasks` - Create a task
- `GET /tasks/{id}` - Get task by ID
- `PUT /tasks/{id}` - Update task
- `PATCH /tasks/{id}/status` - Update task status
- `DELETE /tasks/{id}` - Delete task

<!-- Expand with request/response examples, authentication requirements, etc. -->

---

## Testing

### Backend Testing

**Unit Tests:**
- [Add testing strategy]

**Integration Tests:**
- [Add integration test examples]

**Test Coverage:**
- [Add coverage goals and tools]

### Frontend Testing

**Unit Tests:**
- Component tests with Angular Testing Library (add as needed)
- Service tests
- Store tests (actions, reducers, selectors)

**E2E Tests:**
- [Add Cypress/Playwright configuration]

---

## Deployment

<!-- Add deployment instructions as environments are configured -->

### Backend Deployment

**Build:**
```bash
./mvnw clean package -DskipTests
```

**Docker:**
- [Add Dockerfile]

**Environment Variables:**
- [List required environment variables]

### Frontend Deployment

**Build:**
```bash
npm run build
```

**Production Build:**
- [Add production configuration]

**Docker:**
- [Add Dockerfile or nginx configuration]

---

## Contributing

<!-- Add contribution guidelines as project grows -->

1. [Fork the repository]
2. [Create a feature branch]
3. [Commit your changes]
4. [Push to the branch]
5. [Create a Pull Request]

**Coding Standards:**
- Follow Spring Boot best practices for backend
- Follow Angular Style Guide for frontend
- Write tests for new features
- Update documentation

---

## Roadmap

### Short Term
- [ ] Add authentication/authorization
- [ ] Add user management
- [ ] Enhance task filtering and search
- [ ] Add task categories/tags

### Medium Term
- [ ] Real-time updates (WebSocket)
- [ ] File attachments
- [ ] Task comments
- [ ] Activity history

### Long Term
- [ ] Multi-user collaboration
- [ ] Team workspaces
- [ ] Analytics and reporting
- [ ] Mobile app

---

## License

<!-- Add license as needed -->

---

## Additional Resources

### Documentation
- [Spring Boot Documentation](https://docs.spring.io/spring-boot/docs/current/reference/htmlsingle/)
- [Angular Documentation](https://angular.io/docs)
- [NgRx Documentation](https://ngrx.io/docs)

### Related Links
- [Project Wiki] (add if applicable)
- [Issue Tracker] (add if applicable)

---

**Note**: This README is a work in progress and will be updated as the project evolves. Feel free to expand any section with relevant details!

