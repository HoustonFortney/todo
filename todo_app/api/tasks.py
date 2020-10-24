from datetime import datetime

from flask_restx import Namespace, Resource, fields

from ..models import Task


api = Namespace('tasks')

task_model = api.model('task', {
    'id': fields.String(readonly=True),
    'name': fields.String(),
    'created': fields.DateTime(readonly=True)
})


@api.route('/')
class TaskList(Resource):
    @api.marshal_with(task_model)
    def get(self):
        return list(Task.objects.all())

    @api.expect(task_model)
    @api.marshal_with(task_model, code=201)
    def post(self):
        task = Task(**api.payload)
        task.created = datetime.now()
        task.save()

        return task, 201


@api.route('/<id>')
class TaskResource(Resource):
    @api.marshal_with(task_model)
    def get(self, id):
        return Task.objects(id=id).first_or_404()

    @api.response(204, 'deleted')
    def delete(self, id):
        Task.objects(id=id).delete()

        return '', 204

    @api.expect(task_model)
    @api.marshal_with(task_model)
    def put(self, id):
        task = Task.objects(id=id).first_or_404()
        task.update(**api.payload)

        return task
