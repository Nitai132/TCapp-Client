import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios'
import { useHistory } from "react-router-dom";
import './HomePage.css';
import { Link } from "react-router-dom";
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import PositionsTable from '../components/PositionsTable';
import NewPositionModal from '../components/NewPositionModal';
import Grid from '@material-ui/core/Grid';
import AdminPanel from '../components/AdminPanel';
import ring from '../assets/ring.mp3';

// פונקציה שמוצאת ברייק פוינטס רספונסיביים ומחלקת אותם לקטגוריות לפי גודל המסך
function getBreakPoint(windowWidth) {
  if (windowWidth) {
    if (windowWidth < 600) {
      return "xs";
    } else if (windowWidth < 960) {
      return "sm";
    } else if (windowWidth < 1280) {
      return "md";
    } else if (windowWidth < 1920) {
      return "lg"
    } else {
      return "xl";
    }
  } else {
    return undefined;
  }
}

//סטיילינג - הוקס
const useStyles = makeStyles((theme) => ({ //שימוש בסטיילינג לפי קלאסים
  root: { //סטייל לרוט דיב
    flexGrow: 1
  },
  Button: { //סטייל לכפתורים
    flexGrow: 0.1,
  },
  title: { //סטייל לכותרות בנאב באר
    flexGrow: 0.12,
    color: 'black'
  },
}));

