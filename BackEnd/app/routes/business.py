from flask import Blueprint, request, jsonify
from app.util import encrypt_id, decrypt_id
from app.models import Business
from configure import db

business_blueprint = Blueprint("business", __name__)

@business_blueprint.route("/", methods=["POST"])
def create_business():
    data = request.get_json()
    biz = Business(
        name=data["name"],
        description=data.get("description"),
        country=data.get("country"),
        website=data.get("website"),
        scale=data.get("scale"),
        categories=data.get("categories"),
        owner_id=data["owner_id"]
    )
    db.session.add(biz)
    db.session.commit()
    return jsonify(biz.to_json()), 201

@business_blueprint.route("/<int:encrypted_business_id>", methods=["GET"])
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
    
@business_blueprint.route("/<int:encrypted_business_id>", methods=["PATCH"])
def edit_business(encrypted_business_id):
    data = request.get_json()
    business_id = decrypt_id(encrypted_business_id)
    biz = Business.query.get_or_404(business_id)
    
    if not biz:
        return jsonify({ "message": "Business not found" }), 404

    try:
        if "name" in data:
            biz.name = data.get("name")
        if "description" in data:
            biz.description = data.get("description")
        biz.website = data.get("website")
        if "country" in data:
            biz.country = data.get("country")
        if "scale" in data:
            biz.scale = data.get("scale")
        if "categories" in data:
            biz.categories = data.get("categories")

        db.session.commit()

        return jsonify({"message": "Business updated successfully"}), 200
    
    except Exception as e:
        db.session.rollback()
        print("Error:", e)
        return jsonify({"message": "Server error occurred."}), 500