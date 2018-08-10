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
      socket: null,
      user: ''
    }
  }


  login(user){
    console.log(user.username, "has logged in!");
    this.setState({
      loggedIn: true,
      user: user
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
          <DocumentPortal user={this.state.user}/>
          :
          this.state.register ?
          <RegisterForm register={() => this.register()} />
          :
          <LoginForm register={() => this.register()} login={(user) => this.login(user)} logout={() => this.logout()} />
         }
      </div>
    )
  }
}
