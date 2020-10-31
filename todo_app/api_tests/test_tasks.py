import json
import unittest
from datetime import datetime
from freezegun import freeze_time

from config import TestConfig
from todo_app import create_app, db
from todo_app.models import Task


class TestBase(unittest.TestCase):
    api_path = '/api/v1'

    def setUp(self):
        app = create_app(TestConfig)
        self.ctx = app.app_context()
        self.client = app.test_client()
        self.db = db.get_db()

        self.ctx.push()

    def tearDown(self):
        for collection in self.db.list_collection_names():
            self.db.drop_collection(collection)

        self.ctx.pop()


class TestGetTask(TestBase):
    def test_get_task(self):
        test_task = Task(name=f'Test task', complete=False, priority='0')
        test_task.save()

        response = self.client.get(f'{self.api_path}/tasks/{test_task.id}')

        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json['name'], test_task.name)
        self.assertEqual(response.json['complete'], test_task.complete)

    def test_not_found(self):
        response = self.client.get(f'{self.api_path}/tasks/5c9a26faf9db831cf8ab3326')

        self.assertEqual(response.status_code, 404)
        self.assertIn('message', response.json)


class TestGetTaskList(TestBase):
    def test_get_task_list(self):
        num_test_tasks = 10
        test_tasks = []
        for i in range(num_test_tasks):
            new_task = Task(name=f'Test task {i + 1}', complete=False, priority=f'{i}')
            test_tasks.append(new_task)
            new_task.save()

        response = self.client.get(f'{self.api_path}/tasks/')

        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.json), num_test_tasks)
        response_names = {task['name'] for task in response.json}
        expected_names = {task['name'] for task in test_tasks}
        self.assertSetEqual(response_names, expected_names)

    def test_task_list_is_sorted_by_priority(self):
        for i in [3, 1, 4, 5, 2]:
            new_task = Task(name=f'{i}', complete=False, priority=f'{i}')
            new_task.save()

        response = self.client.get(f'{self.api_path}/tasks/')

        priorities = [task['name'] for task in response.json]
        self.assertListEqual(priorities, sorted(priorities, reverse=True))

    def test_empty_list(self):
        response = self.client.get(f'{self.api_path}/tasks/')

        self.assertEqual(response.status_code, 200)
        self.assertListEqual(response.json, [])


class TestCreateTask(TestBase):
    def test_create_task(self):
        test_task_data = {'name': 'Test task'}
        response = self.client.post(f'{self.api_path}/tasks/',
                                    data=json.dumps(test_task_data),
                                    content_type='application/json')

        self.assertEqual(response.status_code, 201)
        self.assertTrue(all(item in response.json.items() for item in test_task_data.items()))
        self.assertFalse(response.json['complete'])

    def test_list_is_updated(self):
        test_task_data = {'name': 'Test task'}
        self.client.post(f'{self.api_path}/tasks/',
                         data=json.dumps(test_task_data),
                         content_type='application/json')

        new_task_list = self.client.get(f'{self.api_path}/tasks/')
        created_task = new_task_list.json[0]
        self.assertTrue(all(item in created_task.items() for item in test_task_data.items()))

    def test_task_created_date(self):
        test_task_data = {'name': 'Test task'}
        test_time = datetime.now()

        with freeze_time(test_time):
            response = self.client.post(f'{self.api_path}/tasks/',
                                        data=json.dumps(test_task_data),
                                        content_type='application/json')

        time_format = '%Y-%m-%dT%H:%M:%S.%f'
        self.assertEqual(datetime.strptime(response.json['created'], time_format), test_time)

    def test_create_task_after(self):
        top = Task(name='Top', complete=False, priority='2000').save()
        Task(name='Bottom', complete=False, priority='1000').save()
        test_task_data = {'name': 'Middle'}
        self.client.post(f'{self.api_path}/tasks/?after={top.id}',
                         data=json.dumps(test_task_data),
                         content_type='application/json')

        response = self.client.get(f'{self.api_path}/tasks/')

        names = [task['name'] for task in response.json]
        self.assertListEqual(names, ['Top', 'Middle', 'Bottom'])

    def test_after_not_found(self):
        response = self.client.post(f'{self.api_path}/tasks/?after=5c9a26faf9db831cf8ab3326')

        self.assertEqual(response.status_code, 400)
        self.assertIn('message', response.json)


class TestDeleteTask(TestBase):
    def test_delete_task(self):
        test_task = Task(name='Delete me', complete=False, priority='0')
        test_task.save()

        response = self.client.delete(f'{self.api_path}/tasks/{test_task.id}')

        self.assertEqual(response.status_code, 204)
        new_task_list = self.client.get(f'{self.api_path}/tasks/').json
        self.assertListEqual(new_task_list, [])

    def test_not_found(self):
        response = self.client.delete(f'{self.api_path}/tasks/5c9a26faf9db831cf8ab3326')

        self.assertEqual(response.status_code, 404)
        self.assertIn('message', response.json)


