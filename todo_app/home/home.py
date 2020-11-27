from flask import Blueprint, render_template, abort
from jinja2 import TemplateNotFound

home_blueprint = Blueprint('home_blueprint', __name__, template_folder='templates')


@home_blueprint.route('/')
def home():
    return render_template('home/index.jinja2')


@home_blueprint.route('/<name>')
def route_name(name):
    try:
        return render_template(f'home/{name}.jinja2')
    except TemplateNotFound:
        abort(404)
