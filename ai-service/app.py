from flask import Flask
from flask_cors import CORS
from routes.describe import describe_bp
from routes.recommend import recommend_bp
from routes.report import report_bp

app = Flask(__name__)
CORS(app) # Required to allow the React frontend to communicate with this service [cite: 17]

# Register Blueprints for AI Developer 1 tasks 
app.register_blueprint(describe_bp, url_prefix='/ai')
app.register_blueprint(recommend_bp, url_prefix='/ai')
app.register_blueprint(report_bp, url_prefix='/ai')

# AI Service Health endpoint 
@app.route('/health', methods=['GET'])
def health():
    return {
        "status": "healthy",
        "service": "ai-service",
        "port": 5000
    }, 200

if __name__ == '__main__':
    # AI Service must run on Port 5000 as per project spec 
    app.run(host='0.0.0.0', port=5000, debug=True)