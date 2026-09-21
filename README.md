# Online Learning Platform

A comprehensive Online Learning Platform built with a modern tech stack. It features a Next.js 16 frontend and an Express.js backend with MongoDB, providing functionalities for both students and instructors, including JWT-based authentication, course management, student enrollments, and an AI-powered course recommendation system.

## 🚀 Tech Stack

### Frontend
- **Framework**: [Next.js](https://nextjs.org/) (App Router, v16.3.5)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State Management**: Zustand
- **HTTP Client**: Axios
- **Icons**: Lucide React
- **Notifications**: Sonner

### Backend
- **Framework**: Express.js (v5.x)
- **Language**: TypeScript
- **Database**: MongoDB (Mongoose)
- **Authentication**: JSON Web Tokens (JWT) & bcryptjs
- **Validation**: Zod
- **AI Integration**: OpenAI API (for course recommendations)

---

## 🛠️ Setup Instructions

### Prerequisites
- Node.js (v20+ recommended)
- MongoDB running locally or a MongoDB Atlas connection string
- OpenAI API Key (for AI features)

### 1. Clone the repository
```bash
git clone <repository-url>
cd online-learning-platform
```

### 2. Backend Setup
```bash
cd backend
npm install
```

Create a `.env` file in the `backend` directory with the following variables:
```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
OPENAI_API_KEY=your_openai_api_key
```

Start the backend development server:
```bash
npm run dev
```

### 3. Frontend Setup
Open a new terminal window and navigate to the frontend directory:
```bash
cd frontend
npm install
```

Create a `.env.local` file in the `frontend` directory if you need to configure custom API URLs (defaults to `http://localhost:5000` via Axios config).

Start the frontend development server:
```bash
npm run dev
```

The frontend will run on `http://localhost:3000` and the backend on `http://localhost:5000` (or your configured PORT).

---

## 🗄️ System Design (Database Structure)

The platform uses MongoDB with Mongoose schemas. Here is the core database structure:

### 1. User Model
Stores information about both students and instructors.
- `firstName` (String, required)
- `lastName` (String, required)
- `email` (String, required, unique)
- `password` (String, required, hashed)
- `role` (String, enum: `["student", "instructor"]`, default: `"student"`)
- `createdAt` / `updatedAt` (Timestamps)

### 2. Course Model
Stores course details created by instructors.
- `title` (String, required)
- `description` (String, required)
- `instructor` (ObjectId, ref: `User`, required)
- `content` (String, required)
- `createdAt` / `updatedAt` (Timestamps)

### 3. Enrollment Model
Tracks which student is enrolled in which course.
- `student` (ObjectId, ref: `User`, required)
- `course` (ObjectId, ref: `Course`, required)
- `createdAt` / `updatedAt` (Timestamps)
- *Note: Features a compound unique index on `{ student: 1, course: 1 }` to prevent duplicate enrollments.*

---

## 📡 API Documentation

### Auth Routes (`/api/auth`)
| Method | Endpoint | Description | Access |
| :--- | :--- | :--- | :--- |
| `POST` | `/register` | Register a new user (student/instructor) | Public |
| `POST` | `/login` | Authenticate user and receive JWT | Public |
| `GET` | `/me` | Get current authenticated user profile | Private |
| `POST` | `/logout` | Logout user | Public |

### Course Routes (`/api/courses`)
| Method | Endpoint | Description | Access |
| :--- | :--- | :--- | :--- |
| `GET` | `/` | Get all available courses | Public |
| `GET` | `/:id` | Get details of a specific course | Public |
| `POST` | `/` | Create a new course | Private (Instructor) |
| `PUT` | `/:id` | Update an existing course | Private (Instructor) |
| `DELETE` | `/:id` | Delete a course | Private (Instructor) |
| `GET` | `/my-courses` | Get courses created by the instructor | Private (Instructor) |
| `GET` | `/:courseId/students` | Get students enrolled in a specific course | Private (Instructor) |

### Enrollment Routes (`/api/enrollments`)
| Method | Endpoint | Description | Access |
| :--- | :--- | :--- | :--- |
| `POST` | `/:courseId` | Enroll in a course | Private (Student) |
| `GET` | `/my-courses` | Get all courses the student is enrolled in | Private (Student) |
| `GET` | `/:courseId/status` | Check enrollment status for a specific course | Private (Student) |

### AI Routes (`/api/ai`)
| Method | Endpoint | Description | Access |
| :--- | :--- | :--- | :--- |
| `POST` | `/course-recommendations`| Get AI-powered course recommendations based on user input | Public |

---

## ☁️ Hosting & Deployment

The entire application infrastructure is hosted within the **Amazon Web Services (AWS)** ecosystem, with custom domain management handled via **GoDaddy**.

### Backend (Node.js/Express API)
- **AWS EC2 (Elastic Compute Cloud):** The backend API is deployed directly on AWS EC2 instances. This provides full control over the server environment, allowing for robust and scalable API services.

### Frontend (Next.js 16)
- **AWS Hosting:** The Next.js frontend is hosted directly on AWS, running as a Node.js server on AWS EC2 alongside the backend infrastructure for seamless integration.

### Domain & DNS
- **GoDaddy:** The custom domain is registered through GoDaddy and configured to point to the AWS infrastructure (e.g., via AWS Route 53 or directly to an Application Load Balancer / CloudFront distribution).

### Database
- **MongoDB Atlas / AWS:** The database is hosted using a cloud-native MongoDB solution, securely connected to the AWS infrastructure.
