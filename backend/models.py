from flask_sqlalchemy import SQLAlchemy
from dataclasses import dataclass

# Initialize the database
db = SQLAlchemy()

# Define a User model
class User(db.Model):
    id: int = db.Column(db.Integer, primary_key=True)
    username: str = db.Column(db.String(80), unique=True, nullable=False)
    email: str = db.Column(db.String(120), unique=True, nullable=False)
