# Task Manager

> **Status**: 🚧 Work in Progress

A modern task management application built with Angular 18, Spring Boot 3.5.9, NgRx, and PostgreSQL. Features Docker containerization with Docker Compose for easy deployment and development.

---

## 📋 Table of Contents

<!-- TOC can be auto-generated as you expand sections -->

- [Overview](#overview)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Quick Start with Docker Compose](#quick-start-with-docker-compose-recommended)
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
- ✅ Task CRUD operations (Create, Read, Update, Delete)
- ✅ Kanban board view with drag-and-drop support
- ✅ Task status management (TODO, IN_PROGRESS, DONE)
- ✅ User context management via header-based authentication
- ✅ Real-time toast notifications
- ✅ Responsive design with Tailwind CSS
- ✅ Server-Side Rendering (SSR) support
- ✅ Docker containerization with Docker Compose
- ✅ RESTful API with standardized responses

---

## Tech Stack

### Backend
- **Framework**: Spring Boot 3.5.9
- **Java**: 17
- **Database**: PostgreSQL 17
- **ORM**: Spring Data JPA
- **Mapping**: MapStruct 1.6.3
- **Build Tool**: Maven 3.9+
- **Container**: Docker with multi-stage build
- **Other**: Lombok, Bean Validation, Spring Boot DevTools

### Frontend
- **Framework**: Angular 18.2
- **State Management**: NgRx 18.1 (Store, Effects)
- **Styling**: Tailwind CSS 3.4
- **SSR**: Angular SSR (Server-Side Rendering)
- **Build Tool**: Angular CLI 18.2+
- **Container**: Docker with Nginx
- **Other**: Angular CDK

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
│   │   │   │   │   ├── GlobalExceptionHandler.java
│   │   │   │   │   └── ResourceNotFoundException.java
│   │   │   │   └── response/        # API response models
│   │   │   │       ├── ApiResponse.java
│   │   │   │       ├── ApiError.java
│   │   │   │       ├── ApiMessage.java
│   │   │   │       └── MessageType.java
│   │   │   ├── config/              # Configuration classes
│   │   │   │   └── CorsConfig.java
│   │   │   ├── task/                # Task feature module
│   │   │   │   ├── api/             # REST controllers
│   │   │   │   │   └── TaskController.java
│   │   │   │   ├── application/     # Service layer
│   │   │   │   │   └── TaskService.java
│   │   │   │   ├── domain/          # Domain entities & repositories
│   │   │   │   │   ├── Task.java
│   │   │   │   │   ├── TaskRepository.java
│   │   │   │   │   └── TaskStatus.java
│   │   │   │   ├── dto/             # Data Transfer Objects
│   │   │   │   │   ├── TaskResponse.java
│   │   │   │   │   ├── TaskUpsertRequest.java
│   │   │   │   │   └── TaskStatusUpdateRequest.java
│   │   │   │   └── mapper/          # MapStruct mappers
│   │   │   │       └── TaskMapper.java
│   │   │   └── WorkflowManagerApplication.java
│   │   └── resources/
│   │       ├── application.properties
│   │       ├── application-dev.properties
│   │       └── application-docker.properties
│   └── test/                        # Test classes
├── dockerfile                       # Docker configuration
├── pom.xml                          # Maven configuration
└── logs/                            # Application logs
```

**Best Practices:**
- ✅ Layered architecture (API → Application → Domain)
- ✅ DTOs for request/response separation
- ✅ MapStruct for type-safe mapping
- ✅ Global exception handling with standardized error responses
- ✅ CORS configuration for frontend integration
- ✅ Environment-specific configuration (dev, docker, production)
- ✅ Health checks for container orchestration
- ✅ Security best practices (non-root user, minimal base images)

### Frontend Structure

```
frontend/
├── src/
│   ├── app/
│   │   ├── core/                    # Singleton services, interceptors
│   │   │   ├── api/                 # API services
│   │   │   │   └── task-api.service.ts
│   │   │   ├── interceptor/         # HTTP interceptors
│   │   │   │   └── user-id.interceptor.ts
│   │   │   ├── models/              # Core domain models
│   │   │   │   ├── task.ts
│   │   │   │   ├── api-response.ts
│   │   │   │   └── toast-message.ts
│   │   │   ├── services/            # Core services
│   │   │   │   └── toast.service.ts
│   │   │   └── user/                # User context
│   │   │       └── user-context.service.ts
│   │   ├── features/                # Feature modules
│   │   │   └── tasks/
│   │   │       ├── components/      # Feature components
│   │   │       │   ├── task-card/
│   │   │       │   ├── task-form/
│   │   │       │   └── task-lane/
│   │   │       ├── pages/           # Page/container components
│   │   │       │   └── tasks-board/
│   │   │       └── store/           # NgRx store
│   │   │           ├── task.actions.ts
│   │   │           ├── task.effects.ts
│   │   │           ├── task.reducer.ts
│   │   │           ├── task.selectors.ts
│   │   │           └── task.state.ts
│   │   ├── shared/                  # Shared components, directives, pipes
│   │   │   ├── components/
│   │   │   │   └── toast/
│   │   │   └── utils/
│   │   │       └── task-util.ts
│   │   ├── app.config.ts            # Application configuration
│   │   ├── app.config.server.ts     # SSR configuration
│   │   └── app.routes.ts            # Routing configuration
│   ├── environments/
│   │   ├── environment.ts           # Development environment
│   │   └── environment.prod.ts      # Production environment
│   ├── main.ts                      # Application bootstrap
│   ├── main.server.ts               # SSR bootstrap
│   └── styles.css                   # Global styles
├── dockerfile                       # Docker configuration
├── angular.json                     # Angular configuration
├── tailwind.config.js               # Tailwind CSS configuration
└── package.json                     # Dependencies
```

**Best Practices:**
- ✅ Feature-based architecture
- ✅ Core vs Shared separation
- ✅ NgRx store per feature (actions, effects, reducers, selectors)
- ✅ Standalone components (Angular 18+)
- ✅ Server-Side Rendering (SSR) support
- ✅ HTTP interceptors for request/response handling
- ✅ Type-safe models and API responses
- ✅ Responsive design with Tailwind CSS

---

## Getting Started

### Prerequisites

**Option 1: Local Development (without Docker)**
- **Backend:**
  - JDK 17 or higher
  - Maven 3.9+
  - PostgreSQL 17
- **Frontend:**
  - Node.js 18+ and npm
  - Angular CLI 18+ (`npm install -g @angular/cli`)

**Option 2: Docker Development**
- Docker 
- Docker Compose 

### Quick Start with Docker Compose

The easiest way to run the entire application:

```bash
# Start all services (backend, frontend, database)
docker-compose up -d

# View logs
docker-compose logs -f

# Stop all services
docker-compose down
```

**Services:**
- Frontend: `http://localhost:4200`
- Backend API: `http://localhost:8080`
- PostgreSQL: `localhost:5432`

**Database Configuration:**
- Database name: `task_manager`
- Username: `postgres`
- Password: `postgres`
- Port: `5432`

**Note:** On first run, Docker will build the images. Subsequent runs will be faster. All services are connected via a Docker network (`task-manager-network`) and have health checks configured for proper startup orchestration.

### Backend Setup

#### Using Docker Compose 

The backend is automatically configured when using `docker-compose up`. Database connection is pre-configured.

#### Local Setup

1. **Configure Database**
   ```properties
   # Update backend/src/main/resources/application.properties
   spring.datasource.url=jdbc:postgresql://localhost:5432/task_manager
   spring.datasource.username=postgres
   spring.datasource.password=postgres
   ```

2. **Start PostgreSQL** (if not using Docker)
   ```bash
   # Using Docker
   docker run -d --name postgres-db \
     -e POSTGRES_DB=task_manager \
     -e POSTGRES_USER=postgres \
     -e POSTGRES_PASSWORD=postgres \
     -p 5432:5432 \
     postgres:17-alpine
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
- Development: `application-dev.properties`
- Docker: `application-docker.properties`  

### Frontend Setup

#### Using Docker Compose

The frontend is automatically built and served when using `docker-compose up`. It uses Nginx to serve the production build.

#### Local Setup

1. **Install Dependencies**
   ```bash
   cd frontend
   npm install
   ```

2. **Configure Environment**
   ```typescript
   // Update frontend/src/environments/environment.ts
   export const environment = {
     apiUrl: 'http://localhost:8080/api'
   };
   ```

3. **Run Frontend**
   ```bash
   npm start
   # Or: ng serve
   ```

   Frontend will start on `http://localhost:4200` (default)

**Note:** When running locally, the frontend communicates with the backend API. Ensure the backend is running or use Docker Compose to run both services together.

---

## Development

### Docker Development Workflow

**Start development environment:**
```bash
docker-compose up -d
```

**View logs:**
```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f postgres
```

**Restart a service:**
```bash
docker-compose restart backend
```

**Rebuild after code changes:**
```bash
docker-compose up -d --build
```

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

**Run with Maven:**
```bash
./mvnw spring-boot:run
```

**View Logs:**
- Local: Console output
- Docker: `docker-compose logs -f backend` or check `./logs/workflow-manager.log`

**Health Check:**
- Local: `http://localhost:8080/actuator/health`
- Docker: Automatically checked by docker-compose healthcheck

**Code Style:**
- Follow Spring Boot best practices
- Use Lombok for reducing boilerplate
- MapStruct for DTO mapping

### Frontend Development

**Running Tests:**
```bash
cd frontend
npm test
```

**Build:**
```bash
# Production build
npm run build

# Development build with watch mode
npm run watch
```

**Development Server:**
```bash
npm start
# Or: ng serve
```

**Linting:**
```bash
ng lint
```

**Code Coverage:**
- Coverage reports generated in `coverage/` directory
- View `coverage/task-manager-angular18-ngrx/index.html` in browser

**Code Style:**
- Follow Angular Style Guide
- ESLint configured with `angular-eslint`
- Use standalone components
- Feature-based architecture with NgRx

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

### Base URL

**Development:**
```
http://localhost:8080/api
```

**Docker:**
```
http://localhost:8080/api
```

### Authentication

The API uses header-based authentication for user identification:
- **Header**: `x-user-id`
- **Type**: String (user identifier)
- **Required**: Yes (for all task-related endpoints)

All API requests must include the `x-user-id` header to identify the current user. The backend validates this header to ensure proper user context for all operations.

**Example Request:**
```http
GET /api/tasks HTTP/1.1
Host: localhost:8080
x-user-id: user123
```

**Example Response:**
```json
{
  "messageType": "success",
  "data": [
    {
      "id": 1,
      "title": "Sample Task",
      "description": "Task description",
      "status": "TODO",
      "userId": "user123",
      "createdAt": "2024-01-01T00:00:00",
      "updatedAt": "2024-01-01T00:00:00"
    }
  ],
  "message":""
}
```

### Endpoints

#### Tasks

**Base Path:** `/api/tasks`

All endpoints require the `x-user-id` header.

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/tasks` | Get all tasks for the authenticated user |
| `POST` | `/tasks` | Create a new task |
| `GET` | `/tasks/{id}` | Get a specific task by ID |
| `PUT` | `/tasks/{id}` | Update an existing task |
| `PATCH` | `/tasks/{id}/status` | Update only the task status |
| `DELETE` | `/tasks/{id}` | Delete a task |

**Task Status Values:**
- `TODO`
- `IN_PROGRESS`
- `DONE`

**Example Requests:**

Create Task:
```http
POST /api/tasks HTTP/1.1
Host: localhost:8080
x-user-id: user123
Content-Type: application/json

{
  "title": "New Task",
  "description": "Task description",
  "status": "TODO"
}
```

Update Task Status:
```http
PATCH /api/tasks/1/status HTTP/1.1
Host: localhost:8080
x-user-id: user123
Content-Type: application/json

{
  "status": "IN_PROGRESS"
}
```

---

## Testing

### Backend Testing

**Unit Tests:**
```bash
cd backend
./mvnw test
```

**Test Structure:**
- Unit tests for services, repositories, and controllers
- Test files located in `src/test/java/`

**Test Coverage:**
- Use Maven Surefire Plugin for test execution
- Consider JaCoCo for coverage reporting (add as needed)

### Frontend Testing

**Unit Tests:**
```bash
cd frontend
npm test
```

**Test Structure:**
- Component tests with Jasmine and Karma
- Service tests
- Store tests (actions, reducers, selectors, effects)
- Test files: `*.spec.ts`
- Coverage reports: `coverage/task-manager-angular18-ngrx/`

**Test Coverage:**
- Karma coverage plugin configured
- View coverage report: Open `coverage/task-manager-angular18-ngrx/index.html` in browser


## Deployment

### Docker Deployment

#### Building Images

**Backend:**
```bash
cd backend
docker build -t backend:latest .
```

**Frontend:**
```bash
cd frontend
docker build -t frontend:latest .
```

#### Using Docker Compose (Production)

```bash
# Build and start all services
docker-compose up -d --build

# View logs
docker-compose logs -f

# Stop services
docker-compose down

# Stop and remove volumes (clean reset)
docker-compose down -v
```

### Backend Deployment

**Local Build:**
```bash
cd backend
./mvnw clean package -DskipTests
```

**Run JAR:**
```bash
java -jar target/workflow-manager-0.0.1-SNAPSHOT.jar
```

**Docker:**
- Multi-stage build (Maven build → JDK runtime)
- Includes health checks (Spring Boot Actuator)
- Exposes port 8080
- Logs directory mounted to `./logs`

**Environment Variables:**
- `SPRING_DATASOURCE_URL`: Database connection URL
- `SPRING_DATASOURCE_USERNAME`: Database username
- `SPRING_DATASOURCE_PASSWORD`: Database password
- `SPRING_PROFILES_ACTIVE`: Active Spring profile (docker/dev)
- `CORS_ALLOWED_ORIGINS`: Allowed CORS origins (comma-separated)
- `SERVER_PORT`: Server port (default: 8080)

### Frontend Deployment

**Local Build:**
```bash
cd frontend
npm run build
```

**Production Build Output:**
- Output directory: `dist/task-manager-angular18-ngrx/browser/`
- Includes SSR build in `dist/task-manager-angular18-ngrx/server/`

**Docker:**
- Multi-stage build (Node build → Nginx serve)
- Uses Nginx Alpine for lightweight container (~25MB)
- Serves static files from `/usr/share/nginx/html/`
- Exposes port 80 (mapped to 4200 in docker-compose)
- Production-optimized build included

**Environment Configuration:**
- Development: `src/environments/environment.ts`
- Production: `src/environments/environment.prod.ts`

---

## Contributing
 

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
- [x] Add authentication/authorization (using `x-user-id` header)
- [ ] Complete frontend/backend unit tests
- [ ] Add i18n (internationalization) support
- [ ] Add E2E Tests
- [ ] Add user management
- [ ] Enhance task filtering and search

### Medium Term
- [ ] File attachments
- [ ] Task comments
- [ ] Activity history

### Long Term
- [ ] Multi-user collaboration
- [ ] Team workspaces
- [ ] Analytics and reporting

### Planned Features

**Internationalization (i18n):**
- 🚧 **Planned**: Adding i18n support to enable multi-language support for the frontend
- Will support multiple languages and locales
- Angular i18n integration planned

**E2E Tests :**
Adding E2E tests
---

## License

This project is licensed under the MIT License.

---

## Additional Resources

### Documentation
- [Spring Boot Documentation](https://docs.spring.io/spring-boot/docs/current/reference/htmlsingle/)
- [Angular Documentation](https://angular.io/docs)
- [NgRx Documentation](https://ngrx.io/docs)
 
---

**Note**: This README is a work in progress and will be updated as the project evolves. Feel free to expand any section with relevant details!

