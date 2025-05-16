from flask import Blueprint, request, jsonify
from app.util import encrypt_id, decrypt_id
from app.models import Account
from configure import db

signup_blueprint = Blueprint("signup", __name__)

@signup_blueprint.route("/question1", methods=["GET"])
def question1():
    categories = request.args.get("categories").split(",")

    if categories:
        return jsonify({"status": "success", "selected_categories": categories}), 200
    else:
        return jsonify({"status": "error", "message": "No category selected"}), 400


@signup_blueprint.route("/question2", methods=["GET"])
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


@signup_blueprint.route("/question3", methods=["GET"])
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


@signup_blueprint.route("/question4", methods=["GET"])
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


@signup_blueprint.route("/question5", methods=["GET"])
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