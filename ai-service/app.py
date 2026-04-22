from flask import Flask
from flask_cors import CORS
from routes.describe import describe_bp# Day 3 blueprints for required endpoints
from routes.recommend import recommend_bp
from routes.report import report_bp#  Import report blueprint with AI Dev 2

app = Flask(__name__)
CORS(app)

# Day 3 Work: Register blueprints for modular AI services
# Port 5000 serves as the AI microservice entry point 
app.register_blueprint(describe_bp, url_prefix='/ai')
app.register_blueprint(recommend_bp, url_prefix='/ai')
app.register_blueprint(report_bp, url_prefix='/ai')

# Day 1 Work: AI Service Health endpoint 
@app.route('/health', methods=['GET'])
def health():
    return {
        "status": "healthy",
        "service": "ai-service",
        "port": 5000
    }, 200

if __name__ == '__main__':
    # Day 1 Work: Run on port 5000 as per project specification 
    app.run(host='0.0.0.0', port=5000, debug=True)