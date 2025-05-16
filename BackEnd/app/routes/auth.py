from flask import Blueprint, request, jsonify, session
from ..models import Account, Business
from configure import db
from app.util import encrypt_id
import requests
import bcrypt

auth_blueprint = Blueprint("auth_bp", __name__)

GOOGLE_TOKEN_INFO = "https://www.googleapis.com/oauth2/v3/tokeninfo"

@auth_blueprint.route("/signup", methods=["POST"])
def register():
    data = request.get_json()
    email = data.get("email").strip()
    password = data.get("password").strip()

    if not email or not password:
        return jsonify({"message": "Email and password are required."}), 400
    if not password or len(password) < 6:
        return jsonify({"message": "Password must be at least 6 characters."}), 400
    if Account.query.filter_by(email=email).first():
        return jsonify({"message": "Email already registered."}), 409

    categories = data.get("categories")
    country = data.get("country")
    scale = data.get("scale")
    country = data.get("country")
    business_name = data.get("business_name")
    business_description = data.get("business_description")

    try:
        new_user = Account(email=email, password=password)
        db.session.add(new_user)
        db.session.flush()

        new_business = Business(
            owner_id=new_user.id,
            name=business_name,
            categories=categories.join(", "),
            country=country,
            scale=scale,
            description=business_description,
        )

        db.session.add(new_business)
        db.session.commit()

        return (
            jsonify(
                {
                    "message": "Account and business created successfully.",
                    "email": new_user.email,
                }
            ),
            201,
        )

    except Exception as e:
        db.session.rollback()
        print("Error:", e)
        return jsonify({"message": "Server error occurred."}), 500

@auth_blueprint.route("/signup/google", methods=["POST"])
def google_auth():
    data = request.get_json()
    token = data.get("token", "")

    if not token:
        return jsonify({"success": False, "message": "No token provided"}), 400

    try:
        # Verify with Google
        response = requests.get(GOOGLE_TOKEN_INFO, params={"access_token": token})
        info = response.json()

        email = info.get("email")
        name = info.get("name", "Google User")

        if not email:
            return jsonify({"success": False, "message": "Invalid token"}), 401

        # Look up existing user
        account = Account.query.filter_by(email=email).first()

        if not account:
            # Create new account
            dummy_password = bcrypt.hashpw("google-oauth".encode("utf-8"), bcrypt.gensalt())
            account = Account(
                email=email,
                full_name=name,
                password=dummy_password,
                location="",   
                linkedIn=None
            )
            db.session.add(account)
            db.session.commit()
            
        return jsonify({
            "success": True, 
            "message ": "Login successful",
            "email": Account.query.get(account.id).email, 
            "token": token
            })
    except Exception as e:
        print("Google login error:", e)
        return jsonify({"success": False, "message": "Login failed"}), 500

@auth_blueprint.route("/login", methods=["GET"])
def get_login_info():
    data = request.args
    user = Account.query.filter_by(email=data.get("email")).first()
    
    if not user:
        return jsonify({"success": False, "message": "User not found"}), 404

    return jsonify({
        "success": True, 
        "user_id": user.id, 
        "email": user.email, 
        "session_id": user.session_id,
        "full_name": user.full_name, 
        "location": user.location, 
        "linkedIn": user.linkedIn, 
        "businesses": [biz.to_json() for biz in user.businesses]
        }), 200

@auth_blueprint.route("/login", methods=["POST"])
def login():
    data = request.get_json()
    email = data.get("email")
    password = data.get("password")

    user = Account.query.filter_by(email=email).first()

    if not user:
        return jsonify({"success": False, "message": "User not found"}), 404
    if user.verify_password(password):
        
        session["session_id"] = user.session_id
        return jsonify(
            {"success": True, "message": "Login successful", "user_id": user.id}
        )
    else:
        return (
            jsonify(
                {
                    "success": False,
                    "message": "Invalid password",
                    "user_id": user.id,
                    "email": user.email,
                    "password": str(user.verify_password(user.password)),
                }
            ),
            401,
        )