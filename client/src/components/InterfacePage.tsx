import React from 'react';
import Container from 'react-bootstrap/Container';
import Button from 'react-bootstrap/Button';
import User from './User';
import Pupup from './Pupup';

class InterfacePage extends React.Component<{
  isActive:boolean,
  logOut: (name:string) => void,
  deleteUser: (name: string) => void,
  popup: (type: string)=>void,
  addingUser: boolean,
  name: string,
  openPopup: boolean,
  showMessage: boolean,
  message:{ head: string, body:string },
  sendCreateAccount: (data: { email: string, password: string, repeatPassword: string },
    byUser?:boolean)=>void,
  users: Array<Array<{ name:string, logs: Array<string> }>>, },
{ userName: string, currentPage: number }> {
  constructor(props: { isActive: boolean,
    logOut: (name:string) => void,
    users: Array<Array<{ name:string, logs: Array<string> }>>,
    deleteUser: (name: string) => void,
    popup: (type: string)=>void,
    addingUser: boolean,
    deletingUser: boolean,
    name: string,
    openPopup: boolean,
    showMessage: boolean,
    message:{ head: string, body:string },
    sendCreateAccount: (data: { email: string, password: string, repeatPassword: string },
      byUser?:boolean)=>void }) {
    super(props);
    this.state = {
      userName: '',
      currentPage: 0,
    };
    this.popup = this.popup.bind(this);
  }

  popup = (type:string, name?: string) => {
    if (name !== undefined) {
      this.setState({ userName: name });
    }
    this.props.popup(type);
  };

  deleteUser = (name: string) => {
    this.props.deleteUser(name);
  };

  changePage = (e:any) => {
    switch (e.target.innerHTML) {
      case 'Previous':
        this.setState({
          currentPage: this.state.currentPage - 1,
        });
        break;
      case 'Next':
        if (this.state.currentPage < this.props.users.length - 1) {
          this.setState({
            currentPage: this.state.currentPage + 1,
          });
        }
        break;
      default: {
        break;
      }
    }
  };

  logOut = () => {
    this.props.logOut(this.state.userName);
  };

  render() {
    return (
      <div className="mt-5 d-flex flex-column border rounded">
        {this.props.openPopup
          ? (
            <Pupup
              deleteUser={this.deleteUser}
              userName={this.state.userName}
              addingUser={this.props.addingUser}
              showMessage={this.props.showMessage}
              sendCreateAccount={this.props.sendCreateAccount}
              message={this.props.message}
              closePopup={this.popup}
            />
          ) : null}
        <Container>
          <div className="pt-3 mb-5 d-flex justify-content-between">
            <h1>{this.props.name}</h1>
            <Button variant="danger" onClick={this.logOut}>Log out</Button>
          </div>
          <div className="d-flex flex-column border rounded usersContainer">
            {this.props.users[this.state.currentPage].map((user) => (
              <User
                index={(this.props.users[this.state.currentPage].indexOf(user) * (this.state.currentPage + 1)) + 1}  // eslint-disable-line
                isActive={this.props.isActive}
                logs={user.logs}
                currentUser={this.props.name}
                popup={this.popup}
                key={user.name}
                name={user.name}
              />
            ))}
          </div>
          <div className="d-flex flex-row justify-content-center mt-5">
            <Button className="w-25" onClick={(() => { this.popup('add'); })}>Add user</Button>
          </div>
          <div className="d-flex flex-row justify-content-around mt-5 pb-5">
            {this.state.currentPage === 0
              ? <Button variant="secondary" disabled>Previous</Button>
              : <Button variant="primary" onClick={this.changePage}>Previous</Button>}
            <div>
              <p>
                {this.state.currentPage + 1}
                /
                {this.props.users.length}
              </p>
            </div>
            {this.state.currentPage === this.props.users.length - 1
              ? <Button variant="secondary" disabled>Next</Button>
              : <Button variant="primary" onClick={this.changePage}>Next</Button>}
          </div>
        </Container>
      </div>
    );
  }
}

export default InterfacePage;
