import os
import pymongo
import shutil
import socket
import subprocess
from pathlib import Path

import pkg_resources


def check_backend_requirementes():
    print('Checking that python packages are installed...')
    requirements_path = Path(__file__).with_name("requirements.txt")
    requirements = pkg_resources.parse_requirements(requirements_path.open())
    for requirement in requirements:
        print('Checking requirement {}'.format(requirement))
        pkg_resources.require(str(requirement))

    print('Checking local DNS...')
    try:
        socket.gethostbyname('todoapp.local')
    except socket.gaierror:
        raise Exception('Add todoapp.local to your hosts file.')

    print('Checking connection to local database...')
    client = pymongo.MongoClient(host=['mongodb://localhost:27017/?ssl=false&serverSelectionTimeoutMS=1000'])
    try:
        client.server_info()
    except pymongo.errors.ServerSelectionTimeoutError:
        raise Exception('Make sure mongodb is installed and running on localhost:27017.')


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
