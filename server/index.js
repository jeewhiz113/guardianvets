const express = require('express');
const accountSid = 'AC4269684a558ff70d56b112ba4cee736f';
const authToken = 'c55cea294352a06579b023424155ea9b';

const client = require('twilio')(accountSid, authToken);
const app = express();

app.get('/makecall', (req, res)=>{
  client.calls.create({
    url: 'http://demo.twilio.com/docs/voice.xml',
    to: '+17735017666',  //change this to the number of the user in the future
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
