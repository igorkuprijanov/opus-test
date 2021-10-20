import React from 'react';
import Button from 'react-bootstrap/Button';
import Alert from 'react-bootstrap/Alert';
import LogInForm from './LogInForm';
import CreateAccountForm from './CreateAccountForm';
import RestoreAccountForm from './ResotreAccountForm';
import '../App.css';

class LogInPage extends React.Component<{
  hideMessage: ()=>void,
  sendLogin: (data: { email: string, password: string })=>void,
  sendCreateAccount: (data: { email: string, password: string,
    repeatPassword: string })=>void,
  sendResetPassword: (data: { email: string })=>void,
  showMessage: boolean, message: { head: string, body: string } },
{ logIn: boolean, createAccount: boolean, restorePassword: boolean }> {
  private buttonCreate = React.createRef<HTMLButtonElement & Button>();

  private buttonPassword = React.createRef<HTMLButtonElement & Button>();

  private buttonLogin = React.createRef<HTMLButtonElement & Button>();

  constructor(props: { hideMessage: ()=>void,
    sendLogin: (data: { email: string, password: string })=>void,
    sendCreateAccount: (data: { email: string, password: string, repeatPassword: string })=>void,
    sendResetPassword: (data: { email: string })=>void,
    showMessage: boolean, message: { head: string, body: string } }) {
    super(props);
    this.state = {
      logIn: true,
      createAccount: false,
      restorePassword: false,
    };
    this.changeForm = this.changeForm.bind(this);
  }

  sendLogin = (data: { email: string, password: string }) => {
    this.props.sendLogin(data);
  };

  sendCreateAccount = (data: { email: string, password: string, repeatPassword: string }) => {
    this.props.sendCreateAccount(data);
  };

  sendResetPassword = (data: { email: string }) => {
    this.props.sendResetPassword(data);
  };

  changeForm = (e:any) => {
    this.props.hideMessage();
    if (e.target === this.buttonCreate.current) {
      this.setState({
        logIn: false,
        createAccount: true,
        restorePassword: false,
      });
    } else if (e.target === this.buttonPassword.current) {
      this.setState({
        logIn: false,
        createAccount: false,
        restorePassword: true,
      });
    } else if (e.target === this.buttonLogin.current) {
      this.setState({
        logIn: true,
        createAccount: false,
        restorePassword: false,
      });
    }
  };

  render() {
    return (
      <div className="mt-5 d-flex flex-column">
        {this.state.logIn
          ? (
            <div>
              <LogInForm sendLogin={this.sendLogin} />
              <div className="mt-5 d-flex flex-column p-2">
                <Button onClick={this.changeForm} variant="link" ref={this.buttonCreate}>Create an account</Button>
                <Button onClick={this.changeForm} variant="link" ref={this.buttonPassword}>Forgot the password? - Restore password</Button>
              </div>
            </div>
          )
          : null}

        {this.state.createAccount
          ? (
            <div>
              <CreateAccountForm sendCreateAccount={this.sendCreateAccount} />
              <div className="mt-5 d-flex flex-column p-2">
                <Button onClick={this.changeForm} variant="link" ref={this.buttonLogin}>Already have an account? - Log in</Button>
                <Button onClick={this.changeForm} variant="link" ref={this.buttonPassword}>Forgot the password? - Restore password</Button>
              </div>
            </div>
          )
          : null}

        {this.state.restorePassword
          ? (
            <div>
              <RestoreAccountForm sendResetPassword={this.sendResetPassword} />
              <div className="mt-5 d-flex flex-column p-2">
                <Button onClick={this.changeForm} variant="link" ref={this.buttonCreate}>Create an account</Button>
                <Button onClick={this.changeForm} variant="link" ref={this.buttonLogin}>Already have an account? - Log in</Button>
              </div>
            </div>
          )
          : null}
        {this.props.showMessage
          ? (
            <Alert className="mt-5 w-50 align-self-center" variant={this.props.message.head === 'Success' ? 'success' : 'danger'}>
              <Alert.Heading>{this.props.message.head}</Alert.Heading>
              <p>{this.props.message.body}</p>
            </Alert>
          )
          : null}
      </div>
    );
  }
}

export default LogInPage;
