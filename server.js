const express = require('express');
require('dotenv').config();
//console.log(process.env)
const cors = require('cors');
const client = require('twilio')(process.env.TWILIO_ACCOUNTSID, process.env.TWILIO_AUTHTOKEN);
const app = express();
app.use(express.json())

app.use(cors());
app.get('/makecall/:num', (req, res)=>{
  console.log('Hitting the makecall route')
  console.log(req.params.num)
  let outboundNum = '+1' + req.params.num;
  client.calls.create({
    url: 'http://demo.twilio.com/docs/voice.xml',
    to: outboundNum,  //change this to the number of the user in the future
    from: '+13182324682'
  }, function(err, call){
    if (err){
      console.log(err);
    }else {
      console.log(call.sid);
    }
  })
})

app.listen(4000, ()=>{
  console.log("running on 4000");
})
