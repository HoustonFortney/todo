import json
import os


def write_build_number_file():
    build_number = os.environ['CODEBUILD_BUILD_NUMBER']

    with open('build_number.json', mode='w') as build_number_file:
        json.dump({'build_number': build_number}, build_number_file)


def get_version_number():
    with open('package.json') as package_file:
        version = json.load(package_file)['version']

    try:
        with open('build_number.json') as build_number_file:
            build_number = json.load(build_number_file)['build_number']
    except FileNotFoundError:
        build_number = 'local'  # We are running locally, not built by the build server

    return '.'.join([version, str(build_number)])


if __name__ == '__main__':
    # This is executed by the build server
    write_build_number_file()
    print(get_version_number())
