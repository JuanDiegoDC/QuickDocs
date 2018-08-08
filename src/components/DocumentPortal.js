import React from 'react';
import Header from './layouts/Header';
import { Button, Paper, Card, Table, TableHead, TableRow, TableCell, TableBody } from '@material-ui/core';
import Edit from '@material-ui/icons';
const url = "http://localhost:8080";
import TextEditor from './TextEditor';

class DocumentPortal extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      documents: [],
      isEditing: false,
      dialogOpen: false
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
    this.setState({
      isEditing: !this.state.editing
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
          <TextEditor />
          :
          <div style={{minWidth: "600px"}}>
          <Header />
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
                        onClose={this.toggleDialog}
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
