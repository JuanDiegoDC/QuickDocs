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
          <MenuItem onMouseDown={() => {this.props.setCurrentSize("size12"); this.handleClose()}}>12</MenuItem>
          <MenuItem onMouseDown={() => {this.props.setCurrentSize("size14"); this.handleClose()}}>14</MenuItem>
          <MenuItem onMouseDown={() => {this.props.setCurrentSize("size16"); this.handleClose()}}>16</MenuItem>
          <MenuItem onMouseDown={() => {this.props.setCurrentSize("size18"); this.handleClose()}}>18</MenuItem>
          <MenuItem onMouseDown={() => {this.props.setCurrentSize("size24"); this.handleClose()}}>24</MenuItem>
          <MenuItem onMouseDown={() => {this.props.setCurrentSize("size32"); this.handleClose()}}>32</MenuItem>
          <MenuItem onMouseDown={() => {this.props.setCurrentSize("size48"); this.handleClose()}}>48</MenuItem>
        </Menu>
      </span>
    );
  }
}

export default SizeMenu;
