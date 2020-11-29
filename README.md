Todo App
===

![Build Status](https://codebuild.us-east-2.amazonaws.com/badges?uuid=eyJlbmNyeXB0ZWREYXRhIjoiczZKUWx5Mi9vQzBkQXF0eEJDbUJFdS83b09FdzRmZGlBN2VleDZyUEp3QnR4UEhHRE1YeGRoaUVpSFdGMVd4YWVOcFZvaDY2WUphRitRQnh4Q0FXZE1jPSIsIml2UGFyYW1ldGVyU3BlYyI6IjZVQ0RzNFl0VGhKRjcvajMiLCJtYXRlcmlhbFNldFNlcmlhbCI6MX0%3D&branch=main)

The purpose of this project is to test drive the
[React](https://reactjs.org/) + 
[Flask](https://flask.palletsprojects.com/) + 
[MongoDB](https://www.mongodb.com/) stack.
See architecture details [here](./docs/CONTRIBUTING.md).

[![Screenshot of Home](./docs/home.gif)](http://tododemo.houstonfortney.com)

Checkout the **[live demo](tododemo.houstonfortney.com)**!

*Note: A demo user account will automatically be created. Tasks will live for 30 days on the demo site.*

Feature Set
---

- Manage tasks
  - ➕ Create tasks
  - ✏️Edit tasks
  - 🗑️ Delete tasks
- ↕️Drag and drop tasks to change priority
  - You can also drag the task adder, new tasks will be added below the task adder
- 🗒️ Add a notes to tasks (supports [markown](https://www.markdownguide.org/))
- 📍 Add a location to a task
- ✔️Mark tasks complete (with satisfying animation)
