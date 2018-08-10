import React from 'react';
import { AppBar, Toolbar, IconButton, Typography, Button } from '@material-ui/core';
import MenuIcon from '@material-ui/icons/Menu';
import FolderIcon from '@material-ui/icons/Folder';
import SaveIcon from '@material-ui/icons/Save';

class HeaderEditor extends React.Component {
  constructor(props){
    super(props)
  }

  componentDidMount(){
    console.log(this.props)
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
            {this.props.title}
          </Typography>
          <div style={{position: "absolute", right: 0}}>
          <Button onClick={(e) => this.props.saveDocument(e)} color="inherit" style={{marginLeft: "150px"}}>
            <SaveIcon /> Save
          </Button>
          <Button onClick={(e) => this.props.goBack(e)} color="inherit" style={{marginLeft: "150px"}}>
            <FolderIcon /> My Documents
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

export default HeaderEditor;
