import React from 'react';
import {
  Button, Form, ListGroup, InputGroup,
} from 'react-bootstrap';

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
    const { name } = this.state;
    const { onCreate } = this.props;
    if (name) {
      onCreate(this.state);
    }
    this.setState({ name: '' });
  }

  render() {
    const { name } = this.state;

    return (
      <ListGroup.Item className="d-flex py-1">
        <Button variant="link" className="add-task-icon" onClick={() => { this.nameInput.focus(); }}><i className="fas fa-plus" /></Button>
        <Form id="task-adder" className="w-100" onSubmit={(event) => event.preventDefault()}>
          <InputGroup className="w-100">
            <Form.Control
              id="task-name"
              placeholder="New task"
              name="name"
              autoComplete="off"
              value={name}
              onKeyDown={this.handleKeyDown}
              onChange={this.handleInputChange}
              ref={(input) => { this.nameInput = input; }}
            />
            <InputGroup.Append>
              <Button id="create-task-button" type="submit" onClick={this.onCreate}>
                Create
              </Button>
            </InputGroup.Append>
          </InputGroup>
        </Form>
      </ListGroup.Item>
    );
  }
}

export default TaskAdder;
