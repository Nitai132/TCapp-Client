import React, { useRef, useEffect, useState } from "react";
import { useHistory } from "react-router-dom";

import axios from 'axios';

// פונקה ראשית - פייפאל
export default function Paypal() {
  const paypal = useRef(); // רפרנס של פייפאל
  const [userDetails, setUserDetails] = useState({}); // פרטים של המשתמש
  const history = useHistory(); // ריאקט הוקס - ראוטר

  //כשהדף עולה
  useEffect(async () => {
    const userDetails = await axios.get('/auth/userDetails'); // מביא מידע על המשתמש
    if (userDetails.firstName === 'Guest') { // אם המשתמש לא מחובר
      history.push('/') //מעביר אותו לדף הראשי
    }
    setUserDetails(userDetails.data); // שומר את המידע בסטייט
    window.paypal //אובייקט שפייפאל שמים על ווינדו
      .Buttons({ //יצירת כפתור של פייפאל 
        createOrder: (data, actions, err) => {
          return actions.order.create({ //יצירת הכפתור 
            intent: "CAPTURE",
            purchase_units: [
              {
                description: "7 positions of any kinds", //תיאור של המוצר - 7 פוזיציות
                amount: {
                  currency_code: "USD", //סוג מטבע לתשלום - דולר
                  value: 30.0, // מחיר - 30
                },
              },
            ],
          });

        },
        onApprove: async (data, actions) => { //ברגע שההעברה התקבלה
          const userDetails = await axios.get('/auth/userDetails'); //מוודא את המידע על המשתמש
          const checkCredits = await axios.get(`/auth/getUserById/${userDetails.data._id}`) //בודק כמה קרדיטים יש למשתמש 
          const updatedCredits = checkCredits.data.credits + 7 // מוסיף למשתמש 7 קרדיטים
          const addCredits = await axios.post('/auth/changeCredits', { //API שמשנה את הקרדיטים של המשתמש בדאטאבייס
            email: userDetails.data.email, //האימייל של המשתמש
            amount: updatedCredits //כמות הקרדיטים המעודכנת
          })
        },
        onError: (err) => { // במידה ויש שגיאה
          console.log(err); // מדפיס את השגיאה
        },
      })
      .render(paypal.current); // רינדור של הכפתור

    window.paypal //אובייקט שפייפאל שמים על ווינדו
      .Buttons({  //יצירת כפתור של פייפאל 
        createOrder: (data, actions, err) => {
          return actions.order.create({ //יצירת הכפתור 
            intent: "CAPTURE",
            purchase_units: [
              {
                description: "15 positions of any kinds", //תיאור של המוצר - 15 פוזיציות
                amount: {
                  currency_code: "USD", // מטבע - דולר
                  value: 69.0, // מחיר - 69
                },
              },
            ],
          });

        },
        onApprove: async (data, actions) => { //ברגע שההעברה התקבלה
          const userDetails = await axios.get('/auth/userDetails'); //מוודא את המידע על המשתמש
          const checkCredits = await axios.get(`/auth/getUserById/${userDetails.data._id}`); //בודק כמה קרדיטים יש למשתמש 
          const updatedCredits = checkCredits.data.credits + 15 // מוסיף למשתמש 15 קרדיטים
          const addCredits = await axios.post('/auth/changeCredits', { //API שמשנה את הקרדיטים של המשתמש בדאטאבייס
            email: userDetails.data.email, //האימייל של המשתמש
            amount: updatedCredits //כמות הקרדיטים המעודכנת
          })
        },
        onError: (err) => { //במידה ויש שגיאה
          console.log(err); // מדפיס את השגיאה
        },
      })
      .render(paypal.current); // מרנדר את הכפתור של פייפאל

    window.paypal //אובייקט שפייפאל שמים על ווינדו
      .Buttons({  //יצירת כפתור של פייפאל
        createOrder: (data, actions, err) => {
          return actions.order.create({ //יצירת הכפתור 
            intent: "CAPTURE",
            purchase_units: [
              {
                description: "22 positions of any kinds", //תיאור של המוצר - 22 פוזיציות
                amount: {
                  currency_code: "USD",  // מטבע - דולר
                  value: 99.0,// מחיר - 99
                },
              },
            ],
          });

        },
        onApprove: async (data, actions) => { //ברגע שההעברה התקבלה
          const userDetails = await axios.get('/auth/userDetails'); //מוודא את המידע על המשתמש
          const checkCredits = await axios.get(`/auth/getUserById/${userDetails.data._id}`); //בודק כמה קרדיטים יש למשתמש
          const updatedCredits = checkCredits.data.credits + 22 // מוסיף למשתמש 22 קרדיטים
          const addCredits = await axios.post('/auth/changeCredits', { //API שמשנה את הקרדיטים של המשתמש בדאטאבייס
            email: userDetails.data.email, //האימייל של המשתמש
            amount: updatedCredits //כמות הקרדיטים המעודכנת
          })
        },
        onError: (err) => { //במידה ויש שגיאה
          console.log(err); // מדפיס את השגיאה
        },
      })
      .render(paypal.current); // מרדנדר את הכפתור של פייפאל
  }, []);

  return (
    <div style={{ textAlign: 'center' }}>
      <h1 style={{ fontSize: '50px' }}>Our Pricing</h1>
      <h3>
        Hello {userDetails.firstName}, welcome to our pricing page.
            {<br />}
             you can choose the plan that fits you the most and pay through paypal.
             {<br />}
            your credits will be updated as soon as your transection is complete.
        </h3>
      <div style={{ width: '450px', height: '400px', backgroundColor: 'lightblue', margin: 'auto' }}>
        <h2 style={{ position: 'relative', top: '10px', marginLeft: '10px', float: 'left' }}>Basic offer: {<br />}30$ for{<br />} 7 positions</h2>
        <h2 style={{ position: 'relative', bottom: '5px', marginRight: '200px', float: 'left' }}>Gold offer:{<br />} 69$ for {<br />}15 positions</h2>
        <h2 style={{ position: 'relative', float: 'left', bottom: '20px' }}>Platinum offer:{<br />} 99$ for{<br />} 22 positions</h2>
      </div>
      <div ref={paypal} style={{ width: '50px', margin: 'auto', position: 'relative', left: '30px', bottom: '370px' }}>
      </div>
    </div>
  );
}