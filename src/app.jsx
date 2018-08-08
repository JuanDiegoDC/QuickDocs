import React from 'react';
import LoginForm from './components/LoginForm';
import RegisterForm from './components/RegisterForm';
import DocumentPortal from './components/DocumentPortal';
import TextEditor from './components/TextEditor';


export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loggedIn: false,
      register: false,
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
      <div>
        {this.state.loggedIn ?
          <DocumentPortal />
          :
          this.state.register ?
          <RegisterForm register={() => this.register()} />
          :
          <LoginForm register={() => this.register()} login={() => this.login()} logout={() => this.logout()} />
         }
      </div>
    )
  }
}
