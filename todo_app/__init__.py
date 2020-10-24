from flask import Flask
from flask_debugtoolbar import DebugToolbarExtension
from flask_mongoengine import MongoEngine
from config import DebugConfig


debug_toolbar = DebugToolbarExtension()
db = MongoEngine()


def create_app(config_object=DebugConfig):
    app = Flask(__name__)
    app.config.from_object(config_object)

    debug_toolbar.init_app(app)
    db.init_app(app)

    with app.app_context():
        from .home import home
        from .api import api_blueprint

        app.register_blueprint(home.home_blueprint)
        app.register_blueprint(api_blueprint, url_prefix='/api/v1')

        return app
