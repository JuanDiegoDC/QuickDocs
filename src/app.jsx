import React from 'react';
import Button from '@material-ui/core/Button';
import io from "socket.io-client";
import {Editor, EditorState, RichUtils} from 'draft-js';
import PropTypes from 'prop-types';
import { GithubPicker } from 'react-color';
import { withStyles } from '@material-ui/core/styles';
import SizeMenu from "./components/SizeMenu.js";
import AlignMenu from "./components/AlignMenu.js";

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      editorState: EditorState.createEmpty(),
      showColorPicker: false,
      editorColor: "black",
      currentSize: 50
    };
    this.onChange = (editorState) => this.setState({editorState});
    this.focus = () => this.refs.editor.focus();
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

  _onBoldClick(e) {
    e.preventDefault()
    this.onChange(RichUtils.toggleInlineStyle(this.state.editorState, 'BOLD'));
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

  handleColorChange(color, e) {
    e.preventDefault();
    console.log(color);
    this.setState({
      editorColor: color.hex,
      showColorPicker: false
    });
  }

  _onSizeClick(e){
    e.preventDefault();
    this.onChange(RichUtils.toggleInlineStyle(this.state.editorState, 'SIZE'));
  }

  _onLeftClick(e){
    e.preventDefault();
    this.onChange(RichUtils.toggleInlineStyle(this.state.editorState, 'left'));
  }

  _onRightClick(e){
    e.preventDefault();
    this.onChange(RichUtils.toggleInlineStyle(this.state.editorState, 'right'));
  }

  _onCenterClick(e){
    e.preventDefault();
    this.onChange(RichUtils.toggleInlineStyle(this.state.editorState, 'center'));
  }

  setCurrentSize(e) {
    e.preventDefault();
    e.stopPropagation();
    this.focus();
    console.log("Called", typeof e.target.value);
    var s = this.state.editorState;
    console.log(this.state.editorState);
    this.setState({
      currentSize: e.target.value
    }, () => {
      this.onChange(RichUtils.toggleInlineStyle(this.state.editorState, 'SIZE'));
    });
  }

  render() {
    const editorStyle = {
      backgroundColor: "#f2f2f2",
      minHeight: "100vh",
      padding: "10px",
      margin: "20px",
      color: this.state.editorColor
    }
    let customStyles = {
      "SIZE": {
        fontSize: 50
      }
    }
    const colors = ['#fff', '#000', '#B80000', '#DB3E00', '#FCCB00', '#008B02', '#006B76', '#1273DE'];
    return (<div onClick={() => this.focus()}>
      <h1>Welcome to this editor!</h1>
      <div id="buttonWrapper">
        <Button variant="outlined" style={{fontWeight: "bold"}} onMouseDown={(e) => this._onBoldClick(e)}>BOLD</Button>
        <Button variant="outlined" style={{fontStyle: "italic"}} onMouseDown={(e) => this._onItalicClick(e)}>ITALIC</Button>
        <Button variant="outlined" style={{textDecoration: "underline"}} onMouseDown={(e) => this._onUnderlineClick(e)}>UNDERLINE</Button>
        <Button variant="outlined" onMouseDown={(e) => this._onColorClick(e)}>COLOR</Button>
        <Button variant="outlined" onMouseDown={(e) => this._onSizeClick(e)}>Size test</Button>
        <SizeMenu setCurrentSize={(e) => this.setCurrentSize(e)} />
        <AlignMenu onLeftClick={(e) => this._onLeftClick(e)} onRightClick={(e) => this._onRightClick(e)} onCenterClick={(e) => this._onCenterClick(e)}/>
      </div>
      <div>
        {this.state.showColorPicker ? <div style={{position: "absolute", left: "275px"}}><GithubPicker colors={colors} onChange={(color, e) => this.handleColorChange(color, e)}/></div> : <div></div>}
      </div>
      <div style={editorStyle}>
        <Editor ref="editor" customStyleMap={customStyles} editorState={this.state.editorState} onChange={this.onChange}/>
      </div>
    </div>);
  }
}
