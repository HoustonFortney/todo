import unittest
from multiprocessing.context import Process

from selenium import webdriver
from waitress import serve

from config import TestConfig
from todo_app import create_app


app = create_app(TestConfig)


def run_test_server():
    serve(app, port=TestConfig.TEST_SERVER_PORT)


class TestBase(unittest.TestCase):
    server_url = 'localhost:{}'.format(TestConfig.TEST_SERVER_PORT)

    @classmethod
    def setUpClass(cls):
        cls.driver = webdriver.Chrome()

    @classmethod
    def tearDownClass(cls):
        cls.driver.quit()

    def setUp(self):
        self.test_server_process = Process(target=run_test_server)
        self.test_server_process.start()

        self.driver.get(self.server_url)
        self.driver.implicitly_wait(1)

    def tearDown(self):
        if self.test_server_process:
            self.test_server_process.terminate()
