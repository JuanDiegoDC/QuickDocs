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

const customStyleMap = {
  "size12": {
    fontSize: 12
  },
  "size14": {
    fontSize: 14
  },
  "size16": {
    fontSize: 16
  },
  "size18": {
    fontSize: 18
  },
  "size24": {
    fontSize: 24
  },
  "size32": {
    fontSize: 32
  },
  "size48": {
    fontSize: 48
  },
}
const { styles, customStyleFn, exporter } = createStyles(['font-size', 'color'], 'PREFIX', customStyleMap);

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
    this.onChange(RichUtils.toggleInlineStyle(this.state.editorState, 'size48'));
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
      color: this.state.editorColor
    }
    const colors = ['#fff', '#000', '#B80000', '#DB3E00', '#FCCB00', '#008B02', '#006B76', '#1273DE'];
    return (<div>
      <h1>Welcome to this editor!</h1>
      <div id="buttonWrapper">
        <Button variant="outlined" style={{fontWeight: "bold"}} onMouseDown={(e) => this._onBoldClick(e)}>BOLD</Button>
        <Button variant="outlined" style={{fontStyle: "italic"}} onMouseDown={(e) => this._onItalicClick(e)}>ITALIC</Button>
        <Button variant="outlined" style={{textDecoration: "underline"}} onMouseDown={(e) => this._onUnderlineClick(e)}>UNDERLINE</Button>
        <Button variant="outlined" onMouseDown={(e) => this._onColorClick(e)}>COLOR</Button>
        <Button variant="outlined" onMouseDown={(e) => this._onSizeClick(e)}>Size test</Button>
        <SizeMenu setCurrentSize={(e) => this.addFontSize(e)} />
        <AlignMenu onLeftClick={(e) => this._onLeftClick(e)} onRightClick={(e) => this._onRightClick(e)} onCenterClick={(e) => this._onCenterClick(e)}/>
      </div>
      <div>
        {this.state.showColorPicker ? <div style={{position: "absolute", left: "275px"}}><GithubPicker colors={colors} onChange={(color, e) => this.handleColorChange(color, e)}/></div> : <div></div>}
      </div>
      <div style={editorStyle}>
        <Editor ref="editor" customStyleMap={customStyleMap} customStyleFn={customStyleFn} editorState={this.state.editorState} onChange={this.onChange}/>
      </div>
    </div>);
  }
}
