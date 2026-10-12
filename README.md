# Online Judge Platform

A comprehensive online competitive programming platform built with a modern microservices architecture, featuring automated code execution, containerized runtimes, real-time submission results, contests, and scalable background workers.

## Demo
[Video demonstration available - contact repository owner for access]

---

## Setup Instructions

### Prerequisites

- Node.js (v14 or higher)
- Docker and Docker Compose
- PostgreSQL database
- Redis

### Environment Configuration

This application requires several environment variables to be configured. **Never commit actual credentials to the repository.**

1. Copy the example environment file:
   ```bash
   cp .env.example .env
   ```

2. Edit `.env` and configure the following required variables:

#### Database Configuration
- `DB_HOST` - Your PostgreSQL database host address
- `DB_PORT` - Database port (default: 5432)
- `DB_NAME` - Database name
- `DB_USER` - Database username
- `DB_PASSWORD` - Database password
- `DB_DIALECT` - Database dialect (default: postgres)

#### Security
- `JWT_SECRET` - A strong random secret key for JWT token signing (generate with `openssl rand -hex 32`)

#### Server
- `PORT` - API server port (default: 3000)
- `NODE_ENV` - Environment (production/development)

#### Redis & Workers
- `REDIS_BROKER_URL` - Redis connection URL for Celery broker
- `REDIS_BACKEND_URL` - Redis connection URL for results backend
- `REDIS_HOST` - Redis host (default: redis)
- `REDIS_PORT` - Redis port (default: 6379)

#### Backend Communication
- `BACKEND_HOST` - Backend service hostname
- `BACKEND_PORT` - Backend service port

### SSL/TLS Certificates for Database Connections

The application supports SSL/TLS encrypted connections to PostgreSQL databases. SSL configuration is **optional** but recommended for production deployments.

#### Configuring SSL Certificates

You have two options for providing SSL certificates:

**Option 1: Environment Variables (Recommended for Docker/Cloud)**

Set the PEM certificate content directly in environment variables. Use `\n` for newlines:

```bash
DB_SSL_CA="-----BEGIN CERTIFICATE-----\nMIID...\n-----END CERTIFICATE-----"
DB_SSL_KEY="-----BEGIN RSA PRIVATE KEY-----\nMIIE...\n-----END RSA PRIVATE KEY-----"
DB_SSL_CERT="-----BEGIN CERTIFICATE-----\nMIID...\n-----END CERTIFICATE-----"
```

**Option 2: File Paths**

Provide paths to certificate files (useful for local development):

```bash
DB_SSL_CA_PATH=/path/to/server-ca.pem
DB_SSL_KEY_PATH=/path/to/client-key.pem
DB_SSL_CERT_PATH=/path/to/client-cert.pem
```

#### Generating New SSL Certificates

If you need to generate new client certificates for database authentication:

```bash
# 1. Generate a new private key (keep this secure!)
openssl genrsa -out client-key.pem 2048

# 2. Create a certificate signing request (CSR)
openssl req -new -key client-key.pem -out client.csr

# 3. Get the CSR signed by your database CA
# For Google Cloud SQL:
#   - Go to Cloud SQL instance → Connections → Security
#   - Create a new client certificate
#   - Download server-ca.pem, client-cert.pem, and use your generated key

# For other providers, follow their SSL certificate documentation
```

#### Important SSL Security Notes

- **All three SSL components** (CA certificate, client key, client certificate) are required together
- If you set ANY SSL environment variable, you MUST set all three
- The application will fail with a clear error if SSL configuration is incomplete
- **NEVER commit private keys** (`client-key.pem`) to version control
- Store private keys in secure secret management systems (AWS Secrets Manager, HashiCorp Vault, etc.)
- Rotate certificates immediately if a private key has been exposed
- The `certs/` directory is now excluded from version control

#### SSL Configuration for Docker Deployments

When using Docker Compose, you have several options:

**Option A: Environment Variables (Most Secure)**

Add SSL certificate content to your `.env` file or set them in your deployment environment:

```bash
# .env file
DB_SSL_CA="-----BEGIN CERTIFICATE-----\n..."
DB_SSL_KEY="-----BEGIN RSA PRIVATE KEY-----\n..."
DB_SSL_CERT="-----BEGIN CERTIFICATE-----\n..."
```

**Option B: Docker Secrets (Recommended for Production)**

Use Docker secrets to securely provide certificates:

