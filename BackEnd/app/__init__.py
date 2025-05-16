import os
from dotenv import load_dotenv
from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from flask_restful import Api, Resource, reqparse, fields, marshal_with, abort
from configure import Config, db
from .routes.chat import chat_blueprint

load_dotenv()

def create_app():
    app = Flask(__name__)
    app.config["SECRET_KEY"] = os.getenv("SECRET_KEY", "dev-secret")
    app.config.from_object(Config)
    CORS(app, supports_credentials=True)

    db.init_app(app)

    from .routes.auth import auth_blueprint
    from .routes.signup import signup_blueprint
    from .routes.business import business_blueprint
    from .routes.chat import chat_blueprint
    from .routes.profile import profile_blueprint

    app.register_blueprint(auth_blueprint, url_prefix="/auth")
    app.register_blueprint(signup_blueprint, url_prefix="/auth/signup")
    app.register_blueprint(business_blueprint, url_prefix="/business")
    app.register_blueprint(chat_blueprint, url_prefix="/chat")
    app.register_blueprint(profile_blueprint, url_prefix="/profile")

    return app

