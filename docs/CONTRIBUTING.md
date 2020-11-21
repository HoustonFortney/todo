## Setup to develop

##### Get your machine setup

- Install npm (part of [Node](https://nodejs.org/en/))
- Install [mongodb](https://www.mongodb.com/)
- Install [python](https://www.python.org/downloads/)
  - Setup a python [virtualenv](https://docs.python.org/3/tutorial/venv.html) (optional)
  - Run `pip install -r requirements.txt`
- Add the following to your machine's hosts file:
  - `127.0.0.1 todoapp.local`
  - `127.0.0.1 static.todoapp.local`
- For end to end tests, install [ChromeDriver](https://sites.google.com/a/chromium.org/chromedriver/home)
- For better debugging, install the [React Developer Tools](https://reactjs.org/blog/2015/09/02/new-react-developer-tools.html) chrome extension

##### Run the debug setup

- Run `run_development_setup.py` which will
  - Check your setup
  - Start the file watcher
  - Start the development server
- The site will be accessible at <http://todoapp.local:5000/>
  - API doc (swagger) at <http://todoapp.local:5000/api/v1/>

##### Run the tests

API tests: `cd api_tests && tox`

JS tests: `npm test`

End to end tests: `cd end_to_end_tests && tox`

Tech stack
---

TODO

Architecture
---

TODO

Workflows
---

TODO
