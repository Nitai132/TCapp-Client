import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import InputLabel from '@material-ui/core/InputLabel';
import Input from '@material-ui/core/Input';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import NotificationsActiveIcon from '@material-ui/icons/NotificationsActive';


const useStyles = makeStyles((theme) => ({ //יצירת סטיילינג
  container: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
  },
}));

export default function DialogSelect(props) { //פונקציה ראשית - מודאל התחלת פוזיצייה חדשה
  const classes = useStyles(); //שימוש בסטיילינג לפי קלאסים
  const [open, setOpen] = useState(false); //סטייט של פתיחת המודל
  const [type, setType] = useState('crypto'); //סטייט של סוג הפוזיציה
  const [amount, setAmount] = useState(1); //סטייט של כמות הפוזיציות
  const [stockValue, setstockValue] = useState(5); //סטייט של שווי המניות
  const [stocksFlag, setStocksFlag] = useState(false);
  const [forexFlag, setForexFlag] = useState(true);


  const handleTypeChange = (value) => { //פונקצייה לשינוי סוג הפוזיציה
    setType(value); //משנה את הפוזיציה לפי הערך שנבחר
  };

  const handleAmountChange = (value) => { //פונקציה לשינוי כמות הפוזיציות
    setAmount(value); //שינוי כמות הפוזיציות לפי הערך שנבחר
  };

  const handleStockValueChange = (value) => { //פונקציה לשינוי שווי המניה
    setstockValue(value); //שינוי שווי המניה לערך שנבחר
  };

  const handleClickOpen = () => { //פונקציה לפתיחת המודל
    setOpen(true); //פותח את המודל בעזרת פלאג
  };

  const handleClose = () => { //פונקציה לסגירת המודל
    setOpen(false); //סוגר את המודל בעזרת פלאג
  };

  const closeModalAndStartTimer = (type, amount, stockValue) => { //פונקציה לסגור את המודל ולהפעיל את הטיימר
    handleClose(); //סוגר את המודל
    props.handleStartTimer(type, amount, stockValue); //מפעיל את הטיימר בפונקצייה הראשית
  };

  useEffect(() => {
    let weekday = true;

    let today = {
      timeZone: 'America/New_York',
      weekday: 'short',
    },
      formatter = new Intl.DateTimeFormat('en-US', today);

    if (formatter.format(new Date()) === 'Sat' || formatter.format(new Date()) === 'Sun') {
      weekday = false;
    };
    
    let options = {
      timeZone: 'Asia/Jerusalem',
      hour: 'numeric',
    },
      formatter2 = new Intl.DateTimeFormat([], options);

    if (formatter2.format(new Date()) > 16 && formatter2.format(new Date()) < 21 && weekday) {
      setStocksFlag(true);
    }
  }, [])

  useEffect(() => {
    let today = {
      timeZone: 'America/New_York',
      weekday: 'short',
    },
      formatter = new Intl.DateTimeFormat('en-US', today);
    if (formatter.format(new Date()) === 'Sun') {
      let hour = {
        timeZone: 'America/New_York',
        hour: 'numeric',
      },
        formatter = new Intl.DateTimeFormat([], hour);
      if (formatter.format(new Date()) <= 17) {
        setForexFlag(false);
      }
    }
    if (formatter.format(new Date()) === 'Sat') {
      setForexFlag(false);
    }
    if (formatter.format(new Date()) === 'Fri') {
      let hour = {
        timeZone: 'America/New_York',
        hour: 'numeric',
      },
        formatter = new Intl.DateTimeFormat([], hour);
      if (formatter.format(new Date()) >= 16) {
        setForexFlag(false);
      };
    };
  }, []);


  return (
    <div>
      <Button
        variant="contained"
        color="primary"
        style={{ fontSize: '15px', width: '200px', position: 'relative', bottom: '20px' }}
        onClick={handleClickOpen} //פותח את המודל בלחיצה
      >
        New Positions
            <NotificationsActiveIcon />
      </Button>
      <Dialog disableBackdropClick disableEscapeKeyDown open={open} onClose={handleClose}>
        <DialogTitle>choose the type and amount of positions you want to get</DialogTitle>
        <DialogContent>
          <form className={classes.container}>
            <FormControl className={classes.formControl}>
              <InputLabel htmlFor="demo-dialog-native">Type</InputLabel>
              <Select
                native
                value={type}
                onChange={({ target: { value } }) => handleTypeChange(value)} //קריאה לפונקציה שמשנה את סוג הפוזיציה
                input={<Input id="demo-dialog-native" />}
              >
                <option value='crypto'>Crypto Currency</option>
                {stocksFlag === true && <option value='stocks'>Stocks</option>}
                {forexFlag === true && <option value='pairs'>Currency pairs</option>}
                {forexFlag === true && <option value='comodity'>Comodity</option>}
                {forexFlag === true && <option value='bonds'>Bonds</option>}
                <option value='rest'>Indexes</option>

              </Select>
            </FormControl>
            <FormControl className={classes.formControl}>
              <InputLabel id="demo-dialog-select-label">Positions</InputLabel>
              <Select
                labelId="demo-dialog-select-label"
                id="demo-dialog-select"
                value={amount}
                onChange={({ target: { value } }) => handleAmountChange(value)} //קריאה לפונקציה שמשנה את כמות הפוזיציות
                input={<Input />}
              >
                <MenuItem value={1}>1</MenuItem>
                <MenuItem value={2}>2</MenuItem>
                <MenuItem value={3}>3</MenuItem>
                <MenuItem value={4}>4</MenuItem>
                <MenuItem value={5}>5</MenuItem>
              </Select>
            </FormControl>
            {type === 'stocks' && <FormControl className={classes.formControl}>
              <InputLabel id="demo-dialog-select-label">Stock's value</InputLabel>
              <Select
                labelId="demo-dialog-select-label"
                id="demo-dialog-select"
                value={stockValue}
                onChange={({ target: { value } }) => handleStockValueChange(value)} //קריאה לפונקציה שמשנה את שווי המניה
                input={<Input />}
              >
                <MenuItem value={5}>5$-100$</MenuItem>
                <MenuItem value={100}>100$-200$</MenuItem>
                <MenuItem value={200}>200$+</MenuItem>

              </Select>
            </FormControl>}
          </form>
          <h3>
            the timer will start according to the current time and will stop when the minutes on the clock reach 01/16/31/46
              {<br />}
              (for example: 03:16, 07:46)
          </h3>
          <h4>
            Regular trading hours for the U.S. stock market, including the New York Stock Exchange (NYSE)
            and the Nasdaq Stock Market (Nasdaq), are 9:30 a.m. to 2 p.m.
            Eastern time on weekdays (except stock market holidays, Saturday and Sunday).
          </h4>
          <h4>
            The Forex market (Currency pairs,Comodity and Bonds)is open 24
            hours a day in different parts of the world, from 5 p.m. EST on Sunday until 4 p.m. EST on Friday.
            (except Forex market holidays)
          </h4>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button
            onClick={() => closeModalAndStartTimer(type, amount, stockValue)} //קריאה לפונקציה שמפעילה את הטיימר
            color="primary">
            Start timer
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};