import React from 'react';
import LoginForm from './components/LoginForm';


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
      <div>
        {this.state.loggedIn ?
          <p>Logged in!</p>
          :
          <LoginForm register={() => this.register()} login={() => this.login()} logout={() => this.logout()} />
         }

      </div>
    )
  }
}
