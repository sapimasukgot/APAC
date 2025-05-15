import os
from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from itsdangerous import URLSafeSerializer
from config import Config
from config import db
from .chat import chat_blueprint

SECRET_KEY = "you WOULD never guess this"
serializer = URLSafeSerializer(SECRET_KEY)

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)

    db.init_app(app)
    CORS(app)

    from .routes import main as main_blueprint
    app.register_blueprint(main_blueprint)
    app.register_blueprint(chat_blueprint)

    return app


def encrypt_id(id):
    return serializer.dumps(id)

def decrypt_id(encrypted_id):
    return serializer.loads(encrypted_id)