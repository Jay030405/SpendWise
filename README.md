# SpendWise

> **Full-Stack Personal Expense Tracker** <br />
> **Tech Stack:** React.js · Go · PostgreSQL · Docker

## Introduction

SpendWise is a **full-stack personal expense tracking application** designed to provide users with a structured way to manage and organize their personal spending.

The project separates the application into a modern **React frontend**, a **Go backend API**, and a **PostgreSQL database**, with Docker Compose used to run the complete stack as coordinated services.

The goal is to provide a clean foundation for recording and managing personal financial data while demonstrating practical full-stack software engineering concepts such as API-driven architecture, persistent relational storage, authentication configuration, containerization, and service orchestration.

---

## Why We Chose This Topic?

Personal expenses are often tracked using scattered notes, spreadsheets, or manual calculations. This makes it difficult to maintain a consistent record and understand spending over time.

SpendWise was created to address this problem by providing a centralized application for personal expense management.

The project focuses on:

1. **Centralized Expense Management:** Provides a dedicated application for maintaining personal expense records.
2. **Structured Data Storage:** Uses PostgreSQL to persist application data instead of relying on temporary browser-side storage.
3. **Full-Stack Architecture:** Separates the user interface, backend logic, and database into distinct layers.
4. **Practical Deployment:** Uses Docker Compose to simplify local setup and run the application as multiple coordinated services.
5. **Authentication Foundation:** Includes JWT secret configuration in the backend environment for authenticated application workflows.

---

## Technologies Used

### Frontend

* **React.js:** Used to build the interactive client-side application.
* **HTML5 & CSS:** Used as part of the web interface structure and presentation.
* **JavaScript:** Provides frontend application logic and interaction.
* **Docker:** Packages the frontend into a containerized service.

### Backend

* **Go:** Server-side language used to build the backend application and API layer.
* **JWT:** The backend accepts a `JWT_SECRET` environment variable for JWT-based authentication workflows.
* **Docker:** Packages the Go backend as an independently deployable service.

### Database

* **PostgreSQL 17:** Relational database used for persistent application data.
* **SQL:** Used for relational database initialization and data operations.
* **Docker Volume:** PostgreSQL data is persisted through the `postgres_data` volume.

### Infrastructure

* **Docker Compose:** Orchestrates the PostgreSQL database, Go backend, and React frontend.
* **Environment Variables:** Keeps database credentials and authentication secrets outside the application source code.

---

## System Architecture

SpendWise follows a three-tier full-stack architecture:

```text
                    ┌──────────────────────────┐
                    │      React Frontend      │
                    │        Port 3000         │
                    └────────────┬─────────────┘
                                 │
                              HTTP/API
                                 │
                                 ▼
                    ┌──────────────────────────┐
                    │       Go Backend         │
                    │        Port 8080         │
                    └────────────┬─────────────┘
                                 │
                              SQL/DB
                                 │
                                 ▼
                    ┌──────────────────────────┐
                    │      PostgreSQL 17       │
                    │        Port 5432         │
                    └──────────────────────────┘
```

The Docker Compose configuration defines three services:

1. **PostgreSQL** — database and persistent storage.
2. **Go Backend** — server/API layer.
3. **React Frontend** — user-facing web application.

The backend waits for PostgreSQL to pass its health check before starting, while the frontend depends on the backend service. PostgreSQL data is persisted through a Docker volume. 

---

## Project Structure

The repository is organized into separate frontend, backend, and infrastructure components:

```text
SpendWise/
├── backend/                         # Go backend/API service
│   ├── database/
│   │   └── init.sql                 # Database initialization script
│   ├── Dockerfile                   # Backend container configuration
│   └── ...                          # Go application source
│
├── frontend/                        # React frontend application
│   ├── Dockerfile                   # Frontend container configuration
│   └── ...                          # React application source
│
├── .env.example                     # Environment variable template
├── .gitignore                       # Git tracking exclusions
├── docker-compose.yml               # Multi-service Docker configuration
└── README.md                        # Project documentation
```

