import Button from 'react-bootstrap/Button';
import Alert from 'react-bootstrap/Alert';
import React from 'react';
import CreateAccountForm from './CreateAccountForm';

const Pupup = (props: { deleteUser: (name:string)=>void,
  userName: string, closePopup: (type:string)=>void,
  addingUser: boolean,
  showMessage: boolean,
  message: { head: string, body: string },
  sendCreateAccount: (data: { email: string,
    password: string, repeatPassword: string },
    byUser?:boolean)=>void }) => {
  const sendCreateAccount = (
    data: { email: string, password: string, repeatPassword: string },
  ) => {
    props.sendCreateAccount(data, true);
  };

  const closePopup = () => {
    props.closePopup('add');
  };

  const deleteUser = () => {
    props.deleteUser(props.userName);
  };

  return (
    <div className="popupContainer">
      {props.addingUser
        ? (
          <div className="bg-light w-50 rounded p-5 mt-5 d-flex flex-column">
            <CreateAccountForm sendCreateAccount={sendCreateAccount} />
            <Button className="w-25 mt-4 align-self-center" onClick={closePopup} variant="danger">Cancel</Button>
            {props.showMessage && props.message.head !== 'Success'
              ? (
                <Alert className="mt-5" variant="danger">
                  <Alert.Heading>{props.message.head}</Alert.Heading>
                  <p>{props.message.body}</p>
                </Alert>
              )
              : null}
          </div>
        )
        : (
          <div className="bg-light w-50 rounded p-3 mt-5 d-flex flex-column justify-content-center align-items-center">
            <h3>Are you sure you want to delete user:</h3>
            <h3>{props.userName}</h3>
            <div className="w-50 mt-4 d-flex flex-row justify-content-around">
              <Button className="w-25" onClick={deleteUser} variant="danger">Yes</Button>
              <Button className="w-25" onClick={closePopup} variant="primary">No</Button>
            </div>
          </div>
        )}
    </div>
  );
};

export default Pupup;
