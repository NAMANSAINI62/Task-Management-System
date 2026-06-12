const API_URL = 'http://127.0.0.1:5000/v1/tasks';
const token = localStorage.getItem('token');
const userRole = localStorage.getItem('role');
const username = localStorage.getItem('username');

if (!token) {
    window.location.href = 'index.html';
}

document.getElementById('user-display').innerText = username;
if (userRole === 'admin') {
    document.getElementById('admin-badge').style.display = 'inline';
}

const taskList = document.getElementById('task-list-items');
const dashboardMsg = document.getElementById('dashboard-message');

function showMsg(msg, type) {
    dashboardMsg.innerText = msg;
    dashboardMsg.className = `message ${type}`;
    dashboardMsg.style.display = 'block';
    setTimeout(() => { dashboardMsg.style.display = 'none'; }, 3000);
}

// Fetch and display tasks
async function fetchTasks() {
    try {
        const response = await fetch(API_URL, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        const tasks = await response.json();

        taskList.innerHTML = '';
        tasks.forEach(task => {
            const li = document.createElement('li');
            li.className = 'task-item';
            li.innerHTML = `
                <div class="task-info">
                    <strong class="task-title"></strong> <span class="task-status"></span><br>
                    <small class="task-desc"></small><br>
                    <small class="task-owner"></small>
                </div>
                <div class="task-actions">
                    <button class="btn-small btn-status">Check</button>
                    <button class="btn-small btn-edit">Edit</button>
                    <button class="btn-small btn-danger btn-delete">Delete</button>
                </div>
            `;
            
            li.querySelector('.task-title').textContent = task.title;
            li.querySelector('.task-status').textContent = `[${task.status}]`;
            li.querySelector('.task-desc').textContent = task.description || 'No description';
            li.querySelector('.task-owner').textContent = `Owner: ${task.owner}`;
            
            li.querySelector('.btn-status').onclick = () => toggleStatus(task.id, task.status);
            li.querySelector('.btn-edit').onclick = () => openEditModal(task.id, task.title, task.description);
            li.querySelector('.btn-delete').onclick = () => deleteTask(task.id);

            taskList.appendChild(li);
        });
    } catch (err) {
        showMsg("Error fetching tasks", "error");
    }
}

// Add new task
document.getElementById('add-task-btn').onclick = async () => {
    const title = document.getElementById('task-title').value;
    const description = document.getElementById('task-desc').value;

    if (!title) return showMsg("Title is required", "error");

    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ title, description })
        });

        if (response.ok) {
            showMsg("Task added", "success");
            document.getElementById('task-title').value = '';
            document.getElementById('task-desc').value = '';
            fetchTasks();
        }
    } catch (err) {
        showMsg("Server error", "error");
    }
};

// Toggle Task Status (Simple Update)
window.toggleStatus = async (id, currentStatus) => {
    const newStatus = currentStatus === 'pending' ? 'completed' : 'pending';
    try {
        await fetch(`${API_URL}/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ status: newStatus })
        });
        fetchTasks();
    } catch (err) {
        showMsg("Update failed", "error");
    }
};

// Delete Task
window.deleteTask = async (id) => {
    if (!confirm("Are you sure?")) return;
    try {
        const response = await fetch(`${API_URL}/${id}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${token}` }
        });
        if (response.ok) {
            showMsg("Task deleted!", "success");
            fetchTasks();
        } else {
            const data = await response.json();
            showMsg(data.message, "error");
        }
    } catch (err) {
        showMsg("Delete failed", "error");
    }
};

// Edit Task Logic
let currentEditId = null;
const editModal = document.getElementById('edit-modal');
const editTitleInput = document.getElementById('edit-title');
const editDescInput = document.getElementById('edit-desc');

window.openEditModal = (id, title, desc) => {
    currentEditId = id;
    editTitleInput.value = title;
    editDescInput.value = desc;
    editModal.style.display = 'block';
};

window.closeEditModal = () => {
    editModal.style.display = 'none';
};

document.getElementById('save-edit-btn').onclick = async () => {
    const title = editTitleInput.value;
    const description = editDescInput.value;

    try {
        const response = await fetch(`${API_URL}/${currentEditId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ title, description })
        });

        if (response.ok) {
            showMsg("Task updated!", "success");
            closeEditModal();
            fetchTasks();
        }
    } catch (err) {
        showMsg("Update failed", "error");
    }
};

// Logout
document.getElementById('logout-btn').onclick = () => {
    localStorage.clear();
    window.location.href = 'index.html';
};

// Initial Load
fetchTasks();
