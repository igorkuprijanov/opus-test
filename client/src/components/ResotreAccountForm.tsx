import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import '../App.css';
import React from 'react';

const loginForm = (props: any) => {
  interface InputData {
    email: string;
  }

  let data: InputData;

  const handleSubmit = (event: any) => {
    event.preventDefault();
    data = {
      email: event.target.elements.email.value,
    };
    props.sendResetPassword(data);
  };

  return (
    <div>
      <h1 className="mb-4">Restore password</h1>
      <Form className="d-flex flex-column" onSubmit={handleSubmit}>
        <Form.Group className="mt-2">
          <Form.Label>Email</Form.Label>
          <Form.Control autoComplete="username" name="email" type="email" placeholder="Enter email" />
        </Form.Group>
        <Button className="mt-5  w-50 align-self-center" variant="primary" type="submit">
          Submit
        </Button>
      </Form>
    </div>
  );
};

export default loginForm;
