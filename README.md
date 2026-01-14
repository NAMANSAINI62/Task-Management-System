# Scalable Task Management System (REST API)

This is a full-stack task management application with secure authentication and role-based access control (RBAC).

## Features
- **Secure Authentication**: Password hashing (Bcrypt) and JWT tokens.
- **RBAC**: Admin users can see and delete any task, while regular users can only manage their own.
- **RESTful API**: Versioned endpoints (`/v1/`) with proper status codes.
- **Modern UI**: Clean frontend built with Vanilla JS.
- **Database**: Persistent storage using MySQL.

## Tech Stack
- **Backend**: Python (Flask)
- **Frontend**: Vanilla JS, HTML, CSS
- **Database**: MySQL
- **Auth**: JWT (JSON Web Tokens)

## Setup Instructions

### Backend
1. Go to the `backend` folder.
2. Create a virtual environment: `python -m venv venv`.
3. Activate it: `venv\Scripts\activate` (Windows).
4. Install dependencies: `pip install -r requirements.txt`.
5. Create a MySQL database named `task_db`.
6. Update the `.env` file with your MySQL password.
7. Start the server: `python app.py`.

### Frontend
1. Simply open `frontend/index.html` in your browser.
2. Ensure the backend server is running on `http://127.0.0.1:5000`.

## API Documentation
| Endpoint | Method | Description | Auth Required |
| --- | --- | --- | --- |
| `/v1/auth/register` | POST | Register a new user | No |
| `/v1/auth/login` | POST | Login and get JWT | No |
| `/v1/tasks` | GET | List tasks | Yes |
| `/v1/tasks` | POST | Create a task | Yes |
| `/v1/tasks/<id>` | PUT | Update task status | Yes |
| `/v1/tasks/<id>` | DELETE | Delete a task | Yes |
