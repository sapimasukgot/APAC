from flask import Blueprint, request, jsonify
from app.models import Account
from configure import db
from app.util import encrypt_id, decrypt_id

profile_blueprint = Blueprint("profile", __name__)

@profile_blueprint.route("/get-profile", methods=["GET"])
def get_profile():
    user = db.session.query(Account).first()

    if not user:
        return jsonify({"message": "User not found"}), 404

    return jsonify(
        {
            "user_id": user.id,
            "email": user.email,
            "full_name": user.full_name,
            "session_id": user.session_id,
            "location": user.location,
            "linkedin": user.linkedIn,
            "businesses": [biz.to_json() for biz in user.businesses],
        }
    )

@profile_blueprint.route("/profile/<string:encrypted_user_id>", methods=["GET", "PATCH"])
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
