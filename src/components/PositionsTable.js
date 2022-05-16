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
import FormControl from '@material-ui/core/FormControl';
import NativeSelect from '@material-ui/core/NativeSelect';
import InputLabel from '@material-ui/core/InputLabel';
import alertify from 'alertifyjs';
import 'alertifyjs/build/css/alertify.css';
import 'alertifyjs/build/css/themes/default.css'


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
  const [openSymbols, setOpenSymbols] = React.useState('');
  const [trackRecord, setTrackRecord] = React.useState('');

  const handleAvailableSymbolsChange = ({ target }) => {
    setOpenSymbols(target.value);
  };


  const bondsSymbols = () => {
    window.open("https://docs.google.com/spreadsheets/d/1VZOFoAPhfIigwNSD8j4SjM3VXvJI17uKasW-KH-hjvk/edit#gid=0", '_blank')
  }

  const pairsSymbols = () => {
    window.open("https://docs.google.com/spreadsheets/d/13WBfVqtgm1lpx230yJyvFVxzgGzOwm96BRDtXTq_dMY/edit#gid=0", '_blank')
  }

  const cryptoSymbols = () => {
    window.open("https://docs.google.com/spreadsheets/u/2/d/1AXKooJnZS8j5HoZVLdmls8jh1B9SN7Xyw7EVzClqRW4/edit#gid=0", '_blank')
  }

  const comoditySymbols = () => {
    window.open("https://docs.google.com/spreadsheets/d/1qQSdmshVsYaP_fvwwDx27UlZBe_R57-R8ixmHtqceTU/edit#gid=0", '_blank')
  }

  const stocksSymbols = () => {
    window.open("https://docs.google.com/spreadsheets/u/2/d/1DmFY6gaN8xzYpNCVg6nOE9xpm05zqKQ97vPzXuZ6Dj0/edit#gid=1238020137", '_blank')
  }

  const indexesSymbols = () => {
    window.open("https://docs.google.com/spreadsheets/d/1pN6EFAZOOcmH_34fO1IzlSlEHX6lle3qB4xAYiBjFE8/edit#gid=0", '_blank')
  }


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
      id: 'tp',
      label: 'TP',
      minWidth: 50,
    },
    {
      id: 'sp',
      label: 'SP',
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
    tp,
    sp,
    succeeded,
    PipsesCents,
    Precent
  ) {
    return { Num, Symbol, Operation, StartDate, EndDate, StartPrice, EndPrice, tp, sp, succeeded, PipsesCents, Precent };
  }


  const handleChangePage = (event, newPage) => { //פונקציה לשינוי עמוד
    setPage(newPage); //שינוי הסטייט לעמוד חדש
  };

  const handleChangeRowsPerPage = (event) => { //אפשרות למשתמש לשנות את מספר השורות בעמוד (כרגע מבוטל)
    setRowsPerPage(+event.target.value); //המספר שהמשתמש בחר
    setPage(0);
  };

  // פונקציה שמוסיפה אחוזי הצלחה בראש כל עמוד + משנה ערכים שהם אנדיפיינד
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
      chunk.map((item) => {
        if (item.succeeded === 'undefined') { //במידה וסוקסידד אנדיפיינד
          item.succeeded = 'Position is open'
          unClosedPositions++; // לא סופר פוזיציות פתוחות בחישוב האחוזים
        };
        if (!item.EndPrice) { // במידה ואין מחיר סגירה
          item.EndPrice = 'Position is open'
        }
        if (!item.PipsesCents) { // במידה ואין פיפסים
          item.PipsesCents = 'Position is open'
        }
      });
      // מוצא את אחוזי ההצלחה לפי החישוב הבא: מספר הפוזיציות שהצליחו לחלק לגודל הצ'אנק פחות מספר הפוזיציות שלא נסגרו
      let rate = (succeeded / (chunk.length - unClosedPositions)) * 100;
      rate = rate.toFixed() + '%';
      if (rate === 'NaN%') {
        rate = '0%'
      };
      ratesArray.push(rate);
    });
    arrays.map((array, idx) => array.unshift(createData('', '', '', '', '', '', '', '', '', '', '', ratesArray[idx]))); //הכנסה של עמודת אחוזים לטבלה
    return arrays.flat()
  }

  //פונקציה שמביאה את כל הפוזיציות והמידע של המשתמש
  const getUserData = async () => {
    const details = await axios.get('/auth/userDetails'); // API שמביא דאטא על המשתמש
    const userPositions = await axios.get(`/positions/getUserPositions/${details.data.email}`); // API שמביא את הפוזיציות של המשתמש
    let finalPositions = [];
    for (let i = 0; i < userPositions.data[0].bonds.length; i++) {
      const bond = await axios.get(`positions/getbond/${userPositions.data[0].bonds[i]}`); // כל הבונדים של המשתמש
      finalPositions.push(bond.data[0]);
    }
    for (let i = 0; i < userPositions.data[0].crypto.length; i++) {
      const crypto = await axios.get(`positions/getCrypto/${userPositions.data[0].crypto[i]}`); // כל הקריפטו של המשתמש
      finalPositions.push(crypto.data[0]);
    }
    for (let i = 0; i < userPositions.data[0].comodity.length; i++) {
      const comodity = await axios.get(`positions/getComodity/${userPositions.data[0].comodity[i]}`); // כל הקומודיטי של המשתמש
      finalPositions.push(comodity.data[0]);
    }
    for (let i = 0; i < userPositions.data[0].pairs.length; i++) {
      const currencyPair = await axios.get(`positions/getCurrencyPair/${userPositions.data[0].pairs[i]}`); // כל הקורנסי של המשתמש
      finalPositions.push(currencyPair.data[0]);
    }
    for (let i = 0; i < userPositions.data[0].rest.length; i++) {
      const rest = await axios.get(`positions/getRest/${userPositions.data[0].rest[i]}`); // כל הרסט של המשתמש
      finalPositions.push(rest.data[0]);
    }
    for (let i = 0; i < userPositions.data[0].stocks.length; i++) {
      const stock = await axios.get(`positions/getStock/${userPositions.data[0].stocks[i]}`); // כל הסטוקס של המשתמש
      finalPositions.push(stock.data[0]);
    }

    const sortedPositions = finalPositions.sort((a, b) => { // מסדר את הפוזיציות 
      return b.insertTime - a.insertTime;
    });
    let rows = [];
    let openPositionsEndDates = []
    for (let i = 0; i < sortedPositions.length; i++) { // לולאת פור על כל הפוזיציות של המשתמש
      if (sortedPositions[i].pipsed !== undefined) { //במידה ויש לפוזיציה פיפסים
        sortedPositions[i].pipsed = sortedPositions[i].pipsed.toFixed(5); // מסדר את הפיפסים רק ל3 מספרים אחרי הנקודה
      };
      if (sortedPositions[i].succeeded === undefined) { //במידה והפוזיציה פתוחה
        openPositionsEndDates.push(sortedPositions[i].endDate); // דוחף למערך את תאריך הסגירה של הפוזיציה
      }
      rows.push(createData( // מכין את כל הפוזיציות לטבלה
        i + 1,
        sortedPositions[i].symbol,
        sortedPositions[i].operation,
        sortedPositions[i].startDate,
        sortedPositions[i].endDate,
        sortedPositions[i].startPrice,
        sortedPositions[i].endPrice,
        sortedPositions[i].tp,
        sortedPositions[i].sp.currentStopPrice,
        String(sortedPositions[i].succeeded),
        sortedPositions[i].pipsed,
        sortedPositions[i].Precent
      ))
    };
    props.passEndDates(openPositionsEndDates); // מעביר תאריכים של כל הפוזיציות הפתוחות לקומפוננטה הראשית
    const finalArray = addSuccessRate(rows); // מוסיף אחוזי הצלחה לטבלה
    setPositions(finalArray); // קריאה לפונקציה שמכניסה את הערכים לטבלה
  }
  //פונקציה בשביל ה TRACK RECORD לאיציק
  const handleTrackRecordChange = ({ target }) => {
    alertify.prompt( 'Set your starting capital', 'What was your capital when you first started using the system signals? ($)', '0'
    , function(evt, value) { alertify.success('You entered: ' + value) }
    , function() { alertify.error('Cancel') });
    setTrackRecord(target.value);
  }

  //קיראה לפונקציה שמביאה את כל המידע על המשתמש כשהדף עולה
  useEffect(() => {
    getUserData();
  }, [])

  //קריאה לקומפוננטה הראשית שצריך לרנדר את הטבלה מחדש
  useEffect(() => {
    if (props.reRender === true) {
      getUserData();
    }
  }, [props.reRender]);


  useEffect(() => {
    if (openSymbols === 'crypto') {
      cryptoSymbols();
    }
    if (openSymbols === 'pairs') {
      pairsSymbols();
    }
    if (openSymbols === 'bonds') {
      bondsSymbols();
    }
    if (openSymbols === 'comodity') {
      comoditySymbols();
    }
    if (openSymbols === 'indexes') {
      indexesSymbols();
    }
    if (openSymbols === 'stocks') {
      stocksSymbols();
    }
  }, [openSymbols])

  return (
    <Paper className={classes.root} style={{ paddingTop: '20px' }}>
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
            {positions.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row, idx) => { //מאפינג לדפים
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
        count={positions.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onChangePage={handleChangePage}
        onChangeRowsPerPage={handleChangeRowsPerPage}
      />
      <FormControl style={{ width: '180px', position: 'relative', bottom: '25px', float: 'right', right: '10px' }} >
        <InputLabel style={{ width: '180px', color: 'black' }} >Available Symbols</InputLabel>
        <NativeSelect style={{ width: '180px' }}
          value={openSymbols}
          onChange={handleAvailableSymbolsChange}
        >
          <option aria-label="None" value="" />
          <option value={'crypto'}>Crypto Symbols</option>
          <option value={'pairs'}>Currency Pairs Symbols</option>
          <option value={'stocks'}>Stocks Symbols</option>
          <option value={'bonds'}>Bonds Symbols</option>
          <option value={'comodity'}>Comodity Symbols</option>
          <option value={'indexes'}>Indexes Symbols</option>
        </NativeSelect>
      </FormControl>
      <FormControl style={{ width: '180px', position: 'relative', bottom: '25px', float: 'right', right: '50px' }} >
        <InputLabel style={{ width: '180px', color: 'black' }} >Track Records</InputLabel>
        <NativeSelect style={{ width: '180px' }}
          value={openSymbols}
          onChange={handleTrackRecordChange}
        >
          <option aria-label="None" value="" />
          <option value={'crypto-symbols'} onClick={() => alert('hello')}
          >
            Track-Record Crypto Symbols
          </option>
          <option value={'pairs-symbols'}>Track-Record Currency Pairs Symbols</option>
          <option value={'stocks-symbols'}>Track-Record Stocks Symbols</option>
          <option value={'bonds-symbols'}>Track-Record Bonds Symbols</option>
          <option value={'comodity-symbols'}>Track-Record Commodity Symbols</option>
          <option value={'indexes-symbols'}>Track-Record Indexes Symbols</option>
        </NativeSelect>
      </FormControl>
      <Button
        onClick={() => props.PdfArray(positions.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage))}
        variant="contained"
        color="primary"
        style={
          { fontSize: '14px', position: 'relative', left: '5px', bottom: '10px' }
        }>
        Download Page(PDF)
      </Button>
    </Paper>
  );
}