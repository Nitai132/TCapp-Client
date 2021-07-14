import React, { useState, useEffect } from 'react';
import Button from '@material-ui/core/Button';
import axios from 'axios'
import { makeStyles } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';
import Collapse from '@material-ui/core/Collapse';
import IconButton from '@material-ui/core/IconButton';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp';
import TablePagination from '@material-ui/core/TablePagination';
import DeleteForeverIcon from '@material-ui/icons/DeleteForever';
import AdminUsersTable from './AdminUsersTable';



export default function AdminEmailTable() { //פונקציה ראשית של אדמין
  const [page, setPage] = React.useState(0); //סטייט של פאג'ינציה
  const [rowsPerPage, setRowsPerPage] = React.useState(10); //סטייט של מספר ההודעות בעמוד
  const [emails, setEmails] = React.useState([]); //סטייט של האימיילים מהדאטאבייס

  const useRowStyles = makeStyles({
    root: {
      '& > *': {
        borderBottom: 'unset',
      },
    },
  });

  function Row(props) { //פונקציה שמטפלת בשורות לטבלה של הודעות
    const { row } = props;
    const [open, setOpen] = React.useState(false); //סטייט לקולאפס של ההודעות עצמן
    const classes = useRowStyles();

    return (
      <React.Fragment>
        <TableRow className={classes.root}>
          <TableCell>
            <IconButton aria-label="expand row" size="small" onClick={() => setOpen(!open)}>
              {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
            </IconButton>
          </TableCell>
          <TableCell align="center" component="th" scope="row">
            {row.fullName}
          </TableCell>
          <TableCell align="center">{row.email}</TableCell>
          <TableCell align="center">{row.date}</TableCell>
          <TableCell align="center">
            <Button
              variant="contained"
              color="secondary"
              onClick={() => deleteMessage(row.id)} //בלחיצה מפעיל את הפונקציה למחיקת הודעה עם האיידי של ההודעה למחוק
            >
              <DeleteForeverIcon />
            </Button>
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
            <Collapse in={open} timeout="auto" unmountOnExit>
              <Box margin={1}>
                <Typography variant="h6" gutterBottom component="div">
                  Message
                    </Typography>
                <Typography gutterBottom component="div">
                  {row.message}
                </Typography>
              </Box>
            </Collapse>
          </TableCell>
        </TableRow>
      </React.Fragment>
    );
  }


  function createData(id, fullName, email, date, message) { // פונקציה שיוצרת דאטא שיכנס לטבלה של ההודעות
    return {
      id, //מזהה
      fullName, //שם מלא
      email, //אימייל
      date, //תאריך
      message, //הודעה
    };
  }


  let rows = []; //משתנה שמכיל את השורות לטבלה של האימיילים
  if (emails[0]) { //ברגע שהתקבלו אימיילים
    for (let i = 0; i < emails.length; i++) { //לולאת פור
      rows.unshift( //דחיפה לתוך המשתנה
        createData( // קריאה לפונקציה שיוצרת דאטא לאימיילים
          emails[i]._id, emails[i].fullName, emails[i].email, emails[i].created_at, emails[i].message // הדאטא שנכנס  
        )
      );
    };
  };


  const handleChangePage = (event, newPage) => { //פונקציה שמחליפה דף - פאג'ינציה
    setPage(newPage); //שינוי דף - סטייט
  };

  const handleChangeRowsPerPage = (event) => { //פונקציה שמחליטה כמה שורות יהיו בעמוד - לא פעיל כרגע
    setRowsPerPage(10); //תמיד יהיה על 10
    setPage(0);
  };


  const deleteMessage = (id) => { //פונקציה למחיקת הודעה
    axios.delete(`/emails/delete/${id}`); //API שמוחק הודעה
    alert('The message has been deleted successfully'); //אלרט שההודעה נמחקה
    window.location.reload(); //רענון של הדף
  }



  const deleteWholePage = () => { //מחיקת דף שלם של הודעות
    const currentPageData = rows.slice( //חישוב ההודעות בדף הנוכחי
      page * rowsPerPage, page * rowsPerPage + rowsPerPage) //חישוב ההודעות בדף הנוכחי
      .map((row) => row.id); //חישוב ההודעות בדף הנוכחי
    for (let i = 0; i < currentPageData.length; i++) { //לולאת פור
      axios.delete(`/emails/delete/${currentPageData[i]}`); //API שמוחק את ההודעות
    }
    alert('the page has been deleted successfully'); //הודעה שהמחיקה בוצעה בהצלחה
    window.location.reload(); //טעינת הדף מחדש
  }

  useEffect(async () => { //ברגע שהדף עולה בפעם הראשונה
    const resEmails = await axios.get('/emails/getall'); //API שולף את כל האימיילים
    setEmails(resEmails.data); //מעדכן סטייט של אימיילים
  }, []);

  return (
    <div style={{ position: 'absolute', top: '300px', right: '200px' }}>
      <TableContainer component={Paper} style={{ width: '1200px' }}>
        <Table aria-label="collapsible table">
          <TableHead>
            <TableRow>
              <TableCell />
              <TableCell id="name" align="center">Sender's full name</TableCell>
              <TableCell id="email" align="center">Sender's Email</TableCell>
              <TableCell id="date" align="center">sending Date</TableCell>
              <TableCell id="action" align="center">Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => (
              <Row key={row.name} row={row} />
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[10]}
        component="div"
        count={rows.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onChangePage={handleChangePage}
        onChangeRowsPerPage={handleChangeRowsPerPage}
      />
      <Button
        variant="contained"
        color="secondary"
        style={{
          position: 'absolute',
          left: '42%',
          bottom: '5px',
        }}
        onClick={() => deleteWholePage()} //מחיקת כל ההודעות בדף בלחיצה
      >
        delete Whole page
        </Button>
    </div>
  )

}