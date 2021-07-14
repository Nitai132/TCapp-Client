import React, { useState, useEffect } from 'react';
import './Login.css';
import { useHistory } from "react-router-dom";
import axios from 'axios'
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import Link from '@material-ui/core/Link';
import Grid from '@material-ui/core/Grid';
import WhatsAppIcon from '@material-ui/icons/WhatsApp';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';

function Copyright() { //פונקציית זכויות יוצרים
  return (
    <Typography variant="body2" color="textSecondary" align="center">
      {'Copyright © '}
      <Link color="inherit" href="https://tradingandcoffee.com/">
        Trading & Coffee
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}

const useStyles = makeStyles((theme) => ({ //סטיילינג
  paper: {
    marginTop: theme.spacing(8),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: '100%',
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));

export default function Login() { //פונקצייה ראשית - התחברות
  const classes = useStyles(); //סטיילינג לפי קלאסים
  const [userName, setUserName] = useState([]);  //שם משתמש - אימייל
  const [password, setPassword] = useState([]); // סיסמא
  const history = useHistory(); // ריאקט הוקס - ראוטר


  const HandleLogin = async (e) => { //פונקציית התחברות
    try {
      const login = await axios.post('/auth/login', { //API שמחבר את המשתמש
        username: userName,
        password: password
    })
    history.push("/"); //אם המשתמש הצליח להתחבר מעביר אותו לדף הראשי
    } catch {
      alert('wrong username or password'); //אם המשתמש לא הצליח מציג הודעת שגיאה
    };
  };
  
  useEffect(() => {

  })

  return (
    <div className="container-div">
      <Container component="main" maxWidth="xs" style={{backgroundColor: 'white'}}>
        <CssBaseline />
        <div className={classes.paper}>
          <Avatar className={classes.avatar}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Sign in
          </Typography>
          <div className={classes.form} noValidate>
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              autoFocus
              onChange={({target: {value}}) => setUserName(value)} //שינוי שם המשתמש לפי הערך שהכניס
            />
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
              onChange={({target: {value}}) => setPassword(value)} //שינוי סיסמא לפי הערך שהכניס
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              className={classes.submit}
              onClick={() => HandleLogin()} //קריאה לפונקציית התחברות
            >
              Sign In
            </Button>
            <Grid container>
              <Grid item>
                <Link href="/register" variant="body2" style={{position: 'relative', left: '90px'}}>
                  {"Don't have an account? Sign Up"}
                </Link>
              </Grid>
            </Grid>
          </div>
        </div>
        <br />
        <Copyright />
        <h4 style={{textAlign: 'center'}}>
         {<a href="https://wa.me/12407431840">Contact through WhatsApp <WhatsAppIcon></WhatsAppIcon>+1-240-743-1840</a>}
          </h4>
          <img 
            src={'/Logo.jpg'}
            style={{width: '300px', display: 'block', marginLeft: 'auto', marginRight: 'auto',position: 'relative',  bottom: '5px', zIndex: '15',}} 
          />  
      </Container>
    </div>
  );
}