import React from 'react';
import { Button,
  Menu,
  MenuItem
 } from '@material-ui/core';
import { FormatAlignCenter,
  FormatAlignJustify,
  FormatAlignLeft,
  FormatAlignRight
} from '@material-ui/icons'

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
      <div>
        <Button
          variant={'contained'}
          color={'default'}
          onMouseDown={(e, align) => {this.props.setAlignment(e, 'left')}}
        >
          <FormatAlignLeft />
        </Button>
        <Button
          variant={'contained'}
          color={'default'}
          onMouseDown={(e, align) => {this.props.setAlignment(e, 'center')}}
        >
          <FormatAlignCenter />
        </Button>
        <Button
          variant={'contained'}
          color={'default'}
          onMouseDown={(e, align) => {this.props.setAlignment(e, 'right')}}
        >
          <FormatAlignRight />
        </Button>
        <Button
          variant={'contained'}
          color={'default'}
          onMouseDown={(e, align) => {this.props.setAlignment(e, 'justify')}}
        >
          <FormatAlignJustify />
        </Button>
      </div>
    );
  }
}

export default AlignMenu;
