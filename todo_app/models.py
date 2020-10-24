import mongoengine as me

from todo_app import db


class Task(db.Document):
    name = me.StringField(required=True)
    created = me.DateTimeField()
