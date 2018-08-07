import React from 'react';

import LoginForm from './components/LoginForm';

export default class App extends React.Component {
  constructor(props) {
    super(props);

  }

  render(){
    return(
      <LoginForm />
    )
  }
}
