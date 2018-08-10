import React from 'react';
import Header from './layouts/Header';
import {
  Button,
  Paper,
  Card,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Dialog,
  DialogTitle,
  DialogActions,
  DialogContent,
  DialogContentText,
  TextField
} from '@material-ui/core';
import Delete from '@material-ui/icons/DeleteOutline';
const url = "http://localhost:8080";
import TextEditor from './TextEditor';

class DocumentPortal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      documents: [],
      isEditing: false,
      dialogOpen: false,
      dialogCreateOpen: false,
      dialogDeleteOpen: false,
      editingDocument: null,
      user: this.props.user,
      docTitle: '',
      docPass: '',
      docVerifyPass: '',
      requestDocId: ""
    }
  }

  updatedocTitle(e) {
    console.log(e.target.value)
    this.setState({
      docTitle: e.target.value
    }, () => {
      console.log(this.state)
    });

  }

  updateDocPass(e) {
    console.log(e.target.value)
    this.setState({
      docPass: e.target.value
    }, () => {
      console.log(this.state)
    });
  }

  goBack(e){
    console.log('Go back is called1111!!!111!!');
    this.setState({
      isEditing: false,
      editingDocument: null
    }, () => {
      console.log('callback!');
      this.getDocuments();
    });
  }

  getDocuments() {
    fetch(url + '/documents', {
      method: 'GET',
      credentials: "same-origin",
      headers: {
        'Content-Type': 'application/json'
      }
    }).then((res) => {
      console.log(res);
      if (res.status !== 200) {
        return res.text();
      } else {
        return res.json()
      }
    }).then((resJson) => {
      console.log(resJson);
      if (resJson.success) {
        console.log("got documents!", resJson.docs);
        this.setState({documents: resJson.docs});
      }
    }).catch((err) => {
      console.log(err);
    })
  }

  componentDidMount() {
    this.getDocuments();
  }

  editToggle() {
    this.setState({
      isEditing: !this.state.isEditing
    });
  }

  openCreateDocument() {
    this.setState({dialogCreateOpen: true});
  }

  closeCreateDocument() {
    this.setState({dialogCreateOpen: false});
  }

  createDocument() {
    this.closeCreateDocument();
    fetch(url + '/create/document', {
      method: 'POST',
      credentials: "same-origin",
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({title: this.state.docTitle, password: this.state.docPass})
    }).then((res) => {
      console.log(res);
      if (res.status !== 200) {
        return res.text();
      } else {
        return res.json()
      }
    }).then((resJson) => {
      console.log(resJson);
      if (resJson.success) {
        console.log("Finished creating document");
        } else {
          console.log("Did not create document");
        }
      }).then(() => {
      fetch(url + '/documents', {
        method: 'GET',
        credentials: "same-origin",
        headers: {
          'Content-Type': 'application/json'
        }
      }).then((res) => {
        console.log(res);
        if (res.status !== 200) {
          return res.text();
        } else {
          return res.json()
        }
      }).then((resJson) => {
        console.log(resJson);
        if (resJson.success) {
          console.log("Finished getting document from database", resJson);
          let editDoc = {};
          resJson.docs.forEach((doc) => {
            if (String(doc._id) === String(resJson.id)){
              editDoc = doc;
            }
          })
          this.setState({
            documents: resJson.docs,
            editingDocument: editDoc
          }, () => {
            this.setState({
              isEditing: true
            });
          });
        }
      })
    }).catch((err) => {
      console.log(err);
    })
  }

  editDocument(e, id) {
    this.state.documents.forEach((item) => {
      if (item._id === id) {
        this.setState({
          isEditing: true,
          editingDocument: item
        });
      }
    });
  }

  dialogOpen(docId) {
    this.setState({
      dialogOpen: true,
      requestDocId: docId
    });
  }

  dialogClose(){
    this.setState({
      dialogOpen: false,
    })
  }

  changeDocPass(e){
    this.setState({
      docVerifyPass: e.target.value
    });
  }

  verificationDocPass(e){
    console.log(this.state.requestDocId);
    fetch(url + '/add/collaborator', {
      method: 'POST',
      credentials: 'same-origin',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        password: this.state.docVerifyPass,
        docId: this.state.requestDocId
      })
    })
    .then((res) => {
      console.log(res)
      return res.json();
    })
    .then((resJson) => {
      if (resJson.success) {
        this.dialogClose();
        this.editDocument(e, this.state.requestDocId);
        this.setState({
          requestDocId: ""
        });
      } else {
        console.log(resJson.error)
      }
    })
    .catch((err) => {
      console.log(err)
    })
  }

  requestAccess(e, docId){
    console.log(docId);
    fetch(url + '/access/document', {
      method: 'POST',
      credentials: "same-origin",
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        docId: docId
      })
    }).then((res) => {
      if (res.status !== 200) {
        return res.text();
      } else {
        return res.json()
      }
    }).then((resJson) => {
      if (resJson.success){
        if (resJson.access) {
          console.log('Granted access to document!')
          this.editDocument(e, docId);
        } else{
          this.dialogOpen(docId);
        }
      } else {
        console.log(resJson.error)
      }
    })
    .catch((err) => {
      if (err) {
        console.log(err);
      }
    })
  }

  dialogDeleteOpen(e){
    e.preventDefault();
    this.setState({
      dialogDeleteOpen: true
    });
  }

  dialogDeleteClose(e){
    e.preventDefault();
    this.setState({
      dialogDeleteOpen: false
    });
  }

  render() {
    return (<div>
      {
        this.state.isEditing
          ? <TextEditor user={this.state.user} goBack={(e)=>this.goBack(e)} editToggle={() => this.editToggle()} getDocuments={() => this.getDocuments()} document={this.state.editingDocument}/>
          : <div style={{
              minWidth: "600px"
            }}>
            <Header createDocument={(e) => this.createDocument(e)} updatedocTitle={(e) => this.updatedocTitle(e)} updateDocPass={(e) => this.updateDocPass(e)} openCreateDocument={() => this.openCreateDocument()} closeCreateDocument={() => this.closeCreateDocument()} dialogCreateOpen={this.state.dialogCreateOpen}/>
            <Card style={{
                margin: '20px'
              }}>
              <div style={{maxHeight: '500px', maxWidth: '100%', overflow: 'auto'}}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Title</TableCell>
                    <TableCell>Owner</TableCell>
                    <TableCell>Edit</TableCell>
                    <TableCell>Delete</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {
                    this.state.documents.map(n => {
                      return (<TableRow hover key={n._id}>
                        <TableCell component="th" scope="row">
                          {n.title}
                        </TableCell>
                        <TableCell >{n.owner}</TableCell>
                        <TableCell>
                          <Button onClick={(e) => this.requestAccess(e, n._id)} variant="extendedFab">Edit</Button>
                            <Dialog title="Dialog With Actions" open={this.state.dialogOpen}>
                              <DialogTitle id="form-dialog-title">
                                Access (document name)</DialogTitle>
                              <DialogContent>
                                <DialogContentText>
                                  Please enter (insert document name here)'s password:
                                </DialogContentText>
                                <TextField autoFocus margin="dense" id="docPassword" label="Password" type="password" onChange={(e)=>this.changeDocPass(e)} fullWidth/>
                              </DialogContent>
                              <DialogActions>
                                <Button onClick={() => this.dialogClose()} color="primary">
                                  Cancel
                                </Button>
                                <Button color="primary" onClick={(e) => this.verificationDocPass(e)}>
                                  Submit
                                </Button>
                              </DialogActions>
                            </Dialog>
                        </TableCell>
                        <TableCell>
                          <Button onClick={(e)=>this.dialogDeleteOpen(e)} variant="extendedFab"><Delete /></Button>
                            <Dialog
                              open={this.state.dialogDeleteOpen}
                              aria-labelledby="alert-dialog-title"
                              aria-describedby="alert-dialog-description"
                              fullWidth
                              >
                              <DialogTitle id="alert-dialog-title">
                                {"Delete this document?"}
                              </DialogTitle>
                              <DialogContentText id="alert-dialog-description" style={{marginLeft: '25px'}}>
                                The document and its contents will be erased.
                              </DialogContentText>
                                <DialogActions>
                                  <Button color="primary" onClick={(e)=>this.dialogDeleteClose(e)}>
                                    Delete
                                  </Button>
                                  <Button color="primary" onClick={(e)=>this.dialogDeleteClose(e)}>
                                    Cancel
                                  </Button>
                                </DialogActions>
                            </Dialog>
                        </TableCell>
                      </TableRow>);
                    })
                  }
                  </TableBody>
              </Table>
            </div>
            </Card>
          </div>
      }
      </div>)
  }
}

export default DocumentPortal;
