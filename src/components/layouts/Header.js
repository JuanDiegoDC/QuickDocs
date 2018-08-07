import React from 'react';
import { AppBar, Toolbar, IconButton, Typography, Button } from '@material-ui/core';
import MenuIcon from '@material-ui/icons/Menu';

class Header extends React.Component {
  constructor(props){
    super(props)

  }

  render(){
    return(
      <AppBar position="static">
        <Toolbar>
          <IconButton color="inherit" aria-label="Menu">
            <MenuIcon />
          </IconButton>
          <Typography variant="title" color="inherit">
            Documents Portal
          </Typography>
          <Button color="inherit">
            LOGOUT
          </Button>
        </Toolbar>
      </AppBar>

    )
  }
}
