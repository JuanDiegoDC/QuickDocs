import React from 'react';
import MuiThemeProvider from '@material-ui/core/styles/MuiThemeProvider';
import AppBar from '@material-ui/core/AppBar';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Card from '@material-ui/core/Card';
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
      <div>
        <MuiThemeProvider theme={createMuiTheme}>
          <Card className="container" align="center">
          <div >
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
            <div >
               <Button primary={true} style={{margin: 15}} onClick={(event) => this.handleClick(event)}>Submit</Button>
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
