from flask import Blueprint, jsonify, request
from models import db, YearlyExpenses, EquipmentEntry, FieldEntry, Equipment
from sqlalchemy import func

yearly_expenses_bp = Blueprint('yearly_expenses', __name__, url_prefix='/api/yearly_expenses')

@yearly_expenses_bp.route('', methods=['GET'])
def get_yearly_expenses():
    expenses = db.session.query(YearlyExpenses).all()
    
    all_expenses = []
    for expense in expenses:
        expense_dict = expense.to_dict()
        
        # Calculate total equipment expenses for the year
        equipment_expense_total = db.session.query(
            func.sum(EquipmentEntry.expense_amount)
        ).filter(EquipmentEntry.year == expense.year).scalar() or 0
        expense_dict["yearly_equipment_expenses"] = equipment_expense_total
        
        # Get crop-specific expenses and break-even prices
        # First, get all unique crop types for the year
        crop_types = db.session.query(FieldEntry.crop_type).filter(
            FieldEntry.year == expense.year
        ).distinct().all()
        crop_types = [crop[0] for crop in crop_types]  # Flatten result list
        
        # Initialize container for crop-specific data
        crop_specific_data = {}
        
        # Overall field expenses
        field_expense_total = db.session.query(
            func.sum(
                FieldEntry.seed_cost + 
                FieldEntry.chemical_cost + 
                FieldEntry.fertilizer_cost + 
                FieldEntry.crop_insurance + 
                FieldEntry.rent
            )
        ).filter(FieldEntry.year == expense.year).scalar() or 0
        expense_dict["yearly_field_expenses"] = field_expense_total
        
        #Overall equipment purchases
        equipment_purchases = db.session.query(
            func.sum(Equipment.purchase_price)
        ).filter(Equipment.year_purchased == expense.year).scalar() or 0
        expense_dict["yearly_equipment_purchases"] = equipment_purchases
        
        # Calculate total acres harvested for the year
        total_acres_harvested = db.session.query(
            func.sum(FieldEntry.acres_harvested)
        ).filter(FieldEntry.year == expense.year).scalar() or 0
        expense_dict["total_acres_harvested"] = total_acres_harvested
        
        # Calculate overall total expenses
        total_expenses = (expense.fuel + 
                          expense.land_payments + 
                          expense.property_tax + 
                          expense.misc + 
                          equipment_expense_total + 
                          field_expense_total)
        expense_dict["total_expenses"] = total_expenses
        
        # Add breakdown by crop type
        for crop_type in crop_types:
            # Calculate crop-specific field expenses
            crop_field_expenses = db.session.query(
                func.sum(
                    FieldEntry.seed_cost + 
                    FieldEntry.chemical_cost + 
                    FieldEntry.fertilizer_cost + 
                    FieldEntry.crop_insurance +
                    FieldEntry.rent
                )
            ).filter(
                FieldEntry.year == expense.year,
                FieldEntry.crop_type == crop_type
            ).scalar() or 0
            
            # Prepare list of field attributes for batch processing
            field_attributes = [
                'seed_cost',
                'fertilizer_cost',
                'chemical_cost',
                'crop_insurance',
                'rent',
                'bushels_harvested',
                'acres_harvested'
            ]
            
            # Create a dictionary to store query results
            field_data = {}
            
            # Run all queries in a loop and store results in the dictionary
            for attr in field_attributes:
                field_data[attr] = db.session.query(
                    func.sum(getattr(FieldEntry, attr))
                ).filter(
                    FieldEntry.year == expense.year,
                    FieldEntry.crop_type == crop_type
                ).scalar() or 0

            # Calculate proportional share of general expenses based on acreage
            # Avoid division by zero
            if total_acres_harvested > 0:
                # Calculate proportion of general expenses to allocate to this crop
                acreage_proportion = field_data['acres_harvested'] / total_acres_harvested
                
                # Allocate general expenses to this crop proportionally
                allocated_general_expenses = acreage_proportion * total_expenses
            else:
                allocated_general_expenses = 0
            
            # Total expenses for this crop
            crop_total_expenses = crop_field_expenses + allocated_general_expenses
            
            # Calculate break-even price for this crop
            if field_data['bushels_harvested'] > 0:
                crop_break_even = round(crop_total_expenses / field_data['bushels_harvested'], 2)
            else:
                crop_break_even = 0
            
            # Store all the crop-specific data
            crop_specific_data[crop_type] = {
                "acres_harvested": field_data['acres_harvested'],
                "bushels_harvested": field_data['bushels_harvested'],
                "expenses": {
                    "seed_cost": field_data['seed_cost'],
                    "fertilizer_cost": field_data['fertilizer_cost'],
                    "chemical_cost": field_data['chemical_cost'],
                    "crop_insurance": field_data['crop_insurance'],
                    "rent": field_data['rent'],
                    "direct_expenses_total": crop_field_expenses,
                    "allocated_general_expenses": allocated_general_expenses,
                    "total_expenses": crop_total_expenses
                },
                "break_even_price": crop_break_even
            }
        
        # Add crop-specific data to the main response
        expense_dict["crops"] = crop_specific_data
        
            
        all_expenses.append(expense_dict)
        
    return jsonify(all_expenses)

@yearly_expenses_bp.route('', methods=['POST'])
def create_yearly_expense():
    data = request.get_json()
    new_expense = YearlyExpenses(
        year=data['year'],
        fuel=data['fuel'],
        land_payments=data['land_payments'],
        property_tax=data['property_tax'],
        misc=data['misc']
    )
    db.session.add(new_expense)
    db.session.commit()
    return jsonify({"message": "Yearly expense created successfully"}), 201

@yearly_expenses_bp.route('/<int:year>', methods=['PUT'])
def update_yearly_expense(year):
    data = request.get_json()
    expense = db.session.query(YearlyExpenses).get_or_404(year)
    expense.year = data['year']
    expense.fuel = data['fuel']
    expense.land_payments = data['land_payments']
    expense.property_tax = data['property_tax']
    expense.misc = data['misc']
    db.session.commit()
    return jsonify({"message": "Yearly expense updated successfully"}), 200

@yearly_expenses_bp.route('/<int:year>', methods=['DELETE'])
def delete_yearly_expense(year):
    expense = db.session.query(YearlyExpenses).get_or_404(year)
    db.session.delete(expense)
    db.session.commit()
    return jsonify({"message": "Yearly expense deleted successfully"}), 200