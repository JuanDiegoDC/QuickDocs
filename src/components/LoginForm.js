import React from 'react';
import MuiThemeProvider from '@material-ui/core/styles/MuiThemeProvider';
import { AppBar, Button, TextField, Card, CardHeader, Divider, Tabs, Tab } from '@material-ui/core';
import createMuiTheme from './theme'

export default class LoginForm extends React.Component {
constructor(props){
  super(props);
  this.state={
    username:'',
    password:''
  }
 }
render() {
    return (
      <div className="form-group" >
        <MuiThemeProvider theme={createMuiTheme}>
          <Card color="blue" className="container" align="center" style={{marginTop: '80px', width: "400px", height:"400px", padding: "40px"}}>
            <AppBar position="static">
              <Tabs >
                <Tab label="LOGIN" />
              </Tabs>
            </AppBar>

            <CardHeader
            title="LOGIN"
            />
            <Divider />
          <div style={{margin: '20px'}}>
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
               <br/>
             <Divider />
            <div >
               <Button style={{margin: 15}} onClick={(event) => this.handleClick(event)}>SUBMIT</Button>
               <Button style={{margin: 15}} onClick={(event) => this.handleClick(event)}>REGISTER</Button>
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
