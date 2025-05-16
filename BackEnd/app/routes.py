from flask import Blueprint, request, jsonify, make_response, redirect, url_for
from .models import Business, Product, Account
from .util import encrypt_id, decrypt_id
from config import db

main = Blueprint("main", __name__)

@main.route("/ping", methods=["GET"])
def ping():
    return jsonify({"message": "pong", "status": "ok"})


@main.route("/signup", methods=["POST"])
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


@main.route("/signup/question1", methods=["GET"])
def question1():
    categories = request.args.get("categories").split(",")

    if categories:
        return jsonify({"status": "success", "selected_categories": categories}), 200
    else:
        return jsonify({"status": "error", "message": "No category selected"}), 400


@main.route("/signup/question2", methods=["GET"])
def question2():
    country = request.args.get("country").strip()
    if country:
        return (
            jsonify(
                {
                    "status": "success",
                    "country": country,
                }
            ),
            200,
        )
    else:
        return jsonify({"status": "error", "message": "No country selected"}), 400


@main.route("/signup/question3", methods=["GET"])
def question3():
    scale = request.args.get("scale").strip()
    if scale:
        return (
            jsonify(
                {
                    "status": "success",
                    "scale": scale,
                }
            ),
            200,
        )
    else:
        return jsonify({"status": "error", "message": "No scale selected"}), 400


@main.route("/signup/question4", methods=["GET"])
def question4():
    business_name = request.args.get("business_name").strip()
    if business_name:
        return (
            jsonify(
                {
                    "status": "success",
                    "business_name": business_name,
                }
            ),
            200,
        )
    else:
        return jsonify({"status": "error", "message": "No business name entered"})


@main.route("/signup/question5", methods=["GET"])
def question5():
    business_description = request.args.get("business_description").strip()
    if business_description:
        return (
            jsonify(
                {
                    "status": "success",
                    "business_description": business_description,
                }
            ),
            200,
        )
    else:
        return jsonify(
            {"status": "error", "message": "No business description entered"}
        )
        
@main.route("/login", methods=["POST"])
def login():
    data = request.get_json()
    email = data.get("email")
    password = data.get("password")

    user = Account.query.filter_by(email=email).first()

    if not user:
        return jsonify({"success": False, "message": "User not found"}), 404
    if user.verify_password(password):
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

@main.route("/profile/<string:encrypted_user_id>", methods=["GET", "PATCH"])
def profile(encrypted_user_id):
    user = Account.query.filter_by(id=decrypt_id(encrypted_user_id)).first()
    if request.methods == "GET":
        data = request.args

        user = Account.query.filter_by(email=data.get("email")).first()
        if not user:
            return jsonify({"message": "User not found"}), 404

        businesses = user.businesses
        if not businesses:
            return jsonify({"message": "User has no businesses"}), 404

        return jsonify(
            {
                "user_id": user.id,
                "email": user.email,
                "full_name": user.full_name,
                "location": user.location,
                "linkedin": user.linkedIn,
                "businesses": [biz.to_json() for biz in businesses],
            }
        )
    if request.methods == "PATCH":
        data = request.get_json()
        
        if not user:
            return jsonify({"message": "User not found"}), 404

        try:
            user.full_name = data.get("full_name", user.full_name)
            user.location = data.get("location", user.location)
            user.linkedIn = data.get("linkedin", user.linkedIn)
            
            if Account.query.filter_by(email=data.get("email")).first() & user.email != data.get("email"):
                return jsonify({"message": "Email already exists"}), 400
            user.email = data.get("email", user.email)

            db.session.commit()

            return jsonify({"message": "User updated successfully"}), 200
        
        except Exception as e:
            db.session.rollback()
            print("Error:", e)
            return jsonify({"message": "Server error occurred."}), 500


@main.route("/business_profile/<int:encrypted_business_id>", methods=["GET"])
def get_business(encrypted_business_id):
    biz = Business.query.get_or_404(decrypt_id(encrypted_business_id))
    
    if not biz:
        return jsonify({"message": "Business not found"}), 404
    
    return jsonify(
        {
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
                "country": biz.owner.country,
            },
            "products": [
                {
                    "id": p.id,
                    "name": p.name,
                    "description": p.description,
                    "image_url": p.image_url,
                }
                for p in biz.products
            ],
        }
    )
    
@main.route("/business_profile/<int:encrypted_business_id>/edit", methods=["PATCH"])
def edit_business(encrypted_business_id):
    data = request.get_json()
    biz = Business.query.get_or_404(data.get("business_id"))
    
    if not biz:
        return jsonify({ "message": "Business not found" }), 404

    try:
        biz.name = data.get("name", biz.name)
        biz.description = data.get("description", biz.description)
        biz.website = data.get("website", biz.website)
        biz.country = data.get("country", biz.country)
        biz.scale = data.get("scale", biz.scale)
        biz.categories = data.get("categories", biz.categories)

        db.session.commit()

        return jsonify({"message": "Business updated successfully"}), 200
    
    except Exception as e:
        db.session.rollback()
        print("Error:", e)
        return jsonify({"message": "Server error occurred."}), 500