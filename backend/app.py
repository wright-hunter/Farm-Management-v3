from flask import Flask, jsonify, request
from flask_cors import CORS
from models import db, Field, FieldEntry
from flask_migrate import Migrate
from dotenv import load_dotenv
import os

load_dotenv() # Load environment variables from .env file

app = Flask(__name__) #tells flask the name of the app is the name of the file "app.py"

CORS(app)

# access database
app.config['SQLALCHEMY_DATABASE_URI'] = f'{os.getenv("DATABASE_URL")}'

#initialize the database
db.init_app(app) 

# Create the database and tables
with app.app_context():
    db.create_all()

migrate = Migrate(app, db)

# Route to get all items
@app.route('/api/fields', methods=['GET'])
def get_fields():
    # Simple test data for fields
    fields = Field.query.all()
    fields = [field.to_dict() for field in fields]
    return jsonify(fields)

@app.route('/api/fields', methods=['POST'])
def create_field():
    data = request.get_json()
    new_field = Field(name=data['name'], location=data['location'])
    db.session.add(new_field)
    db.session.commit()
    return jsonify({"message": "Field created successfully"}), 201

@app.route('/api/fields/<int:id>', methods=['PUT'])
def update_field(id):
    data = request.get_json()
    field = Field.query.get_or_404(id)
    field.name = data['name']
    field.location = data['location']
    db.session.commit()
    return jsonify({"message": "Field updated successfully"}), 200

@app.route('/api/fields/<int:id>', methods=['DELETE'])
def delete_field(id):
    field = Field.query.get_or_404(id)
    db.session.delete(field)
    db.session.commit()
    return jsonify({"message": "Field deleted successfully"}), 200

@app.route('/api/fields/<int:field_id>', methods=['GET'])
def get_field(field_id):
    entries = FieldEntry.query.filter_by(field_id=field_id).all()
    
    # Calculate break even price for each entry
    entries_with_calcs = []
    for entry in entries:

        entry_dict = entry.to_dict()
        
        # Calculate total cost
        total_cost = (entry.seed_cost + entry.chemical_cost + 
                     entry.fertilizer_cost + entry.crop_insurance)
        
        # Calculate break-even price (cost per bushel)
        if entry.bushels_harvested > 0:  # Avoid division by zero
            entry_dict['break_even_price'] = round(total_cost / entry.bushels_harvested, 2)
            entry_dict['bu_acre'] = round(entry.bushels_harvested / entry.acres_harvested, 2)
        else:
            entry_dict['break_even_price'] = 0
            entry_dict['bu_acre'] = 0
            
        entries_with_calcs.append(entry_dict)
    
    return jsonify(entries_with_calcs)
@app.route('/api/fields/<int:field_id>', methods=['POST'])
def create_field_entry(field_id):
    data = request.get_json()
    new_entry = FieldEntry(
        field_id=field_id,
        year=data['year'],
        acres_harvested=data['acres_harvested'],
        crop_type=data['crop_type'],
        seed_cost=data['seed_cost'],
        fertilizer_cost=data['fertilizer_cost'],
        chemical_cost=data['chemical_cost'],
        crop_insurance=data['crop_insurance'],
        bushels_harvested=data['bushels_harvested']
    )
    db.session.add(new_entry)
    db.session.commit()
    return jsonify({"message": "Field entry created successfully"}), 201

@app.route('/api/fields/<int:field_id>/<int:entry_id>', methods=['PUT'])
def update_field_entry(field_id, entry_id):
    data = request.get_json()
    entry = FieldEntry.query.get_or_404(entry_id)
    entry.year = data['year']
    entry.acres_harvested = data['acres_harvested']
    entry.crop_type = data['crop_type']
    entry.seed_cost = data['seed_cost']
    entry.fertilizer_cost = data['fertilizer_cost']
    entry.chemical_cost = data['chemical_cost']
    entry.crop_insurance = data['crop_insurance']
    entry.bushels_harvested = data['bushels_harvested']
    db.session.commit()
    return jsonify({"message": "Field entry updated successfully"}), 200

@app.route ('/api/fields/<int:field_id>/<int:entry_id>', methods=['DELETE'])
def delete_field_entry(field_id, entry_id):
    entry = FieldEntry.query.get_or_404(entry_id)
    db.session.delete(entry)
    db.session.commit()
    return jsonify({"message": "Field entry deleted successfully"}), 200

if __name__ == '__main__':
    app.run(debug=True)