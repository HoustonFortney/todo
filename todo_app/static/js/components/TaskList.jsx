import React from "react";
import Accordion from "react-bootstrap/Accordion";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import ItemService from "./ItemService.jsx";
import ConfirmationModal from "./ConfirmationModal.jsx"

class TaskList extends React.Component {
    constructor(props) {
        super(props);

        this.itemService = new ItemService("api/v1/tasks/");

        this.createTask = this.createTask.bind(this);
        this.updateTask = this.updateTask.bind(this);
        this.deleteTask = this.deleteTask.bind(this);
        this.confirmDeleteTask = this.confirmDeleteTask.bind(this);
        this.cancelDeleteTask = this.cancelDeleteTask.bind(this);

        this.state = {
            tasks: null,
            deletePending: false,
            deleteTask: null
        };
    }

    componentDidMount() {
        this.getTasks();
    }

    getTasks() {
        this.itemService.retrieveItems().then(items => {
                this.setState({tasks: items});
            }
        );
    }

    createTask(newTask) {
        this.itemService.createItem(newTask).then(item => {
                this.getTasks();
            }
        );
    }

    updateTask(task) {
        this.itemService.updateItem(task).then(item => {
                this.getTasks();
            }
        );
    }

    deleteTask(task) {
        this.itemService.deleteItem(task.id).then(res => {
                this.getTasks();
                this.setState({deletePending: false, deleteTask: null,});
            }
        );
    }

    confirmDeleteTask(task) {
        this.setState({deletePending: true, deleteTask: task});
    }

    cancelDeleteTask() {
        this.setState({deletePending: false, deleteTask: null});
    }

    render() {
        const tasks = this.state.tasks;
        if (!tasks) return null;

        return (
            <div>
                <AddTask onCreate={this.createTask}/>
                {tasks.map(task => (
                    <TaskListItem task={task} key={task.id}
                                  onUpdate={this.updateTask}
                                  onDelete={this.confirmDeleteTask}/>
                ))}
                {this.state.deleteTask && <ConfirmationModal show={this.state.deletePending}
                                                             title="Delete task"
                                                             message={"Are you sure you want to delete " + this.state.deleteTask.name + "?"}
                                                             onHide={this.cancelDeleteTask}
                                                             onCancel={this.cancelDeleteTask}
                                                             onConfirm={() => this.deleteTask(this.state.deleteTask)}/>}
            </div>
        );
    }
}

class TaskListItem extends React.Component {
    constructor(props) {
        super(props);

        this.startEditing = this.startEditing.bind(this);
        this.cancelEditing = this.cancelEditing.bind(this);
        this.saveEdits = this.saveEdits.bind(this);
        this.toggleComplete = this.toggleComplete.bind(this);

        this.state = {
            editing: false
        };
    }

    startEditing() {
        this.setState({editing: true});
    }

    cancelEditing() {
        this.setState({editing: false});
    }

    saveEdits(task) {
        this.props.onUpdate(task);
        this.setState({editing: false});
    }

    toggleComplete() {
        const task = this.props.task;
        this.props.onUpdate({id: task.id, complete: !task.complete});
    }

    render() {
        const task = this.props.task;
        return (
            <Accordion>
                <Card>
                    <Card.Header>
                        <span onClick={this.toggleComplete}>
                            {task.complete ? <i className="far fa-check-square"/> : <i className="far fa-square"/>}
                        </span>
                        <Accordion.Toggle as={Button} variant="link" eventKey={task.id}>{task.name}</Accordion.Toggle>
                    </Card.Header>
                    <Accordion.Collapse eventKey={task.id}>
                        <Card.Body>
                            {this.state.editing ?
                                <EditTask task={task} onCancelEdit={this.cancelEditing} onSaveEdit={this.saveEdits}/> :
                                <TaskDetails task={task} onEdit={this.startEditing} onDelete={this.props.onDelete}/>}
                        </Card.Body>
                    </Accordion.Collapse>
                </Card>
            </Accordion>
        )
    }
}

const TaskDetails = (props) =>
    <div>
        Created {new Date(props.task.created).toLocaleDateString()}&nbsp;
        <Button onClick={props.onEdit}>
            <i className="far fa-edit"/>&nbsp;Edit
        </Button>&nbsp;
        <Button variant="danger" onClick={() => props.onDelete(props.task)}>
            <i className="far fa-trash-alt"/>&nbsp;Delete
        </Button>
    </div>

class EditTask extends React.Component {
    constructor(props) {
        super(props);

        this.handleInputChange = this.handleInputChange.bind(this);

        this.state = {
            id: props.task.id,
            name: props.task.name
        };
    }

    handleInputChange(event) {
        const target = event.target;
        this.setState({[target.name]: target.value});
    }

    render() {
        return (
            <div>
                Name:&nbsp;
                <Form.Control
                    id="task-name"
                    placeholder="New task"
                    aria-label="Task name"
                    aria-describedby="basic-addon1"
                    name="name"
                    value={this.state.name}
                    onChange={this.handleInputChange}
                    required
                />
                <Button variant="outline-secondary" onClick={this.props.onCancelEdit}>
                    Cancel
                </Button>&nbsp;
                <Button onClick={() => this.props.onSaveEdit(this.state)}>
                    <i className="far fa-save"/>&nbsp;Save
                </Button>
            </div>
        );
    }
}

class AddTask extends React.Component {
    constructor(props) {
        super(props);

        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleKeyDown = this.handleKeyDown.bind(this);
        this.onCreate = this.onCreate.bind(this);

        this.state = {
            name: ""
        };
    }

    handleInputChange(event) {
        this.setState({name: event.target.value});
    }

    handleKeyDown(event) {
        if (event.key === "Enter") {
            this.onCreate();
        }
    }

    onCreate() {
        this.props.onCreate(this.state);
        this.setState({name: ""})
    }

    render() {
        return (
            <Card>
                <Card.Header>
                    <i className="fas fa-plus"/>
                    <Form.Control
                        id="task-name"
                        placeholder="New task"
                        aria-label="Task name"
                        aria-describedby="basic-addon1"
                        name="name"
                        value={this.state.name}
                        onKeyDown={this.handleKeyDown}
                        onChange={this.handleInputChange}
                        required
                    />
                    <Button type="submit" className="mb-2" onClick={this.onCreate}>
                        Create
                    </Button>
                </Card.Header>
            </Card>
        );
    }
}

export default TaskList;