class TestUpdateTask(TestBase):
    def test_update_task(self):
        test_task = Task(name='Old name', complete=False, priority='0')
        test_task.save()

        new_task_data = {'name': 'New name', 'complete': True}
        response = self.client.put(f'{self.api_path}/tasks/{test_task.id}',
                                   data=json.dumps(new_task_data),
                                   content_type='application/json')

        self.assertEqual(response.status_code, 200)
        self.assertTrue(all(item in response.json.items() for item in new_task_data.items()))

    def test_list_is_updated(self):
        test_task = Task(name='Another old name', complete=False, priority='0')
        test_task.save()

        new_task_data = {'name': 'Another new name', 'complete': True}
        self.client.put(f'{self.api_path}/tasks/{test_task.id}',
                        data=json.dumps(new_task_data),
                        content_type='application/json')

        new_task_list = self.client.get(f'{self.api_path}/tasks/')
        updated_task = new_task_list.json[0]
        self.assertTrue(all(item in updated_task.items() for item in new_task_data.items()))

    def test_updates_do_not_impact_priority_without_after(self):
        Task(name='Top', complete=False, priority='3000').save()
        middle = Task(name='Middle', complete=False, priority='2000').save()
        Task(name='Bottom', complete=False, priority='1000').save()

        new_task_data = {'name': 'Still in the middle'}
        self.client.put(f'{self.api_path}/tasks/{middle.id}',
                        data=json.dumps(new_task_data),
                        content_type='application/json')

        new_task_list = self.client.get(f'{self.api_path}/tasks/')
        self.assertEqual(new_task_list.json[1]['id'], str(middle.id))

    def test_not_found(self):
        response = self.client.put(f'{self.api_path}/tasks/5c9a26faf9db831cf8ab3326')

        self.assertEqual(response.status_code, 404)
        self.assertIn('message', response.json)


class TestReorderTask(TestBase):
    def setUp(self):
        super().setUp()

        Task(name='Task A', complete=False, priority='14000').save()
        Task(name='Task B', complete=False, priority='13000').save()
        Task(name='Task C', complete=False, priority='12000').save()
        Task(name='Task D', complete=False, priority='11000').save()
        Task(name='Task E', complete=False, priority='10000').save()

        self.test_tasks = self.client.get(f'{self.api_path}/tasks/').json

    def test_move_item_to_top(self):
        move_id = self.test_tasks[3]['id']
        self.check_reorder(move_id, '', ['Task D', 'Task A', 'Task B', 'Task C', 'Task E'])

    def test_move_item_to_bottom(self):
        move_id = self.test_tasks[1]['id']
        after_id = self.test_tasks[-1]['id']
        self.check_reorder(move_id, after_id, ['Task A', 'Task C', 'Task D', 'Task E', 'Task B'])

    def test_move_item_up(self):
        move_id = self.test_tasks[2]['id']
        after_id = self.test_tasks[0]['id']
        self.check_reorder(move_id, after_id, ['Task A', 'Task C', 'Task B', 'Task D', 'Task E'])

    def test_move_item_down(self):
        move_id = self.test_tasks[2]['id']
        after_id = self.test_tasks[3]['id']
        self.check_reorder(move_id, after_id, ['Task A', 'Task B', 'Task D', 'Task C', 'Task E'])

    def test_no_movement(self):
        move_id = self.test_tasks[2]['id']
        after_id = self.test_tasks[1]['id']
        self.check_reorder(move_id, after_id, ['Task A', 'Task B', 'Task C', 'Task D', 'Task E'])

    def test_top_to_bottom(self):
        move_id = self.test_tasks[0]['id']
        after_id = self.test_tasks[-1]['id']
        self.check_reorder(move_id, after_id, ['Task B', 'Task C', 'Task D', 'Task E', 'Task A'])

    def test_bottom_to_top(self):
        move_id = self.test_tasks[-1]['id']
        self.check_reorder(move_id, '', ['Task E', 'Task A', 'Task B', 'Task C', 'Task D'])

    def test_after_self(self):
        move_id = self.test_tasks[2]['id']
        after_id = self.test_tasks[2]['id']
        self.check_reorder(move_id, after_id, ['Task A', 'Task B', 'Task C', 'Task D', 'Task E'])

    def test_after_not_found(self):
        test_task_id = self.test_tasks[0]['id']
        response = self.client.put(f'{self.api_path}/tasks/{test_task_id}?after=5c9a26faf9db831cf8ab3326')

        self.assertEqual(response.status_code, 400)
        self.assertIn('message', response.json)

    def check_reorder(self, move_id, after_id, expected_order):
        response = self.client.put(f'{self.api_path}/tasks/{move_id}?after={after_id}')

        self.assertEqual(response.status_code, 200)
        new_task_list = self.client.get(f'{self.api_path}/tasks/')
        names = [task['name'] for task in new_task_list.json]
        self.assertListEqual(names, expected_order)