const HomePage = () => { //פונקציה דף ראשי
  const classes = useStyles(); //שימוש בסטיילינג לקלאסים
  const [timerMinutes, setTimerMinutes] = useState('00'); //סטייט של טיימר - דקות
  const [timerSeconds, setTimerSeconds] = useState('00');//סטייט של טיימר - שניות 
  const [userFirstName, setUserFirstName] = useState('Guest'); //סטייט של שם המשתמש
  const [userPremission, setUserPremission] = useState(''); //סטייט של הראשות משתמש
  const [userCredits, setUserCredits] = useState(0); //סטייט של קרדיט שיש למשתמש
  const [userEmail, setUserEmail] = useState(''); //סטייט אימייל של המשתמש
  const [newPositionsType, setNewPositionsType] = useState();
  const [newPositionsAmount, setNewPositionsAmount] = useState();
  const [newStocksRate, setNewStocksRate] = useState(5);
  const [reRenderTable, setReRenderTable] = useState(false);
  const [relativeEndDate, setRelativeEndDate] = useState();
  const history = useHistory(); // ריאקט הוקס - ראוטר
  const isWindowClient = typeof window === "object";
  const [windowSize, setWindowSize] = useState(
    isWindowClient
      ? getBreakPoint(window.innerWidth) //👈
      : undefined
  );

  useEffect(() => {
    //הנדלר שנקרא ברגע שיש שינוי בגודל המסך
    function setSize() {
      setWindowSize(getBreakPoint(window.innerWidth)); //👈
    }

    if (isWindowClient) {
      //register the window resize listener
      window.addEventListener("resize", setSize);

      //unregister the listerner on destroy of the hook
      return () => window.removeEventListener("resize", setSize);
    }
  }, [isWindowClient, setWindowSize]);

  let audio = new Audio(ring); //יצירת קובץ אודיו 

  const paypal = useRef();

  const HandleLogout = async (e) => { //פונקציה שמנתקת את המשתמש
    await axios.get('/auth/logout'); // API שמנתק את המשתמש
    window.location.reload() //רענון של הדף
  }

  // פונקציה שקוראת לאייפיאיי שמוסיף פוזיציות מסוג קריפטו למשתמש לפי הכמות שבחר
  const addNewCrypto = async () => {
    const getNewCryptos = await axios.get(`/positions/getNewCrypto/${newPositionsAmount}`);
    if (getNewCryptos.data.length < newPositionsAmount) {
      axios.post('/auth/changeCredits', {
        email: userEmail,
        amount: userCredits + newPositionsAmount
      }).then(() => {
        alert('There were not enough positions available. Please refresh the page to get refunded and try again in a few minutes');
      })
    }
    else { 
      for (let i = 0; i < getNewCryptos.data.length; i++) {
        await axios.post('/positions/addNewPosition', {
          type: 'crypto',
          email: userEmail,
          id: getNewCryptos.data[i]._id
        });
      }; 
    }
  };

  // פונקציה שקוראת לאייפיאיי שמוסיף פוזיציות מסוג בונדס למשתמש לפי הכמות שבחר
  const addNewBonds = async () => {
    const getNewBonds = await axios.get(`/positions/getNewBonds/${newPositionsAmount}`);
    if (getNewBonds.data.length < newPositionsAmount) {
      axios.post('/auth/changeCredits', {
        email: userEmail,
        amount: userCredits + newPositionsAmount
      }).then(() => {
        alert('There were not enough positions available. Please refresh the page to get refunded and try again in a few minutes');
      })
    }
    else { 
      for (let i = 0; i < getNewBonds.data.length; i++) {
        await axios.post('/positions/addNewPosition', {
          type: 'bonds',
          email: userEmail,
          id: getNewBonds.data[i]._id
        })
      }
    } 
  }

  // פונקציה שקוראת לאייפיאיי שמוסיף פוזיציות מסוג רסט למשתמש לפי הכמות שבחר
  const addNewRest = async () => {
    const getNewRest = await axios.get(`/positions/getNewRest/${newPositionsAmount}`);
    if (getNewRest.data.length < newPositionsAmount) {
      axios.post('/auth/changeCredits', {
        email: userEmail,
        amount: userCredits + newPositionsAmount
      }).then(() => {
        alert('There were not enough positions available. Please refresh the page to get refunded and try again in a few minutes');
      })
    }
    else { 
      for (let i = 0; i < getNewRest.data.length; i++) {
        axios.post('/positions/addNewPosition', {
          type: 'rest',
          email: userEmail,
          id: getNewRest.data[i]._id
        })
      };
    }
  };

  // פונקציה שקוראת לאייפיאיי שמוסיף פוזיציות מסוג קומודיטי למשתמש לפי הכמות שבחר
  const addNewComodity = async () => {
    const getNewComodity = await axios.get(`/positions/getNewComodity/${newPositionsAmount}`);
    if (getNewComodity.data.length < newPositionsAmount) {
      axios.post('/auth/changeCredits', {
        email: userEmail,
        amount: userCredits + newPositionsAmount
      }).then(() => {
        alert('There were not enough positions available. Please refresh the page to get refunded and try again in a few minutes');
      })
    }
    else { 
      for (let i = 0; i < getNewComodity.data.length; i++) {
        await axios.post('/positions/addNewPosition', {
          type: 'comodity',
          email: userEmail,
          id: getNewComodity.data[i]._id
        })
      };
    }
  };


  // פונקציה שקוראת לאייפיאיי שמוסיף פוזיציות מסוג קורנסי פיירס למשתמש לפי הכמות שבחר
  const addNewPairs = async () => {
    const getNewPairs = await axios.get(`/positions/getNewPairs/${newPositionsAmount}`);
    if (getNewPairs.data.length < newPositionsAmount) {
      axios.post('/auth/changeCredits', {
        email: userEmail,
        amount: userCredits + newPositionsAmount
      }).then(() => {
        alert('There were not enough positions available. Please refresh the page to get refunded and try again in a few minutes');
      })
    }
    else { 
      for (let i = 0; i < getNewPairs.data.length; i++) {
        await axios.post('/positions/addNewPosition', {
          type: 'pairs',
          email: userEmail,
          id: getNewPairs.data[i]._id
        })
      };
    }
  };

  // פונקציה שקוראת לאייפיאיי שמוסיף פוזיציות מסוג סטוקס למשתמש לפי הכמות שבחר
  const addNewStocks = async () => {
    const getNewStocks = await axios.get(`/positions/getNewStocks/${newPositionsAmount}/${newStocksRate}`);
    if (getNewStocks.data.length < newPositionsAmount) {
      axios.post('/auth/changeCredits', {
        email: userEmail,
        amount: userCredits + newPositionsAmount
      }).then(() => {
        alert('There were not enough positions available. Please refresh the page to get refunded and try again in a few minutes');
      })
    }
    else { 
      for (let i = 0; i < getNewStocks.data.length; i++) {
        await axios.post('/positions/addNewPosition', {
          type: 'stocks',
          email: userEmail,
          id: getNewStocks.data[i]._id
        })
      };
    }
  };

  //פונקציה שבודקת אם למשתמש יש מספיק קרדיט לקנות פוזיציה
  const TimerValidation = async (type, amount, stockValue) => {
    setNewPositionsType(type);
    setNewPositionsAmount(amount);
    setNewStocksRate(stockValue);
    if (amount <= userCredits) { //במידה וכמות הפוזיציות קטנה מכמות הקרדיט של המשתמש
      window.localStorage.setItem('timer', 1);
      window.localStorage.setItem('email', userEmail);
      window.localStorage.setItem('type', type);
      window.localStorage.setItem('amount', userCredits);
      startTimer(); //מפעיל את הטיימר
      const updatedCredits = Number(userCredits - amount); //כמות הפוזציות שנקנו פחות כמות הקרדיט של המשתמש
      await axios.post('/auth/changeCredits', { email: userEmail, amount: updatedCredits }); //API עדכון הקרדיט
      setUserCredits(updatedCredits); //עדכון הקרדיט בדפדפן
    } else {
      alert('You dont have enough credits'); //הודעה במידה ואין למשתמש בספיק קרדיט
    }
  };

  // פונקציה שעוצרת את הטיימר ומביאה פיצוי למשתמש
  const stopTimer = async () => {
    window.localStorage.removeItem('timer');
    window.localStorage.removeItem('email');
    window.localStorage.removeItem('type');
    window.localStorage.removeItem('amount');
    const updatedCredits = Number(userCredits + newPositionsAmount); //כמות הפוזציות שנקנו פחות כמות הקרדיט של המשתמש
    await axios.post('/auth/changeCredits', { email: userEmail, amount: updatedCredits }); //API עדכון הקרדיט
    window.location.reload() //רענון של הדף
  }

  //פונקציה שמפעילה את הטיימר 
  const startTimer = () => {
    if (userFirstName !== 'Guest') {
      const timeNowMinutes = new Date().toLocaleTimeString([], { minute: '2-digit' }) // בדיקה מה הזמן כרגע בדקות
      const timeNowSeconds = 60 - new Date().toLocaleTimeString([], { second: '2-digit' }); // בדיקה 60 פחות הזמן כרגע בשניות
      if (Number(timeNowMinutes) < 16) { //במידה והדקות בשעון כרגע פחות מ15
        const timerMinutes = 15 - timeNowMinutes; // מוריד 14 דקות מהשעה הנוכחית (לדוגמא אם כרגע 14:07 התוצאה תהיה 7)
        setTimerMinutes(timerMinutes); // מפעיל את הטיימר על 7 דקות(נוסף פה גם חישוב של שניות בהמשך אז התוצאה תהיה לדוגמא 7:35)
      }
      else if (Number(timeNowMinutes) < 31) { // אותו דבר רק לגבי פחות  מ30 דקות
        const timerMinutes = 30 - timeNowMinutes;
        setTimerMinutes(timerMinutes);
      }
      else if (Number(timeNowMinutes) < 46) { // אותו דבר רק לגבי פחות מ45 דקות
        const timerMinutes = 45 - timeNowMinutes;
        setTimerMinutes(timerMinutes);
      }
      else if (Number(timeNowMinutes) > 46) { // אותו דבר אבל מעל 45 דקות
        const timerMinutes = 60 - timeNowMinutes;
        setTimerMinutes(timerMinutes);
      }
      setTimerSeconds(timeNowSeconds); //חישוב השניות והוספה לטיימר

    }
    else {
      alert('You have to login to get new positions'); //משתמש לא מחובר מנסה להביא פוזיציה
    }
  }

  const TimerHandler = async () => { //פונקציה הגורמת לטיימר לעבוד (הטיימר בודק כל הזמן את השעה הנוכחית ומוודא שהיא תואמת לטיימר) //במידה והטיימר לא על 00:00
    const Interval = setInterval(async () => { //יצירת אינטרבל שעובד כל שנייה
      if (timerMinutes !== -1) { //אם הטיימר לא סיים לעבוד
        const timeNowSeconds = 60 - new Date().toLocaleTimeString([], { second: '2-digit' }); //בדיקת הזמן הנוכחי בשניות
        setTimerSeconds(timeNowSeconds); //שינוי הטיימר בשניות ל60 פחות הזמן הנוכחי בשניות
        clearInterval(Interval); //ניקוי האינטרבל
      }
      else if (timerMinutes === -1 && timerSeconds === '60') { //במידה והטיימר סיים לעבוד
        clearInterval(Interval); //ניקוי אינטרבל
        setTimerSeconds(0); // שינוי השניות ל00
        setTimerMinutes(0); // שינוי הדקות ל00
        window.localStorage.removeItem('timer');
        window.localStorage.removeItem('email');
        window.localStorage.removeItem('type');
        window.localStorage.removeItem('amount');
        audio.play(); // מפעיל את הפעמול 
        if (newPositionsType === 'crypto') { // במידה ונבחר קריפטו
          await addNewCrypto();  // מוסיף קריפטו
        }
        if (newPositionsType === 'bonds') { // במידה ונבחר בונדס
          await addNewBonds(); // מוסיף בונדס
        }
        if (newPositionsType === 'rest') { // במידה ונבחר רסט
          await addNewRest(); // מוסיף רסט
        }
        if (newPositionsType === 'comodity') { // במידה ונבחר קומודיטי
          await addNewComodity(); // מוסיף קומודיטי
        }
        if (newPositionsType === 'pairs') { // במידה ונבחר קורנסי פיירס
          await addNewPairs(); // מוסיף קורנסי פיירס
        }
        if (newPositionsType === 'stocks') { // במידה ונבחר סטוקס
          await addNewStocks(); // מוסיף סטוקס
        }
        handleReRenderTable();
      }
    }, 1000) //סוף האינטרבל
    if (timerSeconds == '1') { //במידה והשניות הגיעו ל1
      setTimeout(async () => {  //יצירת טיים אאוט
        await setTimerMinutes(timerMinutes - 1); //כעבור שנייה הדקות ירדו ב1
        setTimerSeconds('60');
      }, 1000);//סוף הטיים אאוט
    }
  }

  // פונקציה שקוראת לאייפיאיי שמכין פידיאף להורדה
  const downloadPdf = async (positionsArray) => {
    try {
      await axios.post('/pdf/downloadpage', {
        positions: positionsArray,
        email: userEmail
      });
      window.open(`/usersPDF/${userEmail}.pdf`, '_blank')
    } catch (err) {
      console.log(err);
    };
  };

  //פונקציית האנדלר לרענון של הקומפוננטה דרך קומפוננטה אחרת 
  const handleReRenderTable = () => {
    setReRenderTable(true);
    setTimeout(() => {
      setReRenderTable(false);
    }, 5000);
  };

  //אפקט שמריץ את הטיימר
  useEffect(() => {
    if (timerSeconds !== '1' && timerSeconds != 0) {
      TimerHandler(); //קריאה לפונקציה שמפעילה את הטיימר
    }
  }, [timerSeconds]);

  useEffect(async () => { //בעלייה הראשונה של הדף
    const userDetails = await axios.get('/auth/userDetails'); //בודק אם המשתמש מחובר ואם כן מביא את הפרטים שלו
    if (userDetails.data) { //אם המשתמש מחובר
      const userCredits = await axios.get(`/auth/getUserById/${userDetails.data._id}`); //בודק כמה קרדיטים יש למשתמש 
      setUserPremission(userDetails.data.isAdmin); //מציג את ההרשאות של המשתמש
      setUserCredits(userCredits.data.credits); //מציג את כמות הקרדיט של המשתמש לפי הדאטאבייס
      setUserEmail(userDetails.data.email); //מציג את האימייל של המשתמש
      setUserFirstName(userDetails.data.firstName) //מציג את השם הפרטי של המשתמש
    }
  }, [])

  // אפקט שבודק אם המשתמש יצא כשהטיימר עבד ושומר אותו בלוקאל סטוריג
  useEffect(() => {
    if (userFirstName !== 'Guest') { // במידה והמשתמש מחובר
      const StorageTimer = window.localStorage.getItem('timer'); // בודק אם היה לו טיימר שעבד
      const email = window.localStorage.getItem('email'); // מוודא שזה אותו משתמש שסגר את הטיימר
      if (StorageTimer == 1 && email === userEmail) { // במידה ושני התנאים נכונים
        const amount = window.localStorage.getItem('amount'); // מביא את כמות הפוזיציות שהמשתמש רצה לפני שסגר את האתר
        const type = window.localStorage.getItem('type'); // מביא את סוג הפוזיציות שהמשתמש רצה לפני שסגר את האתר
        axios.post('/auth/changeCredits', {
          email: email,
          amount: amount
        })
        .then(() => {
          window.localStorage.setItem('timer', 0);
          window.localStorage.setItem('email', '');
          window.localStorage.setItem('type', '');
          window.localStorage.setItem('amount', '');
          alert('You have left the page while the timer was working. please refreh the application to get refunded.')
        })
      }
    }
  }, [userFirstName]);

  // ימחק בהמשך - פונקציית טסט שמאפסת את הדקות בטיימר למתרות טסטינג
  const testTimer = () => {
    setTimerMinutes(0);
  };

 // פונקציה שמקבלת מהקומפוננטה של הטבלה תאריכים של פוזיציות פתוחות ומרנדרת מחדש את הטבלה כשתאריך סגירה מגיע
  const getEndDateData = (endDatesArray) => {
    //אופציות לטיימר שיפעל על שעון ישראל לפי תאריך
    let options = {
      timeZone: 'Asia/Jerusalem',
      day: '2-digit', month: '2-digit', year: 'numeric', day: '2-digit'
    },
      formatter = new Intl.DateTimeFormat([], options);
    let today = formatter.format(new Date()).replace(/[.]/g, '-'); //התאריך של היום

    let validEndDatesArray = [];

    //בודק שהתאריך של הפוזיציה וולידי
    endDatesArray.map((date) => {
      if (date.slice(0, 10) === today) {
        validEndDatesArray.push(date);
      };
    });
    // מסדר את התאריכים מהקרוב ביותר לרחוק ביותר
    const sortedValidDates = validEndDatesArray.sort((a, b) => {
      return a.slice(10).replace(':', '') - b.slice(10).replace(':', '');
    });

    //אופציות לטיימר שיפעל על שעון ישראל לפי שעה
    let hourOptions = {
      timeZone: 'Asia/Jerusalem',
      hour: '2-digit'
    },
      formatter2 = new Intl.DateTimeFormat([], hourOptions);
    let hour = formatter2.format(new Date());
    //אופציות לטיימר שיפעל על שעון ישראל לפי דקה
    let minuteOptions = {
      timeZone: 'Asia/Jerusalem',
      minute: '2-digit'
    },
      formatter3 = new Intl.DateTimeFormat([], minuteOptions);
    let minutes = formatter3.format(new Date());
    //מוודא שוב שהפוזיציה רלטיבית מבחינת שעות
    const relativeDates = sortedValidDates.filter(date => Number(date.slice(10, 13)) >= hour && Number(date.slice(14, 16)) >= minutes);
    setRelativeEndDate(relativeDates[0]);
  };

  useEffect(() => {
        //אופציות לטיימר שיפעל על שעון ישראל לפי שעה
    let hourOptions = {
      timeZone: 'Asia/Jerusalem',
      hour: '2-digit'
    },
      formatter2 = new Intl.DateTimeFormat([], hourOptions);
    let hour = formatter2.format(new Date());

    //אופציות לטיימר שיפעל על שעון ישראל לפי דקה
    let minuteOptions = {
      timeZone: 'Asia/Jerusalem',
      minute: '2-digit'
    },
      formatter3 = new Intl.DateTimeFormat([], minuteOptions);
    let minutes = formatter3.format(new Date());
    
    if (relativeEndDate) { // אם יש תאריכים רלוונטים
      if (Number(relativeEndDate.slice(10, 13)) === Number(hour)) { //אם השעה של תאריך הסגירה שווה לשעה הנוכחית
        setTimeout(() => { // מפעיל טיימר
          handleReRenderTable(); //מרנדר מחדש את הטבלה
        }, (Number(relativeEndDate.slice(14, 16) - minutes)) * 1000 * 60) // הזמן שהטיימר צריך לעבוד 
      }
    }
  }, [relativeEndDate]);

  const bondsSymbols = ()=> {
    window.open("https://docs.google.com/spreadsheets/d/1VZOFoAPhfIigwNSD8j4SjM3VXvJI17uKasW-KH-hjvk/edit#gid=0", '_blank')
  }

  const pairsSymbols = ()=> {
    window.open("https://docs.google.com/spreadsheets/d/13WBfVqtgm1lpx230yJyvFVxzgGzOwm96BRDtXTq_dMY/edit#gid=0", '_blank')
  }

  const cryptoSymbols = ()=> {
    window.open("https://docs.google.com/spreadsheets/u/2/d/1AXKooJnZS8j5HoZVLdmls8jh1B9SN7Xyw7EVzClqRW4/edit#gid=0", '_blank')
  }

  const comoditySymbols = ()=> {
    window.open("https://docs.google.com/spreadsheets/d/1qQSdmshVsYaP_fvwwDx27UlZBe_R57-R8ixmHtqceTU/edit#gid=0", '_blank')
  }

  const stocksSymbols = ()=> {
    window.open("https://docs.google.com/spreadsheets/u/2/d/1DmFY6gaN8xzYpNCVg6nOE9xpm05zqKQ97vPzXuZ6Dj0/edit#gid=1238020137", '_blank')
  }

  const indexesSymbols = ()=> {
    window.open("https://docs.google.com/spreadsheets/d/1pN6EFAZOOcmH_34fO1IzlSlEHX6lle3qB4xAYiBjFE8/edit#gid=0", '_blank')
  }



  return (
    <div className={classes.root}>
      <AppBar
        position="relative"
        style={{ top: 0, height: '280px', margin: 'auto', paddingTop: '45px', backgroundColor: 'white', zIndex: '10' }}
      >
        <Toolbar>
          <Grid container alignItems="center" justify="center" spacing={2}>
            {userFirstName === 'Guest' && <Grid item xs={5} sm={3}>
              <Typography variant="h6" className={classes.title}>
                Hello {userFirstName}
              </Typography>
            </Grid>}
            {userFirstName !== 'Guest' && <Grid item xs={5} sm={1}>
              <Typography variant="h6" className={classes.title}>
                Hello {userFirstName}
              </Typography>
            </Grid>}
            {userFirstName !== 'Guest' && userPremission !== 1 && <Grid item xs={5} sm={1}>
              <Typography variant="h6" className={classes.title}>
                {userCredits} Credits
            </Typography>
            </Grid>}
            {userPremission !== 1 && timerMinutes == '00' && timerSeconds == '00' &&
              <Grid item xs={8} sm={2}>
                <NewPositionModal handleStartTimer={(type, amount, stockValue) => TimerValidation(type, amount, stockValue)} />
              </Grid>}
            {userPremission !== 1 && timerSeconds != '00' && <Grid item xs={6} sm={2}>
              <Button variant="contained" color="secondary"
                onClick={() => testTimer()}
              >
                Stop timer (refund)
            </Button>
            </Grid>}
            {userPremission !== 1 && userFirstName !== 'Guest' && <Grid item xs={5} sm={1}>
              <Typography variant="h6" className={classes.title}>
                Timer: {timerMinutes}:{timerSeconds}
              </Typography>
            </Grid>}
            {userPremission !== 1 && userFirstName !== "Guest" && <Grid item xs={6} sm={2}>
              <Button
                variant="contained"
                color="primary"
                style={{marginLeft: '35px'}}
                onClick={() => history.push('/payment')}
              >
                Buy Credits
            </Button>
            </Grid>}
            {userPremission !== 1 && userFirstName !== 'Guest' &&<Grid item xs={6} sm={2}>
              <Link to="/contact" style={{ textDecoration: 'none', marginLeft: '30px'}}>
                <Button
                  variant="contained"
                  color="primary"
                >
                  Contact us
              </Button>
              </Link>
            </Grid>}
            {userPremission !== 1 && windowSize !== 'xs' && userFirstName === 'Guest' &&<Grid item xs={6} sm={3}>
              <Link to="/contact" style={{ textDecoration: 'none', marginLeft: '80px'}}>
                <Button
                  variant="contained"
                  color="primary"
                >
                  Contact us
              </Button>
              </Link>
            </Grid>}

            {userPremission !== 1 && windowSize === 'xs' && userFirstName === 'Guest' &&<Grid item xs={6} sm={3}>
              <Link to="/contact" style={{ textDecoration: 'none', marginLeft: '10px'}}>
                <Button
                  variant="contained"
                  color="primary"
                >
                  Contact us
              </Button>
              </Link>
            </Grid>}
            {userFirstName === 'Guest' && <Grid item xs={7} sm={1}>
              <Link to="/login" style={{ textDecoration: 'none' }}>
                <Button variant="contained" color="success">
                  Sign in
              </Button>
              </Link>
            </Grid>}
            {userFirstName === 'Guest' && <Grid item xs={4} sm={1}>
              <Link to="/register" style={{ textDecoration: 'none' }}>
                <Button variant="contained" color="secondary" >
                  Sign up
              </Button>
              </Link>
            </Grid>}

            {userFirstName !== 'Guest' && <Grid item xs={5} sm={1}>
              <Button
                variant="contained"
                color="secondary"
                style={{ fontSize: '15px', position: 'relative' }}
                onClick={() => HandleLogout()} //מבצע התנתקות בלחיצה
              >
                logout
            </Button>
            </Grid>}
            {userPremission === 1 && <AdminPanel />}
            {userPremission !== 1 && windowSize !== 'xs' && <Grid item xs={9} sm={1}>
              <img
                src={'/Logo.jpg'}
                style={{ width: '180px', zIndex: '15', position: 'relative', bottom: '30px' }}
              />
            </Grid>}
            {userPremission !== 1 && windowSize !== 'xs' && <Grid item sm={2}>
              <Button 
              variant="contained"   
              onClick={() => cryptoSymbols()} 
              style={{backgroundColor: 'green', color: 'white'}}>
                Crypto symbols
              </Button>
            </Grid>}
            {userPremission !== 1 && windowSize !== 'xs' && <Grid item sm={2}>
              <Button variant="contained" style={{backgroundColor: 'green', color: 'white'}}
              onClick={() => bondsSymbols()}
              >Bonds symbols</Button>
            </Grid>}
            {userPremission !== 1 && windowSize !== 'xs' && <Grid item sm={2}>
              <Button variant="contained" style={{backgroundColor: 'green', color: 'white'}}
              onClick={() => comoditySymbols()}
              >Comodity symbols</Button>
            </Grid>}
            {userPremission !== 1 && windowSize !== 'xs' && <Grid item sm={2}>
              <Button variant="contained" style={{backgroundColor: 'green', color: 'white'}}
              onClick={() => stocksSymbols()}
              >Stocks symbols</Button>
            </Grid>}
            {userPremission !== 1 && windowSize !== 'xs' && <Grid item sm={2}>
              <Button variant="contained" style={{backgroundColor: 'green', color: 'white'}}
              onClick={() => pairsSymbols()}              
              >Currency pair symbols</Button>
            </Grid>}
            {userPremission !== 1 && windowSize !== 'xs' && <Grid item sm={2}>
              <Button variant="contained" style={{backgroundColor: 'green', color: 'white', marginLeft: '40px'}}
              onClick={() => indexesSymbols()}              
              >Indexes symbols</Button>
            </Grid>}
          </Grid>
        </Toolbar>
      </AppBar>
      {userPremission === 0 &&
        <PositionsTable
          passEndDates={(endDatesArray) => getEndDateData(endDatesArray)}
          reRender={reRenderTable}
          PdfArray={(positionsArray) => downloadPdf(positionsArray)}
        />}
      {userPremission !== 1 && windowSize === 'xs' && <Grid item xs={9} sm={1}>
        <img
          src={'/Logo.jpg'}
          style={{ width: '250px', zIndex: '15', position: 'relative', bottom: '0', top: '20px', left: '25%' }}
        />
      </Grid>}
    </div>
  );
}
export default HomePage;