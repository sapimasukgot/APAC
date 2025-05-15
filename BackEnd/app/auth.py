from flask import Blueprint, request, jsonify
from .models import Account
from config import db
import requests
import bcrypt

auth_bp = Blueprint("auth_bp", __name__)

GOOGLE_TOKEN_INFO = "https://www.googleapis.com/oauth2/v3/tokeninfo"

@auth_bp.route("/auth/google", methods=["POST"])
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
