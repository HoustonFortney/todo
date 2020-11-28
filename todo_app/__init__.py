from flask import Flask, Blueprint
from flask_debugtoolbar import DebugToolbarExtension

from config import DebugConfig
from .db import db
from .demo_login_system import demo_login_manager


def create_app(config_object=DebugConfig):
    app = Flask(__name__)
    app.config.from_object(config_object)

    debug_toolbar = DebugToolbarExtension()
    debug_toolbar.init_app(app)

    db.init_app(app)
    demo_login_manager.init_app(app)

    local_static_server = Blueprint('static',
                                    __name__,
                                    static_folder='./static/dist',
                                    static_url_path='',
                                    url_prefix='/')

    # pylint: disable=unused-variable
    @app.context_processor
    def add_static_url_for():
        static_url_for = lambda p: app.config['STATIC_PATH'] + '/' + p
        return dict(static_url_for=static_url_for)

    with app.app_context():
        # pylint: disable=import-outside-toplevel
        from .home import home
        from .api import api_blueprint

        app.register_blueprint(local_static_server, subdomain='static')
        app.register_blueprint(home.home_blueprint)
        app.register_blueprint(api_blueprint, url_prefix='/api/v1')

        return app
