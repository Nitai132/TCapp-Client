import React, { useRef, useEffect, useState } from "react";
import axios from 'axios';

export default function Paypal() {
  const paypal = useRef();
  const [userDetails, setUserDetails] = useState({});


  useEffect(async () => {
    const userDetails = await axios.get('/auth/userDetails');
    setUserDetails(userDetails.data);
     window.paypal
      .Buttons({
        createOrder: (data, actions, err) => {
          return actions.order.create({
            intent: "CAPTURE",
            purchase_units: [
              {
                description: "7 positions of any kinds",
                amount: {
                  currency_code: "USD",
                  value: 30.0,
                },
              },
            ],
          });
          
        },
        onApprove: async (data, actions) => {
            const userDetails = await axios.get('/auth/userDetails');
            const checkCredits = await axios.get(`/auth/getUserById/${userDetails.data._id}`)
            const updatedCredits = checkCredits.data.credits + 7
            const addCredits = await axios.post('/auth/changeCredits', {
                email: userDetails.data.email,
                amount: updatedCredits
          })
        },
      })
      .render(paypal.current);
      window.paypal
      .Buttons({
        createOrder: (data, actions, err) => {
          return actions.order.create({
            intent: "CAPTURE",
            purchase_units: [
              {
                description: "15 positions of any kinds",
                amount: {
                  currency_code: "USD",
                  value: 69.0,
                },
              },
            ],
          });
          
        },
        onApprove: async (data, actions) => {
            const userDetails = await axios.get('/auth/userDetails');
            const checkCredits = await axios.get(`/auth/getUserById/${userDetails.data._id}`)
            const updatedCredits = checkCredits.data.credits + 15
            const addCredits = await axios.post('/auth/changeCredits', {
                email: userDetails.data.email,
                amount: updatedCredits
          })
        },
        onError: (err) => {
          console.log(err);
        },
      })
      .render(paypal.current);
      window.paypal
      .Buttons({
        createOrder: (data, actions, err) => {
          return actions.order.create({
            intent: "CAPTURE",
            purchase_units: [
              {
                description: "22 positions of any kinds",
                amount: {
                  currency_code: "USD",
                  value: 99.0,
                },
              },
            ],
          });
          
        },
        onApprove: async (data, actions) => {
            const userDetails = await axios.get('/auth/userDetails');
            const checkCredits = await axios.get(`/auth/getUserById/${userDetails.data._id}`)
            const updatedCredits = checkCredits.data.credits + 22
            const addCredits = await axios.post('/auth/changeCredits', {
                email: userDetails.data.email,
                amount: updatedCredits
          })
        },
        onError: (err) => {
          console.log(err);
        },
      })
      .render(paypal.current);
  }, []);

  return (
    <div style={{textAlign: 'center'}}>
        <h1 style={{fontSize: '50px'}}>Our Pricing</h1>
        <h3>
            Hello {userDetails.firstName}, welcome to our pricing page.
            {<br />}
             you can choose the plan that fits you the most and pay through paypal. 
             {<br />}
            your credits will be updated as soon as your transection is complete.
        </h3>
        <div style={{width: '450px', height: '400px', backgroundColor: 'lightblue',margin: 'auto'}}>
            <h2 style={{position: 'relative',top: '10px', marginLeft: '10px', float: 'left' }}>Basic offer: {<br />}30$ for{<br />} 7 positions</h2>
            <h2  style={{position: 'relative',bottom: '5px', marginRight: '200px', float: 'left' }}>Gold offer:{<br />} 69$ for {<br />}15 positions</h2>
            <h2  style={{position: 'relative', float: 'left', bottom: '20px' }}>Platinum offer:{<br />} 99$ for{<br />} 22 positions</h2>
            </div>
        <div ref={paypal} style={{width: '50px', margin: 'auto', position: 'relative', left: '30px', bottom: '370px'}}>
        </div>
    </div>
  );
}