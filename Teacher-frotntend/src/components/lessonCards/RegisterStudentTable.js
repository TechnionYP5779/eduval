import React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';

import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import { withTranslation } from "react-i18next";
import CheckCircleIcon from '@material-ui/icons/CheckCircle';


const columns = [
  { id: 'check', label: '', minWidth: 33 },
  { id: 'name', label: 'Name', minWidth: 70 },
  { id: 'phoneNum', label: 'Phone Number', minWidth: 70 },
  { id: 'emons', label: 'Emons', minWidth: 70 },
  { id: 'email', label: 'Email', minWidth: 70 },
  { id: 'id', label: 'Email', minWidth: 70 },
  { id: 'missing', label: 'Email', minWidth: 70 },
];


function createData(name, email, phoneNum, emons, id, missing) {
  return { name, email, phoneNum, emons, id, missing};
}


const styles = theme => ({
  root: {
    width: '100%',
  },
  tableWrapper: {
    maxHeight: 440,
    overflow: 'auto',
  },

  loggedOn: {
    backgroundColor: "white ",
  },


  missing: {
    backgroundColor: "#BEBEBE",
  },

  icon:{
    color:"LimeGreen",
  }

});

class RegisterStudentTable extends React.Component {

  constructor(props)
  {
    super(props);
    this.state =
    {
      page: 0,
      rowsPerPage: 5,
      registered_students: this.props.registered_students,
      students: this.props.students,
      rows: [],
    }

    var index = 0;

    for(index = 0; index<this.state.registered_students.length; index++)
    {
      var student = this.state.students[index];
      this.state.rows.push(createData(student.name, student.phoneNum, student.emons, student.email, student.id, true));

    }

    this.setPage = this.setPage.bind(this)
    this.setRowsPerPage = this.setRowsPerPage.bind(this)
    this.handleChangePage = this.handleChangePage.bind(this)
    this.handleChangeRowsPerPage = this.handleChangeRowsPerPage.bind(this)
  }

  componentDidUpdate(prevProps, prevState) {

    if(prevProps.registered_students!=this.props.registered_students
    || prevProps.students != this.props.students)
    {
      this.setState({registered_students: this.props.registered_students});
      this.setState({students: this.props.students});
      console.log("Curr Reg");
      console.log(this.state.registered_students);
      console.log("Curr Att");
      console.log(this.state.students);

      var tmprows = [];
      var index;
      for(index = 0; index<this.props.registered_students.length; index++)
      {
        var student = this.props.registered_students[index];
        var student_missing = this.props.students.findIndex(
          (s) =>
          {
            return s.id==student.id;
          })==-1;
        console.log("Student " + student.name + " is missing? " + student_missing);
        tmprows.push(createData(student.name, student.email, student.phoneNum,
          student.emons, student.id, student_missing));
      }

      this.setState({rows:tmprows});
    }
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
    const { t, i18n } = this.props;

    return (
      <Paper className={classes.root}>
        <div className={classes.tableWrapper}>
          <Table stickyHeader aria-label="sticky table">
            <TableHead>
              <TableRow>
                {columns.map(column =>
                  {if(column.id=="id" || column.id=="missing") return;
                  return (
                  <TableCell
                    key={column.id}
                    align={column.align}
                    style={{ minWidth: column.minWidth }}
                  >
                    {t(column.label)}
                  </TableCell>
                )})}
              </TableRow>
            </TableHead>
            <TableBody>
              {this.state.rows.slice(this.state.page * this.state.rowsPerPage,
                this.state.page * this.state.rowsPerPage + this.state.rowsPerPage).map(row => {
                console.log("Student " + row.name+ " is missing? " + row.missing);
                return (
                  <TableRow hover role="checkbox" tabIndex={-1} key={row.code}>
                    {columns.map(column => {
                      const value = row[column.id];
                      if(column.id=="id"  || column.id=="missing") return;
                      if(column.id=="check" && !row.missing)
                      {
                        return(
                          <TableCell key={column.id} align={column.align}>
                            <CheckCircleIcon className={classes.icon}/>
                          </TableCell>

                        )
                      }
                      return (
                        <TableCell key={column.id} align={column.align}
                        className=
                          {
                            clsx([classes.loggedOn],
                              {
                                [classes.missing]: row.missing
                              }
                            )
                          }
                        >
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


export default withTranslation()(withStyles(styles)(RegisterStudentTable));
