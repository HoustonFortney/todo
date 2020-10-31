from flask import Blueprint
from flask_restx import Api
from flask_mongoengine import ValidationError

from .tasks import api as tasks_api


api_blueprint = Blueprint('api_blueprint', __name__)
api = Api(api_blueprint, debug=True)

api.add_namespace(tasks_api)


@api.errorhandler(ValidationError)
def handle_validation_error(error):
    return {'message': str(error)}, 400
