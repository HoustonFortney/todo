from flask_login import current_user

from api_tests.base import TestBase


class TestDemoLoginSystem(TestBase):
    def test_existing_user(self):
        with self.client:
            self.client.get('/')
            user_id = current_user.id

        self.assertEqual(user_id, self.user.id)
        with self.client.session_transaction() as sess:
            self.assertEqual(sess['user_id'], str(user_id))

    def test_new_user_created_if_no_user(self):
        with self.client.session_transaction() as sess:
            sess.pop('user_id')

        with self.client:
            self.client.get('/')
            user_id = current_user.id

        self.assertNotEqual(user_id, self.user.id)
        with self.client.session_transaction() as sess:
            self.assertEqual(sess['user_id'], str(user_id))

    def test_user_not_found(self):
        not_found_id = '579236cab9db831cf8ab2896'
        with self.client.session_transaction() as sess:
            sess['user_id'] = not_found_id

        with self.client:
            self.client.get('/')
            user_id = current_user.id

        self.assertNotEqual(user_id, self.user.id)
        with self.client.session_transaction() as sess:
            self.assertEqual(sess['user_id'], str(user_id))
