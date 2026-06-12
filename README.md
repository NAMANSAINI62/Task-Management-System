# Scalable Task Management System (REST API)

This is a clean, secure full-stack task management application with user authentication and role-based access control (RBAC).

## Features
- **Secure Authentication**: Password hashing (Bcrypt) and session validation using JWT (JSON Web Tokens).
- **Role-Based Access Control (RBAC)**: Admin users can view all tasks in the system, while regular users can only view and manage their own.
- **Modern UI**: Fully responsive frontend built with Vanilla HTML, CSS, and JS (secured against common injection/XSS issues).
- **Database**: Persistent storage using MySQL database with SQLAlchemy models.

## Tech Stack
- **Backend**: Python (Flask, Flask-SQLAlchemy, Flask-JWT-Extended, Flask-Bcrypt, Flask-CORS)
- **Frontend**: HTML,CSS, JavaScript
- **Database**: MySQL
- **Auth**: JWT (JSON Web Tokens)

---

## Setup Instructions

### 1. Database Setup
Ensure you have a MySQL database named `task_db` running. Update the configuration in `backend/.env` with your username and password:
```env
SECRET_KEY=yoursecretkeyhere
JWT_SECRET_KEY=yourjwtsecretkeyhere
DB_USER=root
DB_PASSWORD=yourmysqlpassword
DB_HOST=127.0.0.1
DB_NAME=task_db
```

### 2. Backend Setup
1. Open a terminal and navigate to the `backend` folder:
   ```bash
   cd backend
   ```
2. Activate the virtual environment:
   * **Windows**: `venv\Scripts\activate`
   * **macOS/Linux**: `source venv/bin/activate`
3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
4. Start the server:
   ```bash
   python app.py
   ```
   *The server will start running on `http://127.0.0.1:5000` and automatically create the required database tables.*

### 3. Frontend Setup
1. Serve the `frontend` directory using any local server, for example:
   ```bash
   cd frontend
   ```
   and start a simple Python server:
   ```bash
   python -m http.server 8080
   ```
2. Open `http://127.0.0.1:8080/index.html` in your browser.

---

## API Endpoints
| Endpoint | Method | Description | Auth Required |
| --- | --- | --- | --- |
| `/v1/auth/register` | POST | Register a new user | No |
| `/v1/auth/login` | POST | Login and receive JWT | No |
| `/v1/tasks` | GET | List tasks (Admin sees all, User sees own) | Yes |
| `/v1/tasks` | POST | Create a task | Yes |
| `/v1/tasks/<id>` | PUT | Update task details or status | Yes |
| `/v1/tasks/<id>` | DELETE | Delete a task (Admin can delete any, User only own) | Yes |