```yaml
services:
  backend:
    secrets:
      - db_ssl_ca
      - db_ssl_key
      - db_ssl_cert
    environment:
      DB_SSL_CA_PATH: /run/secrets/db_ssl_ca
      DB_SSL_KEY_PATH: /run/secrets/db_ssl_key
      DB_SSL_CERT_PATH: /run/secrets/db_ssl_cert

secrets:
  db_ssl_ca:
    file: ./secrets/server-ca.pem
  db_ssl_key:
    file: ./secrets/client-key.pem
  db_ssl_cert:
    file: ./secrets/client-cert.pem
```

**Option C: Volume Mounts (For Testing Only)**

Mount a local directory with certificates:

```yaml
services:
  backend:
    volumes:
      - ./certs:/certs:ro
    environment:
      DB_SSL_CA_PATH: /certs/server-ca.pem
      DB_SSL_KEY_PATH: /certs/client-key.pem
      DB_SSL_CERT_PATH: /certs/client-cert.pem
```

**⚠️ Warning:** Keep the `certs/` directory out of version control and ensure proper file permissions.

#### Disabling SSL (Not Recommended for Production)

If your database does not require SSL (e.g., local development), simply omit all SSL environment variables. The application will connect without SSL encryption.

### Running the Application

#### Using Docker Compose

```bash
docker-compose up -d
```

#### Manual Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the services:
   ```bash
   npm start
   ```

### Security Notes

- Always use strong, randomly generated values for `JWT_SECRET`
- Never commit `.env` files or actual credentials to the repository
- Rotate all credentials if they have been exposed
- Use environment-specific configurations for development, staging, and production

---

## Platform Highlights

* **Online Code Execution** - Users submit solutions in more than one language and the platform runs them.
* **Microservices Architecture** - API requests, job queues, and program execution are handled by separate services.
* **Containerized Execution** - Each submitted program runs inside its own Docker container.
* **Real-Time Results** - Submission status and run outcomes are returned as they become available.
* **Competitive Programming** - The site includes problems, submissions, contests, and leaderboards.
* **Team Competitions** - Contests can be entered by teams working together.
* **Secure Authentication** - Sign-in and access control use JSON Web Tokens.
* **Scalable Execution** - Background workers can judge several submissions at the same time.

---

## Technology Stack

<div align="center">

