import google.generativeai as genai
from flask import Blueprint, request, jsonify
from .models import ChatMessage
from config import db

chat_blueprint = Blueprint("chat", __name__)

# Setup Gemini (you can load this from env later)
genai.configure(api_key="AIzaSyCdfYSd-EiqT8fFev6DiLKDgRR-Zo0vKLs")
model = genai.GenerativeModel("gemini-2.0-flash")

@chat_blueprint.route("/chat/<string:user_id>/<string:session_id>", methods=["POST"])
def chat(user_id, session_id):
    data = request.get_json()
    user_message = data.get("message", "").strip()

    if not user_message:
        return jsonify({"error": "Empty message"}), 400

    # for bot / AI id -> 0
    try:
        sender_id = user_id
        new_user_message_log = ChatMessage(sender_id=sender_id, session_id=session_id, receiver_id=0, message=user_message)
        db.session.add(new_user_message_log)
        db.session.commit()

    except Exception as e:
        print("Something error with chat:", e)
        return jsonify({"error": "Failed to save chat message"}), 500

    try:
        response = model.generate_content(user_message)
        response_text = response.text.strip()
        
        new_bot_message_log = ChatMessage(sender_id=0, session_id=session_id, receiver_id=user_id, message=response_text)
        db.session.add(new_bot_message_log)
        db.session.commit()
        
        return jsonify({"reply": response_text})
    except Exception as e:
        print("Gemini error:", e)
        return jsonify({"error": "Failed to get AI response"}), 500
    
