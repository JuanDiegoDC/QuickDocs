import React from 'react';
import Button from '@material-ui/core/Button';
import io from "socket.io-client";
import { Editor, EditorState, RichUtils } from 'draft-js';

export default class App extends React.Component {
  constructor(props) {
  super(props);
  this.state = {editorState: EditorState.createEmpty()};
  this.onChange = (editorState) => this.setState({editorState});
}

componentDidMount() {
  const socket = io('http://localhost:8080');
  socket.on('connect', function(){console.log('ws connect')});
  socket.on('disconnect', function(){console.log('ws disconnect')});
  socket.on('msg', function(data){
    console.log('ws msg:', data);
    socket.emit('cmd', {foo:123})
  });
}

_onBoldClick(e) {
  e.preventDefault()
  this.onChange(RichUtils.toggleInlineStyle(this.state.editorState, 'BOLD'));
}

  render() {
    return (<div>
      <h1>Welcome to this editor!</h1>
      <Button onMouseDown={(e) => this._onBoldClick(e)}>BOLD</Button>
      <Editor
        editorState={this.state.editorState}
        onChange={this.onChange}
      />
    </div>);
  }
}