![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge\&logo=nodedotjs\&logoColor=white)
![Express.js](https://img.shields.io/badge/Express.js-000000?style=for-the-badge\&logo=express\&logoColor=white)
![Flask](https://img.shields.io/badge/Flask-000000?style=for-the-badge\&logo=flask\&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge\&logo=postgresql\&logoColor=white)
![Redis](https://img.shields.io/badge/Redis-DC382D?style=for-the-badge\&logo=redis\&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-2496ED?style=for-the-badge\&logo=docker\&logoColor=white)
![Google Cloud](https://img.shields.io/badge/Google_Cloud-4285F4?style=for-the-badge\&logo=google-cloud\&logoColor=white)

</div>

### Backend

* **Node.js + Express.js** - The main API. It covers sign-in, problems, contests, and submissions.
* **Flask** - A separate service that accepts execution requests and places them on a queue.
* **Celery** - A distributed queue that carries out code-execution jobs.
* **PostgreSQL** - Long-term storage for users, problems, contests, and submissions.
* **Redis** - Message broker, plus storage for results and cached data.

### DevOps & Infrastructure

* **Docker & Docker Compose** - Packages each service and starts them together.
* **Google Cloud Platform** - Hosts the application.
* **Let's Encrypt** - Issues the SSL certificates.
* **GoDaddy** - Manages the domain and DNS.

---

## System Architecture

```mermaid
graph TB

    A[User / Frontend] -->|HTTPS| B[Express.js API]

    B -->|Store Data| C[(PostgreSQL)]

    B -->|Submit Execution Job| D[Flask Microservice]

    D -->|Queue Task| E[(Redis)]

    E -->|Process Task| F[Celery Worker]

    F -->|Create Isolated Environment| G[Docker Container]

    G -->|Execute Code| H[Runtime]

    H -->|Execution Result| F

    F -->|Store Result| E

    F -->|Update Submission| C

    E -->|Result Polling| B

    B -->|Response| A

    subgraph "Supported Runtimes"
        H1[Python]
        H2[Java]
        H3[C++]
    end

    H --> H1
    H --> H2
    H --> H3
```
---

## Features

### User Management

* Account registration
* Sign-in
* Authorization with JWTs
* Profile management
* Submissions tied to a specific user

### Problem Management

* Browse the problem list
* Add a problem
* Update a problem
* Remove a problem
* Group programming challenges
* Check a solution against a fixed set of test cases

### Multi-Language Code Execution

Submitted programs can be run in more than one language, including:

* C++
* Python
* Java

Every submission runs in a runtime kept separate from the rest of the system.

### Online Judge

Submitted code is checked against the problem's test cases, and that check produces a final verdict.

Possible verdicts:

* Accepted
* Wrong Answer
* Runtime Error
* Time Limit Exceeded
* Compilation Error

### Contests

* Create a contest
* Enter a contest
* Attach problems to a contest
* Track submissions
* Show standings while a contest is running
* Rank participants on a leaderboard

### Team Competitions

Contests can also be run for teams, so several users can compete together on the same entry.

### Leaderboards

Rankings update from contest results and from submissions.

### Security

* Authentication with JWTs
* Authorization by role
* Hashed passwords
* Execution kept apart from the host
* A Docker sandbox around each run
* Limits on the resources a program may use
* Traffic sent over HTTPS

---

## Docker Architecture

The application is made up of several services.

```text
                 ┌──────────────────┐
                 │    Frontend      │
                 └────────┬─────────┘
                          │
                          ▼
                 ┌──────────────────┐
                 │  Express API     │
                 └───────┬──────────┘
                         │
              ┌──────────┴──────────┐
              ▼                     ▼
       ┌──────────────┐      ┌──────────────┐
       │ PostgreSQL   │      │    Flask     │
       └──────────────┘      └──────┬───────┘
                                    │
                                    ▼
                              ┌────────────┐
                              │   Redis    │
                              └─────┬──────┘
                                    │
                                    ▼
                              ┌────────────┐
                              │   Celery   │
                              │   Worker   │
                              └─────┬──────┘
                                    │
                                    ▼
                            ┌─────────────────┐
                            │ Docker Sandbox  │
                            │                 │
                            │ C++ / Java /    │
                            │ Python          │
                            └─────────────────┘
```

Adding more workers lets more execution jobs run at the same time.

---

## Code Execution Security

An online judge has to run programs that users wrote, and that code cannot be trusted. That is one of the central problems this kind of system has to solve.

Isolation here is done with Docker.

Each submission gets its own container, so the program cannot reach the host directly.

That environment can limit or control:

* CPU use
* Memory use
* How long the program may run
* What it can do with the filesystem
* Whether it can use the network
* Removal of the container once the run ends

The result is a safer place to run code that did not come from the platform itself.

---

## Scalability

Because execution is asynchronous, many submissions can be in progress while the main API keeps answering requests.

Programs are not run inside the API process:

```text
User
 │
 ▼
API Server
 │
 ▼
Queue
 │
 ├── Worker 1
 ├── Worker 2
 ├── Worker 3
 └── Worker N
```

More workers can be started when more submissions arrive.

That lets the execution tier, which does the heavy computing, grow by adding workers.

---

## Data Storage

PostgreSQL is the main database, and the data stored there is kept permanently.

Records kept there include:

* Users
* Problems
* Test cases
* Contests
* Teams
* Submissions
* Submission results
* Contest standings

Redis handles:

* Queuing tasks
* Holding execution results for a short time
* Reading those results quickly
* Passing information between the pieces that run code

---

## Performance Considerations

Handling an incoming request and actually running the submitted program are separate steps.

A submission that takes a long time therefore does not stall the API.

The main techniques used for speed are:

* Asynchronous task processing
* Queues backed by Redis
* More than one Celery worker
* Indexes on the database
* Running programs in containers
* Caching results
* Adding workers as load grows

---

## Key Engineering Challenges

### 1. Running Untrusted Code

User programs have to be executed without letting them damage the machine they run on.

**Solution:** Isolated Docker environments that also cap resource use.

### 2. Long-Running Submissions

Judging a program often takes much longer than a typical API call.

**Solution:** Hand that work to Celery workers that run asynchronously.

### 3. Concurrent Submissions

Several people can submit at the same time.

**Solution:** Queues in Redis, with workers that can be scaled out.

### 4. Reliable Result Retrieval

The API needs to stay responsive while workers are still judging.

**Solution:** Keep execution state and results in a separate store, and read them back asynchronously.

### 5. Deployment

The project is made of several services that run on their own.

**Solution:** Docker Compose starts them together, and GitHub Actions deploys them automatically.

---

## High-Level Architecture

```text
my-online-judge/
│
├── backend/
│   ├── controllers/
│   ├── routes/
│   ├── models/
│   ├── middleware/
│   └── services/
│
├── frontend/
│
├── flask-service/
│
├── worker/
│
├── docker/
│
├── docker-compose.yml
├── .env.example
└── README.md
```

> Update the tree above so it matches the layout of this repository.

---
## Inspiration

The design follows ideas from existing competitive programming sites, including:

* Codeforces
* LeetCode
* AtCoder
* HackerRank

The aim is a contest-style interface on top of a backend that can grow with load and can run untrusted code safely.

---

---

**Online Judge Platform**

</div>
