import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import React, { useState } from 'react';

const User = (props: {
  index:number,
  isActive: boolean,
  currentUser: string,
  name: string,
  logs:Array<string>,
  popup: (type: string, name?: string)=>void }) => {
  const [open, setOpen] = useState(false);

  const deleteUser = () => {
    props.popup('delete', props.name);
  };

  return (
    <Container onClick={() => { setOpen(!open); }} className={props.currentUser === props.name ? 'user you p-2 mb-3' : 'user mb-3 p-2'}>
      <div className="d-flex flex-row justify-content-between">
        <h3>
          {props.index}
          .
        </h3>
        <h3>
          {props.name}
          {' '}
          {props.currentUser === props.name ? '(You)' : null}
        </h3>
        {props.isActive
          ? <Button onClick={deleteUser} variant="danger">Delete</Button>
          : <div />}
      </div>
      {open
        ? (
          <Container className="mt-4">
            {props.logs.map((log) => <p key={log}>{log}</p>)}
          </Container>
        )
        : null}

    </Container>
  );
};

export default User;
