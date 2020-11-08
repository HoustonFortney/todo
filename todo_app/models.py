import mongoengine as me

from todo_app import db


class Task(db.Document):
    name = me.StringField(required=True)
    complete = me.BooleanField(required=True)
    location = me.StringField(default='')
    notes = me.StringField(default='')
    priority = me.StringField(required=True)
    created = me.DateTimeField()
