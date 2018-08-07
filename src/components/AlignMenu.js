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
          Text Alignment
        </Button>
        <Menu
          id="simple-menu"
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={this.handleClose}
        >
          <MenuItem value='0' onMouseDown={(e) => {this.props.setAlignment(e); this.handleClose()}}>Center</MenuItem>
          <MenuItem value='1' onMouseDown={(e) => {this.props.setAlignment(e); this.handleClose()}}>Left</MenuItem>
          <MenuItem value='2' onMouseDown={(e) => {this.props.setAlignment(e); this.handleClose()}}>Right</MenuItem>
        </Menu>
      </span>
    );
  }
}

export default AlignMenu;
