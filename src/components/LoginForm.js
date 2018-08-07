import React from 'react';
import MuiThemeProvider from '@material-ui/core/styles/MuiThemeProvider';
<<<<<<< HEAD
import { AppBar, Button, TextField, Card, CardHeader, Divider, Tabs, Tab } from '@material-ui/core';
import createMuiTheme from './theme';
import axios from "axios";
const url = "http://localhost:8080";
=======
import { AppBar, Button, TextField, Card, CardHeader, Divider, Tabs, Tab, Typography } from '@material-ui/core';
import createMuiTheme from './theme'
>>>>>>> 5c518e270f21d0313ebe04a647c6813e00ab0bdd

export default class LoginForm extends React.Component {
constructor(props){
  super(props);
  this.state={
    username:'',
    password:''
  }
 }

 login(event) {
   console.log(this.state.username, this.state.password);
   console.log("login");
   fetch(url + '/login', {
    method: 'POST',
    credentials: "same-origin",
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      username: this.state.username,
      password: this.state.password,
    }),
  })
  .then((res) => {console.log(res); if(res.status !== 200) {
    return res.text();
  } else {
    return res.json()
  }})
  .then((resJson) => {
    console.log(resJson);
    if (resJson.success) {
      console.log("Success is true");
      this.props.login();
    }
  })
  .catch((err) => {
    console.log(err);
  })
 }
render() {
    return (
      <div className="form-group" >
        <MuiThemeProvider theme={createMuiTheme}>
          <Card color="blue" className="container" align="center" style={{marginTop: '80px', width: "400px", height:"350px", padding: "40px"}}>
            <AppBar position="static">
              <Typography variant="title" color="inherit" style={{padding: '20px'}}>
                LOGIN
              </Typography>
            </AppBar>
            <Divider />
          <div style={{margin: '20px'}}>
            <div >
             <TextField
               hinttext="Enter your Username"
               floatinglabeltext="Username"
               label="Username"
               onChange = {(event,newValue) => this.setState({username:event.target.value})}
               />
            </div>
            <div >
               <TextField
                 type="password"
                 hinttext="Enter your Password"
                 label="Password"
                 floatinglabeltext="Password"
                 onChange = {(event,newValue) => this.setState({password:event.target.value})}
                 />
            </div>
               <br/>
             <Divider />
            <div >
<<<<<<< HEAD
               <Button style={{margin: 15}} onClick={(event) => this.login(event)}>SUBMIT</Button>
               <Button style={{margin: 15}} onClick={(event) => this.handleClick(event)}>REGISTER</Button>
=======
               <Button color="primary" style={{margin: 15}} onClick={(event) => this.handleClick(event)}>SUBMIT</Button>
               <Button color="primary" style={{margin: 15}} onClick={(event) => this.handleClick(event)}>REGISTER</Button>
>>>>>>> 5c518e270f21d0313ebe04a647c6813e00ab0bdd
            </div>
         </div>
       </Card>
         </MuiThemeProvider>
      </div>
    );
  }
}
const style = {
 margin: 15,
};
