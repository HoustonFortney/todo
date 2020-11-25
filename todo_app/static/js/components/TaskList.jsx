import '../../css/tasklist.sass';
import React from 'react';
import { Card, ListGroup } from 'react-bootstrap';
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd';
import ItemService from './ItemService';
import ConfirmationModal from './ConfirmationModal';
import TaskListItem from './TaskListItem';
import TaskAdder from './TaskAdder';

class TaskList extends React.Component {
  constructor(props) {
    super(props);

    this.itemService = new ItemService('api/v1/tasks/');

    this.createTask = this.createTask.bind(this);
    this.updateTask = this.updateTask.bind(this);
    this.deleteTask = this.deleteTask.bind(this);
    this.confirmDeleteTask = this.confirmDeleteTask.bind(this);
    this.cancelDeleteTask = this.cancelDeleteTask.bind(this);
    this.updateTaskOrder = this.updateTaskOrder.bind(this);

    this.state = {
      tasks: null,
      deletePending: false,
      deleteTask: null,
      adderIndex: 0,
    };
  }

  componentDidMount() {
    this.getTasks();
  }

  getTasks() {
    this.itemService.retrieveItems().then((items) => {
      this.setState({ tasks: items });
    });
  }

  createTask(newTask) {
    const { adderIndex, tasks } = this.state;
    const afterId = (adderIndex > 0) ? tasks[adderIndex - 1].id : '';
    this.itemService.createItem(newTask, { after: afterId }).then(() => {
      this.getTasks();
    });
  }

  updateTask(task) {
    this.itemService.updateItem(task).then(() => {
      this.getTasks();
    });
  }

  deleteTask(task) {
    this.itemService.deleteItem(task.id).then(() => {
      this.getTasks();
      this.setState({ deletePending: false, deleteTask: null });
    });
  }

  confirmDeleteTask(task) {
    this.setState({ deletePending: true, deleteTask: task });
  }

  cancelDeleteTask() {
    this.setState({ deletePending: false, deleteTask: null });
  }

  updateTaskOrder(result) {
    if (!result.destination) return; // Guard drop to nowhere

    let fromIndex = result.source.index;
    let toIndex = result.destination.index;

    // Handle movement of task adder
    if (result.draggableId === 'taskadder') {
      this.setState({ adderIndex: toIndex });
      return;
    }

    const { adderIndex, tasks } = this.state;

    // See if adder needs to move
    let newAdderIndex = adderIndex;
    if (toIndex <= newAdderIndex && fromIndex > newAdderIndex) {
      newAdderIndex++;
    } else if (toIndex >= newAdderIndex && fromIndex < newAdderIndex) {
      newAdderIndex--;
    }

    // Compute indexes if there were no adder
    if (fromIndex > adderIndex) fromIndex--;
    if (toIndex > newAdderIndex) toIndex--;

    // Do local move
    const taskList = [...tasks];
    taskList.splice(toIndex, 0, taskList.splice(fromIndex, 1)[0]);
    this.setState({ tasks: taskList, adderIndex: newAdderIndex });

    // Do remote move
    let afterId = '';
    if (toIndex > 0) {
      if (toIndex < fromIndex) toIndex--;
      afterId = tasks[toIndex].id;
    }
    this.itemService.updateItem({ id: result.draggableId }, { after: afterId }).then(() => {
      this.getTasks();
    });
  }

  render() {
    const {
      tasks, adderIndex, deleteTask, deletePending,
    } = this.state;

    if (!tasks) return null;
    const displayTasks = [...tasks];

    displayTasks.splice(adderIndex, 0, { id: 'taskadder' });

    const taskList = (
      <ListGroup>
        {displayTasks.map((task, index) => (
          <Draggable key={task.id} draggableId={task.id} index={index}>
            {(provided) => (
              <div
                ref={provided.innerRef}
                {...provided.draggableProps}
                {...provided.dragHandleProps}
              >
                {task.id === 'taskadder'
                  ? <TaskAdder onCreate={this.createTask} />
                  : (
                    <TaskListItem
                      task={task}
                      onUpdate={this.updateTask}
                      onDelete={this.confirmDeleteTask}
                    />
                  )}
              </div>
            )}
          </Draggable>
        ))}
      </ListGroup>
    );

    return (
      <div>
        <DragDropContext onDragEnd={this.updateTaskOrder}>
          <Droppable droppableId="droppable">
            {(provided) => (
              <Card {...provided.droppableProps} ref={provided.innerRef}>
                {taskList}
                {provided.placeholder}
              </Card>
            )}
          </Droppable>
        </DragDropContext>
        {deleteTask && (
        <ConfirmationModal
          show={deletePending}
          title="Delete task"
          message={`Are you sure you want to delete ${deleteTask.name}?`}
          onHide={this.cancelDeleteTask}
          onCancel={this.cancelDeleteTask}
          onConfirm={() => this.deleteTask(deleteTask)}
        />
        )}
      </div>
    );
  }
}

export default TaskList;
