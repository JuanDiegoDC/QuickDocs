import React from 'react';
import LoginForm from './components/LoginForm';
import RegisterForm from './components/RegisterForm';
import DocumentPortal from './components/DocumentPortal';


export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loggedIn: false,
      register: false
    }
  }

  login(){
    console.log("Login called");
    this.setState({
      loggedIn: true
    });
  }

  logout(){
    this.setState({
      loggedIn: false
    });
  }

  register(){
    this.setState({
      register: !this.state.register
    });
  }

  render(){
    return(
<<<<<<< HEAD
      <DocumentPortal />
=======
      <div>
        {this.state.loggedIn ?
          <p>Logged in!</p>
          :
          <LoginForm register={() => this.register()} login={() => this.login()} logout={() => this.logout()} />
         }

      </div>
>>>>>>> f44a0c35c68c7f1a024e19d575f5d908e6c11077
    )
  }
}
