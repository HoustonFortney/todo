import {
  Button, Card, Collapse, Col, Form, ListGroup, Row,
} from 'react-bootstrap';
import React from 'react';
import TextWithInfo from './TextWithInfo';
import { renderSanitizedMarkdown } from './Markdown';

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
        notes: this.props.task.notes,
      },
    };
  }

  toggleExpanded() {
    this.setState({ expanded: !this.state.expanded });
  }

  startEditing() {
    this.setState({ editing: true });
  }

  cancelEditing() {
    this.setState({
      editing: false,
      editTask: {
        id: this.props.task.id,
        name: this.props.task.name,
        location: this.props.task.location,
        notes: this.props.task.notes,
      },
    });
  }

  saveEdits() {
    this.props.onUpdate(this.state.editTask);
    this.setState({ editing: false });
  }

  deleteTask() {
    this.props.onDelete(this.props.task);
  }

  toggleComplete() {
    const { task } = this.props;
    this.props.onUpdate({ id: task.id, complete: !task.complete });
    this.setState({ doAnimation: true });
  }

  handleInputChange(event) {
    const { editTask } = this.state;
    const { target } = event;
    editTask[target.name] = target.value;
    this.setState({ editTask });
  }

  render() {
    const { task } = this.props;
    const buttonClass = (task.complete ? 'task-name-complete' : 'task-name') + (this.state.doAnimation ? ' animate' : '');
    return (
      <ListGroup.Item className="task-list-item">
        <div className="task-header">
          <span className="btn" onClick={this.toggleComplete}>
            {task.complete ? <i className="far fa-check-square" /> : <i className="far fa-square" />}
          </span>
          <Button
            variant="link"
            className={buttonClass}
            id="task-name"
            onClick={this.toggleExpanded}
          >
            {this.state.editTask.name}
          </Button>
          {this.state.expanded && (this.state.editing
            ? <CancelSaveButtons onCancelEdit={this.cancelEditing} onSaveEdit={this.saveEdits} />
            : <EditDeleteButtons onEdit={this.startEditing} onDelete={this.deleteTask} />)}
        </div>
        <Collapse in={this.state.expanded}>
          <div>
            <Card.Body>
              {this.state.editing
                ? <EditTask task={this.state.editTask} handleInputChange={this.handleInputChange} />
                : <TaskDetails task={task} />}
            </Card.Body>
          </div>
        </Collapse>
      </ListGroup.Item>
    );
  }
}

const EditDeleteButtons = (props) => (
  <span className="float-right">
    <Button onClick={props.onEdit}>
      <i className="far fa-edit" />
      <span className="d-none d-md-inline-block">&nbsp;Edit</span>
    </Button>
    <Button variant="danger" onClick={props.onDelete}>
      <i className="far fa-trash-alt" />
      <span className="d-none d-md-inline-block">&nbsp;Delete</span>
    </Button>
  </span>
);

const CancelSaveButtons = (props) => (
  <span className="float-right">
    <Button variant="outline-secondary" onClick={props.onCancelEdit}>
      <i className="fas fa-undo" />
      <span className="d-none d-md-inline-block">&nbsp;Cancel</span>
    </Button>
    <Button onClick={props.onSaveEdit}>
      <i className="far fa-save" />
      <span className="d-none d-md-inline-block">&nbsp;Save</span>
    </Button>
  </span>
);

const TaskDetails = (props) => (
  <div>
    {props.task.location && <p><strong>Location</strong>&nbsp;{props.task.location}</p>}
    <div dangerouslySetInnerHTML={{__html: renderSanitizedMarkdown(props.task.notes)}}/>
    {props.task.complete ?
      <span className="text-muted">Completed {new Date(props.task.completed).toLocaleDateString()}</span> :
      <span className="text-muted">Created {new Date(props.task.created).toLocaleDateString()}</span>}
  </div>
);

const EditTask = (props) => (
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
            Supports
            {' '}
            <a href="https://www.markdownguide.org/cheat-sheet/" target="_blank">markdown</a>
            .
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
          <div className="p-3" dangerouslySetInnerHTML={{ __html: renderSanitizedMarkdown(props.task.notes) }} />
        </Col>
      </Form.Group>
    </Form>
  </div>
);

export default TaskListItem;
