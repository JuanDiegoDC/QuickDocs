import React from 'react';
import io from "socket.io-client";
import { Editor,
  EditorState,
  RichUtils,
  convertToRaw,
  DefaultDraftBlockRenderMap,
  convertFromRaw
} from 'draft-js';
import PropTypes from 'prop-types';
import { GithubPicker } from 'react-color';
import Button from '@material-ui/core/Button';
import { withStyles } from '@material-ui/core/styles';
import SizeMenu from "./SizeMenu.js";
import AlignMenu from "./AlignMenu.js";
import createStyles from 'draft-js-custom-styles';
import { Map } from 'immutable';
import HeaderEditor from './layouts/HeaderEditor';
const url = "http://localhost:8080";

// Initializing editor text transformation variables

const blockRenderMap = DefaultDraftBlockRenderMap.merge(new Map({
  left: {
    wrapper: <div style={{textAlign: 'left'}} />,
  },
  center: {
    wrapper: <div style={{textAlign: 'center'}} />,
  },
  right: {
    wrapper: <div style={{textAlign: 'right'}} />,
  },
  justify: {
    wrapper: <div style={{textAlign: 'justify'}} />,
  },
}));

const colors = ['#fff', '#000', '#B80000', '#DB3E00', '#FCCB00', '#008B02', '#006B76', '#1273DE'];

export default class TextEditor extends React.Component {
  constructor(props) {
    super(props);

    // if (this.props.document) {
    //   let doc = EditorState.createWithContent(this.props.document.content);
    // }
    // else {
    //   let doc = EditorState.createEmpty();
    // }
    this.state = {
      editorState: EditorState.createEmpty(),
      showColorPicker: false,
      editorColor: "black",
      size: 20,
      fontWeight: 'normal',
      textDecoration: 'none',
      textAlign: 'left',
    };
    this.focus = () => this.refs.editor.focus()
    this.onChange = (editorState) => this.setState({editorState});
    this.updateEditorState = editorState => this.setState({ editorState });
  }

  componentDidMount() {
    console.log(this.props.document);
    if (this.props.document.content || this.props.inlineStyles) {
      console.log("Component did mount log: ", this.props.document);
      this.setState({
        editorState: EditorState.createWithContent(convertFromRaw(JSON.parse(this.props.document.content))),
        inlineStyles: JSON.parse(this.props.document.inlineStyles),
      });
    }
    const socket = io('http://localhost:8080');
    socket.on('connect', function() {
      console.log('ws connect')
    });
    socket.on('disconnect', function() {
      console.log('ws disconnect')
    });
    // socket.on('msg', function(data) {
    //   console.log('ws msg:', data);
    //   socket.emit('cmd', {foo: 123})
    // });
    socket.emit('joinRoom', { docId: this.props.document._id, user: this.props.user });
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

  _onAlignClick(e, align){
    console.log(align);
    e.preventDefault();
    this.onChange(RichUtils.toggleBlockType(this.state.editorState, align))
  }

  _onFontClick(val){
    console.log(val)
    const newInlineStyles = Object.assign(
      {},
      this.state.inlineStyles,
      { [val]: { fontSize: `${val}px` } }
    );
    console.log(newInlineStyles)
    this.setState({
      inlineStyles: newInlineStyles,
      editorState: RichUtils.toggleInlineStyle(this.state.editorState, val),
      fontSize: val
    })
  }

  handleColorChange(color, e){
    console.log(color)
    e.preventDefault();
    const newInlineStyles = Object.assign(
      {},
      this.state.inlineStyles,
      { [color.hex]: { color: color.hex } }
    );
    this.setState({
      inlineStyles: newInlineStyles,
      editorState: RichUtils.toggleInlineStyle(this.state.editorState, color.hex)
    })
  }

  saveDocument(e) {
    e.preventDefault();
    let c = convertToRaw(this.state.editorState.getCurrentContent());
    console.log(c);
    fetch(url + '/save/document', {
     method: 'POST',
     credentials: "same-origin",
     headers: {
       'Content-Type': 'application/json',
     },
     body: JSON.stringify({
       content: JSON.stringify(convertToRaw(this.state.editorState.getCurrentContent())),
       inlineStyles: JSON.stringify(this.state.inlineStyles)
     })
   })
   .then((res) => {console.log(res); if(res.status !== 200) {
     return res.text();
   } else {
     return res.json()
   }})
   .then((resJson) => {
     console.log(resJson.doc.content);
     if (resJson.success) {
       console.log("Success is true");
     }
   })
   .catch((err) => {
     console.log(err);
   })
  }


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

    return (
      <div>
      <HeaderEditor saveDocument={(e) => this.saveDocument(e)} editToggle={() => this.props.editToggle()} title={this.props.document.title} />
      <div id="buttonWrapper">
        <Button variant="outlined" style={{fontWeight: "bold"}} onMouseDown={(e) => this._onBoldClick(e)}>BOLD</Button>
        <Button variant="outlined" style={{fontStyle: "italic"}} onMouseDown={(e) => this._onItalicClick(e)}>ITALIC</Button>
        <Button variant="outlined" style={{textDecoration: "underline"}} onMouseDown={(e) => this._onUnderlineClick(e)}>UNDERLINE</Button>
        <Button variant="outlined" onMouseDown={(e) => this._onColorClick(e)}>COLOR</Button>
        <SizeMenu setCurrentSize={(e) => this._onFontClick(e)} />
        <AlignMenu setAlignment={(e, val) => this._onAlignClick(e, val)} />
        <Button variant="outlined" style={{textDecoration: 'underline'}} onMouseDown={(e) => this._onBulletedClick(e)}>BULLETED LIST</Button>
        <Button variant="outlined" style={{textDecoration: 'underline'}} onMouseDown={(e) => this._onNumberedClick(e)}>NUMBERED LIST</Button>
      </div>
      <div>
        {this.state.showColorPicker ? <div style={{position: "absolute", left: "275px"}}><GithubPicker colors={colors} onChange={(color, e) => this.handleColorChange(color, e)}/></div> : <div></div>}
      </div>
      <div style={editorStyle}>
        <Editor
          ref='editor'
          editorState={this.state.editorState}
          onChange={(editorState)=>this.onChange(editorState)}
          customStyleMap={this.state.inlineStyles}
          blockRenderMap={blockRenderMap}
        />
      </div>
    </div>);
  }
}
