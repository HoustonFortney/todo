import {
  Button, Card, Collapse, Col, Form, ListGroup, Row,
} from 'react-bootstrap';
import React from 'react';
import TextWithInfo from './TextWithInfo';
import renderSanitizedMarkdown from './Markdown';

/* dangerouslySetInnerHTML is only used with sanitization */
/* eslint-disable react/no-danger */

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

    const { task } = this.props;

    this.state = {
      expanded: false,
      editing: false,
      doAnimation: false,
      editTask: { ...task },
    };
  }

  handleInputChange(event) {
    const { editTask } = this.state;
    editTask[event.target.name] = event.target.value;
    this.setState({ editTask });
  }

  toggleExpanded() {
    const { expanded } = this.state;
    this.setState({ expanded: !expanded, doAnimation: false });
  }

  startEditing() {
    this.setState({ editing: true });
  }

  cancelEditing() {
    const { task } = this.props;
    this.setState({
      editing: false,
      editTask: { ...task },
    });
  }

  saveEdits() {
    const { onUpdate } = this.props;
    const { editTask } = this.state;
    onUpdate(editTask);
    this.setState({ editing: false });
  }

  deleteTask() {
    const { onDelete } = this.props;
    const { editTask } = this.state;
    onDelete(editTask);
  }

  toggleComplete() {
    const { task, onUpdate } = this.props;
    task.complete = !task.complete;
    this.setState({ doAnimation: true, editTask: task });
    onUpdate({ id: task.id, complete: task.complete });
  }

  render() {
    const { task } = this.props;
    const {
      doAnimation, editTask, expanded, editing,
    } = this.state;

    let itemClass = 'py-1  px-2 task-list-item';
    itemClass += (task.complete ? ' task-complete' : '');
    itemClass += (expanded ? ' expanded' : '');
    itemClass += (doAnimation ? ' animate' : '');

    return (
      <ListGroup.Item className={itemClass}>
        <div className="task-header">
          <Button variant="link" className="toggle-complete" onClick={this.toggleComplete}>
            {task.complete ? <i className="far fa-check-square" /> : <i className="far fa-square" />}
          </Button>
          <div className="task-name-container">
            <Button
              variant="link"
              className="task-name"
              id="task-name"
              onClick={this.toggleExpanded}
            >
              {editTask.name}
            </Button>
          </div>
          <div className="action-buttons mr-3">
            {expanded && (editing
              ? <CancelSaveButtons onCancelEdit={this.cancelEditing} onSaveEdit={this.saveEdits} />
              : <EditDeleteButtons onEdit={this.startEditing} onDelete={this.deleteTask} />)}
          </div>
        </div>
        <Collapse in={expanded}>
          <div>
            <Card.Body>
              {editing
                ? <EditTask task={editTask} handleInputChange={this.handleInputChange} />
                : <TaskDetails task={task} />}
            </Card.Body>
          </div>
        </Collapse>
      </ListGroup.Item>
    );
  }
}

const EditDeleteButtons = (props) => {
  const { onEdit, onDelete } = props;

  return (
    <span className="float-right">
      <Button className="ml-1" onClick={onEdit}>
        <i className="far fa-edit" />
        <span className="d-none d-md-inline-block">&nbsp;Edit</span>
      </Button>
      <Button variant="danger" className="ml-1" onClick={onDelete}>
        <i className="far fa-trash-alt" />
        <span className="d-none d-md-inline-block">&nbsp;Delete</span>
      </Button>
    </span>
  );
};

const CancelSaveButtons = (props) => {
  const { onCancelEdit, onSaveEdit } = props;

  return (
    <span className="float-right">
      <Button variant="outline-secondary" className="ml-1" onClick={onCancelEdit}>
        <i className="fas fa-undo" />
        <span className="d-none d-md-inline-block">&nbsp;Cancel</span>
      </Button>
      <Button className="ml-1" onClick={onSaveEdit}>
        <i className="far fa-save" />
        <span className="d-none d-md-inline-block">&nbsp;Save</span>
      </Button>
    </span>
  );
};

const TaskDetails = (props) => {
  const { task } = props;
  return (
    <div>
      {task.location && (
      <p>
        <strong>Location</strong>
        {'\xA0'}
        {task.location}
      </p>
      )}
      <div dangerouslySetInnerHTML={{ __html: renderSanitizedMarkdown(task.notes) }} />
      <span className="text-muted">
        {task.complete
          ? `Completed ${new Date(task.completed).toLocaleDateString()}`
          : `Created ${new Date(task.created).toLocaleDateString()}`}
      </span>
    </div>
  );
};

const EditTask = (props) => {
  const { task, handleInputChange } = props;
  return (
    <div>
      <Form onSubmit={(event) => event.preventDefault()}>
        <Form.Group as={Row}>
          <Form.Label column sm={2}>Name</Form.Label>
          <Col sm={10}>
            <Form.Control
              placeholder="New task"
              name="name"
              value={task.name}
              onChange={handleInputChange}
            />
          </Col>
        </Form.Group>
        <Form.Group as={Row}>
          <Form.Label column sm={2}>Location</Form.Label>
          <Col sm={10}>
            <Form.Control
              name="location"
              value={task.location}
              onChange={handleInputChange}
            />
          </Col>
        </Form.Group>
        <Form.Group as={Row}>
          <Form.Label column sm={2}>
            <TextWithInfo text="Notes" title="Task notes">
              Supports
              {' '}
              <a href="https://www.markdownguide.org/cheat-sheet/" target="_blank" rel="noreferrer">markdown</a>
              .
            </TextWithInfo>
          </Form.Label>
          <Col sm={10}>
            <Form.Control
              as="textarea"
              rows={8}
              name="notes"
              value={task.notes}
              onChange={handleInputChange}
            />
            <div className="p-3" dangerouslySetInnerHTML={{ __html: renderSanitizedMarkdown(task.notes) }} />
          </Col>
        </Form.Group>
      </Form>
    </div>
  );
};

export default TaskListItem;
