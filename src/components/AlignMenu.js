import React from 'react';
import Button from '@material-ui/core/Button';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';

class SizeMenu extends React.Component {
  state = {
    anchorEl: null,
  };

  handleClick = event => {
    this.setState({ anchorEl: event.currentTarget });
  };

  handleClose = () => {
    this.setState({ anchorEl: null });
  };

  render() {
    const { anchorEl } = this.state;

    return (
      <span>
        <Button
          variant="outlined"
          aria-owns={anchorEl ? 'simple-menu' : null}
          aria-haspopup="true"
          onClick={this.handleClick}
        >
          Font Size
        </Button>
        <Menu
          id="simple-menu"
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={this.handleClose}
        >
          <MenuItem value={12} onClick={(e) => {this.props.setCurrentSize(e); this.handleClose()}}>12</MenuItem>
          <MenuItem value={14} onClick={(e) => {this.props.setCurrentSize(e); this.handleClose()}}>14</MenuItem>
          <MenuItem value={14} onClick={(e) => {this.props.setCurrentSize(e); this.handleClose()}}>14</MenuItem>
        </Menu>
      </span>
    );
  }
}

export default SizeMenu;
