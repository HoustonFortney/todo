import os
import shutil
import socket
import subprocess
from pathlib import Path

import pkg_resources
import pymongo


def check_backend_requirementes():
    print('Checking that python packages are installed...')
    requirements_path = Path(__file__).with_name("requirements.txt")
    requirements = pkg_resources.parse_requirements(requirements_path.open())
    for requirement in requirements:
        print('Checking requirement {}'.format(requirement))
        pkg_resources.require(str(requirement))

    print('Checking local DNS...')
    for test_name in ['todoapp.local', 'static.todoapp.local']:
        try:
            socket.gethostbyname(test_name)
        except socket.gaierror:
            raise Exception('Add {} to your hosts file.'.format(test_name))

    print('Checking connection to local database...')
    client = pymongo.MongoClient(host=['mongodb://localhost:27017/?ssl=false&serverSelectionTimeoutMS=1000'])
    try:
        client.server_info()
    except pymongo.errors.ServerSelectionTimeoutError:
        raise Exception('Make sure mongodb is installed and running on localhost:27017.')

    print('Checking that ChromeDriver is installed...')
    if shutil.which('chromedriver') is None:
        raise Exception('Make sure ChromeDriver is installed and in the PATH.')


def run_backend():
    os.environ['FLASK_APP'] = 'todo_app'
    os.environ['FLASK_ENV'] = 'development'
    subprocess.run(['flask', 'run'])


def check_front_end_requirements():
    print('Checking that npm is installed...')
    if shutil.which('npm') is None:
        Exception('Make sure npm is installed (via node) and in the PATH.')

    print('Making sure that node modules are installed...')
    subprocess.run(['npm.cmd', 'install'])


def run_front_end_watcher():
    subprocess.Popen(['npm.cmd', 'start'])


if __name__ == '__main__':
    check_backend_requirementes()
    check_front_end_requirements()

    run_front_end_watcher()
    run_backend()
