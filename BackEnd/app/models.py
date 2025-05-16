from enum import Enum
from datetime import datetime
import uuid
import time
import secrets
import bcrypt
import re

from configure import db

EMAIL_REGEX = re.compile(r"[^@]+@[^@]+\.[^@]+")

def generate_timestamped_id():
    return f"ACC_{int(time.time())}_{secrets.token_hex(5)}"

def generate_timestamped_chat_id():
    return f"MSG_{int(time.time())}_{uuid.uuid4().hex[:8]}"

def generate_account_session_id():
    return f"ACSESS_{int(time.time())}_{secrets.token_hex(12)}"

class Account(db.Model):
    __tablename__ = "account"

    id = db.Column(db.String(35), primary_key=True, default=generate_timestamped_id)
    email = db.Column(db.String(80), unique=True, nullable=False)
    session_id = db.Column(db.String(50), default=generate_timestamped_id)
    password_hash = db.Column(db.String(128))
    full_name = db.Column(db.String(50))
    location = db.Column(db.String(100))
    linkedIn = db.Column(db.String(100))

    businesses = db.relationship("Business", backref="account", lazy=True)

    def __init__(self, email, password=None, full_name=None, location=None, linkedIn=None):
        self.email = email
        self.full_name = full_name
        self.location = location
        self.linkedIn = linkedIn
        if password:
            self.set_password(password)

    def set_password(self, raw_password):
        if not raw_password or len(raw_password) < 6:
            raise ValueError("Password must be at least 6 characters")
        if isinstance(raw_password, bytes):
            raw_password = raw_password.decode("utf-8")  # ensure it’s a string
        self.password_hash = bcrypt.hashpw(raw_password.encode("utf-8"), bcrypt.gensalt())

    def verify_password(self, raw_password):
        return bcrypt.checkpw(raw_password.encode("utf-8"), self.password_hash)

    def to_json(self):
        return {
            "id": self.id,
            "email": self.email,
            "full_name": self.full_name,
            "location": self.location,
            "linkedIn": self.linkedIn
        }

    def from_json(self, json):
        self.email = json.get("email")
        self.full_name = json.get("full_name")
        self.location = json.get("location")
        self.linkedIn = json.get("linkedIn")
        return self

class Scale(Enum):
    Small = "Small"
    Medium = "Medium"
    Large = "Large"

class Business(db.Model):
    __tablename__ = "businesses"

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(120), nullable=False)
    description = db.Column(db.Text)
    country = db.Column(db.String(50))
    website = db.Column(db.String(200))
    scale = db.Column(db.String(50))
    categories = db.Column(db.String(120))
    
    owner_id = db.Column(db.Integer, db.ForeignKey("account.id"), nullable=False)

    products = db.relationship("Product", backref="business", lazy=True)
    

    def to_json(self):
        return {
            "id": self.id,
            "name": self.name,
            "description": self.description,
            "country": self.country,
            "website": self.website,
            "scale": self.scale,
            "categories": self.categories,
            "owner_id": self.owner_id
        }

    def from_json(self, json):
        self.name = json.get("name")
        self.description = json.get("description")
        self.country = json.get("country")
        self.website = json.get("website")
        self.scale = json.get("scale")
        self.categories = json.get("categories"),
        return self

class Product(db.Model):
    __tablename__ = "products"

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(120), nullable=False)
    description = db.Column(db.Text)
    image_url = db.Column(db.String(200))
    
    business_id = db.Column(db.Integer, db.ForeignKey("businesses.id"), nullable=False)

    def to_json(self):
        return {
            "id": self.id,
            "name": self.name,
            "description": self.description,
            "image_url": self.image_url,
            "business_id": self.business_id
        }

    def from_json(self, json):
        self.name = json.get("name")
        self.description = json.get("description")
        self.image_url = json.get("image_url")
        self.business_id = json.get("business_id")
        return self

class ChatMessageAI(db.Model):
    __tablename__ = "chat_ai_messages"

    id = db.Column(db.String, default=generate_timestamped_chat_id, primary_key=True)
    session_id = db.Column(db.String(64), nullable=False)
    message = db.Column(db.Text, nullable=False)
    timestamp = db.Column(db.DateTime, default=datetime.utcnow)
    
    user_message_id = db.Column(db.String, db.ForeignKey("chat_user_messages.id"), nullable=False)
    
    user_message = db.relationship("ChatMessageUser", back_populates="ai_replies")
    
    def to_json(self):
        return {
            "id": self.id,
            "session_id": self.session_id,
            "message": self.message,
            "sender": "ai",
            "timestamp": self.timestamp.isoformat()
        }

class ChatMessageUser(db.Model):
    __tablename__ = "chat_user_messages"

    id = db.Column(db.String, default=generate_timestamped_chat_id, primary_key=True)
    session_id = db.Column(db.String(64), nullable=False)
    message = db.Column(db.Text)
    sender_id = db.Column(db.String(64))
    receiver_id = db.Column(db.String(64))
    timestamp = db.Column(db.DateTime, default=datetime.utcnow)
    
    ai_replies = db.relationship("ChatMessageAI", back_populates="user_message")
    
    def to_json(self):
        return {
            "id": self.id,
            "session_id": self.session_id,
            "message": self.message,
            "sender": self.sender_id,
            "receiver": self.receiver_id,
            "timestamp": self.timestamp.isoformat()
        }

    def from_json(self, json):
        self.session_id = json.get("session_id")
        self.message = json.get("message")
        self.sender_id = json.get("sender")
        self.receiver_id = json.get("receiver")
        return self

