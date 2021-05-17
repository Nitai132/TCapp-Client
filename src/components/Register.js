import React, { useState, useEffect } from 'react';
import './Register.css';
import axios from 'axios';
import { useHistory } from "react-router-dom";
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Link from '@material-ui/core/Link';
import Grid from '@material-ui/core/Grid';
import WhatsAppIcon from '@material-ui/icons/WhatsApp';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import PhoneInput from 'react-phone-input-2'
import 'react-phone-input-2/lib/style.css'


const useStyles = makeStyles((theme) => ({ //יצירת סטיילינג
  paper: {
    marginTop: theme.spacing(3),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(3),
  },
  submit: {
    margin: theme.spacing(1, 0, 1),
  },
}));

export default function Register() { //פונקציה ראשית - הרשמה
  const classes = useStyles(); //שימוש סטיילינג לפי קלאסים
  const [firstName, setFirstName] = useState(); //סטייט שם פרטי
  const [lastName, setlastName] = useState(); //סטייט שם משפחה
  const [email, setEmail] = useState(); //סטייט אימייל
  const [password, setPassword] = useState(); //סטייט סיסמא
  const [checkBox, setCheckBox] = useState(false); //סטייט קריאת תנאי הרשמה
  const [phoneNumber, setPhoneNumber] = useState();
  const [confirmPass, setConfirmPass] = useState();
  const [emailFlag, setEmailFlag] = useState(false);
  const history = useHistory(); //ריאקט הוקס - ראוטר

  const HandleRegister = async (e) => { //פונקציה שרושמת את המשתמש במערכת
    try {
      if (checkBox === true) { //במידה והמשתמש קרא את התנאים
        if (confirmPass === password) { //מוודא שהסיסמא תואמת
          if (emailFlag === true) {
            const signup = await axios.post('/auth/signup', { //api רושם את המשתמש במערכת
              firstName: firstName,
              lastName: lastName,
              phone: phoneNumber,
              email: email,
              password: password,
            })
            console.log(signup);
            alert(signup.data.message);
            if (signup.data.created === 'true') {
              history.push("/login"); //מעביר את המשתמש לעמוד התחברות במידה והוא נרשם בהצלחה
            }
          } else {
            alert('email is not valid');
          }    
        } else {
          alert('Passwords does not match');
        };
      } else {
        alert('you have to agree to the terms of service'); //הודעת שגיאה במידה והמשתמש לא קרא את התנאים
      }
    } catch {
      alert('something went wrong'); //הודעת שגיאה במידה ומשהו השתבש בדרך
    };
  };

  useEffect(() => {
    if (String(email).includes('@') === true) {
      setEmailFlag(true);
    }
    else {
      setEmailFlag(false);
    };
  }, [email])

  return (
    <div className="container-div">
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <div className={classes.paper}>
          <Typography component="h1" variant="h5">
            Sign up
          </Typography>
          <div className={classes.form} noValidate>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  autoComplete="fname"
                  name="firstName"
                  variant="outlined"
                  required
                  fullWidth
                  id="firstName"
                  label="First Name"
                  autoFocus
                  onChange={({target: {value}}) => setFirstName(value)} //שינוי שם פרטי לפי הערך שהמשתמש בחר
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  variant="outlined"
                  required
                  fullWidth
                  id="lastName"
                  label="Last Name"
                  name="lastName"
                  onChange={({target: {value}}) => setlastName(value)} //שינוי שם משפחה לפי הערך שהמשתמש בחר
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  variant="outlined"
                  required
                  fullWidth
                  id="email"
                  label="Email Address"
                  name="email"
                  onChange={({target: {value}}) => setEmail(value)} //שינוי אימייל לפי הערך שהמשתמש בחר
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  variant="outlined"
                  required
                  fullWidth
                  name="password"
                  label="Password"
                  type="password"
                  id="password"
                  onChange={({target: {value}}) => setConfirmPass(value)} //שינוי סיסמא לפי הערך שהמשתמש בחר
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  variant="outlined"
                  required
                  fullWidth
                  name="confirm"
                  label="confirm password"
                  type="password"
                  id="confirm"
                  onChange={({target: {value}}) => setPassword(value)} //שינוי סיסמא לפי הערך שהמשתמש בחר
                />
              </Grid>
              <Grid item xs={12}>
              <PhoneInput
              style={{
                position: 'relative',
                margin: 'auto',
                width: '300px'
              }}
              country={'ee'}
              onChange={(phone) => setPhoneNumber(phone)}
              />
              </Grid>
              <Grid item xs={12}>
                <FormControlLabel
                  control={<Checkbox value="false" color="primary" />}
                  label="I have read and accept the Terms of service."
                  onClick={() => checkBox == true ? setCheckBox(false) : setCheckBox(true)} //שינוי סטייט שהמשתמש קרא את התנאים
                />
              </Grid>
            </Grid>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              className={classes.submit}
              onClick={()=> HandleRegister()} //קריאה לפונקציית הרשמה
            >
              Sign Up
            </Button>
            <Grid container justify="flex-end">
              <Grid item>
                <Link href="/login" variant="body2" style={{position: 'relative', right: '90px'}}>
                  Already have an account? Sign in
                </Link>
              </Grid>
            </Grid>
          </div>
        </div>
        <h4 style={{textAlign: 'center', position: 'relative', bottom: '10px'}}>
           {<a href="https://wa.me/972585469668">Contact through WhatsApp<WhatsAppIcon></WhatsAppIcon>+972-585-469-668</a> }
        </h4>
        <Grid item xs={12}>
        <img 
            src={'/Logo.jpg'}
            style={{width: '300px', display: 'block', marginLeft: 'auto', marginRight: 'auto', Index: '15',}} 
          />  
          </Grid>
      </Container>
    </div>
  );
}