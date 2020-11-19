import mongoengine as me

from .db import db


class User(db.Document):
    username = me.StringField()


class Task(db.Document):
    user = me.ReferenceField(User, required=True)
    name = me.StringField(required=True)
    complete = me.BooleanField(required=True)
    completed = me.DateTimeField()
    location = me.StringField(default='')
    notes = me.StringField(default='')
    priority = me.StringField(required=True)
    created = me.DateTimeField()

    meta = {
        'indexes': [
            {'fields': ['created'], 'expireAfterSeconds': 60 * 60 * 24 * 30}  # For keeping demo db small
        ]
    }
