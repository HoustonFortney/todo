import React from 'react';
import { Button, Form, ListGroup } from 'react-bootstrap';

class TaskAdder extends React.Component {
  constructor(props) {
    super(props);

    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleKeyDown = this.handleKeyDown.bind(this);
    this.onCreate = this.onCreate.bind(this);

    this.state = {
      name: '',
    };
  }

  handleInputChange(event) {
    this.setState({ name: event.target.value });
  }

  handleKeyDown(event) {
    if (event.key === 'Enter') {
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
    this.setState({ name: '' });
  }

  render() {
    return (
      <ListGroup.Item>
        <Form id="task-adder" inline onSubmit={(event) => event.preventDefault()}>
          <span className="btn"><i className="fas fa-plus" /></span>
          <Form.Control
            id="task-name"
            className="w-75"
            placeholder="New task"
            name="name"
            autoComplete="off"
            value={this.state.name}
            onKeyDown={this.handleKeyDown}
            onChange={this.handleInputChange}
          />
          <Button id="create-task-button" type="submit" onClick={this.onCreate}>
            Create
          </Button>
        </Form>
      </ListGroup.Item>
    );
  }
}

export default TaskAdder;
