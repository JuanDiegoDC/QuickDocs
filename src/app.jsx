import React from 'react';
import LoginForm from './components/LoginForm';
import RegisterForm from './components/RegisterForm';
import DocumentPortal from './components/DocumentPortal';


export default class App extends React.Component {
  constructor(props) {
    super(props);

  }

  render(){
    return(
      <DocumentPortal />
    )
  }
}
