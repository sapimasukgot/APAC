from enum import unique
from enum import Enum
import bcrypt
import re


from sqlalchemy import null
from config import db

EMAIL_REGEX = re.compile(r"[^@]+@[^@]+\.[^@]+")

class Account(db.Model):
    __tablename__ = "accounts"
    
    id = db.Column(db.Integer, primary_key=True)
    _email = db.Column('email', db.String(80), unique=True, nullable=False)
    _password = db.Column("password", db.LargeBinary(128), nullable=False)
    _full_name = db.Column('fullName', db.String(50), unique=False)
    _location = db.Column('location', db.String(100), unique=False)
    _linkedIn = db.Column('LinkedIn', db.String(100), unique=True)
     
    def to_json(self):
        return {
            "id": self.id,
            "email": self._email,
            "password":self._password,
            "full_name": self._full_name,
            "location": self._location,
            "linkedIn": self._linkedIn
        }
        
    def from_json(self, json):
        self._id = json["id"]
        self._email = json["email"]
        self._password = json["password"]
        self._full_name = json["full_name"]
        self._location = json["location"]
        
        return self
    
    # getter
    @property
    def id(self):
        return self.id
    
    @property
    def email(self):
        return self._email
    
    @property
    def password(self):
        raise AttributeError("Password is write-only")
    
    @property
    def full_name(self):
        return self._full_name
    
    @property
    def location(self):
        return self._location
    
    @property
    def linkedIn(self):
        return self._linkedIn
    
    # setter
    @id.setter
    def id(self, value):
        self.id = value
    
    @email.setter
    def email(self, value):
        if not EMAIL_REGEX.match(value):
            raise ValueError("Invalid email address.")
        self._email = value.lower()
    
    @full_name.setter
    def full_name(self, value):
        if not value or len(value) < 2:
            raise ValueError("Full name must be at least 2 characters.")
        self._full_name = value.strip()
    
    @location.setter
    def location(self, value):
        self._location = value.strip()
        
    @linkedIn.setter
    def linkedin(self, value):
        self._linkedin = value.strip()
        
    @password.setter
    def password(self, raw_password):
        if len(raw_password) < 6:
            raise ValueError("Password must be at least 6 characters")
        self._password = bcrypt.hashpw(raw_password.encode("utf-8"), bcrypt.gensalt())

    def verify_password(self, raw_password):
        return bcrypt.checkpw(raw_password.encode("utf-8"), self._password)

    businesses = db.relationship('business', backref='account',  lazy=True)
        
class ScaleRole(Enum):
    Small = "Small"
    Medium = "Medium"
    Large = "Large"
        
class Business(db.Model):
    __tablename__ = "businesses"
    _id = db.Column("id", db.Integer, primary_key=True)
    _name = db.Column("name", db.String(120), nullable=False)
    _description = db.Column("description", db.Text)
    _country = db.Column("country", db.String(50))
    _website = db.Column("website", db.String(200))
    _size = db.Column("size", db.String(50))
    _categories = db.Column("categories", db.String(120))
    _owner_id = db.Column("owner_id", db.Integer, db.ForeignKey("user_profiles.id"), nullable=False)

    owner = db.relationship("UserProfile", backref="businesses")

    def to_json(self):
        return {
            "id": self._id,
            "name": self._name,
            "description": self._description,
            "country": self._country,
            "website": self._website,
            "size": self._size,
            "categories": self._categories,
            "owner": self._owner_id
        }
        
    def from_json(self, json):
        self._id = json["id"]
        self._name = json["name"]
        
        
        return self
    
    @property
    def id(self): return self._id

    @property
    def name(self): return self._name
    @name.setter
    def name(self, value):
        if not value:
            raise ValueError("Business name is required.")
        self._name = value.strip()

    @property
    def description(self): return self._description or ""
    @description.setter
    def description(self, value):
        self._description = value.strip()

    @property
    def website(self): return self._website
    @website.setter
    def website(self, value):
        if value and not value.startswith("http"):
            raise ValueError("Invalid website URL.")
        self._website = value

    @property
    def country(self): return self._country
    @country.setter
    def country(self, value):
        self._country = value

    @property
    def size(self): return self._size
    @size.setter
    def size(self, value):
        self._size = value

    @property
    def categories(self): return self._categories
    @categories.setter
    def categories(self, value):
        self._categories = value


class Product(db.Model):
    __tablename__ = "products"
    _id = db.Column("id", db.Integer, primary_key=True)
    _name = db.Column("name", db.String(120), nullable=False)
    _description = db.Column("description", db.Text)
    _image_url = db.Column("image_url", db.String(200))
    _business_id = db.Column("business_id", db.Integer, db.ForeignKey("businesses.id"), nullable=False)

    business = db.relationship("Business", backref="products")

    @property
    def id(self): return self._id

    @property
    def name(self): return self._name
    @name.setter
    def name(self, value):
        if not value:
            raise ValueError("Product name is required.")
        self._name = value.strip()

    @property
    def description(self): return self._description or ""
    @description.setter
    def description(self, value):
        self._description = value.strip()

    @property
    def image_url(self): return self._image_url
    @image_url.setter
    def image_url(self, value):
        if value and not value.startswith("http"):
            raise ValueError("Invalid image URL.")
        self._image_url = value