from flask_sqlalchemy import SQLAlchemy
from sqlalchemy_serializer import SerializerMixin

# Initialize the database object
db = SQLAlchemy()

# Field model
class Field(db.Model, SerializerMixin):
    id: int = db.Column(db.Integer, primary_key=True)
    name: str = db.Column(db.String(80), nullable=False)
    location: str = db.Column(db.String(120))

# FieldEntry model
class FieldEntry(db.Model, SerializerMixin):
    id: int = db.Column(db.Integer, primary_key=True)
    field_id: int = db.Column(db.Integer, db.ForeignKey('field.id', ondelete='CASCADE'), nullable=False)
    year: int = db.Column(db.Integer, nullable=False)
    passes: int = db.Column(db.Integer)
    acres_harvested: float = db.Column(db.Float)
    crop_type: str = db.Column(db.String(80))
    seed_cost: float = db.Column(db.Float)
    fertilizer_cost: float = db.Column(db.Float)
    chemical_cost: float = db.Column(db.Float)
    crop_insurance: float = db.Column(db.Float)
    rent: float = db.Column(db.Float)
    bushels_harvested: float = db.Column(db.Float)

# Equipment model
class Equipment(db.Model, SerializerMixin):
    id: int = db.Column(db.Integer, primary_key=True)
    type: str = db.Column(db.String(80), nullable=False)
    make: str = db.Column(db.String(80), nullable=False)
    model: str = db.Column(db.String(80), nullable=False)
    year_purchased: int = db.Column(db.Integer)
    purchase_price: float = db.Column(db.Float)

# EquipmentEntry model
class EquipmentEntry(db.Model, SerializerMixin):
    id: int = db.Column(db.Integer, primary_key=True)
    equipment_id: int = db.Column(db.Integer, db.ForeignKey('equipment.id', ondelete='CASCADE'), nullable=False)
    expense_note: str = db.Column(db.String(200), nullable=False)
    expense_amount: float = db.Column(db.Float, nullable=False)
    year: int = db.Column(db.Integer, nullable=False)
    
# YearlyExpenses model
class YearlyExpenses(db.Model, SerializerMixin):
    year: int = db.Column(db.Integer, primary_key=True)
    fuel: float = db.Column(db.Float)
    land_payments: float = db.Column(db.Float)
    property_tax: float = db.Column(db.Float)
    misc: float = db.Column(db.Float)
    
    
    
    
    