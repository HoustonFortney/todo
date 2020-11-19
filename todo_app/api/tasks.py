from datetime import datetime

from flask import abort
from flask_login import current_user
from flask_restx import Namespace, Resource, fields

from ..models import Task


api = Namespace('tasks')

task_model = api.model('task', {
    'id': fields.String(readonly=True),
    'name': fields.String(),
    'complete': fields.Boolean(),
    'completed': fields.DateTime(readonly=True),
    'location': fields.String(),
    'notes': fields.String(),
    'created': fields.DateTime(readonly=True)
})

task_args_parser = api.parser()
task_args_parser.add_argument('after', help='ID of another task. If supplied, this task will be '
                                            'ordered immediately after the specified task.')


@api.route('/')
class TaskList(Resource):
    @api.marshal_with(task_model)
    def get(self):
        return list(Task.objects(user=current_user.id).order_by('-priority').all())

    @api.expect(task_model, task_args_parser)
    @api.marshal_with(task_model, code=201)
    def post(self):
        args = task_args_parser.parse_args()
        after_task_id = args['after']

        task_fields = api.payload if api.payload is not None else {}
        task = Task(**task_fields)
        task.user = current_user.id
        task.created = datetime.now()
        task.complete = False

        if after_task_id is not None and after_task_id:
            after_task = Task.objects(user=current_user.id, id=after_task_id).first()
            if after_task is None:
                abort(400, f'After task with id {after_task_id} not found.')
        else:
            # after_task not supplied or empty, so insert at top (after nothing)
            after_task = None

        insert_after(task, after_task)

        return task, 201


@api.route('/<id>')
@api.doc(params={'id': 'ID of task'})
class TaskResource(Resource):
    @api.marshal_with(task_model)
    def get(self, id):
        return Task.objects(user=current_user.id, id=id).first_or_404()

    @api.response(204, 'deleted')
    def delete(self, id):
        Task.objects(user=current_user.id, id=id).first_or_404().delete()

        return '', 204

    @api.expect(task_model, task_args_parser)
    @api.marshal_with(task_model)
    def put(self, id):
        args = task_args_parser.parse_args()
        after_task_id = args['after']

        task = Task.objects(user=current_user.id, id=id).first_or_404()
        previous_complete = task.complete

        if api.payload:
            task.modify(**api.payload)

        if task.complete:
            if not previous_complete:
                task.completed = datetime.now()
        else:
            task.completed = None

        task.save()

        # Update priority only if after_task was supplied
        if after_task_id is not None:
            if after_task_id:
                after_task = Task.objects(user=current_user.id, id=after_task_id).first()
                if after_task is None:
                    abort(400, f'After task with id {after_task_id} not found.')
            else:
                # after_task was supplied but empty, so insert at top (after nothing)
                after_task = None

            insert_after(task, after_task)

        return task


def insert_after(this_task, after_task):
    # For the time being, this is implemented with a simple priority score. Writes O(n) items on each move.
    # This can be replaced in the future with something more sophisticated.
    # The priority is encoded as a string for this reason. int(str(x)) is a safe round-trip.
    # TODO: Fix race conditions.

    initial = 100000
    increment = 1000

    if after_task is None:
        highest_priority_task = Task.objects(user=current_user.id).order_by('-priority').limit(1).first()
        if highest_priority_task is None:
            # This is the first task
            this_task_priority = initial
        else:
            # Insert this task at the highest priority
            this_task_priority = int(highest_priority_task.priority) + increment
    else:
        this_task_priority = int(after_task.priority)
        higher_priority_tasks = Task.objects(user=current_user.id, priority__gte=after_task.priority).order_by('priority')

        # Increase the priority of all tasks which are higher priority than this task to make room
        new_priority = this_task_priority
        for task in higher_priority_tasks:
            if task.id != this_task.id:
                new_priority += increment
                task.update(priority=str(new_priority))

    this_task.priority = str(this_task_priority)
    this_task.save()
