import "../../css/tasklist.sass"
import React from "react";
import {Button, Card, Col, Collapse, Form, ListGroup, Row} from "react-bootstrap"
import {DragDropContext, Draggable, Droppable} from "react-beautiful-dnd";
import ItemService from "./ItemService.jsx";
import ConfirmationModal from "./ConfirmationModal.jsx"
import {renderSanitizedMarkdown} from "./Markdown.jsx";
import TextWithInfo from "./TextWithInfo.jsx";

class TaskList extends React.Component {
    constructor(props) {
        super(props);

        this.itemService = new ItemService("api/v1/tasks/");

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
            adderIndex: 0
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
        const adderIndex = this.state.adderIndex;
        const afterId = (adderIndex > 0) ? this.state.tasks[adderIndex - 1].id : '';
        this.itemService.createItem(newTask, {after: afterId}).then(item => {
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

    updateTaskOrder(result) {
        if (!result.destination) return; // Guard drop to nowhere

        let fromIndex = result.source.index;
        let toIndex = result.destination.index;

        // Handle movement of task adder
        if (result.draggableId === 'taskadder') {
            this.setState({adderIndex: toIndex});
            return;
        }

        // See if adder needs to move
        let newAdderIndex = this.state.adderIndex;
        if (toIndex <= newAdderIndex && fromIndex > newAdderIndex) {
            newAdderIndex++;
        } else if (toIndex >= newAdderIndex && fromIndex < newAdderIndex) {
            newAdderIndex--;
        }

        // Compute indexes if there were no adder
        if (fromIndex > this.state.adderIndex) fromIndex--;
        if (toIndex > newAdderIndex) toIndex--;

        // Do local move
        let taskList = [...this.state.tasks];
        taskList.splice(toIndex, 0, taskList.splice(fromIndex, 1)[0]);
        this.setState({tasks: taskList, adderIndex: newAdderIndex});

        // Do remote move
        let afterId = '';
        if (toIndex > 0) {
            if (toIndex < fromIndex) toIndex--;
            afterId = this.state.tasks[toIndex].id;
        }
        this.itemService.updateItem({id: result.draggableId}, {after: afterId}).then(item => {
                this.getTasks();
            }
        );
    }

    render() {
        if (!this.state.tasks) return null;
        let tasks = [...this.state.tasks];

        tasks.splice(this.state.adderIndex, 0, {id: 'taskadder'});

        const taskList = <ListGroup>
            {tasks.map((task, index) => (
                <Draggable key={task.id} draggableId={task.id} index={index}>
                    {(provided, snapshot) => (
                        <div ref={provided.innerRef}
                             {...provided.draggableProps}
                             {...provided.dragHandleProps}>
                            {task.id === 'taskadder' ?
                                <AddTask onCreate={this.createTask}/> :
                                <TaskListItem task={task}
                                              onUpdate={this.updateTask}
                                              onDelete={this.confirmDeleteTask}/>
                            }
                        </div>
                    )}
                </Draggable>
            ))}
        </ListGroup>

        return (
            <div>
                <DragDropContext onDragEnd={this.updateTaskOrder}>
                    <Droppable droppableId="droppable">
                        {(provided, snapshot) => (
                            <Card {...provided.droppableProps} ref={provided.innerRef}>
                                {taskList}
                                {provided.placeholder}
                            </Card>
                        )}
                    </Droppable>
                </DragDropContext>
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
                name: this.props.task.name,
                location: this.props.task.location,
                notes: this.props.task.notes
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
                name: this.props.task.name,
                location: this.props.task.location,
                notes: this.props.task.notes
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
                    <span className="btn" onClick={this.toggleComplete}>
                        {task.complete ? <i className="far fa-check-square"/> : <i className="far fa-square"/>}
                    </span>
                    <Button variant="link" className={buttonClass}
                            onClick={this.toggleExpanded}>{this.state.editTask.name}</Button>
                    {this.state.expanded && (this.state.editing ?
                        <CancelSaveButtons onCancelEdit={this.cancelEditing} onSaveEdit={this.saveEdits}/> :
                        <EditDeleteButtons onEdit={this.startEditing} onDelete={this.deleteTask}/>)}
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
            <i className="far fa-edit"/><span className="d-none d-md-inline-block">&nbsp;Edit</span>
        </Button>&nbsp;
        <Button variant="danger" onClick={props.onDelete}>
            <i className="far fa-trash-alt"/><span className="d-none d-md-inline-block">&nbsp;Delete</span>
        </Button>
    </span>

const CancelSaveButtons = (props) =>
    <span className="float-right">
        <Button variant="outline-secondary" onClick={props.onCancelEdit}>
            <i className="fas fa-undo"></i><span className="d-none d-md-inline-block">&nbsp;Cancel</span>
        </Button>&nbsp;
        <Button onClick={props.onSaveEdit}>
            <i className="far fa-save"/><span className="d-none d-md-inline-block">&nbsp;Save</span>
        </Button>
    </span>

const TaskDetails = (props) =>
    <div>
        {props.task.location && <p><strong>Location</strong>&nbsp;{props.task.location}</p>}
        <div dangerouslySetInnerHTML={{__html: renderSanitizedMarkdown(props.task.notes)}}/>
            {props.task.complete ?
                <span className="text-muted">Completed {new Date(props.task.completed).toLocaleDateString()}</span> :
                <span className="text-muted">Created {new Date(props.task.created).toLocaleDateString()}</span>}
    </div>

const EditTask = (props) =>
    <div>
        <Form onSubmit={(event) => event.preventDefault()}>
            <Form.Group as={Row}>
                <Form.Label column sm={2}>Name</Form.Label>
                <Col sm={10}>
                    <Form.Control
                        placeholder="New task"
                        name="name"
                        value={props.task.name}
                        onChange={props.handleInputChange}
                    />
                </Col>
            </Form.Group>
            <Form.Group as={Row}>
                <Form.Label column sm={2}>Location</Form.Label>
                <Col sm={10}>
                    <Form.Control
                        name="location"
                        value={props.task.location}
                        onChange={props.handleInputChange}
                    />
                </Col>
            </Form.Group>
            <Form.Group as={Row}>
                <Form.Label column sm={2}>
                    <TextWithInfo text="Notes" title="Task notes">
                        Supports <a href="https://www.markdownguide.org/cheat-sheet/" target="_blank">markdown</a>.
                    </TextWithInfo>
                </Form.Label>
                <Col sm={10}>
                    <Form.Control
                        as="textarea"
                        rows={8}
                        name="notes"
                        value={props.task.notes}
                        onChange={props.handleInputChange}
                    />
                    <div className="p-3" dangerouslySetInnerHTML={{__html: renderSanitizedMarkdown(props.task.notes)}}/>
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

            // Clear native autocomplete
            event.target.blur();
            event.target.focus();
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
                    <span className="btn"><i className="fas fa-plus"/></span>
                    <Form.Control
                        className="w-75"
                        placeholder="New task"
                        name="name"
                        autoComplete="off"
                        value={this.state.name}
                        onKeyDown={this.handleKeyDown}
                        onChange={this.handleInputChange}
                    />&nbsp;
                    <Button type="submit" onClick={this.onCreate}>
                        Create
                    </Button>
                </Form>
            </ListGroup.Item>
        );
    }
}

export default TaskList;
