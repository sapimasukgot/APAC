import traceback
import google.generativeai as genai
from google.genai import types
from dotenv import load_dotenv
from flask import Blueprint, request, jsonify, session
from ..models import ChatMessageAI, ChatMessageUser
from configure import db

load_dotenv()
chat_blueprint = Blueprint("chat", __name__)

genai.configure(api_key="AIzaSyCdfYSd-EiqT8fFev6DiLKDgRR-Zo0vKLs")

def get_gemini_response(session_id, user_message, num_history=30):
    """
    Queries Gemini AI to get a response to the given user message,
    considering the last num_history messages in the conversation.

    Args:
        session_id (str): The id of the chat session.
        user_message (str): The message typed by the user.
        num_history (int, optional): The number of past messages to consider. Defaults to 30.

    Returns:
        str: The response from the AI.
    """

    try:
        previous_user_msgs = ChatMessageUser.query.filter_by(session_id=session_id).order_by(ChatMessageUser.timestamp).limit(num_history).all()
        previous_ai_msgs = ChatMessageAI.query.filter_by(session_id=session_id).order_by(ChatMessageAI.timestamp).limit(num_history).all()
        
        all_msg = previous_user_msgs + previous_ai_msgs
        all_msgs = sorted(all_msg, key=lambda x: x.timestamp)
        
        past_conversation = ""
        for msg in all_msgs:
            sender = msg.sender_id if hasattr(msg, "sender_id") else "AI"
            past_conversation += f"{sender}: {msg.message}\n"
        
        full_prompt = f"""
                        You are a helpful assistant. Here is the user's chat history:

                        {past_conversation}

                        Remember this context when responding, but don't repeat it unless necessary.

                        Present conversation:
                        User: {user_message}
                        AI:
                        """
        
        model = genai.GenerativeModel("gemini-2.0-flash")
        response = model.generate_content(full_prompt)
        
        if response.text:
            return response.text
        else:
            return "Failed to get AI response"
        
    except Exception as e:
        print("Gemini Error:", e)
        traceback.print_exc()
        return "An error occurred while trying to get a response from AI."


@chat_blueprint.route("/cached-session-id", methods=["GET"])
def get_cached_session_id():
    """Returns the user's cached session_id from Flask session."""
    print("Request received at /chat/cached-session-id")
    
    session_id = session.get("session_id")
    
    # test session_id for dummy
    if not session_id:
        return jsonify({"session_id": "5qewrew"}), 200
    
    return jsonify({"session_id": session_id}), 200

@chat_blueprint.route("/lumea_page/<string:session_id>/history", methods=["GET"])
def chat_history(session_id):
    """Get the chat history for the given session_id.
    
    Returns a JSON object of a list of messages, where each message is a JSON object with the following keys:
        id: string
        session_id: string
        message: string
        sender: string (either "user" or "AI")
        timestamp: datetime string in ISO 8601 format
    """
    user_msgs = ChatMessageUser.query.filter_by(session_id=session_id).all()
    ai_msgs = ChatMessageAI.query.filter_by(session_id=session_id).all()

    all_msgs = [*user_msgs, *ai_msgs]
    all_msgs.sort(key=lambda x: x.timestamp)

    return jsonify([msg.to_json() for msg in all_msgs])

@chat_blueprint.route("/lumea_page/<string:session_id>/send", methods=["POST"])
def chat(session_id):
    """Sends a message to the chat and receives a response from the AI.
    
    POST /lumea_page/send
    {
        "session_id": string,
        "user_id": string,
        "message": string
    }
    
    Returns a JSON object with two keys: "user" and "ai". The value of "user" is the user's message, and the value of "ai" is the AI's response.
    
    If the request is invalid, returns a JSON object with an "error" key. If the AI fails to respond, returns a JSON object with an "error" key and a 500 status code.
    """
    
    data = request.get_json()
    
    session_id = session_id
    user_id = data.get("user_id")
    user_message = data.get("message")

    if not user_message:
        return jsonify({"error": "Empty message"}), 400

    if not session_id:
        return jsonify({"error": "Missing session_id"}), 400
    
    try:
        # Save user message first
        user_msg = ChatMessageUser(
            session_id=session_id,
            message=user_message,
            sender_id=user_id,
            receiver_id="ai"
        )
        db.session.add(user_msg)
        db.session.flush()

        # Get AI response
        ai_reply = get_gemini_response(session_id, user_message)

        formatted_ai_reply = f"{ai_reply}"

        ai_msg = ChatMessageAI(
            session_id=session_id,
            message=formatted_ai_reply,
            user_message_id=user_msg.id
        )
        db.session.add(ai_msg)
        db.session.commit()
        
        return jsonify({
            "user": user_msg.to_json(),
            "ai": ai_msg.to_json(),
            "session_id": session_id  # Include session_id in the response if needed
        }), 201

        
    except Exception as e:
        print("Gemini error:", e)
        traceback.print_exc()
        db.session.rollback()  # Rollback changes in case of error
        return jsonify({"error": "Internal server error"}), 500

    
@chat_blueprint.route("/lumea_page/<string:session_id>/clear", methods=["DELETE"])
def clear_chat(session_id):
    ChatMessageUser.query.filter_by(session_id=session_id).delete()
    ChatMessageAI.query.filter_by(session_id=session_id).delete()
    db.session.commit()
    return jsonify({"message": "Chat cleared"}), 200

@chat_blueprint.route("/debug/session", methods=["GET"])
def debug_session():
    return jsonify(dict(session)), 200