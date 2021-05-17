import React, { useEffect } from 'react';
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
import Button from '@material-ui/core/Button';

const useStyles = makeStyles({ //יצירת סטיילינג
  root: { //דיב רוט 
    width: '100%',
  },
  container: { // דיב חיצוני ביותר
    maxHeight: 800,
  },
});

export default function StickyHeadTable(props) { //הפונקציה של הטבלה
  const classes = useStyles(); //שימוש בסטיילינג לפי קלאסים
  const [page, setPage] = React.useState(0); //סטייט של הפאג'ינציה (עמודים)
  const [rowsPerPage, setRowsPerPage] = React.useState(11); //כמות שורות פר עמוד
  const [positions, setPositions] = React.useState([]);

  
const columns = [  // עמודות לטבלה הראשית
  {
    id: 'Num',
    label: 'Num',
    minWidth: 50
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
      id: 'Precent', 
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
  Precent
  ) {
return {Num, Symbol, Operation, StartDate, EndDate, StartPrice, EndPrice, succeeded, PipsesCents, Precent};
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
      let succeeded = chunk.filter(item => item.succeeded === 'true').length;
      // מוצא את מספר הפוזיציות שעדיין לא נסגרו
      let unClosedPositions = 0;
      chunk.map((item)=> {
        if (item.succeeded === 'undefined') {
          item.succeeded = 'Position is open'
          unClosedPositions++;
        };
        if (item.EndDate === 'N/A') {
          item.EndDate = 'Position is open'
        }
        if (!item.EndPrice) {
          item.EndPrice = 'Position is open'
        }
        if (!item.PipsesCents) {
          item.PipsesCents = 'Position is open'
        }
      });
      // מוצא את אחוזי ההצלחה לפי החישוב הבא: מספר הפוזיציות שהצליחו לחלק לגודל הצ'אנק פחות מספר הפוזיציות שלא נסגרו
      let rate = (succeeded/(chunk.length-unClosedPositions)) * 100;
      rate = rate.toFixed()+'%';
      if (rate === 'NaN%') {
        rate = '0%'
      };
      ratesArray.push(rate);
    });
    arrays.map((array, idx) => array.unshift(createData('', '','','','','','','','',ratesArray[idx])));
    return arrays.flat()
  }

  useEffect(async () => {
      const details = await axios.get('/auth/userDetails');
      const userPositions = await axios.get(`/positions/getUserPositions/${details.data.email}`);
      let finalPositions = [];
      for (let i=0;i<userPositions.data[0].bonds.length;i++) {
        const bond = await axios.get(`positions/getbond/${userPositions.data[0].bonds[i]}`);
        finalPositions.push(bond.data[0]);
      }
      for (let i=0;i<userPositions.data[0].crypto.length;i++) {
        const crypto = await axios.get(`positions/getCrypto/${userPositions.data[0].crypto[i]}`);
        finalPositions.push(crypto.data[0]);
      }
      for (let i=0;i<userPositions.data[0].comodity.length;i++) {
        const comodity = await axios.get(`positions/getComodity/${userPositions.data[0].comodity[i]}`);
        finalPositions.push(comodity.data[0]);
      }
      for (let i=0;i<userPositions.data[0].pairs.length;i++) {
        const currencyPair = await axios.get(`positions/getCurrencyPair/${userPositions.data[0].pairs[i]}`);
        finalPositions.push(currencyPair.data[0]);
      }
      for (let i=0;i<userPositions.data[0].rest.length;i++) {
        const rest = await axios.get(`positions/getRest/${userPositions.data[0].rest[i]}`);
        finalPositions.push(rest.data[0]);
      }
      for (let i=0;i<userPositions.data[0].stocks.length;i++) {
        const stock = await axios.get(`positions/getStock/${userPositions.data[0].stocks[i]}`);
        finalPositions.push(stock.data[0]);
      }

      const sortedPositions = finalPositions.sort((a, b) => {
        return b.insertTime - a.insertTime;
      });
      let rows = [];
      for (let i=0;i<sortedPositions.length;i++) {
        rows.push(createData(
          i+1,
          sortedPositions[i].symbol, 
          sortedPositions[i].operation, 
          sortedPositions[i].startDate, 
          sortedPositions[i].endDate, 
          sortedPositions[i].startPrice,
          sortedPositions[i].endPrice,
          String(sortedPositions[i].succeeded), 
          sortedPositions[i].pipsed,
          sortedPositions[i].Precent
          ))
      };
      const finalArray = addSuccessRate(rows);
      setPositions(finalArray);
    }, [])
  return (
    <Paper className={classes.root} style={{paddingTop: '20px'}}>
      <TableContainer className={classes.container}>
        <Table stickyHeader aria-label="sticky table">
          <TableHead>
            <TableRow> 
              {columns.map((column, idx) => ( //מאפינג לעמודות
                <TableCell 
                  key={idx} //מזהה
                  align={column.align}
                  style={{ minWidth: column.minWidth, textAlign: 'center', backgroundColor: 'lightBlue'}} //סטיילינג
                >
                  {column.label} 
                </TableCell> 
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {positions.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row, idx) => { //מאפינג לדפים
              return (
                <TableRow hover role="checkbox" tabIndex={-1} key={idx}> 
                  {columns.map((column , idx) => { //  מאפינג שורות לתוך הטבלה
                    const value = row[column.id]; 
                    return (
                      <TableCell key={idx} align={column.align} style={{textAlign: 'center', fontSize: '11px', height: '16.5px', borderBottom: '1px solid black'}}>
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
        count={positions.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onChangePage={handleChangePage}
        onChangeRowsPerPage={handleChangeRowsPerPage}
      />
      <Button 
      onClick={() => props.PdfArray(positions.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage))}
      variant="contained" 
      color="primary" 
      style={
        {fontSize: '14px', position: 'relative', left: '10px', bottom: '10px'}
      }>
        Download Page as PDF
      </Button>
    </Paper>
  );
}