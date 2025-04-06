# Import and register blueprints here
from routes.fields import fields_bp

def register_blueprints(app):
    app.register_blueprint(fields_bp)