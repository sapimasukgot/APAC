from flask import Blueprint, request, jsonify
from .models import Business, Product, UserProfile
from . import db

main = Blueprint("main", __name__)

@main.route("/ping", methods=["GET"])
def ping():
    return jsonify({"message": "pong", "status": "ok"})

@main.route("/register", methods=["POST"])
def register():
    data = request.get_json()
    email = data.get("email", "").strip().lower()
    password = data.get("password", "").strip()

    if not email or not password:
        return jsonify({"message": "Email and password are required."}), 400

    if len(password) < 6:
        return jsonify({"message": "Password must be at least 6 characters."}), 400

    if UserProfile.query.filter_by(_email=email).first():
        return jsonify({"message": "Email already registered."}), 409

    try:
        new_user = UserProfile()
        new_user.email = email
        new_user.password = password  # will hash it via model
        new_user.full_name = "New User"
        db.session.add(new_user)
        db.session.commit()

        return jsonify({"message": "Account created successfully."}), 201

    except Exception as e:
        db.session.rollback()
        print("Error:", e)
        return jsonify({"message": "Server error occurred."}), 500

@main.route("/profile/<int:user_id>", methods=["GET"])
def get_profile(user_id):
    user = UserProfile.query.get_or_404(user_id)
    return jsonify({
        "full_name": user.full_name,
        "location": user.location,
        "email": user.email,
        "linkedin": user.linkedin
    })

@main.route("/profile", methods=["POST"])
def create_or_update_profile():
    data = request.get_json()
    user = UserProfile.query.filter_by(email=data.get("email")).first()
    if not user:
        user = UserProfile(email=data["email"])
    user.full_name = data.get("full_name")
    user.location = data.get("location")
    user.linkedin = data.get("linkedin")
    db.session.add(user)
    db.session.commit()
    return jsonify({"message": "Profile saved", "user_id": user.id})

@main.route("/login", methods=["POST"])
def login():
    data = request.get_json()
    email = data.get("email")
    password = data.get("password")
    
    user = UserProfile.query.filter_by(email=email).first()
    if user and user.verify_password(password):
        return jsonify({"success": True, "message": "Login successful", "user_id": user.id})
    
    return jsonify({"success": False, "message": "Invalid credentials"}), 401

@main.route("/login", methods=["POST"])
def login():
    data = request.get_json()
    email = data.get("email", "").strip().lower()
    password = data.get("password", "").strip()

    user = UserProfile.query.filter_by(_email=email).first()
    if not user or not user.verify_password(password):
        return jsonify({"success": False, "message": "Invalid credentials"}), 401

    return jsonify({"success": True, "message": "Login successful", "user_id": user.id})

@main.route("/business/<int:biz_id>", methods=["GET"])
def get_business(biz_id):
    biz = Business.query.get_or_404(biz_id)
    return jsonify({
        "id": biz.id,
        "name": biz.name,
        "description": biz.description,
        "website": biz.website,
        "country": biz.country,
        "size": biz.size,
        "categories": biz.categories,
        "owner": {
            "id": biz.owner.id,
            "full_name": biz.owner.full_name,
            "country": biz.owner.country
        },
        "products": [
            {
                "id": p.id,
                "name": p.name,
                "description": p.description,
                "image_url": p.image_url
            } for p in biz.products
        ]
    })
