from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from config import Config
from .chat import chat_blueprint

db = SQLAlchemy()

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)

    db.init_app(app)
    CORS(app)

    from .routes import main as main_blueprint
    app.register_blueprint(main_blueprint)
    app.register_blueprint(chat_blueprint)

    return app
