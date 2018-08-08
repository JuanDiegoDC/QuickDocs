import React from 'react';
import { AppBar, Toolbar, IconButton, Typography, Button } from '@material-ui/core';
import MenuIcon from '@material-ui/icons/Menu';
import CreateIcon from '@material-ui/icons/create';

class Header extends React.Component {
  constructor(props){
    super(props)

  }

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
          <Button onClick={() => this.props.editToggle()} color="inherit" style={{marginLeft: "150px"}}>
            <CreateIcon /> Create Document
          </Button>
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
