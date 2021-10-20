import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import '../App.css';
import React from 'react';

const loginForm = (props: { sendLogin: (data: { email: string, password: string })=>void }) => {
  interface InputData {
    email: string;
    password: string
  }

  let data: InputData;

  const handleSubmit = (event:any) => {
    event.preventDefault();

    data = {
      email: event.target.elements.email.value,
      password: event.target.elements.password.value,
    };

    props.sendLogin(data);
  };

  return (
    <div>
      <h1 className="mb-4">Log in</h1>
      <Form onSubmit={handleSubmit} className="d-flex flex-column">
        <Form.Group className="mt-2">
          <Form.Label>Email</Form.Label>
          <Form.Control autoComplete="username" required name="email" type="email" placeholder="Enter email" />
        </Form.Group>
        <Form.Group className="mt-2">
          <Form.Label>Password</Form.Label>
          <Form.Control autoComplete="current-password" minLength={8} required name="password" type="password" placeholder="Enter password" />
        </Form.Group>
        <Button className="mt-5  w-50 align-self-center" variant="primary" type="submit">
          Submit
        </Button>
      </Form>
    </div>
  );
};

export default loginForm;
