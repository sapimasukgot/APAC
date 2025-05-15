import google.generativeai as genai
from flask import Blueprint, request, jsonify

chat_blueprint = Blueprint("chat", __name__)

# Setup Gemini (you can load this from env later)
genai.configure(api_key="AIzaSyCdfYSd-EiqT8fFev6DiLKDgRR-Zo0vKLs")
model = genai.GenerativeModel("gemini-2.0-flash")

@chat_blueprint.route("/chat", methods=["POST"])
def chat():
    data = request.get_json()
    user_message = data.get("message", "").strip()

    if not user_message:
        return jsonify({"error": "Empty message"}), 400

    try:
        response = model.generate_content(user_message)
        return jsonify({"reply": response.text.strip()})
    except Exception as e:
        print("Gemini error:", e)
        return jsonify({"error": "Failed to get AI response"}), 500
