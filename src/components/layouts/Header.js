import React from 'react';
import { AppBar, Toolbar, IconButton, Typography, Button, Dialog, DialogTitle, DialogActions, DialogContent, DialogContentText, TextField  } from '@material-ui/core';
import MenuIcon from '@material-ui/icons/Menu';
import CreateIcon from '@material-ui/icons/create';

class Header extends React.Component {
  constructor(props){
    super(props)
  }

  // updatedocTitle(e){
  //   console.log(e.target.value)
  //   this.setState({
  //     docTitle: e.target.value
  //   }, () => {console.log(this.state)});
  //
  // }
  //
  // updateDocPass(e){
  //   console.log(e.target.value)
  //   this.setState({
  //     docPass: e.target.value
  //   }, () => {console.log(this.state)});
  // }

  render(){
    return(
      <div>
      <AppBar position="static">
        <Toolbar>
          <IconButton color="inherit" aria-label="Menu" style={{marginLeft: "-10px", marginRight: "20px"}}>
            <MenuIcon />
          </IconButton>
          <Typography variant="title" color="inherit">
            Documents Portal
          </Typography>
          <div style={{position: "absolute", right: 0}}>
            <Button onClick={() => this.props.openCreateDocument()} color="inherit" style={{marginLeft: "150px"}}>
              <CreateIcon /> Create Document
            </Button>
                  <Dialog
                title="Dialog With Actions"
                open={this.props.dialogCreateOpen}

                  >
                  <DialogTitle id="form-dialog-title"> Create Document </DialogTitle>
                  <DialogContent>
                    {/* <DialogContentText>
                      Please enter Document Name:
                    </DialogContentText> */}
                    <TextField
                  autoFocus
                  margin="dense"
                  id="docTitle"
                  label="Document Name"
                  type="text"
                  fullWidth
                  onChange={(e)=>this.props.updatedocTitle(e)}
                    />
                    {/* <DialogContentText>
                      Please enter password:
                    </DialogContentText> */}
                    <TextField
                  margin="dense"
                  id="docPassword"
                  label="Password"
                  type="password"
                  fullWidth
                  onChange={(e)=>this.props.updateDocPass(e)}
                    />
                  </DialogContent>
                  <DialogActions>
                    <Button onClick={(e) => this.props.createDocument(e)} color="primary">
                      Create
                    </Button>
                    <Button color="primary" onClick={() => this.props.closeCreateDocument()}>
                      Cancel
                    </Button>
                  </DialogActions>
                </Dialog>
          <Button color="inherit" style={{marginLeft: "20px"}}>
            LOGOUT
          </Button>
          </div>
        </Toolbar>
      </AppBar>
    </div>
    )
  }
}

export default Header;
