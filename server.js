const express = require('express');
require('dotenv').config();
const cors = require('cors');
const client = require('twilio')(process.env.TWILIO_ACCOUNTSID, process.env.TWILIO_AUTHTOKEN);
const stripe = require("stripe")(process.env.STRIPE_SECRETKEY);
console.log(process.env)
const uuid = require("uuid").v4;
const app = express();
app.use(express.json());
app.use(cors());

app.get('/makecall/:num', (req, res)=>{
  console.log('Hitting the makecall route')
  console.log(req.params.num)
  let outboundNum = '+1' + req.params.num;
  client.calls.create({
    url: 'http://demo.twilio.com/docs/voice.xml',
    to: outboundNum, 
    from: '+13182324682'
  }, function(err, call){
    if (err){
      console.log(err);
    }else {
      console.log(call.sid);
    }
  })
})

app.post('/checkout', async (req, res)=>{
  let chargeStatus;
  let callMessage;
  const {token, outboundNumber} = req.body;
  try {
    const customer = await stripe.customers.create({
      email: token.email,
      source: token.id
    })
    const idempotencyKey = uuid();
    const charge = await stripe.charges.create(
      {
        amount: 50,
        currency: "usd",
        customer: customer.id,
        receipt_email: token.email,
        description: "Phone Call",
        shipping: {
          name: token.card.name,
          address:{
            line1: token.card.address_line1,
            line2: token.card.address_line2,
            city: token.card.address_city,
            country: token.card.address_country,
            postal_code: token.card.address_zip
          }
        }
      },
      {
        idempotencyKey
      }
    );
    chargeStatus = "success";
  }catch (error){
    console.log("Error:", error);
    chargeStatus = "failed"
  }
  if (chargeStatus === "success"){
    client.calls.create({
        url: 'http://demo.twilio.com/docs/voice.xml',
        to: outboundNumber,
        from: '+13182324682'
      }, function(err, call){
        if (err){
          callMessage = "an error occured while calling that number"
          console.log(err);
        }else {
          callMessage = "Call made to that number"
          console.log(call.sid);
        }
      })
  }else {
    callMessage = "call was not made";
  }
  res.json({chargeStatus, callMessage})
})

app.listen(4000, ()=>{
  console.log("running on 4000");
})
