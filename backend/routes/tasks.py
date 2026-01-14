from flask import Blueprint, request, jsonify
from models import db, Task
from flask_jwt_extended import jwt_required, get_jwt_identity, get_jwt

tasks_bp = Blueprint('tasks', __name__)

@tasks_bp.route('', methods=['GET'])
@jwt_required()
def get_tasks():
    user_id = get_jwt_identity()
    claims = get_jwt()
    role = claims.get('role', 'user')
    
    if role == 'admin':
        tasks = Task.query.all()
    else:
        tasks = Task.query.filter_by(user_id=user_id).all()
    
    output = []
    for task in tasks:
        output.append({
            "id": task.id,
            "title": task.title,
            "description": task.description,
            "status": task.status,
            "user_id": task.user_id,
            "owner": task.owner.username
        })
    
    return jsonify(output), 200

@tasks_bp.route('', methods=['POST'])
@jwt_required()
def create_task():
    user_id = get_jwt_identity()
    data = request.get_json()
    
    if not data or not data.get('title'):
        return jsonify({"message": "Title is required"}), 400
    
    new_task = Task(
        title=data['title'],
        description=data.get('description', ''),
        user_id=user_id
    )
    
    db.session.add(new_task)
    db.session.commit()
    
    return jsonify({"message": "Task created"}), 201

@tasks_bp.route('/<int:id>', methods=['PUT'])
@jwt_required()
def update_task(id):
    user_id = int(get_jwt_identity())
    role = get_jwt().get('role', 'user')
    task = Task.query.get_or_404(id)
    
    # Only owner or admin can update (though usually owner)
    if task.user_id != user_id and role != 'admin':
        return jsonify({"message": "Permission denied"}), 403
    
    data = request.get_json()
    task.title = data.get('title', task.title)
    task.description = data.get('description', task.description)
    task.status = data.get('status', task.status)
    
    db.session.commit()
    return jsonify({"message": "Task updated"}), 200

@tasks_bp.route('/<int:id>', methods=['DELETE'])
@jwt_required()
def delete_task(id):
    user_id = int(get_jwt_identity())
    role = get_jwt().get('role', 'user')
    task = Task.query.get_or_404(id)
    
    # Requirement: Admin can delete any, User only their own
    if role != 'admin' and task.user_id != user_id:
        return jsonify({"message": "Permission denied"}), 403
    
    db.session.delete(task)
    db.session.commit()
    
    return jsonify({"message": "Task deleted"}), 200
