import React, { useState, useEffect } from 'react';
import Button from '@material-ui/core/Button';
import axios from 'axios'
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import TablePagination from '@material-ui/core/TablePagination';
import TextField from '@material-ui/core/TextField';



export default function AdminUsersTable() { 
    const [page, setPage] = React.useState(0); //סטייט של פאג'ינציה
    const [rowsPerPage, setRowsPerPage] = React.useState(10); //סטייט של מספר ההודעות בעמוד
    const [users, setUsers] = React.useState([]); //סטייט של המשתמשים מהדאטאבייס
    const [usersRows, setusersRows] = React.useState([]);

    const columns = [ //עמודות לטבלה של המשתמשים
        { 
          id: 'userId', //מזהה
          label: 'User id', //השם שיופיע בדפדפן
          minWidth: 50, //רוחב מינימלי
          align: 'center' //סידור הטקסט במרכז העמודה
        },
        { 
          id: 'firstName', 
          label: 'First name', 
          minWidth: 50,
          align: 'center'
        },
        { 
          id: 'lastName', 
          label: 'Last name', 
          minWidth: 50,
          align: 'center'
        },
        {
          id: 'email',
          label: 'Email',
          minWidth: 50,
          align: 'center'
        },
        {
          id: 'phone',
          label: 'Phone',
          minWidth: 50,
          align: 'center'
        },
        {
          id: 'date',
          label: 'Signup date',
          minWidth: 50,
          align: 'center'
        },
        {
          id: 'credits',
          label: 'credits',
          minWidth: 50,
          align: 'center'
        },
        {
          id: 'actions',
          label: 'Actions',
          minWidth: 50,
          align: 'center'
        },          
        {
          id: 'delete',
          label: 'Delete',
          minWidth: 50,
          align: 'center'
        },       
      ];

    const changeUserCredits = async (email, amount) => { //פונקציה לשינוי הקרדיט של משתמש
        try {
          axios.post('/auth/changeCredits', { //api לשינוי קרדיט
            email: email, //האימייל של המשתמש
            amount: amount //הכמות אלייה האדמין רוצה לשנות
          });
          alert('user`s credits successfully changed.'); //הודעה שהשינוי בוצע
        } catch {
          alert('something went wrong'); //הודעה שמשהו השתבש במקרה של כשלון
        };
    };

    const createData2 = (userId, firstName, lastName, email, phone, date, credits, successRate) => { //פונקציה שיוצרת דאטא שיכנס לטבלה של משתמשים
        return {
          userId, //מזהה משתמש
          firstName, //שם פרטי
          lastName, //שם משפחה
          email, //אימייל
          phone, //טלפון
          date, //תאריך
          credits, //קרדיטים
          successRate //אחוזי הצלחה
        };
    }

    const handleChangePage = (event, newPage) => { //פונקציה שמחליפה דף - פאג'ינציה
        setPage(newPage); //שינוי דף - סטייט
      };
    
      const handleChangeRowsPerPage = (event) => { //פונקציה שמחליטה כמה שורות יהיו בעמוד - לא פעיל כרגע
        setRowsPerPage(10); //תמיד יהיה על 10
        setPage(0); 
      };
      const fNameChanged = async (value) => {
        let filter = usersRows.filter(row => row.firstName.toLowerCase().includes(value));
        setusersRows(filter);
        if (value === '') {
          setusersRows([]);
            for(let i=0;i<users.length;i++) {
              setusersRows( usersRows => [...usersRows,  //דחיפה לתוך המשתנה
                  createData2( //קריאה לפונקציה שיוצרת דאטא למשתמשים
                    users[i]._id, users[i].firstName, users[i].lastName, users[i].email, users[i].phone, users[i].created_at, users[i].credits
                  )]);
            };
        }
      }

    const lNameChanged = async (value) => {
        let filter = usersRows.filter(row => row.lastName.toLowerCase().includes(value));
        setusersRows(filter);
        if (value === '') {
          setusersRows([]);
            for(let i=0;i<users.length;i++) {
              setusersRows( usersRows => [...usersRows,  //דחיפה לתוך המשתנה
                  createData2( //קריאה לפונקציה שיוצרת דאטא למשתמשים
                    users[i]._id, users[i].firstName, users[i].lastName, users[i].email, users[i].phone, users[i].created_at, users[i].credits
                  )]);
            };
        }
    }

    const emailChanged = async (value) => {
        let filter = usersRows.filter(row => row.email.toLowerCase().includes(value));
        setusersRows(filter);
        if (value === '') {
          setusersRows([]);
            for(let i=0;i<users.length;i++) {
              setusersRows( usersRows => [...usersRows,  //דחיפה לתוך המשתנה
                  createData2( //קריאה לפונקציה שיוצרת דאטא למשתמשים
                    users[i]._id, users[i].firstName, users[i].lastName, users[i].email, users[i].phone, users[i].created_at, users[i].credits
                  )]);
            };
        }
    }

    const dateChanged = async (value) => {
        let filter = usersRows.filter(row => String(row.date).includes(value));
        setusersRows(filter);
        if (value === '') {
          setusersRows([]);
            for(let i=0;i<users.length;i++) {
              setusersRows( usersRows => [...usersRows,  //דחיפה לתוך המשתנה
                  createData2( //קריאה לפונקציה שיוצרת דאטא למשתמשים
                    users[i]._id, users[i].firstName, users[i].lastName, users[i].email, users[i].phone, users[i].created_at, users[i].credits
                  )]);
            };
        }
    }

    const phoneChanged = async (value) => {
        let filter = usersRows.filter(row => String(row.phone).includes(value));
        setusersRows(filter);
        if (value === '') {
          setusersRows([]);
            for(let i=0;i<users.length;i++) {
              setusersRows( usersRows => [...usersRows,  //דחיפה לתוך המשתנה
                  createData2( //קריאה לפונקציה שיוצרת דאטא למשתמשים
                    users[i]._id, users[i].firstName, users[i].lastName, users[i].email, users[i].phone, users[i].created_at, users[i].credits
                  )]);
            };
        }
    }

    const deleteUser = async (id) => {
      console.log(id)
      await axios.delete(`/auth/deleteUser/${id}`)
      alert('User deleted Successfully');
      window.location.reload(); //רענון של הדף
    }


    useEffect( async() => { //ברגע שהדף עולה בפעם הראשונה
        const resUsers = await axios.get('/auth/allUsers'); //API שולף את כל המשתמשים
        setUsers(resUsers.data); //מעדכן סטייט של משתמשים
          for(let i=0;i<resUsers.data.length;i++) {
            setusersRows( usersRows => [...usersRows,  //דחיפה לתוך המשתנה
                createData2( //קריאה לפונקציה שיוצרת דאטא למשתמשים
                  resUsers.data[i]._id, resUsers.data[i].firstName, resUsers.data[i].lastName, resUsers.data[i].email, resUsers.data[i].phone, resUsers.data[i].created_at, resUsers.data[i].credits
                )]);
          };
      }, []);



      return (
        <div style={{position: 'absolute', top: '120px', left: '10px', width: '1500px'}}>
        <TextField id="filled-basic" label="Search by F-name" variant="filled" style={{marginRight: '20px', marginLeft: '250px', width: '150px'}}
        onChange={({target: {value}})=> fNameChanged(value)}
        />
        <TextField id="filled-basic" label="Search by L-name" variant="filled"  style={{marginRight: '20px', width: '150px'}}
        onChange={({target: {value}})=> lNameChanged(value)}
        />
        <TextField id="filled-basic" label="Search by email" variant="filled" style={{marginRight: '20px', width: '150px'}} 
        onChange={({target: {value}})=> emailChanged(value)}
        />
        <TextField id="filled-basic" label="Search by phone" variant="filled" style={{marginRight: '20px,', width: '150px'}}
        onChange={({target: {value}})=> phoneChanged(value)}          
        />
        <TextField id="filled-basic" label="Search by date" variant="filled" style={{marginRight: '20px',marginLeft: '20px', width: '150px'}}
        onChange={({target: {value}})=> dateChanged(value)}          
        />
        <Paper>
          <TableContainer>
            <Table stickyHeader aria-label="sticky table">
              <TableHead>
                <TableRow>
                  {columns.map((column) => (
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
                {usersRows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => {  //סלייס+מאפינג של השורות לפי עמודים
                  return ( 
                    <TableRow hover role="checkbox" tabIndex={-1} key={row.code}> 
                      {columns.map((column) => {
                        const value = row[column.id];
                        if (column.id !== 'credits') {
                          return (
                            <TableCell key={column.id} align={column.align}>
                              {column.format && typeof value === 'number' ? column.format(value) : value}
                              {column.id === 'actions' && <Button                
                              variant="contained" 
                              color="primary"
                              onClick={()=> changeUserCredits(row.email, row.credits)} //שינוי הקרדיט למשתמש בלחיצה לפי הסכום שנבחר
                              >
                                Change credits
                              </Button>}
                              {column.id === 'delete' && <Button
                              variant="contained" 
                              color="secondary"
                              onClick={()=> deleteUser(row.userId)}
                              >
                                Delete User
                              </Button>}
                            </TableCell>
                          );
                        } 
                        else {
                          return (
                            <TableCell key={column.id} align={column.align}>
                              <TextField
                              id="standard-number"
                              label="Amount"
                              type="number"
                              placeholder={value}
                              InputLabelProps={{
                              shrink: true,
                              }}
                              style={{
                                width: '60px'
                              }}
                              onChange={({target: {value}})=> row.credits = value} //שינוי מספר הקרדיטים
                              />
                              </TableCell>
                          );
                        }
                      })}
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
          rowsPerPageOptions={[10, 25, 100]}
          component="div"
          count={usersRows.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onChangePage={handleChangePage}
          onChangeRowsPerPage={handleChangeRowsPerPage}
          />
        </Paper>
      </div>
      )
}