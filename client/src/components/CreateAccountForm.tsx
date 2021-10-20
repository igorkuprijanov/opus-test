import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import React from 'react';
import '../App.css';

const CreateAccountForm = (props: {
  sendCreateAccount: (data: { email: string, password: string, repeatPassword: string },
    byUser?:boolean)=>void
}) => {
  interface InputData {
    email: string;
    password: string,
    repeatPassword: string
  }

  let data: InputData;

  const checkAccount = (event: any) => {
    event.preventDefault();
    data = {
      email: event.target.elements.email.value,
      password: event.target.elements.password.value,
      repeatPassword: event.target.elements.repeatPassword.value,
    };

    props.sendCreateAccount(data);
  };

  return (
    <div>
      <h1 className="mb-4">Create an account</h1>
      <Form onSubmit={checkAccount} className="d-flex flex-column">
        <Form.Group className="mt-2">
          <Form.Label>Email</Form.Label>
          <Form.Control autoComplete="username" required name="email" type="email" placeholder="Enter email" />
        </Form.Group>
        <Form.Group className="mt-2">
          <Form.Label>Password</Form.Label>
          <Form.Control autoComplete="current-password" minLength={8} required name="password" type="password" placeholder="Enter password" />
        </Form.Group>
        <Form.Group className="mt-2">
          <Form.Label>Repeat password</Form.Label>
          <Form.Control autoComplete="current-password" minLength={8} required name="repeatPassword" type="password" placeholder="Repeat password" />
        </Form.Group>
        <Button className="mt-5 w-50 align-self-center" variant="primary" type="submit">
          Submit
        </Button>
      </Form>
    </div>
  );
};

export default CreateAccountForm;
