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
    this.setState({
      isEditing: !this.state.editing
    });
  }

  editDocument() {
    this.setState({
      isEditing: !this.state.editing
    });
  }

  render(){
    return(
      <div>
        {this.state.isEditing ?
          <TextEditor />
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
                    <TableCell><Button onClick={() => this.editToggle()} variant="extendedFab">edit</Button></TableCell>
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
