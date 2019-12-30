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
import Delete from '@material-ui/icons/Delete';
import IconButton from '@material-ui/core/IconButton';
import PlayArrowIcon from '@material-ui/icons/PlayArrow';
import Tooltip from '@material-ui/core/Tooltip';
import PlayCircleFilledWhiteRoundedIcon from '@material-ui/icons/PlayCircleFilledWhiteRounded';
import Modal from '@material-ui/core/Modal';
import Backdrop from '@material-ui/core/Backdrop';
import Fade from '@material-ui/core/Fade';
import Button from '@material-ui/core/Button';
import ClearIcon from '@material-ui/icons/Clear';


const columns = [
  { id: 'check', label: '', minWidth: 33 },
  { id: 'name', label: 'Name', minWidth: 70 },
  { id: 'phoneNum', label: 'Phone Number', minWidth: 70 },
  { id: 'emons', label: 'Emons', minWidth: 70 },
  { id: 'email', label: 'Email', minWidth: 70 },
  { id: 'id', label: 'Email', minWidth: 70 },
  { id: 'missing', label: 'Email', minWidth: 70 },
  { id: 'delete', label: 'Unregister Student', minWidth: 30 },
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
  delete:{
    color: "red",
    margin: "auto",
  },

  deleteCell:{
    backgroundColor:"white",
    textAlign:"center",
  },
  deleteCellHeader:{
    textAlign:"center",
  },
  missing: {
    backgroundColor: "#BEBEBE",
  },

  icon:{
    color:"LimeGreen",
  },

  modal: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  paper: {
    backgroundColor: theme.palette.background.paper,
    border: '2px solid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },

  delete_confirmation:
  {
    width: "50%",
    position: 'relative',
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
      registered_students: this.props.registered_students,
      students: this.props.students,
      rows: [],
      up_for_deletion_name:"",
      up_for_deletion_id:"",
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
    this.handleDeleteStudent = this.handleDeleteStudent.bind(this);
    this.setDeleteModalChange = this.setDeleteModalChange.bind(this)
    this.handleDeleteModalOpen = this.handleDeleteModalOpen.bind(this)
    this.handleDeleteModalClose = this.handleDeleteModalClose.bind(this)

  }

  componentDidUpdate(prevProps, prevState) {

    if(prevProps.registered_students!=this.props.registered_students
    || prevProps.students != this.props.students)
    {
      this.setState({registered_students: this.props.registered_students});
      this.setState({students: this.props.students});

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

  setDeleteModalChange(value)
  {
    this.setState({delete_modal_open: value})
  }

  handleDeleteModalOpen = () => {
    this.setDeleteModalChange(true);
  };

  handleDeleteModalClose = () => {
    this.setDeleteModalChange(false);
  };

  handleDeleteStudent(id)
  {
    this.props.deleteStudent(id);
    this.handleDeleteModalClose();
  }


  render()
  {
    const classes = this.props.classes;
    const { t } = this.props;
    console.log("RegisterStudentTable in CourseDetails?", this.props.courseDetails)
    return (
      <div>
        <Modal
          aria-labelledby="transition-modal-title"
          aria-describedby="transition-modal-description"
          className={classes.modal}
          open={this.state.delete_modal_open}
          onClose={this.handleDeleteModalClose}
          closeAfterTransition
          BackdropComponent={Backdrop}
          BackdropProps={{
            timeout: 500,
          }}
        >
          <Fade in={this.state.delete_modal_open}>
            <div className={classes.paper}>
            {this.props.courseDetails && <h3 id="transition-modal-title">{t('unregisterStudentConfirm', {name: this.state.up_for_deletion_name})}</h3>}
            {!this.props.courseDetails && <h3 id="transition-modal-title">{t('deleteConfirm', {name: this.state.name})}</h3>}
              <Button
                variant="contained"
                color="primary"
                className={classes.delete_confirmation}
                endIcon={<ClearIcon />}
                onClick={this.handleDeleteModalClose}
              >
                {t('Cancel')}
              </Button>
              <Button
                variant="contained"
                color="secondary"
                className={classes.delete_confirmation}
                endIcon={<Delete />}
                onClick={() => {this.handleDeleteStudent(this.state.up_for_deletion_id)}}
              >
                {t('Delete')}
              </Button>
            </div>
          </Fade>
        </Modal>
        <Paper className={classes.root}>
          <div className={classes.tableWrapper}>
            <Table stickyHeader aria-label="sticky table">
              <TableHead>
                <TableRow>
                  {columns.map(column =>
                    {
                    if(column.id=="id" || column.id=="missing") return;
                    if((column.id=="emons" || column.id=="check") && this.props.courseDetails) return;
                    if(column.id=="delete"&& !this.props.courseDetails) return;
                    if(column.id=="delete")
                    {
                      return (
                      <TableCell
                        key={column.id}
                        align={column.align}
                        style={{ minWidth: column.minWidth }}
                        className={classes.deleteCellHeader}
                      >
                        {t(column.label)}
                      </TableCell>
                    )
                    }
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
                  return (
                    <TableRow hover role="checkbox" tabIndex={-1} key={row.code}>
                      {columns.map(column => {
                        const value = row[column.id];
                        if((column.id=="emons" || column.id=="check") && this.props.courseDetails) return;
                        if(column.id=="id"  || column.id=="missing") return;
                        if(column.id=="delete"&& !this.props.courseDetails) return;
                        if(column.id=="check" && !row.missing)
                        {
                          return(
                            <TableCell key={column.id} align={column.align}>
                              <CheckCircleIcon className={classes.icon}/>
                            </TableCell>

                          )
                        }
                        if(column.id=="delete" && this.props.courseDetails)
                        {
                          return(
                            <TableCell
                            key={column.id}
                            align={column.align}
                            className={classes.deleteCell}>
                              <IconButton aria-label="delete"
                              className={classes.delete}
                              disabled={this.state.play_pushed}
                              onClick={()=>{
                                this.setState({up_for_deletion_id: row["id"]});
                                this.setState({up_for_deletion_name: row["name"]});

                                this.handleDeleteModalOpen()
                              }}
                              >
                                <Delete  />
                              </IconButton>
                            </TableCell>

                          )
                        }
                        return (
                          <TableCell key={column.id} align={column.align}
                          className=
                            {
                              clsx([classes.loggedOn],
                                {
                                  [classes.missing ]: row.missing & !this.props.courseDetails
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
      </div>
    );

  }
}


RegisterStudentTable.propTypes = {
  classes:PropTypes.object.isRequired,
};


export default withTranslation()(withStyles(styles)(RegisterStudentTable));
