import requests
import json

BASE_URL = "http://127.0.0.1:5000/v1"

def test_api():
    print("--- Starting API Tests ---")

    # 1. Register
    reg_data = {
        "username": "testuser",
        "email": "test@example.com",
        "password": "password123"
    }
    response = requests.post(f"{BASE_URL}/auth/register", json=reg_data)
    print(f"Register: {response.status_code} - {response.json()}")

    # 2. Login
    login_data = {
        "username": "testuser",
        "password": "password123"
    }
    response = requests.post(f"{BASE_URL}/auth/login", json=login_data)
    print(f"Login: {response.status_code}")
    token = response.json().get('access_token')
    headers = {"Authorization": f"Bearer {token}"}

    # 3. Create Task
    task_data = {
        "title": "Test Task",
        "description": "Testing the API"
    }
    response = requests.post(f"{BASE_URL}/tasks", json=task_data, headers=headers)
    print(f"Create Task: {response.status_code} - {response.json()}")

    # 4. Get Tasks
    response = requests.get(f"{BASE_URL}/tasks", headers=headers)
    tasks = response.json()
    print(f"Get Tasks: {response.status_code} - {len(tasks)} tasks found")
    task_id = tasks[0]['id'] if tasks else None

    # 5. Update Task
    if task_id:
        update_data = {"status": "completed"}
        response = requests.put(f"{BASE_URL}/tasks/{task_id}", json=update_data, headers=headers)
        print(f"Update Task: {response.status_code} - {response.json()}")

    # 6. Delete Task
    if task_id:
        response = requests.delete(f"{BASE_URL}/tasks/{task_id}", headers=headers)
        print(f"Delete Task: {response.status_code} - {response.json()}")

    print("--- API Tests Completed ---")

if __name__ == "__main__":
    try:
        test_api()
    except Exception as e:
        print(f"Test failed: {e}")
