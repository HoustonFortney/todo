from flask import session
from flask_login import LoginManager

from .models import User

demo_login_manager = LoginManager()


@demo_login_manager.request_loader
def load_user(request):
    if 'user_id' not in session:
        user = None
    else:
        user = User.objects(id=session['user_id']).first()

    if user is None:
        # User does not exist, create new demo user
        user = User(username='Demo User', addr=request.access_route[0])
        user.save()
        session['user_id'] = str(user.id)

    return user
