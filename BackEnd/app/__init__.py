import os
from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from config import Config
from config import db
from .chat import chat_blueprint

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)

    db.init_app(app)
    CORS(app)

    from .routes import main as main_blueprint
    app.register_blueprint(main_blueprint)
    app.register_blueprint(chat_blueprint)

    return app

