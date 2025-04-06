from flask import Flask
from flask_cors import CORS
from models import db
from flask_migrate import Migrate
from dotenv import load_dotenv
import os
from routes import register_blueprints

def create_app():
    load_dotenv()  # Load environment variables from .env file
    
    app = Flask(__name__)
    CORS(app)
    
    # Configure database
    app.config['SQLALCHEMY_DATABASE_URI'] = f'{os.getenv("DATABASE_URL")}'
    
    # Initialize database
    db.init_app(app)
    
    # Create the database and tables
    with app.app_context():
        db.create_all()
    
    # Setup migrations
    migrate = Migrate(app, db)
    
    # Register all blueprints
    register_blueprints(app)
    
    return app

# Create the application instance
app = create_app()

if __name__ == '__main__':
    app.run(debug=True)