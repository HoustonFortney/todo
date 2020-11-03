import React from "react";
import Card from "react-bootstrap/Card";
import Row from "react-bootstrap/Row"
import Col from "react-bootstrap/Col"
import Button from "react-bootstrap/Button";
import Collapse from "react-bootstrap/Collapse"
import Form from "react-bootstrap/Form";
import {ListGroup} from "react-bootstrap";
import ItemService from "./ItemService.jsx";
import ConfirmationModal from "./ConfirmationModal.jsx"
import "../../css/tasklist.sass"

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
                <Card>
                    <ListGroup>
                        <AddTask onCreate={this.createTask}/>
                        {tasks.map(task => (
                            <TaskListItem task={task} key={task.id}
                                          onUpdate={this.updateTask}
                                          onDelete={this.confirmDeleteTask}/>
                        ))}
                    </ListGroup>
                </Card>
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

        this.toggleExpanded = this.toggleExpanded.bind(this);
        this.startEditing = this.startEditing.bind(this);
        this.cancelEditing = this.cancelEditing.bind(this);
        this.saveEdits = this.saveEdits.bind(this);
        this.deleteTask = this.deleteTask.bind(this);
        this.toggleComplete = this.toggleComplete.bind(this);
        this.handleInputChange = this.handleInputChange.bind(this);

        this.state = {
            expanded: false,
            editing: false,
            doAnimation: false,
            editTask: {
                id: this.props.task.id,
                name: this.props.task.name
            }
        };
    }

    toggleExpanded() {
        this.setState({expanded: !this.state.expanded});
    }

    startEditing() {
        this.setState({editing: true});
    }

    cancelEditing() {
        this.setState({
            editing: false,
            editTask: {
                id: this.props.task.id,
                name: this.props.task.name
            }
        });
    }

    saveEdits() {
        this.props.onUpdate(this.state.editTask);
        this.setState({editing: false});
    }

    deleteTask() {
        this.props.onDelete(this.props.task);
    }

    toggleComplete() {
        const task = this.props.task;
        this.props.onUpdate({id: task.id, complete: !task.complete});
        this.setState({doAnimation: true});
    }

    handleInputChange(event) {
        let editTask = this.state.editTask;
        const target = event.target;
        editTask[target.name] = target.value;
        this.setState({editTask: editTask});
    }

    render() {
        const task = this.props.task;
        const buttonClass = (task.complete ? "task-name-complete" : "task-name") + (this.state.doAnimation ? " animate" : "");
        return (
            <ListGroup.Item>
                <div className="task-header">
                    <span className="btn task-state" onClick={this.toggleComplete}>
                        {task.complete ? <i className="far fa-check-square"/> : <i className="far fa-square"/>}
                    </span>
                    <Button variant="link" className={buttonClass}
                            onClick={this.toggleExpanded}>{this.state.editTask.name}</Button>
                    {this.state.expanded && (this.state.editing ?
                        <CancelSaveButtons onCancelEdit={this.cancelEditing}
                                           onSaveEdit={this.saveEdits}/> :
                        <EditDeleteButtons onEdit={this.startEditing}
                                           onDelete={this.deleteTask}/>)}
                </div>
                <Collapse in={this.state.expanded}>
                    <div>
                        <Card.Body>
                            {this.state.editing ?
                                <EditTask task={this.state.editTask} handleInputChange={this.handleInputChange}/> :
                                <TaskDetails task={task}/>}
                        </Card.Body>
                    </div>
                </Collapse>
            </ListGroup.Item>
        )
    }
}

const EditDeleteButtons = (props) =>
    <span className="float-right">
        <Button onClick={props.onEdit}>
            <i className="far fa-edit"/>&nbsp;Edit
        </Button>&nbsp;
        <Button variant="danger" onClick={props.onDelete}>
            <i className="far fa-trash-alt"/>&nbsp;Delete
        </Button>
    </span>

const CancelSaveButtons = (props) =>
    <span className="float-right">
        <Button variant="outline-secondary" onClick={props.onCancelEdit}>
            Cancel
        </Button>&nbsp;
        <Button onClick={props.onSaveEdit}>
            <i className="far fa-save"/>&nbsp;Save
        </Button>
    </span>

const TaskDetails = (props) =>
    <div>
        <span className="text-muted">Created {new Date(props.task.created).toLocaleDateString()}</span>
    </div>

const EditTask = (props) =>
    <div>
        <Form onSubmit={(event) => event.preventDefault()}>
            <Form.Group as={Row}>
                <Form.Label column sm={1}>Name</Form.Label>
                <Col sm={11}>
                    <Form.Control
                        placeholder="New task"
                        name="name"
                        value={props.task.name}
                        onChange={props.handleInputChange}
                    />
                </Col>
            </Form.Group>
        </Form>
    </div>

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
        if (this.state.name) {
            this.props.onCreate(this.state);
        }
        this.setState({name: ""})
    }

    render() {
        return (
            <ListGroup.Item>

                <Form inline onSubmit={(event) => event.preventDefault()}>
                    <i className="fas fa-plus"/>
                    <Form.Control
                        placeholder="New task"
                        name="name"
                        value={this.state.name}
                        onKeyDown={this.handleKeyDown}
                        onChange={this.handleInputChange}
                    />
                    <Button type="submit" onClick={this.onCreate}>
                        Create
                    </Button>
                </Form>

            </ListGroup.Item>
        );
    }
}

export default TaskList;
