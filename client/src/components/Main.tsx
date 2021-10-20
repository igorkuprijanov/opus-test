import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import LogInPage from './LogInPage';
import InterfacePage from './InterfacePage';

class Main extends React.Component<{}, {
  usersOnPage: number,
  isActive: boolean,
  isLoading: boolean,
  sortedUsers: Array<Array<{ name:string, logs:Array<string> }>>,
  unsortedUsers: Array<{ name:string, logs:Array<string> }>,
  isLoggedIn: boolean,
  addingUser: boolean,
  user:string,
  showMessage: boolean,
  message: { head: string, body: string },
  openPopup: boolean }> {
  constructor(props: any) {
    super(props);
    this.state = {
      isLoggedIn: false,
      user: '',
      showMessage: false,
      message: { body: '', head: '' },
      openPopup: false,
      addingUser: false,
      unsortedUsers: [],
      sortedUsers: [],
      isLoading: false,
      isActive: false,
      usersOnPage: 6,

    };
    this.sendData = this.sendData.bind(this);
    this.sendLogin = this.sendLogin.bind(this);
    this.sendCreateAccount = this.sendCreateAccount.bind(this);
    this.sendResetPassword = this.sendResetPassword.bind(this);
  }

  async componentDidMount() {
    const refreshToken = localStorage.getItem('refreshToken');
    if (refreshToken) {
      this.setState({ isLoading: true });
      try {
        await fetch('http://localhost:4000/refresh',
          {
            method: 'POST',
            mode: 'cors',
            headers: new Headers({
              'Content-Type': 'application/json',
            }),
            body: JSON.stringify({ refreshToken }),
          })
          .then((response) => {
            if (response.ok) {
              return response.json()
                .then(async (json) => {
                  await this.getAllUsers(json.newTokens.accessToken);
                  localStorage.setItem('token', json.newTokens.accessToken);
                  localStorage.setItem('refreshToken', json.newTokens.refreshToken);
                  this.setState({
                    isActive: json.user.isActive, isLoggedIn: true, user: json.user.email.toString(), showMessage: false, message: { head: '', body: '' },
                  });
                });
            } if (!response.ok) {
              throw Error(response.statusText);
            }
          });
      } catch (error) {
        console.log(error);  // eslint-disable-line
      } finally {
        this.setState({ isLoading: false });
      }
    }
  }

  sendData = async (data:any, url:string, method: string) => {
    const response: any = await fetch(`http://localhost:4000/${url}`,
      {
        method,
        mode: 'cors',
        headers: this.requestInterceptor(),
        credentials: 'include',
        body: JSON.stringify(data),
      })
      .then(async (res) => {
        if (res.status === 401) {
          console.log(Error(res.statusText)); // eslint-disable-line
          const newData:any = await this.responseInterceptor(data, url, method)
            .then((interceptorResponse) => interceptorResponse);
          return newData;
        }
        return res.json().then((json: any) => json);
      });
    return response;
  };

  requestInterceptor = () => {
    const token = localStorage.getItem('token');
    if (!token) {
      return new Headers({
        'Content-Type': 'application/json',
      });
    }
    return new Headers({
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    });
  };

  responseInterceptor = async (data:any, url:string, method:string) => {
    const refreshToken = localStorage.getItem('refreshToken');
    const token = localStorage.getItem('token');
    try {
      await fetch('http://localhost:4000/refresh',
        {
          method: 'POST',
          mode: 'cors',
          headers: new Headers({
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          }),
          body: JSON.stringify({ refreshToken }),
        })
        .then((response) => {
          if (response.ok) {
            return response.json()
              .then(async (json) => {
                localStorage.setItem('token', json.newTokens.accessToken);
                localStorage.setItem('refreshToken', json.newTokens.refreshToken);
              });
          } if (!response.ok) {
            throw Error(response.statusText);
          }
        });
    } catch (error) {
      console.log(error); // eslint-disable-line
    }
    const interceptorResponse = await this.sendData(data, url, method);
    return interceptorResponse;
  };

  sendLogin = async (data: { email: string, password: string }) => {
    const response = await this.sendData(data, 'login', 'POST');
    if (response.status) {
      await this.getAllUsers(response.accessToken);
      localStorage.setItem('token', response.accessToken);
      localStorage.setItem('refreshToken', response.refreshToken);
      this.setState({
        isActive: response.data.isActive,
        isLoggedIn: true,
        user: response.data.email.toString(),
        showMessage: false,
        message: { head: '', body: '' },
      });
    } else if (!response.status) {
      this.setState({
        showMessage: true,
        message: { head: response.data.head, body: response.data.body },
      });
    }
  };

  sendCreateAccount = async ( data: { email: string, password: string, repeatPassword: string }, byUser?:boolean) => {  // eslint-disable-line
    if (data.password === data.repeatPassword) {
      const destination = (() => (byUser ? 'addUser' : 'registration'))();
      const response = await this.sendData(data, destination, 'POST');
      if (response.status) {
        if (this.state.openPopup) {
          this.setState({
            openPopup: false,
            unsortedUsers: [...this.state.unsortedUsers, { name: data.email, logs: [] }],
            sortedUsers: this.sortUsers([...this.state.unsortedUsers, { name: data.email, logs: [] }]), // eslint-disable-line
          });
        }
        this.setState({
          showMessage: true,
          message: { head: response.data.head, body: response.data.body },
        });
      } else if (!response.status) {
        this.setState({
          showMessage: true,
          message: { head: response.data.head, body: response.data.body },
        });
      }
    } else {
      this.setState({
        showMessage: true,
        message: { head: 'Passwords dont match', body: 'Check that both password fields are the same.' },
      });
    }
  };

  deleteUser = async (name: string) => {
    if (name === this.state.user) {
      this.logOut();
    }

    await this.sendData({ email: name }, 'delete', 'DELETE')
      .then((response) => {
        if (!response.status) {
          alert('Could not delete user, please try again'); // eslint-disable-line
        } else {
          this.popup('delete');
          const newUsers = this.state.unsortedUsers;
          const user:any = newUsers.find((userData) => (userData.name === name ? userData : null));
          if (user) {
            const userIndex = newUsers.indexOf(user);
            newUsers.splice(userIndex, 1);
          }
          this.setState({
            unsortedUsers: newUsers,
            sortedUsers: this.sortUsers(newUsers),
          });
        }
      });
  };

  getAllUsers = async (token:string) => {
    try {
      await fetch('http://localhost:4000/users',
        {
          method: 'GET',
          mode: 'cors',
          headers: new Headers({
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          }),
        })
        .then((response) => {
          if (response.ok) {
            return response.json()
              .then((json) => {
                this.setState({
                  unsortedUsers: json,
                  sortedUsers: this.sortUsers(json),
                });
              });
          } if (!response.ok) {
            throw Error(response.statusText);
          }
        });
    } catch (error) {
      console.log(error);  // eslint-disable-line
    }
  };

  logOut = async () => {
    const refreshToken = localStorage.getItem('refreshToken');
    await this.sendData({ refreshToken }, 'logout', 'POST');
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    this.setState({ isLoggedIn: false, showMessage: false, message: { head: '', body: '' } });
  };

  sendResetPassword = async (data: { email: string }) => {
    const response = await this.sendData(data, 'restore', 'POST');
    this.setState({
      showMessage: true,
      message: { head: response.data.head, body: response.data.body },
    });
  };

  hideMessage = () => {
    this.setState({
      showMessage: false,
    });
  };

  sortUsers = (data: Array<{ name:string, logs:Array<string> }>) => {
    const newUsers: Array<Array<{ name:string, logs:Array<string> }>> = [];
    for (let i = 0; i < data.length; i += 1) {
      const { usersOnPage } = this.state;
      const sliceableArray = data.slice(i * usersOnPage, usersOnPage * (i + 1));
      if (sliceableArray.length > 0) { newUsers.push(sliceableArray); }
    }
    return newUsers;
  };

  popup = (type: string) => {
    if (type === 'add') {
      this.setState({
        openPopup: !this.state.openPopup,
        addingUser: true,
        showMessage: false,
        message: { head: '', body: '' },
      });
    } else {
      this.setState({
        openPopup: !this.state.openPopup,
        addingUser: false,
      });
    }
  };

  render() {
    return (
      <div className="App">
        {this.state.isLoading ? <p>Loading...</p>
          : (
            <Container>
              <Row>
                <Col />
                <Col md={8}>
                  {this.state.isLoggedIn
                    ? (
                      <InterfacePage
                        isActive={this.state.isActive}
                        logOut={this.logOut}
                        users={this.state.sortedUsers}
                        deleteUser={this.deleteUser}
                        addingUser={this.state.addingUser}
                        popup={this.popup}
                        openPopup={this.state.openPopup}
                        showMessage={this.state.showMessage}
                        sendCreateAccount={this.sendCreateAccount}
                        message={this.state.message}
                        name={this.state.user}
                      />
                    )
                    : (
                      <LogInPage
                        hideMessage={this.hideMessage}
                        showMessage={this.state.showMessage}
                        message={this.state.message}
                        sendLogin={this.sendLogin}
                        sendCreateAccount={this.sendCreateAccount}
                        sendResetPassword={this.sendResetPassword}
                      />
                    )}
                </Col>
                <Col />
              </Row>
            </Container>
          )}
      </div>
    );
  }
}

export default Main;
