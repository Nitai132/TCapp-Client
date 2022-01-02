import React, { useEffect, useLayoutEffect } from 'react';
import axios from 'axios';
import './PositionsTable.css';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';

const useStyles = makeStyles({ //יצירת סטיילינג
  root: { //דיב רוט 
    width: '100%'
  },
  container: { // דיב חיצוני ביותר
    maxHeight: 800,
  },
});

export default function AdminPositionsTable({ positionType }) { //הפונקציה של הטבלה
  const classes = useStyles(); //שימוש בסטיילינג לפי קלאסים
  const [page, setPage] = React.useState(0); //סטייט של הפאג'ינציה (עמודים)
  const [rowsPerPage, setRowsPerPage] = React.useState(11); //כמות שורות פר עמוד
  const [positions, setPositions] = React.useState([]);
  const [rows, setRows] = React.useState([]);


  const columns = [  // עמודות לטבלה הראשית
    {
      id: 'Num', // id = מזהה
      label: '#', // label = השם שמוצג בעמוד
      minWidth: 50, // רוחב מינימלי
    },
    {
      id: 'Symbol',
      label: 'Symbol',
      minWidth: 50,
    },
    {
      id: 'Operation',
      label: 'Operation',
      minWidth: 50
    },
    {
      id: 'StartDate',
      label: 'Start Date',
      minWidth: 50,
    },
    {
      id: 'EndDate',
      label: 'End Date',
      minWidth: 50,
    },
    {
      id: 'StartPrice',
      label: 'Start Price',
      minWidth: 50,
    },
    {
      id: 'EndPrice',
      label: 'End Price',
      minWidth: 50,
    },
    {
      id: 'succeeded',
      label: 'Succeeded',
      minWidth: 50,
    },
    {
      id: 'PipsesCents',
      label: 'Pipses/Cents',
      minWidth: 50,
    },
    {
      id: 'precent',
      label: 'Success rate (per page)',
      minWidth: 50,
    },
  ];

  function createData( //פונקציה המייצרת דאטא חדש לטבלה
    Num,
    Symbol,
    Operation,
    StartDate,
    EndDate,
    StartPrice,
    EndPrice,
    succeeded,
    PipsesCents,
    precent
  ) {
    return { Num, Symbol, Operation, StartDate, EndDate, StartPrice, EndPrice, succeeded, PipsesCents, precent };
  }

  const handleChangePage = (event, newPage) => { //פונקציה לשינוי עמוד
    setPage(newPage); //שינוי הסטייט לעמוד חדש
  };

  const handleChangeRowsPerPage = (event) => { //אפשרות למשתמש לשנות את מספר השורות בעמוד (כרגע מבוטל)
    setRowsPerPage(+event.target.value); //המספר שהמשתמש בחר
    setPage(0);
  };

  const addSuccessRate = (arr) => {
    let arrays = [];
    const size = 10;
    let ratesArray = [];
    // חותך את המערך לצ'אנקים של 10 או פחות
    for (let i = 0; i < arr.length; i += size) {
      arrays.push(arr.slice(i, i + size));
    }
    //לולאת פור איצ
    arrays.forEach(chunk => {
      //מוצא את מספר הפוזיציות שהצליחו
      let succeeded = chunk.filter(item => item.succeeded == 'true').length;
      // מוצא את מספר הפוזיציות שעדיין לא נסגרו
      let unClosedPositions = 0;
      chunk.map((item) => {
        if (item.succeeded == 'undefined') {
          unClosedPositions++;
        };
      });
      // מוצא את אחוזי ההצלחה לפי החישוב הבא: מספר הפוזיציות שהצליחו לחלק לגודל הצ'אנק פחות מספר הפוזיציות שלא נסגרו
      let rate = (succeeded / (chunk.length - unClosedPositions)) * 100;
      rate = rate.toFixed() + '%';
      if (rate === 'NaN%') {
        rate = '0%'
      };
      ratesArray.push(rate);
      //לכל אובייקט במערך successRate מוסיף מפתח בשם
    });
    arrays.map((array, idx) => array.unshift(createData('', '', '', '', '', '', '', '', '', ratesArray[idx])));
    return arrays.flat()
  }

  const fetchPositionsData = async()=> {
    let { data } = await axios.get(`/positions/getAll${positionType}`);
    let enrichedRows = [];
    data.sort((a, b) => {
      return b.insertTime - a.insertTime;
    });
    data.map((object, idx) => {
      if (object.pipsed) {
        object.pipsed = object.pipsed.toFixed(5);
      };
      enrichedRows.push(
        createData(
          idx + 1,
          object.symbol,
          object.operation,
          object.startDate,
          object.endDate,
          object.startPrice,
          object.endPrice,
          String(object.succeeded),
          object.pipsed,
          object.Precent
        )
      )
    })
    let finalRows = addSuccessRate(enrichedRows);
    setRows(finalRows);
    window.interval = setInterval( async() => {
      data = await axios.get(`/positions/getAll${positionType}`);
      enrichedRows = [];
      data.data.sort((a, b) => {
        return b.insertTime - a.insertTime;
      });
      data.data.map((object, idx) => {
        if (object.pipsed) {
          object.pipsed = object.pipsed.toFixed(5);
        };
        enrichedRows.push(
          createData(
            idx + 1,
            object.symbol,
            object.operation,
            object.startDate,
            object.endDate,
            object.startPrice,
            object.endPrice,
            String(object.succeeded),
            object.pipsed,
            object.Precent
          )
        )
      })
      finalRows = addSuccessRate(enrichedRows);
      setRows(finalRows);
      console.log('data refreshed', finalRows)
    }, 1000*60)
  }

  useEffect(() => {
    fetchPositionsData();
  }, []);

  useLayoutEffect(() => {
    return () => {
        clearInterval(window.interval);
    }
}, [])
  return (
    <Paper className={classes.root}>
      <TableContainer className={classes.container}>
        <Table stickyHeader aria-label="sticky table">
          <TableHead>
            <TableRow>
              {columns.map((column, idx) => ( //מאפינג לעמודות
                <TableCell
                  key={idx} //מזהה
                  align={column.align}
                  style={{ minWidth: column.minWidth, textAlign: 'center', backgroundColor: 'lightBlue' }} //סטיילינג
                >
                  {column.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row, idx) => { //מאפינג לדפים
              return (
                <TableRow hover role="checkbox" tabIndex={-1} key={idx}>
                  {columns.map((column, idx) => { //  מאפינג שורות לתוך הטבלה
                    const value = row[column.id];
                    return (
                      <TableCell key={idx} align={column.align} style={{ textAlign: 'center', fontSize: '11px', height: '16.5px', borderBottom: '1px solid black' }}>
                        {column.format && typeof value === 'number' ? column.format(value) : value}
                      </TableCell>
                    );
                  })}
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination //פאג'ינציה (דפים)
        rowsPerPageOptions={[10]} //אפשרות לתת למשתמש לבחור כמות שורות בדף כרגע האפשרות היחידה היא 10
        component="div"
        count={rows.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onChangePage={handleChangePage}
        onChangeRowsPerPage={handleChangeRowsPerPage}
      />
    </Paper>
  );
}