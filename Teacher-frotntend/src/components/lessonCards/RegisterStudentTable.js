import React from 'react';
import PropTypes from 'prop-types';

import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';

const columns = [
  { id: 'name', label: 'Name', minWidth: 70 },
  { id: 'phoneNum', label: 'Phone Number', minWidth: 70 },
  { id: 'emons', label: 'Emons', minWidth: 70 },
  { id: 'email', label: 'Email', minWidth: 70 },
];


function createData(name, email, phoneNum, emons) {
  return { name, email, phoneNum, emons};
}


const styles = theme => ({
  root: {
    width: '100%',
  },
  tableWrapper: {
    maxHeight: 440,
    overflow: 'auto',
  },
});

class RegisterStudentTable extends React.Component {

  constructor(props)
  {
    super(props);
    this.state =
    {
      page: 0,
      rowsPerPage: 5,
      students: this.props.students,
      rows: [],
    }
    console.log("Table PRops");
    console.log(props);

    var index = 0;

    for(index = 0; index<this.state.students.lengtH; index++)
    {
      var student = this.state.students[index];
      this.state.rows.push(createData(student.name, student.phoneNum, student.emons, student.email));

    }

    this.setPage = this.setPage.bind(this)
    this.setRowsPerPage = this.setRowsPerPage.bind(this)
    this.handleChangePage = this.handleChangePage.bind(this)
    this.handleChangeRowsPerPage = this.handleChangeRowsPerPage.bind(this)
  }

  componentDidUpdate(prevProps, prevState) {
    console.log(prevProps);
    console.log("PREVV");
    console.log(this.props);
    console.log("NOW");
    if(prevProps.students!=this.props.students)
    {
      this.setState({students: this.props.students});
      console.log("Table update!");
      console.log(this.props);
      var tmprows = [];
      var index;
      for(index = 0; index<this.props.students.length; index++)
      {
        var student = this.props.students[index];
        tmprows.push(createData(student.name, student.email, student.phoneNum, student.emons));
        console.log("Pushed "+index);
        console.log(student);
      }

      this.setState({rows:tmprows});
    }
    console.log(this.state);
  }


  setPage(value)
  {
    this.setState({page: value})
  }

  setRowsPerPage(value)
  {
    this.setState({rowsPerPage: value})
  }

  handleChangePage(event, newPage)
  {
    this.setPage(newPage);
  }

  handleChangeRowsPerPage(event)
  {
    this.setRowsPerPage(+event.target.value);
    this.setPage(0);
  }



  render()
  {
    const classes = this.props.classes;
    return (
      <Paper className={classes.root}>
        <div className={classes.tableWrapper}>
          <Table stickyHeader aria-label="sticky table">
            <TableHead>
              <TableRow>
                {columns.map(column => (
                  <TableCell
                    key={column.id}
                    align={column.align}
                    style={{ minWidth: column.minWidth }}
                  >
                    {column.label}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {this.state.rows.slice(this.state.page * this.state.rowsPerPage,
                this.state.page * this.state.rowsPerPage + this.state.rowsPerPage).map(row => {
                return (
                  <TableRow hover role="checkbox" tabIndex={-1} key={row.code}>
                    {columns.map(column => {
                      const value = row[column.id];
                      return (
                        <TableCell key={column.id} align={column.align}>
                          {column.format && typeof value === 'number' ? column.format(value) : value}
                        </TableCell>
                      );
                    })}
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
        <TablePagination
          rowsPerPageOptions={[5, 25, 100]}
          component="div"
          count={this.state.rows.length}
          rowsPerPage={this.state.rowsPerPage}
          page={this.state.page}
          onChangePage={this.handleChangePage}
          onChangeRowsPerPage={this.handleChangeRowsPerPage}
        />
      </Paper>
    );

  }
}


RegisterStudentTable.propTypes = {
  classes:PropTypes.object.isRequired,
};


export default withStyles(styles)(RegisterStudentTable);
