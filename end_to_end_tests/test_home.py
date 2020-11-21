from time import sleep

from selenium.webdriver.common.keys import Keys

from end_to_end_tests.base import TestBase


class TestTaskCreation(TestBase):
    def test_create_task_with_button(self):
        task_adder = self.driver.find_element_by_id('task-adder')
        task_adder.find_element_by_id('task-name').send_keys('Test Task')
        task_adder.find_element_by_id('create-task-button').click()

        task_names = self.get_task_names()
        self.assertEqual(task_names, ['Test Task'])

    def test_create_task_with_enter_key(self):
        new_task_name_field = self.driver.find_element_by_id('task-adder').find_element_by_id('task-name')
        new_task_name_field.send_keys('Test Task')
        new_task_name_field.send_keys(Keys.ENTER)

        self.assertEqual(self.get_task_names(), ['Test Task'])

    def test_create_multiple_tasks_without_refocus(self):
        test_names = ['Test Task {}'.format(i) for i in range(5)]

        for test_name in test_names:
            new_task_name_field = self.driver.find_element_by_id('task-adder').find_element_by_id('task-name')
            new_task_name_field.send_keys(test_name)
            new_task_name_field.send_keys(Keys.ENTER)

        expected = list(reversed(test_names))
        self.assertEqual(self.get_task_names(), expected)

    def get_task_names(self):
        reload_time = 0.1
        sleep(reload_time)
        tasks = self.driver.find_elements_by_class_name('task-list-item')
        task_names = [task.find_element_by_id('task-name').get_attribute('innerHTML') for task in tasks]

        return task_names
