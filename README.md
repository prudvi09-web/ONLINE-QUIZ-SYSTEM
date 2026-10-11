# Online Quiz System 🎓

A full-stack, enterprise-grade **Online Quiz System** built according to the research abstract specifications. The platform conducts digital assessments efficiently with automatic evaluation, dual-role access (Administrators and Students), dynamic question navigation, and real-time score calculation.

---

## 🌟 Key Features

### 👤 User / Student Capabilities
- **Secure Authentication**: User registration and JWT-based secure sign-in.
- **Category Browsing**: Select quizzes across diverse domains (Java Programming, Web Development, Database & SQL, DSA).
- **Interactive Quiz Interface**:
  - Live countdown timer with auto-submission upon expiry.
  - Question navigation palette with state indicators (Answered, Unanswered, Flagged for Review).
  - Multiple-Choice Questions (MCQ) with intuitive option selectors.
  - Instant automatic evaluation and grading upon completion.
- **Detailed Solution Breakdown**:
  - Immediate score card with percentage, pass/fail status, and celebratory confetti.
  - Question-by-question review highlighting user choices, correct answers, and educational rationales.
- **Personal History & Leaderboard**: Track past attempts, aggregate metrics, and view top performers globally.

### 🛡️ Administrator Capabilities
- **Quiz Management**: Create, update, delete, and publish quizzes with configurable durations, pass thresholds, and difficulty levels.
- **Question Management**: Add, modify, or remove multiple-choice questions with answer keys, mark weighting, and explanations.
- **Category Organization**: Create and manage topic categories with color themes and icons.
- **User Results Audit**: Inspect all candidate attempt records across the entire system.
- **Analytics Dashboard**: Real-time system statistics covering total assessments, questions, users, pass rates, and average performance.

---

## 🏗️ Technology Stack

| Component | Technologies |
|---|---|
| **Frontend** | React 18, Vite, Tailwind CSS, Lucide React, Canvas Confetti |
| **Backend** | Java 17+, Spring Boot 3.3, Spring Security, Spring Data JPA, JWT |
| **Database** | H2 Embedded Database (Plug & Play, zero setup) / MySQL 8.x ready |
| **Build Tools** | Apache Maven 3.9+, Node.js (npm) |

---

## 🔑 Pre-configured Demo Accounts

When the backend starts, the built-in `DataInitializer` seeds these ready-to-use accounts:

| Role | Email | Password | Permissions |
|---|---|---|---|
| **Administrator** | `admin@quiz.com` | `admin123` | Full CRUD access to quizzes, questions, categories, and student records |
| **Student (John)** | `user@quiz.com` | `user123` | Can take assessments, review scores, view history |
| **Student (Sarah)** | `sarah@quiz.com` | `sarah123` | Sample student account |
| **Student (Alex)** | `alex@quiz.com` | `alex123` | Sample student account |

*Note: You can also register any new account instantly from the UI.*

---

## 🚀 Quick Start Guide

### 1. Start the Spring Boot Backend
Open a terminal in the `backend` folder and run:
```bash
cd backend
mvn spring-boot:run
```
- The backend server will launch at: **`http://localhost:8080`**
- H2 Database Web Console: **`http://localhost:8080/h2-console`**
  - JDBC URL: `jdbc:h2:mem:quizdb`
  - Username: `sa`
  - Password: *(blank)*

### 2. Start the React Frontend
In a second terminal window in the `frontend` folder:
```bash
cd frontend
npm install
npm run dev
```
- The frontend will launch at: **`http://localhost:3000`** (or `http://localhost:5173`)
- Proxies `/api` requests directly to `http://localhost:8080`.

---

## 🗄️ Optional: Connecting MySQL
By default, the backend runs with an in-memory embedded H2 database for instant execution without configuration.
To switch to MySQL:
1. Create a MySQL database:
   ```sql
   CREATE DATABASE quiz_system_db;
   ```
2. In `backend/src/main/resources/application.properties`, uncomment the MySQL block and configure your credentials:
   ```properties
   spring.datasource.url=jdbc:mysql://localhost:3306/quiz_system_db?useSSL=false&serverTimezone=UTC&allowPublicKeyRetrieval=true
   spring.datasource.username=root
   spring.datasource.password=your_mysql_password
   spring.datasource.driver-class-name=com.mysql.cj.jdbc.Driver
   spring.jpa.database-platform=org.hibernate.dialect.MySQLDialect
   ```

---

## 📡 Key REST API Endpoints

### Authentication
- `POST /api/auth/login` - Authenticate and get JWT token
- `POST /api/auth/register` - Create user or administrator
- `GET /api/auth/me` - Current authenticated user details

### Quizzes & Categories
- `GET /api/categories` - List categories
- `GET /api/quizzes/active` - List all active quizzes for students
- `GET /api/quizzes/{id}/take` - Fetch quiz questions without leaking correct options
- `POST /api/attempts/submit` - Submit answers and receive automatic score evaluation

### Administrative APIs (`ROLE_ADMIN`)
- `GET /api/admin/stats` - Overall platform analytics and metrics
- `GET /api/admin/attempts` - View all candidate submissions
- `POST /api/quizzes` - Create quiz
- `PUT /api/quizzes/{id}` - Update quiz
- `DELETE /api/quizzes/{id}` - Delete quiz
- `POST /api/quizzes/{quizId}/questions` - Add question to quiz
- `PUT /api/quizzes/questions/{questionId}` - Update question
- `DELETE /api/quizzes/questions/{questionId}` - Delete question
