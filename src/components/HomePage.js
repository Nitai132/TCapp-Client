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
  const [newStocksRate, setNewStocksRate] = useState();
  const [reRenderTable, setReRenderTable] = useState(false);
  const history = useHistory(); // ריאקט הוקס - ראוטר
  const isWindowClient = typeof window === "object";

  const [windowSize, setWindowSize] = useState(
    isWindowClient
      ? getBreakPoint(window.innerWidth) //👈
      : undefined
  );

  useEffect(() => {
    //a handler which will be called on change of the screen resize
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

  let audio = new Audio("/ring.mp3"); //יצירת קובץ אודיו 

  const paypal = useRef();

  const HandleLogout = async (e) => { //פונקציה שמנתקת את המשתמש
    await axios.get('/auth/logout'); // API שמנתק את המשתמש
    window.location.reload() //רענון של הדף
  }

  const addNewCrypto = async () => {
      const getNewCryptos = await axios.get(`/positions/getNewCrypto/${newPositionsAmount}`)
      for (let i=0;i<getNewCryptos.data.length;i++) {
        await axios.post('/positions/addNewPosition', {
          type: 'crypto',
          email: userEmail,
          id: getNewCryptos.data[i]._id
        })
      };
  };

  const addNewBonds = async () => {
      const getNewBonds = await axios.get(`/positions/getNewBonds/${newPositionsAmount}`)
      for (let i=0;i<getNewBonds.data.length;i++) {
        await axios.post('/positions/addNewPosition', {
          type: 'bonds',
          email: userEmail,
          id: getNewBonds.data[i]._id
        })
    }
}

  const addNewRest = async () => {
      const getNewRest = await axios.get(`/positions/getNewRest/${newPositionsAmount}`)
      for (let i=0;i<getNewRest.data.length;i++) {
        axios.post('/positions/addNewPosition', {
          type: 'rest',
          email: userEmail,
          id: getNewRest.data[i]._id
        })
      };
  };

  const addNewComodity = async () => {
      const getNewComodity = await axios.get(`/positions/getNewComodity/${newPositionsAmount}`)
      for (let i=0;i<getNewComodity.data.length;i++) {
        await axios.post('/positions/addNewPosition', {
          type: 'comodity',
          email: userEmail,
          id: getNewComodity.data[i]._id
        })
      };
  };
  
  const addNewPairs = async () => {
      const getNewPairs = await axios.get(`/positions/getNewPairs/${newPositionsAmount}`)
      for (let i=0;i<getNewPairs.data.length;i++) {
        await axios.post('/positions/addNewPosition', {
          type: 'pairs',
          email: userEmail,
          id: getNewPairs.data[i]._id
        })
      };
  };

  const addNewStocks = async () => {
    setTimeout(async () => {
      const getNewStocks = await axios.get(`/positions/getNewStocks/${newPositionsAmount}/${newStocksRate}`)
      for (let i=0;i<getNewStocks.data.length;i++) {
        await axios.post('/positions/addNewPosition', {
          type: 'stocks',
          email: userEmail,
          id: getNewStocks.data[i]._id
        })
      };
    }, 2000);
  };

  const TimerValidation = async (type,amount, stockValue) => { //פונקציה שבודקת אם למשתמש יש מספיק קרדיט לקנות פוזיציה
    setNewPositionsType(type);
    setNewPositionsAmount(amount);
    setNewStocksRate(stockValue);
    if (amount <= userCredits) { //במידה וכמות הפוזיציות קטנה מכמות הקרדיט של המשתמש
      window.localStorage.setItem('timer', 1);
      window.localStorage.setItem('email', userEmail);
      window.localStorage.setItem('type', type);
      window.localStorage.setItem('amount', amount);
      startTimer(); //מפעיל את הטיימר
      const updatedCredits = Number(userCredits-amount); //כמות הפוזציות שנקנו פחות כמות הקרדיט של המשתמש
      await axios.post('/auth/changeCredits', {email: userEmail, amount: updatedCredits}); //API עדכון הקרדיט
      setUserCredits(updatedCredits); //עדכון הקרדיט בדפדפן
    } else {
      alert('You dont have enough credits'); //הודעה במידה ואין למשתמש בספיק קרדיט
    }
  };

  const stopTimer = async () => {
    window.localStorage.removeItem('timer');
    window.localStorage.removeItem('email');
    window.localStorage.removeItem('type');
    window.localStorage.removeItem('amount');
    const updatedCredits = Number(userCredits + newPositionsAmount); //כמות הפוזציות שנקנו פחות כמות הקרדיט של המשתמש
    await axios.post('/auth/changeCredits', {email: userEmail, amount: updatedCredits}); //API עדכון הקרדיט
    window.location.reload() //רענון של הדף
  }

  const startTimer = () => { //פונקציה שמפעילה את הטיימר 
    if (userFirstName !== 'Guest') {
      const timeNowMinutes = new Date().toLocaleTimeString([], {minute: '2-digit'}) // בדיקה מה הזמן כרגע בדקות
      const timeNowSeconds = 60-new Date().toLocaleTimeString([], {second: '2-digit'}); // בדיקה 60 פחות הזמן כרגע בשניות
      if (Number(timeNowMinutes) < 16) { //במידה והדקות בשעון כרגע פחות מ15
        const timerMinutes = 15-timeNowMinutes; // מוריד 14 דקות מהשעה הנוכחית (לדוגמא אם כרגע 14:07 התוצאה תהיה 7)
        setTimerMinutes(timerMinutes); // מפעיל את הטיימר על 7 דקות(נוסף פה גם חישוב של שניות בהמשך אז התוצאה תהיה לדוגמא 7:35)
      } 
      else if (Number(timeNowMinutes) < 31) { // אותו דבר רק לגבי פחות  מ30 דקות
        const timerMinutes = 30-timeNowMinutes;
        setTimerMinutes(timerMinutes);
      }
      else if (Number(timeNowMinutes) < 46) { // אותו דבר רק לגבי פחות מ45 דקות
        const timerMinutes = 45-timeNowMinutes;
        setTimerMinutes(timerMinutes);
      }  
      else if (Number(timeNowMinutes) > 46) { // אותו דבר אבל מעל 45 דקות
        const timerMinutes = 60-timeNowMinutes;
        setTimerMinutes(timerMinutes);
      }
      setTimerSeconds(timeNowSeconds); //חישוב השניות והוספה לטיימר
      
    }
    else {
      alert('You have to login to get new positions'); //משתמש לא מחובר מנסה להביא פוזיציה
    }
  }
  

  const testStartTimer = () => {
    setTimerMinutes(0);
    setTimerSeconds(30);
  }

  const TimerHandler = async () => { //פונקציה הגורמת לטיימר לעבוד (הטיימר בודק כל הזמן את השעה הנוכחית ומוודא שהיא תואמת לטיימר) //במידה והטיימר לא על 00:00
      const Interval = setInterval(async () => { //יצירת אינטרבל שעובד כל שנייה
        if (timerMinutes !== -1)  { //אם הטיימר לא סיים לעבוד
          const timeNowSeconds = 60-new Date().toLocaleTimeString([], {second: '2-digit'}); //בדיקת הזמן הנוכחי בשניות
          setTimerSeconds(timeNowSeconds); //שינוי הטיימר בשניות ל60 פחות הזמן הנוכחי בשניות
          clearInterval(Interval); //ניקוי האינטרבל
        }
        else { //במידה והטיימר סיים לעבוד
          clearInterval(Interval); //ניקוי אינטרבל
          await setTimerSeconds(0); // שינוי השניות ל00
          await setTimerMinutes(0); // שינוי הדקות ל00
          window.localStorage.removeItem('timer');
          window.localStorage.removeItem('email');
          window.localStorage.removeItem('type');
          window.localStorage.removeItem('amount');
          audio.play();
          setTimeout(async () => {
          if (newPositionsType === 'crypto') {
            await addNewCrypto();
            window.location.reload() //רענון של הדף
          }
          if (newPositionsType === 'bonds') {
            await addNewBonds()
            window.location.reload() //רענון של הדף
          }
          if (newPositionsType === 'rest') {
            await addNewRest();
            window.location.reload() //רענון של הדף
          }
          if (newPositionsType === 'comodity') {
            await addNewComodity();
            window.location.reload() //רענון של הדף
          }
          if (newPositionsType === 'pairs') {
            await addNewPairs();
            window.location.reload() //רענון של הדף
          }
          if (newPositionsType === 'stocks') {
            await addNewStocks();
          }
          }, 1000)
        }
      }, 1000) //סוף האינטרבל
    if (timerSeconds == '1') { //במידה והשניות הגיעו ל1
      setTimeout(async () => {  //יצירת טיים אאוט
      await setTimerMinutes(timerMinutes-1); //כעבור שנייה הדקות ירדו ב1
      setTimerSeconds('60');
      }, 1000);//סוף הטיים אאוט
    }
  }

  const downloadPdf = async (positionsArray) => {
    try {
      await axios.post('/pdf/downloadpage', {
        positions: positionsArray,
        email: userEmail
      });
      window.open(`/usersPDF/${userEmail}.pdf`, '_blank')
    } catch(err) {
      console.log(err);
    };
  };

  useEffect(() => {
    if (timerSeconds !== '1' && timerSeconds != 0) {
        TimerHandler(); //קריאה לפונקציה שמפעילה את הטיימר
    }
  }, [timerSeconds]);

  useEffect( async () => { //בעלייה הראשונה של הדף
    const userDetails = await axios.get('/auth/userDetails'); //בודק אם המשתמש מחובר ואם כן מביא את הפרטים שלו
    if (userDetails.data) { //אם המשתמש מחובר
    const userCredits = await axios.get(`/auth/getUserById/${userDetails.data._id}`); //בודק כמה קרדיטים יש למשתמש 
    setUserPremission(userDetails.data.isAdmin); //מציג את ההרשאות של המשתמש
    setUserCredits(userCredits.data.credits); //מציג את כמות הקרדיט של המשתמש לפי הדאטאבייס
    setUserEmail(userDetails.data.email); //מציג את האימייל של המשתמש
    setUserFirstName(userDetails.data.firstName) //מציג את השם הפרטי של המשתמש
    }
  }, [])

  useEffect(() => {
    if (userFirstName !== 'Guest') {
      const StorageTimer = window.localStorage.getItem('timer');
      const email = window.localStorage.getItem('email');
      if (StorageTimer == 1 && email === userEmail) {
        const amount = window.localStorage.getItem('amount');
        const type = window.localStorage.getItem('type');
        setNewPositionsAmount(amount);
        setNewPositionsType(type);
        startTimer();
      }
    }
  }, [userFirstName])

  return (
    <div className={classes.root}>  
      <AppBar 
      position="relative" 
      style={{top: 0, height: '280px', margin: 'auto', paddingTop: '45px', backgroundColor: 'white', zIndex: '10'}}
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
          {userFirstName !== 'Guest' && <Grid item xs={5} sm={1}>
            <Typography variant="h6" className={classes.title}>
            {userCredits} Credits
            </Typography>
          </Grid>}
          { userPremission !== 1 && timerMinutes == '00' && timerSeconds == '00' &&
          <Grid item xs={8} sm={2}>
            <NewPositionModal handleStartTimer={(type, amount)=> TimerValidation(type, amount)}/>
          </Grid> }
          { userPremission !== 1 && timerSeconds != '00' && <Grid item xs={6} sm={1}>
            <Button variant="contained" color="secondary"
            onClick={() => stopTimer()}
            >
              Stop timer (refund)
            </Button> 
          </Grid>}
          { userPremission !== 1 && userFirstName !== 'Guest' && <Grid item xs={5} sm={1}>
            <Typography variant="h6" className={classes.title}>
              Timer: {timerMinutes}:{timerSeconds}
            </Typography>
          </Grid>}
          { userPremission !== 1 && userFirstName !== "Guest" && <Grid item xs={6} sm={2}>
            <Button 
            variant="contained" 
            color="primary" 
            onClick={() => history.push('/payment')}
            >
              Buy Credits
            </Button>
          </Grid>}
          { userPremission !== 1 && <Grid item xs={6} sm={2}>
            <Link to="/contact" style={{ textDecoration: 'none' }}>
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
            style={{fontSize: '15px', position: 'relative'}}
            onClick={()=> HandleLogout()} //מבצע התנתקות בלחיצה
            >
              logout
            </Button>
            </Grid>}

            {userPremission === 1 && <AdminPanel />}
          {userPremission !== 1 && windowSize !== 'xs' && <Grid item xs={9} sm={1}>
             <img 
            src={'/Logo.jpg'}
            style={{width: '180px', zIndex: '15', position: 'relative', bottom: '30px'}} 
            />
          </Grid>}
          </Grid>
        </Toolbar>
      </AppBar>    
      {userPremission === 0 && <PositionsTable reRender={reRenderTable} PdfArray={(positionsArray)=> downloadPdf(positionsArray)}/>}
      {userPremission !== 1 && windowSize === 'xs' && <Grid item xs={9} sm={1}>
             <img 
            src={'/Logo.jpg'}
            style={{width: '250px', zIndex: '15', position: 'relative', bottom: '0', top: '20px', left: '25%'}} 
            />
          </Grid>}
    </div>  
  );   
}
export default HomePage;