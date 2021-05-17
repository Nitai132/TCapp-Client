import React from 'react';
import axios from 'axios'
import './Contact.css'
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import {Button} from '@material-ui/core'
import LocationOnIcon from '@material-ui/icons/LocationOn';
import WhatsAppIcon from '@material-ui/icons/WhatsApp';
import EmailIcon from '@material-ui/icons/Email';
import Grid from '@material-ui/core/Grid';


const useStyles = makeStyles((theme) => ({ //יצירת סטייל
  root: {
    '& .MuiTextField-root': {
      margin: theme.spacing(1),
      width: '25ch',
    },
  },
}));

export default function ContactPage() { //פונקציה ראשית - עמוד יצירת קשר
  const classes = useStyles(); //שימוש בסטייל לפי קלאסים
  const [fullName, setfullName] = React.useState(''); //סטייט שם מלא
  const [email, setEmail] = React.useState(''); //סטייט אימייל
  const [message, setMessage] = React.useState(''); //סטייט הודעה

  const handleNameChange = (fullName) => { //פונקציה לשינוי השם
    setfullName(fullName); //משנה את השם לפי הערך שהמשתמש הזין
  };

  const handleEmailChange = (email) => { //פונקציה לשינוי אימייל
    setEmail(email); //משנה את האימייל לפי הערך שהמשתמש הזין
  };

  const handleMessageChange = (message) => { //שינוי ההודעוה
    setMessage(message); //משנה את ההודעה לפי הערך שהמשתמש הזין
  };

  const sendEmail = async (fullName, email, message) => { //שליחת הודעה למערכת
      try {
        await axios.post('/emails/send', { //API שולח הודעה לדאטא בייס
            fullName, 
            email,
            message
        })
        alert('Your message has been sent successfully'); //הודעה שההודעה נשלחה בהצלחה
        setEmail(''); //איפוס אימייל
        setfullName(''); //איפוס שם מלא
        setMessage(''); //איפוס ההודעה
      } catch {
        alert('Something went wrong please try again'); //במקרה של כשלון שולח הודעה שמשהו השתבש
      };
  };

    return (
        <div className={classes.root}>
          <Grid container justify="center" alignItems="center">
              <div style={{textAlign: 'center'}}>
                  <span className="fonted" style={{fontSize: '60px', position: 'relative', top: '20px'}}>Contact Us</span>
                  <br />
                  <br />
                  <span className="fonted2" style={{fontSize: '40px', position: 'relative', top: '20px'}}>We'd love to help!</span>
                  <br />
                  <br />
                  <span className="fonted2" style={{fontSize: '30px', position: 'relative', top: '20px'}}>we Suggest you to send us an Email or a message through Whatsapp</span>
              </div>
          </Grid>
          <Grid container  justify="flex-start" alignItems="center" direction="row">
            <div style={{width: '40%', marginBottom: '200px'}}>
              <Grid container  justify="center" alignItems="flex-end" direction="column">
                <Grid item xs={12}>
                  <TextField
                    style={{
                      position: 'relative',
                      top: '50px',
                      width: '360px',
                    }}
                    id="fullName"
                    label="Your full name"
                    value={fullName}
                    placeholder="example: Nitai Luyckx"
                    onChange={({target: {value}})=> handleNameChange(value)} //קיראה לפונקציה שינוי שם עם הערך שנבחר
                    variant="outlined"
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    style={{
                      position: 'relative',
                      top: '50px',
                      width: '360px'
                    }}
                    value={email}
                    id="email"
                    label="Your email address"
                    placeholder="example: customer@Trading&Coffee.com"
                    variant="outlined"
                    onChange={({target: {value}})=> handleEmailChange(value)} //קיראה לפונקציה שינוי אימייל עם הערך שנבחר
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                  style={{
                    position: 'relative',
                    top: '50px',
                    width: '360px'
                  }}
                  id="message"
                  label="Your message"
                  multiline
                  value={message}
                  rows={10}
                  placeholder="example: I would love to buy some credits. how can i do that?"
                  variant="outlined"
                  onChange={({target: {value}})=> handleMessageChange(value)} //קיראה לפונקציה שינוי הודעה עם הערך שנבחר
                  />
                </Grid>
                <Grid item xs={12}>
                  <Button
                  variant="contained"
                  color="primary"
                  style={{
                      position: 'relative',
                      top: '50px',
                      width: '360px',
                      left: '7px'
                  }}
                  onClick={()=> sendEmail(fullName, email, message)}
                  >
                    <span className="fonted">Send Email</span>
                  </Button>
                </Grid>
              </Grid>
            </div>
            <Grid item xs={12} sm={6}>
            <div style={{margin: '0 auto', width: '100%', position: 'relative', bottom: '10px'}}>
              <Grid container  justify="flex-end" alignItems="center" direction="column">
                <Grid item xs={12}>
                  <a href="https://www.google.co.il/maps/place/Nolimitz/@29.4238044,-98.4927114,18.3z"
                  rel="noreferrer"
                  target="_blank"
                  style={{color: 'black'}}
                  >
                    <LocationOnIcon style={{fontSize: '50px', position: 'relative', top: '10px'}}/>
                    <span className="fonted3"  style={{fontSize: '30px'}}>
                      7292 Dictum Av.San Antonio
                    </span>
                  </a>  
                </Grid>
                <a href="https://wa.me/972585469668"
                target="_blank"
                rel="noreferrer"
                style={{color: 'black'}}
                >
                  <WhatsAppIcon style={{fontSize: '50px', position: 'relative', top: '10px', right: '80px'}} />
                  <span className="fonted3" style={{fontSize: '30px', position: 'relative', right: '70px'}}>
                    Let's talk
                  </span>
                </a>
                <a href="https://mail.google.com/mail/u/0/?fs=1&to=coffeeandtrading@gmail.com&su=SUBJECT&body=BODY&tf=cm"
                target="_blank"
                rel="noreferrer"
                style={{color: 'black'}}
                >
                <EmailIcon style={{fontSize: '50px', position: 'relative', top: '10px', right: '60px'}}/>
                <span className="fonted3" style={{fontSize: '30px', position: 'relative', right: '50px'}}>
                  Send an Email
                </span>
                </a>
              </Grid>
            </div>
            <img 
                
                src={'/Logo.jpg'}
                alt="logo"
                style={{width: '380px',position: 'relative',float: 'right', zIndex: '15', bottom: '20px'}} 
                /> 
            </Grid>
            </Grid>
        </div>
    );
};
