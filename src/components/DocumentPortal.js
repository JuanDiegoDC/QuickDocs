import React from 'react';
import Header from './layouts/Header';
import { Button, Paper, Card, Table, TableHead, TableRow, TableCell, TableBody, Dialog, DialogTitle, DialogActions, DialogContent, DialogContentText, TextField } from '@material-ui/core';
import Edit from '@material-ui/icons';
const url = "http://localhost:8080";
import TextEditor from './TextEditor';

class DocumentPortal extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      documents: [],
      isEditing: false,
      dialogOpen: false,
      editingDocument: null
    }
  }

  componentWillMount(){
    fetch(url + '/documents', {
     method: 'GET',
     credentials: "same-origin",
     headers: {
       'Content-Type': 'application/json',
     },
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
       this.setState({
         documents: resJson.docs
       });
     }
   })
   .catch((err) => {
     console.log(err);
   })
  }



  editToggle() {
    fetch(url + '/create/document', {
     method: 'POST',
     credentials: "same-origin",
     headers: {
       'Content-Type': 'application/json',
     },
     body: {
       title: this.state.title,
       password: this.state.password
     }
   })
   .then((res) => {console.log(res); if(res.status !== 200) {
     return res.text();
   } else {
     return res.json()
   }})
   .then((resJson) => {
     console.log(resJson);
     if (resJson.success) {
       console.log("Finished creating document");
     }
   })
   .then(() => {
     fetch(url + '/documents', {
      method: 'GET',
      credentials: "same-origin",
      headers: {
        'Content-Type': 'application/json',
      },
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
        this.setState({
          documents: resJson.docs
        });
      }
    })
   })
   .catch((err) => {
     console.log(err);
   })

    console.log("Toggle called");
    this.setState({
      isEditing: !this.state.isEditing,
      editingDocument: {title: "untitled"}
    }, () => {
      console.log(this.state);
    });
  }

  editDocument(event, id) {
    let doc = {};
    this.state.documents.forEach((item) => {
      if (item._id === id) {
        doc = item;
      }
    });
    this.setState({
      isEditing: !this.state.isEditing,
      editingDocument: doc
    });
  }

  toggleDialog(){
    this.setState({
      dialogOpen: !this.state.dialogOpen
    });
  }

  render(){
    return(
      <div>
        {this.state.isEditing ?
          <TextEditor editToggle={() => this.editToggle()} document={this.state.editingDocument} />
          :
          <div style={{minWidth: "600px"}}>
          <Header editToggle={() => this.editToggle()} />
          <Card style={{margin: '20px'}}>
            <Table>
            <TableHead>
              <TableRow>
                <TableCell>My Documents</TableCell>
                <TableCell>Date of Creation</TableCell>
                <TableCell>Owner</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {this.state.documents.map(n => {
                return (
                  <TableRow hover key={n._id}>
                    <TableCell component="th" scope="row">
                      {n.title}
                    </TableCell>
                    <TableCell >{n.owner}</TableCell>
                    <TableCell>
                      <Button onClick={() => this.toggleDialog()} variant="extendedFab">
                        edit
                          <Dialog
                        title="Dialog With Actions"
                        open={this.state.dialogOpen}
                          >
                          <DialogTitle id="form-dialog-title"> Access (document name)</DialogTitle>
                          <DialogContent>
                            <DialogContentText>
                              Please enter (insert document name here)'s password:
                            </DialogContentText>
                            <TextField
                          autoFocus
                          margin="dense"
                          id="docPassword"
                          label="Password"
                          type="password"
                          fullWidth
                            />
                          </DialogContent>
                          <DialogActions>
                            <Button onClick={() => this.toggleDialog()} color="primary">
                              Cancel
                            </Button>
                            <Button color="primary">
                              Submit
                            </Button>
                          </DialogActions>
                        </Dialog>
                      </Button>
                    </TableCell>
                    <TableCell><Button onClick={() => this.editDocument(event, n._id)} variant="extendedFab">edit</Button></TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </Card>
          </div>
         }
      </div>
    )
  }
}

export default DocumentPortal;
