import React from 'react';
import MuiThemeProvider from '@material-ui/core/styles/MuiThemeProvider';
import { AppBar, Button, TextField, Card, CardHeader, Divider, Tabs, Tab, Typography } from '@material-ui/core';
import createMuiTheme from './theme'

export default class RegisterForm extends React.Component {
constructor(props){
  super(props);
  this.state={
    email: '',
    username:'',
    password:'',
    confirmPassword: ''
  }
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
               label="Username"
               onChange = {(event,newValue) => this.setState({email:newValue})}
               />
            </div>
            <div >
             <TextField
               hinttext="Enter your Username"
               floatinglabeltext="Username"
               label="Username"
               onChange = {(event,newValue) => this.setState({username:newValue})}
               />
            </div>
            <div >
               <TextField
                 type="password"
                 hinttext="Enter your Password"
                 label="Password"
                 floatinglabeltext="Password"
                 onChange = {(event,newValue) => this.setState({password:newValue})}
                 />
            </div>
            <div >
               <TextField
                 type="password"
                 hinttext="Confirm your Password"
                 label="Confirm Password"
                 floatinglabeltext="Password"
                 onChange = {(event,newValue) => this.setState({confirmPassword:newValue})}
                 />
            </div>
               <br/>
             <Divider />
            <div >
               <Button color="primary" style={{margin: 15}} onClick={(event) => this.handleClick(event)}>SUBMIT</Button>
               <Button color="primary" style={{margin: 15}} onClick={(event) => this.handleClick(event)}>LOGIN</Button>
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