---

## Docker & Deployment Architecture

The application uses a containerized architecture to keep the three major components isolated while allowing them to communicate through Docker Compose.

### 1. PostgreSQL

The database service:

* Uses **PostgreSQL 17**.
* Runs on port `5432`.
* Uses the `POSTGRES_DB`, `POSTGRES_USER`, and `POSTGRES_PASSWORD` environment variables.
* Mounts `backend/database/init.sql` as the database initialization script.
* Uses a health check based on `pg_isready`.
* Stores persistent data in the `postgres_data` Docker volume.

### 2. Go Backend

The backend service:

* Is built from `backend/Dockerfile`.
* Runs on port `8080`.
* Connects to PostgreSQL using the Docker service hostname `postgres`.
* Receives database credentials through environment variables.
* Receives `JWT_SECRET` through environment configuration.
* Starts after PostgreSQL reports a healthy state.

### 3. React Frontend

The frontend service:

* Is built from `frontend/Dockerfile`.
* Runs inside its own container.
* Is exposed to the host through port `3000`.
* Depends on the backend service.

---

## Environment Configuration

The repository provides an `.env.example` file containing the required configuration:

```env
POSTGRES_DB=spendwise
POSTGRES_USER=postgres
POSTGRES_PASSWORD=your_postgres_password
JWT_SECRET=your_long_random_jwt_secret
```

Create your local environment file:

```bash
cp .env.example .env
```

Update the values before running the application.

> **Security:** Never commit real database passwords, JWT secrets, API keys, or other credentials to Git.

---

## Installation & Setup Guide

### Prerequisites

* **Git**
* **Docker**
* **Docker Compose**

Docker Desktop includes Docker Compose on current installations.

### Step 1: Clone the Repository

```bash
git clone https://github.com/Jay030405/SpendWise.git
cd SpendWise
```

### Step 2: Configure Environment Variables

Create the `.env` file:

```bash
cp .env.example .env
```

Then update:

```env
POSTGRES_DB=spendwise
POSTGRES_USER=postgres
POSTGRES_PASSWORD=your_secure_password
JWT_SECRET=your_long_random_jwt_secret
```

### Step 3: Build and Start the Application

```bash
docker compose up --build
```

Docker Compose will start:

```text
PostgreSQL
    ↓
Go Backend
    ↓
React Frontend
```

### Step 4: Access the Application

The configured host ports are:

| Service | URL / Port |
| :--- | :--- |
| **Frontend** | `http://localhost:3000` |
| **Backend** | `http://localhost:8080` |
| **PostgreSQL** | `localhost:5432` |

Open the frontend in your browser:

```text
http://localhost:3000
```

### Step 5: Stop the Application

```bash
docker compose down
```

To remove the PostgreSQL volume and reset the local database:

```bash
docker compose down -v
```

> **Warning:** Removing the volume deletes the locally persisted PostgreSQL data.

---

## Database Initialization

The project initializes PostgreSQL using:

```text
backend/database/init.sql
```

The initialization script is mounted into PostgreSQL through Docker Compose:

```text
./backend/database/init.sql
        ↓
/docker-entrypoint-initdb.d/init.sql
```

This allows the database schema/setup to be initialized when the PostgreSQL container creates its database for the first time.

---

## Application Flow

The high-level request flow is:

```text
User
 │
 ▼
React Frontend
 │
 │ HTTP Request
 ▼
Go Backend API
 │
 │ Database Query
 ▼
PostgreSQL
 │
 │ Query Result
 ▼
Go Backend
 │
 │ API Response
 ▼
React Frontend
 │
 ▼
User Interface
```

This separation keeps presentation, server-side application logic, and persistent data storage in independent layers.

---

## Website / UI Screenshots

