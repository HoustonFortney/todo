from flask import Blueprint, render_template

home_blueprint = Blueprint('home_blueprint', __name__, template_folder='templates')

@home_blueprint.route('/')
def home():
    return render_template('home/index.jinja2', title='todo_app')
