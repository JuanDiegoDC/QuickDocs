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
          <MenuItem value='12px' onMouseDown={(e) => {this.props.setCurrentSize(e.target.value); this.handleClose()}}>12</MenuItem>
          <MenuItem value='14px' onMouseDown={(e) => {this.props.setCurrentSize(e.target.value); this.handleClose()}}>14</MenuItem>
          <MenuItem value='16px' onMouseDown={(e) => {this.props.setCurrentSize(e.target.value); this.handleClose()}}>16</MenuItem>
          <MenuItem value='18px' onMouseDown={(e) => {this.props.setCurrentSize(e.target.value); this.handleClose()}}>18</MenuItem>
          <MenuItem value='24px' onMouseDown={(e) => {this.props.setCurrentSize(e.target.value); this.handleClose()}}>24</MenuItem>
          <MenuItem value='32px' onMouseDown={(e) => {this.props.setCurrentSize(e.target.value); this.handleClose()}}>32</MenuItem>
        </Menu>
      </span>
    );
  }
}

export default SizeMenu;
