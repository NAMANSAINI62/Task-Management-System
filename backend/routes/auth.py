from flask import Blueprint, request, jsonify
from models import db, User
from flask_jwt_extended import create_access_token

auth_bp = Blueprint('auth', __name__)

@auth_bp.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    
    if not data or not data.get('username') or not data.get('password') or not data.get('email'):
        return jsonify({"message": "Missing required fields"}), 400
    
    if User.query.filter_by(username=data['username']).first():
        return jsonify({"message": "Username already exists"}), 409

    if User.query.filter_by(email=data['email']).first():
        return jsonify({"message": "Email already exists"}), 409

    new_user = User(
        username=data['username'],
        email=data['email'],
        role=data.get('role', 'user')
    )
    new_user.set_password(data['password'])
    
    db.session.add(new_user)
    db.session.commit()
    
    return jsonify({"message": "User registered successfully"}), 201

@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    
    user = User.query.filter_by(username=data.get('username')).first()
    
    if user and user.check_password(data.get('password')):
        # JWT Subject (identity) MUST be a string. We store the role in additional_claims.
        access_token = create_access_token(
            identity=str(user.id), 
            additional_claims={"role": user.role}
        )
        return jsonify(access_token=access_token, role=user.role, username=user.username), 200
    
    return jsonify({"message": "Invalid credentials"}), 401
