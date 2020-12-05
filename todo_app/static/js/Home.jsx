import React from 'react';
import ReactDOM from 'react-dom';
import Container from 'react-bootstrap/Container';
import TaskList from './components/TaskList';
import Footer from './components/Footer';

const Home = () => (
  <Container className="d-flex flex-column min-vh-100 pt-2">
    <h1>Tasks</h1>
    <TaskList />
    <Footer />
  </Container>
);

ReactDOM.render(<Home />, document.getElementById('content'));
