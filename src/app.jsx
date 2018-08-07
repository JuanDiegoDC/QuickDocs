import React from 'react';
import Button from '@material-ui/core/Button';
import io from "socket.io-client";
import {Editor, EditorState, RichUtils, convertToRaw} from 'draft-js';
import PropTypes from 'prop-types';
import { GithubPicker } from 'react-color';
import { withStyles } from '@material-ui/core/styles';
import SizeMenu from "./components/SizeMenu.js";
import AlignMenu from "./components/AlignMenu.js";
import createStyles from 'draft-js-custom-styles';

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      editorState: EditorState.createEmpty(),
      showColorPicker: false,
      editorColor: "black",
      size: 50,
      fontWeight: 'normal',
      textDecoration: 'none',
      textAlign: 'left'
    };
    this.focus = () => this.refs.editor.focus()
    this.onChange = (editorState) => this.setState({editorState});
    this.updateEditorState = editorState => this.setState({ editorState });
  }

  componentDidMount() {
    const socket = io('http://localhost:8080');
    socket.on('connect', function() {
      console.log('ws connect')
    });
    socket.on('disconnect', function() {
      console.log('ws disconnect')
    });
    socket.on('msg', function(data) {
      console.log('ws msg:', data);
      socket.emit('cmd', {foo: 123})
    });
  }

  toggleFontSize = fontSize => {
    this.setState({
      size: fontSize
    });
  };

  _onBoldClick(e) {
    e.preventDefault()
    this.onChange(RichUtils.toggleInlineStyle(this.state.editorState, 'size48'));
  }

  _onItalicClick(e){
    e.preventDefault();
    this.onChange(RichUtils.toggleInlineStyle(this.state.editorState, 'ITALIC'));
  }

  _onUnderlineClick(e){
    e.preventDefault();
    this.onChange(RichUtils.toggleInlineStyle(this.state.editorState, 'UNDERLINE'));
  }

  _onColorClick(e){
    e.preventDefault();
    this.setState({
      showColorPicker: !this.state.showColorPicker
    });
  }

  _onBulletedClick(e){
    e.preventDefault();
    this.onChange(RichUtils.toggleBlockType(this.state.editorState, 'unordered-list-item'))
  }

  _onNumberedClick(e){
    e.preventDefault();
    this.onChange(RichUtils.toggleBlockType(this.state.editorState, 'ordered-list-item'))
  }


  handleColorChange(color, e) {
    e.preventDefault();
    console.log(color);
    this.setState({
      editorColor: color.hex,
      showColorPicker: false
    });
    console.log(this.state.editorColor);
  }

  toggleAlignment(e){
    e.preventDefault();
    console.log(e.target.value);
    let x = e.target.value;
    if (x === 0) {
      this.state.textAlign = 'center';
    } else if (x === 1) {
      this.state.textAlign = 'right';
    } else if (x === 2) {
      this.state.textAlign = 'left';
    }
    console.log(this.state.textAlign);
  }

  addFontSize(size) {
    console.log(size);
    this.focus();
    this.onChange(RichUtils.toggleInlineStyle(this.state.editorState, size));
  };

  render() {
    const editorStyle = {
      backgroundColor: "#f2f2f2",
      minHeight: "100vh",
      padding: "10px",
      margin: "20px",
      color: this.state.editorColor,
      fontSize: this.state.size,
      fontWeight: this.state.fontWeight,
      fontStyle: this.state.fontStyle,
      textDecoration: this.state.textDecoration,
      textAlign: this.state.textAlign
    }
    const colors = ['#fff', '#000', '#B80000', '#DB3E00', '#FCCB00', '#008B02', '#006B76', '#1273DE'];
    return (<div>
      <h1>Welcome to this editor!</h1>
      <div id="buttonWrapper">
        <Button variant="outlined" style={{fontWeight: "bold"}} onMouseDown={(e) => this._onBoldClick(e)}>BOLD</Button>
        <Button variant="outlined" style={{fontStyle: "italic"}} onMouseDown={(e) => this._onItalicClick(e)}>ITALIC</Button>
        <Button variant="outlined" style={{textDecoration: "underline"}} onMouseDown={(e) => this._onUnderlineClick(e)}>UNDERLINE</Button>
        <Button variant="outlined" onMouseDown={(e) => this._onColorClick(e)}>COLOR</Button>
        <SizeMenu setCurrentSize={(e) => this.toggleFontSize(e)} />
        <AlignMenu setAlignment={(e) => this.toggleAlignment(e)} />
        <Button variant="outlined" style={{textDecoration: 'underline'}} onMouseDown={(e) => this._onBulletedClick(e)}>BULLETED LIST</Button>
        <Button variant="outlined" style={{textDecoration: 'underline'}} onMouseDown={(e) => this._onNumberedClick(e)}>NUMBERED LIST</Button>
      </div>
      <div>
        {this.state.showColorPicker ? <div style={{position: "absolute", left: "275px"}}><GithubPicker colors={colors} onChange={(color, e) => this.handleColorChange(color, e)}/></div> : <div></div>}
      </div>
      <div style={editorStyle}>
        <Editor ref='editor' editorState={this.state.editorState} onChange={(editorState)=>this.onChange(editorState)}/>
      </div>
    </div>);
  }
}
