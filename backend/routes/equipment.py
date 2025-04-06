from flask import Blueprint, jsonify, request
from models import db, Equipment, EquipmentEntry

equipment_bp = Blueprint('equipment', __name__, url_prefix='/api/equipment')

@equipment_bp.route('', methods=['GET'])
def get_equipment():
    equipment = Equipment.query.all()
    equipment = [eq.to_dict() for eq in equipment]
    return jsonify(equipment)

@equipment_bp.route('', methods=['POST'])
def create_equipment():
    data = request.get_json()
    new_equipment = Equipment(
        type=data['type'],
        make=data['make'],
        model=data['model'],
        year_purchased=data['year_purchased'],
        purchase_price=data['purchase_price']
    )
    db.session.add(new_equipment)
    db.session.commit()
    return jsonify({"message": "Equipment created successfully"}), 201

@equipment_bp.route('/<int:id>', methods=['PUT'])
def update_equipment(id):
    data = request.get_json()
    equipment = Equipment.query.get_or_404(id)
    equipment.type = data['type']
    equipment.make = data['make']
    equipment.model = data['model']
    equipment.year_purchased = data['year_purchased']
    equipment.purchase_price = data['purchase_price']
    db.session.commit()
    return jsonify({"message": "Equipment updated successfully"}), 200

@equipment_bp.route('/<int:id>', methods=['DELETE'])
def delete_equipment(id):
    equipment = Equipment.query.get_or_404(id)
    db.session.delete(equipment)
    db.session.commit()
    return jsonify({"message": "Equipment deleted successfully"}), 200

@equipment_bp.route('/<int:equipment_id>', methods=['GET'])
def get_equipment_entries(equipment_id):
    entries = EquipmentEntry.query.filter_by(equipment_id=equipment_id).all()
    
    entry_dicts = []
    for entry in entries:
        entry_dict = entry.to_dict()
        
        entry_dicts.append(entry_dict)
    return jsonify(entry_dicts)

@equipment_bp.route('/<int:equipment_id>', methods=['POST'])
def create_equipment_entry(equipment_id):
    data = request.get_json()
    new_entry = EquipmentEntry(
        equipment_id=equipment_id,
        expense_note=data['expense_note'],
        expense_amount=data['expense_amount'],
        year=data['year']
    )
    db.session.add(new_entry)
    db.session.commit()
    return jsonify({"message": "Equipment entry created successfully"}), 201

@equipment_bp.route('/<int:equipment_id>/<int:entry_id>', methods=['PUT'])
def edit_equipment_entry(equipment_id, entry_id):
    data = request.get_json()
    entry = EquipmentEntry.query.get_or_404(entry_id)
    entry.expense_note = data['expense_note']
    entry.expense_amount = data['expense_amount']
    entry.year = data['year']
    db.session.commit()
    return jsonify({"message": "Equipment entry updated successfully"}), 200

@equipment_bp.route('/<int:equipment_id>/<int:entry_id>', methods=['DELETE'])
def delete_equipment_entry(equipment_id, entry_id):
    entry = EquipmentEntry.query.get_or_404(entry_id)
    db.session.delete(entry)
    db.session.commit()
    return jsonify({"message": "Equipment entry deleted successfully"}), 200

    