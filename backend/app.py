from flask import Flask, jsonify, request
from flask_cors import CORS

app = Flask(__name__)

# Allow CORS
CORS(app)

# Sample data
data = [
    {"id": 1, "name": "Item 1"},
    {"id": 2, "name": "Item 2"},
]

# Route to get all items
@app.route('/api/items', methods=['GET'])
def get_items():
    return jsonify(data)

# Route to get a single item by ID
@app.route('/api/items/<int:item_id>', methods=['GET'])
def get_item(item_id):
    item = next((item for item in data if item['id'] == item_id), None)
    if item:
        return jsonify(item)
    else:
        return jsonify({"error": "Item not found"}), 404

if __name__ == '__main__':
    app.run(debug=True)