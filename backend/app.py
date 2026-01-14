from flask import Flask, jsonify
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from config import Config
from models import db, bcrypt
from routes.auth import auth_bp
from routes.tasks import tasks_bp

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)

    # Initialize extensions
    db.init_app(app)
    bcrypt.init_app(app)
    CORS(app)
    JWTManager(app)

    # Register blueprints with versioning
    app.register_blueprint(auth_bp, url_prefix='/v1/auth')
    app.register_blueprint(tasks_bp, url_prefix='/v1/tasks')

    # Global error handler for 404
    @app.errorhandler(404)
    def not_found(error):
        return jsonify({"message": "Resource not found"}), 404

    # Global error handler for 500
    @app.errorhandler(500)
    def server_error(error):
        return jsonify({"message": "Internal server error"}), 500

    return app

if __name__ == '__main__':
    app = create_app()
    with app.app_context():
        db.create_all() # This creates the tables if they don't exist
    app.run(debug=True, port=5000)
