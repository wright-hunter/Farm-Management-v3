from flask import Flask, jsonify, request
from flask_cors import CORS
from models import db, User

app = Flask(__name__) #tells flask the name of the app is the name of the file "app.py"

# Allow CORS for local testing
CORS(app)

app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///test_database.db' #create database file
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False #disable modification tracking

db.init_app(app) #initialize the database

# Create the database and tables
with app.app_context():
    db.create_all()

# Route to get all items
@app.route('/api/users', methods=['GET'])
def get_items():
    users = User.query.all()
    return {'users': [user.username for user in users]}

# Route to get a single item by ID
@app.route('/api/users/<int:item_id>', methods=['GET'])
def get_item(item_id):
    user = User.query.get(item_id)
    if user:
        return jsonify(user)
    else:
        return jsonify({"error": "Item not found"}), 404

if __name__ == '__main__':
    app.run(debug=True)