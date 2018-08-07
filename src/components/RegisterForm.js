import React from 'react';
import MuiThemeProvider from '@material-ui/core/styles/MuiThemeProvider';
import { AppBar, Button, TextField, Card, CardHeader, Divider, Tabs, Tab, Typography } from '@material-ui/core';
import createMuiTheme from './theme';
const url = "http://localhost:8080";

export default class RegisterForm extends React.Component {
constructor(props){
  super(props);
  this.state={
    email: '',
    username:'',
    password:'',
    passwordconfirm: ''
  }
 }

 clickRegsiter() {
   fetch(url + '/register', {
    method: 'POST',
    credentials: "same-origin",
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      username: this.state.username,
      password: this.state.password,
      email: this.state.email,
      passwordconfirm: this.state.passwordconfirm
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
      this.props.register();
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
          <Card color="blue" className="container" align="center" style={{marginTop: '80px', width: "400px", height:"450px", padding: "40px"}}>
            <AppBar position="static">
              <Typography variant="title" color="inherit" style={{ padding: '20px'}}>
                REGISTER
              </Typography>
            </AppBar>
            <Divider />
          <div style={{margin: '20px'}}>
            <div >
             <TextField
               hinttext="Enter your Email"
               floatinglabeltext="e-mail"
               label="Email"
               onChange = {(event,newValue) => this.setState({email:event.target.value})}
               />
            </div>
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
            <div >
               <TextField
                 type="password"
                 hinttext="Confirm your Password"
                 label="Confirm Password"
                 floatinglabeltext="Password"
                 onChange = {(event,newValue) => this.setState({passwordconfirm:event.target.value})}
                 />
            </div>
               <br/>
             <Divider />
            <div >
               <Button color="primary" style={{margin: 15}} onClick={(event) => this.clickRegsiter(event)}>SUBMIT</Button>
               <Button color="primary" style={{margin: 15}} onClick={(event) => this.props.register(event)}>LOGIN</Button>
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
