from flask import Flask, jsonify
from flask_cors import CORS
from routes.describe import describe_bp # AI Dev 1 - Day 3 
from routes.recommend import recommend_bp # AI Dev 1 - Day 4 

app = Flask(__name__)
CORS(app) 

# Register Blueprints with the /ai prefix
app.register_blueprint(describe_bp, url_prefix='/ai')
app.register_blueprint(recommend_bp, url_prefix='/ai')

# Day 1 Requirement: Health endpoint 
@app.route('/health', methods=['GET'])
def health():
    return jsonify({
        "status": "healthy",
        "service": "ai-service",
        "port": 5000
    }), 200

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)