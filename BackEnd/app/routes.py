from flask import Blueprint, request, jsonify
from .models import Business, Product, Account
from app import encrypt_id, decrypt_id
from config import db

main = Blueprint("main", __name__)

@main.route("/ping", methods=["GET"])
def ping():
    return jsonify({"message": "pong", "status": "ok"})


@main.route("/create-account", methods=["POST"])
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

    try:
        new_user = Account(email=email, password=password)
        db.session.add(new_user)
        db.session.commit()

        return jsonify({
            "message": "Account created successfully.",
            "email": new_user.email
            }), 201

    except Exception as e:
        db.session.rollback()
        print("Error:", e)
        return jsonify({"message": "Server error occurred."}), 500


@main.route("/profile/<string:user_id>", methods=["GET"])
def get_profile(user_id):
    user = Account.query.get_or_404(user_id)
    
    if not user:
        return jsonify({"message": "User not found"}), 404
    
    return jsonify({
        "id": user.id,
        "full_name": user.full_name,
        "location": user.location,
        "email": user.email,
        "linkedin": user.linkedIn
    })

@main.route("/profile", methods=["POST"])
def update_profile():
    data = request.get_json()
    user = Account.query.filter_by(email=data.get("email")).first()
    if not user:
        user = Account(email=data["email"])
    user.full_name = data.get("full_name", user.full_name)
    user.location = data.get("location", user.location)
    user.linkedin = data.get("linkedin", user.linkedin)
    db.session.add(user)
    db.session.commit()
    return jsonify({"message": "Profile saved", "user_id": user.id})

@main.route("/login", methods=["POST"])
def login():
    data = request.get_json()
    email = data.get("email")
    password = data.get("password")
    
    user = Account.query.filter_by(email=email).first()
    
    if not user:
        return jsonify({"success": False, "message": "User not found"}), 404
    
    if user.verify_password(password):
        return jsonify({"success": True, "message": "Login successful", "user_id": user.id})
    else :
        return jsonify({"success": False, "message": "Invalid password", "user_id": user.id, "email": user.email, "password": str(user.verify_password(user.password))}), 401
    

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
