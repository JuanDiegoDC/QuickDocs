import React from 'react';
import Button from '@material-ui/core/Button';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';

class AlignMenu extends React.Component {
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
          <MenuItem onClick={(e) => {this.props.onLeftClick(e); this.handleClose()}}>Left</MenuItem>
          <MenuItem onClick={(e) => {this.props.onRightClick(e); this.handleClose()}}>Right</MenuItem>
          <MenuItem onClick={(e) => {this.props.onCenterClick(e); this.handleClose()}}>Center</MenuItem>
        </Menu>
      </span>
    );
  }
}

export default AlignMenu;
