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
      user: this.props.user,
      inlineStyles: {
        "SELECTED": {
          "backgroundColor": "red"
        }
      }
    };
    this.focus = () => this.refs.editor.focus()
    this.onTab = (e) => this._onTab(e)
    this.updateEditorState = editorState => this.setState({ editorState });
  }


  componentDidMount() {
    console.log(this.state);
    this.onChange = (editorState) => this.setState({editorState});
    console.log(this.props.document);
    if (this.props.document.content) {
      console.log("Component did mount log: ", this.props.document);
      this.setState({
        editorState: EditorState.createWithContent(convertFromRaw(JSON.parse(this.props.document.content))),
        inlineStyles: JSON.parse(this.props.document.inlineStyles),
      });
    }
    console.log("Block map:", this.state.editorState.getCurrentContent().getBlockMap());
    const socket = io(url);
    let that = this;
    socket.on('connect', function() {
      console.log('ws connect')
      socket.emit('join', { docId: that.props.document._id });
      that.onChange = (editorState) => {
        that.setState({editorState});
        let selectionState = that.state.editorState.getSelection();
        let selectionData = {};
        if (selectionState.getIsBackward()) {
          //Focus is before Anchor
          selectionData = {
            startKey: selectionState.getFocusKey(),
            endKey: selectionState.getAnchorKey(),
            startOffset: selectionState.getFocusOffset(),
            endOffset: selectionState.getAnchorOffset(),
            id: that.state.user._id
          }
        }
        else {
          //Anchor is before Focus
          selectionData = {
            startKey: selectionState.getAnchorKey(),
            endKey: selectionState.getFocusKey(),
            startOffset: selectionState.getAnchorOffset(),
            endOffset: selectionState.getFocusOffset(),
            id: that.state.user._id
          }
        }
        console.log("selectionData:", selectionData);
        socket.emit('editorChange', {
          content: JSON.stringify(convertToRaw(that.state.editorState.getCurrentContent())),
          inlineStyles: JSON.stringify(that.state.inlineStyles),
          docId: that.props.document._id,
          selectionData: JSON.stringify(selectionData)
        });
      };
    });
    socket.on('disconnect', function() {
      console.log('ws disconnect')
      socket.emit('leave', {docId: that.props.document._id })
      that.onChange = (editorState) => that.setState({editorState});
    });
    socket.on('editorChange', function(data) {
      let currState = JSON.parse(data.content);
      console.log(currState);
      let selectionData = JSON.parse(data.selectionData);
      console.log(selectionData);

      if (selectionData.id !== that.state.user.id) {
        if (selectionData.startKey === selectionData.endKey) {
          currState.blocks.forEach((item) => {
            if (String(item.key) === String(selectionData.startKey)) {
              item.inlineStyleRanges.push({offset: selectionData.startOffset, length: (selectionData.endOffset - selectionData.startOffset), style: "SELECTED"})
            }
          });
        }
      }

      console.log('The EditorChange data is: ', currState);

      that.setState({
        editorState: EditorState.createWithContent(convertFromRaw(currState)),
        inlineStyles: JSON.parse(data.inlineStyles),
      });
    });
  }

  _onTab(e) {
    console.log('on tab called.')
    const maxDepth = 10;
    this.onChange(RichUtils.onTab(e, this.state.editorState, maxDepth));
  }


  toggleFontSize = fontSize => {
    this.setState({
      size: fontSize
    });
  };

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

  saveDocument(e, id) {
    e.preventDefault();
    let c = convertToRaw(this.state.editorState.getCurrentContent());
    console.log(c);
    console.log("id: ", id);
    fetch(url + '/save/document', {
     method: 'POST',
     credentials: "same-origin",
     headers: {
       'Content-Type': 'application/json',
     },
     body: JSON.stringify({
       content: JSON.stringify(convertToRaw(this.state.editorState.getCurrentContent())),
       inlineStyles: JSON.stringify(this.state.inlineStyles),
       id: String(id)
     })
   })
   .then((res) => {console.log(res); if(res.status !== 200) {
     return res.text();
   } else {
     return res.json()
   }})
   .then((resJson) => {
     console.log(resJson);
     if (resJson.success) {
       console.log("Success is true");
     }
   })
   .then(() => {
     this.props.getDocuments();
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
      // color: this.state.editorColor,
      // fontSize: this.state.size,
      // fontWeight: this.state.fontWeight,
      // fontStyle: this.state.fontStyle,
      // textDecoration: this.state.textDecoration,
      // textAlign: this.state.textAlign
    }

    return (
      <div>
      <HeaderEditor goBack={(e)=>this.props.goBack(e)} saveDocument={(e) => this.saveDocument(e, this.props.document._id)} editToggle={() => this.props.editToggle()} document={this.props.document} />
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
      <div style={editorStyle} onClick={this.focus}>
        <Editor
          ref='editor'
          editorState={this.state.editorState}
          onChange={(editorState)=>this.onChange(editorState)}
          customStyleMap={this.state.inlineStyles}
          blockRenderMap={blockRenderMap}
          onTab={(e) => this.onTab(e)}
        />
      </div>
    </div>);
  }
}
