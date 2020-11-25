import React from 'react';
import ReactDOM from 'react-dom';
import Container from 'react-bootstrap/Container';
import TaskList from './components/TaskList';

const Home = () => (
  <Container>
    <h1>Tasks</h1>
    <TaskList />
  </Container>
);

ReactDOM.render(<Home />, document.getElementById('content'));
