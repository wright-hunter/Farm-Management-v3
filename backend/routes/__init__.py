# Import and register blueprints here
from routes.fields import fields_bp
from routes.equipment import equipment_bp
from routes.yearly_expenses import yearly_expenses_bp

def register_blueprints(app):
    app.register_blueprint(fields_bp)
    app.register_blueprint(equipment_bp)
    app.register_blueprint(yearly_expenses_bp)