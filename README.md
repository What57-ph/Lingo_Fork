# 📘 Lingo - Online Learning Platform

### 1. Project Introduction
Lingo is a comprehensive web application built on a **microservices architecture**, providing a robust platform for online learning and testing.

---

### 2. Key Features
- **Account Management & Authentication**  
  Integrates Keycloak for registration, login, and social logins.

- **Test Management**  
  CRUD operations for tests, questions, and multimedia.

- **Attempt History**  
  Tracks user attempts, calculates scores, stores results.

- **File Management**  
  Upload and retrieve avatars, audio/video files.

- **User Interface**  
  ReactJS frontend for users and admins.

- **Admin Dashboard**  
  Manage users, tests, and view statistics.

---

### 3. System Architecture
- **API Gateway** – Spring Cloud Gateway  
- **Discovery Server** – Eureka  
- **Account Service** – User accounts  
- **Test Service** – Test logic  
- **Attempt Service** – Test results  
- **File Service** – File handling  
- **Web App** – ReactJS SPA  
- **Database** – MySQL  
- **Keycloak** – Authentication  
- **Observability** – Prometheus & Grafana  

---

### 4. Technology Stack

**Backend**
- Java 17+
- Spring Boot, Spring Cloud, Spring Security
- Hibernate, Feign Client
- Keycloak
- RabbitMQ

**Frontend**
- ReactJS, Redux Toolkit
- Axios, Tailwind CSS, Ant Design

**Database**
- MySQL

**DevOps**
- Docker, Docker Compose
- Maven
- Prometheus, Grafana

---

### 5. Installation & Setup

```bash
git clone https://github.com/ducsieunhan/lingo.git
cd lingo
docker-compose up -d
```

Optional observability tools:

```bash
docker-compose -f docker-compose.yml -f docker-compose-observability.yml up -d
```

---

### 6. Usage
- Web App → `http://localhost:5173`  
- API Gateway → `http://localhost:8080`  
- Keycloak Admin → `http://localhost:8180/realms/master`  
- Grafana → `http://localhost:4000`  
``` 
