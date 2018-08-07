import React from 'react';
import Header from './layouts/Header';
import { Button, Paper, Card, Table, TableHead, TableRow, TableCell, TableBody } from '@material-ui/core';
import Edit from '@material-ui/icons';

class DocumentPortal extends React.Component {
  constructor(props){
    super(props);

  }

  render(){
    return(
      <div style={{minWidth: "600px"}}>
      <Header />
      <Card style={{margin: '20px'}}>
        <Table>
        <TableHead>
          <TableRow>
            <TableCell>My Documents</TableCell>
            <TableCell>Date of Creation</TableCell>
            <TableCell></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map(n => {
            return (
              <TableRow hover key={n.id}>
                <TableCell component="th" scope="row">
                  {n.name}
                </TableCell>
                <TableCell >{n.calories}</TableCell>
                <TableCell><Button variant="extendedFab">edit</Button></TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </Card>
      </div>
    )
  }
}

let id = 0;
function createData(name, calories, fat, carbs, protein) {
  id += 1;
  return { id, name, calories, fat, carbs, protein };
}

const data = [
  createData('Cryptocurrency Report', '01/04/18', 6.0, 24, 4.0),
  createData('Workouts', '20/03/18', 9.0, 37, 4.3),
  createData('Grocery List', '13/03/18', 16.0, 24, 6.0),
  createData('React.JS Class Notes', '17/03/18', 3.7, 67, 4.3),
  createData('REAMDE', '01/01/18', 16.0, 49, 3.9),
];

export default DocumentPortal;
