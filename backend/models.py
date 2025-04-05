from flask_sqlalchemy import SQLAlchemy
from sqlalchemy_serializer import SerializerMixin

# Initialize the database
db = SQLAlchemy()

# Define a Field model
class Field(db.Model, SerializerMixin):
    id: int = db.Column(db.Integer, primary_key=True)
    name: str = db.Column(db.String(80), nullable=False)
    location: str = db.Column(db.String(120), nullable=False)

class FieldEntry(db.Model, SerializerMixin):
    id: int = db.Column(db.Integer, primary_key=True)
    field_id: int = db.Column(db.Integer, db.ForeignKey('field.id', ondelete='CASCADE'), nullable=False)
    year: int = db.Column(db.Integer, nullable=False)
    acres_harvested: float = db.Column(db.Float, nullable=False)
    crop_type: str = db.Column(db.String(80), nullable=False)
    seed_cost: float = db.Column(db.Float)
    fertilizer_cost: float = db.Column(db.Float)
    chemical_cost: float = db.Column(db.Float)
    crop_insurance: float = db.Column(db.Float)
    bushels_harvested: float = db.Column(db.Float)
    
    
    