The repository currently does not contain a dedicated screenshot directory, so screenshots can be added here as the project documentation is expanded.

### 1. Application Interface

```text
Add screenshot here:
![SpendWise Dashboard](screenshots/dashboard.png)
```

### 2. Expense Management

```text
Add screenshot here:
![Expense Management](screenshots/expenses.png)
```

### 3. Authentication

```text
Add screenshot here:
![Authentication](screenshots/login.png)
```

> Recommended: add screenshots under a `screenshots/` directory and replace the placeholders above with the actual image paths.

---

## Development Workflow

### Start all services

```bash
docker compose up --build
```

### Run in detached mode

```bash
docker compose up --build -d
```

### View logs

```bash
docker compose logs -f
```

### View a specific service's logs

```bash
docker compose logs -f backend
```

```bash
docker compose logs -f frontend
```

```bash
docker compose logs -f postgres
```

### Check running containers

```bash
docker compose ps
```

### Stop services

```bash
docker compose down
```

---

## Troubleshooting

### PostgreSQL is not ready

Check the database logs:

```bash
docker compose logs postgres
```

Check service status:

```bash
docker compose ps
```

The backend is configured to wait for the PostgreSQL health check.

### Port 3000 is already in use

Stop the process using port `3000`, or change the frontend port mapping in `docker-compose.yml`.

### Port 8080 is already in use

Stop the process using port `8080`, or change the backend port mapping in `docker-compose.yml`.

### Port 5432 is already in use

A local PostgreSQL installation may already be using port `5432`. Stop the local PostgreSQL service or change the Docker port mapping.

### Reset the development database

```bash
docker compose down -v
docker compose up --build
```

This recreates the PostgreSQL volume and initializes the database again.

---

## Security Considerations

Because SpendWise handles personal financial information, security should be considered when extending the project for production use.

Recommended practices include:

* Use strong and unique PostgreSQL credentials.
* Generate a cryptographically strong `JWT_SECRET`.
* Never commit `.env` files containing real credentials.
* Avoid exposing PostgreSQL directly to the public internet.
* Validate and sanitize user-controlled input on the backend.
* Enforce authentication and authorization for protected API operations.
* Keep Docker images and project dependencies updated.
* Use HTTPS when deploying the application publicly.

---

## Future Improvements

Potential areas for future development include:

* Expense categorization and advanced filtering.
* Spending analytics and visual reports.
* Budget management.
* Search and transaction history improvements.
* Automated frontend and backend testing.
* API documentation.
* CI/CD integration.
* Production deployment documentation.
* Improved application monitoring and error handling.
* Enhanced authentication and account-management features.

---

## Contributing

Contributions are welcome.

### Contribution Workflow

1. Fork the repository.
2. Create a new branch:

```bash
git checkout -b feature/your-feature
```

3. Make your changes.
4. Test the application locally.
5. Review your changes:

```bash
git status
git diff
```

6. Commit your changes:

```bash
git add .
git commit -m "feat: describe your change"
```

7. Push your branch:

```bash
git push origin feature/your-feature
```

8. Open a Pull Request with a clear description of the changes.

### Pull Request Checklist

- [ ] The change has a clear purpose.
- [ ] Existing functionality has been tested.
- [ ] The project builds successfully.
- [ ] No credentials or secrets were committed.
- [ ] Documentation has been updated where necessary.
- [ ] The PR clearly explains what changed and why.

---

## Conclusion

SpendWise provides a practical foundation for personal expense management while demonstrating a modern full-stack application architecture.

The project combines:

```text
React.js
   +
Go
   +
PostgreSQL
   +
JWT Configuration
   +
Docker
   +
Docker Compose
```

This architecture separates the frontend, backend, and database responsibilities while providing a reproducible development environment through Docker Compose.

The project can be further extended with richer financial analytics, budgeting functionality, automated testing, stronger observability, and production deployment capabilities.
