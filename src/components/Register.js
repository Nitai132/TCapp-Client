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
  const [checkBox2, setCheckBox2] = useState(false); //סטייט מעל גיל 18
  const [phoneNumber, setPhoneNumber] = useState();
  const [confirmPass, setConfirmPass] = useState();
  const [emailFlag, setEmailFlag] = useState(false);
  const history = useHistory(); //ריאקט הוקס - ראוטר

  const HandleRegister = async (e) => { //פונקציה שרושמת את המשתמש במערכת
    try {
      if (checkBox === true) { //במידה והמשתמש קרא את התנאים
        if (checkBox2 === true) {
                  if (confirmPass === password) { //מוודא שהסיסמא תואמת
          if (emailFlag === true) {
            const signup = await axios.post('/auth/signup', { //api רושם את המשתמש במערכת
              firstName: firstName,
              lastName: lastName,
              phone: phoneNumber,
              email: email,
              password: password,
            })
            await axios.post('/emails/sendRegisterationMail', {
              email: email,
              username: email,
              password: password
            })
            alert(signup.data.message);
            if (signup.data.created === 'true') {
              history.push("/login"); //מעביר את המשתמש לעמוד התחברות במידה והוא נרשם בהצלחה
            }
          } else {
            alert('Email is not valid');
          }
        } else {
          alert('Passwords does not match');
        };
      } else {
        alert('You have to confirm you are at least 18 years old')
      }
      } else {
        alert('You have to agree to the terms of service'); //הודעת שגיאה במידה והמשתמש לא קרא את התנאים
      }
    } catch {
      alert('Something went wrong'); //הודעת שגיאה במידה ומשהו השתבש בדרך
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
                  onChange={({ target: { value } }) => setFirstName(value)} //שינוי שם פרטי לפי הערך שהמשתמש בחר
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
                  onChange={({ target: { value } }) => setlastName(value)} //שינוי שם משפחה לפי הערך שהמשתמש בחר
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
                  onChange={({ target: { value } }) => setEmail(value)} //שינוי אימייל לפי הערך שהמשתמש בחר
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
                  onChange={({ target: { value } }) => setConfirmPass(value)} //שינוי סיסמא לפי הערך שהמשתמש בחר
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
                  onChange={({ target: { value } }) => setPassword(value)} //שינוי סיסמא לפי הערך שהמשתמש בחר
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
                  label="I have read and accept the Terms of service, Privacy policy & Disclaimer."
                  onClick={() => checkBox == true ? setCheckBox(false) : setCheckBox(true)} //שינוי סטייט שהמשתמש קרא את התנאים
                />
              </Grid>
              <Grid item xs={12}>
                <FormControlLabel
                  control={<Checkbox value="false" color="primary" />}
                  label="I am over 18 years old"
                  onClick={() => checkBox2 == true ? setCheckBox2(false) : setCheckBox2(true)} //שינוי סטייט שהמשתמש קרא את התנאים
                />
              </Grid>
            </Grid>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              className={classes.submit}
              onClick={() => HandleRegister()} //קריאה לפונקציית הרשמה
            >
              Sign Up
            </Button>
            <Grid container justify="center">
              <Grid item  lg={5}>
                  <Link style={{color: 'black', fontWeight: 'bold'}} href="https://docs.google.com/document/d/1xkG8ccYOo9-h1TdRxQP6MEkWzo4UotttVusHba8h2sU/edit">Terms of services</Link>
              </Grid>
              <Grid item lg={4}>
                  <Link style={{color: 'black', fontWeight: 'bold'}} href="https://docs.google.com/document/d/1YsQbDrYkuke9pX13NmyYDcb9l9kc7qe0wakAvKBeCJ8/edit">Privacy policy</Link>
              </Grid>
              <Grid item lg={3}>
                  <Link style={{color: 'black', fontWeight: 'bold'}} href="https://docs.google.com/document/d/1YsQbDrYkuke9pX13NmyYDcb9l9kc7qe0wakAvKBeCJ8/edit">Disclaimer</Link>
              </Grid>
              
              <br/>
              <br/>

              <Grid item>
                <Link href="/login" variant="body2" style={{color: 'black', fontWeight: 'bold'}}>
                  Already have an account? Sign in
                </Link>
              </Grid>
            </Grid>
          </div>
        </div>
        <h4 style={{ textAlign: 'center', position: 'relative', bottom: '10px' }}>
          {<a href="https://wa.me/12407431840" style={{color: 'black'}}>Contact through WhatsApp<WhatsAppIcon></WhatsAppIcon>+1-240-743-1840</a>}
        </h4>
        <Grid item xs={12}>
          <img
            src={'/Logo.jpg'}
            style={{ width: '300px', display: 'block', marginLeft: 'auto', marginRight: 'auto', Index: '15', }}
          />
        </Grid>
      </Container>
    </div>
  );
}