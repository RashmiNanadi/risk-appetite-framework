from flask import Blueprint, request, jsonify
from services.groq_client import groq_client
import os

describe_bp = Blueprint('describe', __name__)

@describe_bp.route('/describe', methods=['POST'])
def describe():
    data = request.json
    risk_name = data.get('risk_name')
    raw_data = data.get('raw_data')

    if not risk_name or not raw_data:
        return jsonify({"error": "Missing risk_name or raw_data"}), 400

    try:
        # 1. Read Prompt Template
        prompt_path = os.path.join('prompts', 'risk_description.txt')
        with open(prompt_path, 'r') as f:
            template = f.read()

        # 2. Fill the placeholders in the template
        filled_prompt = template.format(risk_name=risk_name, raw_data=raw_data)

        # 3. Call the GroqClient engine
        ai_response = groq_client.get_completion(
            system_prompt="You are a professional Risk Management Consultant.",
            user_input=filled_prompt
        )

        return jsonify({
            "risk_name": risk_name,
            "description": ai_response
        }), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500