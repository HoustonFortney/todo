import unittest

from config import TestConfig
from todo_app import create_app, db
from todo_app.models import User


class TestBase(unittest.TestCase):
    api_path = '/api/v1'

    def setUp(self):
        app = create_app(TestConfig)
        self.ctx = app.app_context()
        self.client = app.test_client()
        self.db = db.get_db()
        user = User(username='Test User')
        user.save()
        self.user = user

        with self.client.session_transaction() as sess:
            sess['user_id'] = str(user.id)

        self.ctx.push()

    def tearDown(self):
        for collection in self.db.list_collection_names():
            self.db.drop_collection(collection)

        self.ctx.pop()
