import db from './firebase';
import { collection, getDocs, getDoc, addDoc, doc, onSnapshot, query } from 'firebase/firestore';
import React, { useState, useEffect } from 'react';
import {Form, Button, Table} from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css'

const accountSid = 'AC4269684a558ff70d56b112ba4cee736f';
  const authToken = 'c55cea294352a06579b023424155ea9b';

var client = require('twilio')(accountSid, authToken);
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


function App() {
  const [contacts, setContacts] = useState(null)
  const [name, setName] = useState(null)
  const [number, setNumber] = useState(null)
  useEffect(()=>{ 
    onSnapshot(collection(db, 'contacts'), (snapshot)=>{
      const data = [];
      snapshot.forEach(doc => {
        data.push(doc.data())
      })
      console.log(data)
      setContacts(data)
    })
  }, [])
  const handleClick = async ()=>{
    const docRef = await addDoc(collection(db, "contacts"), {
      name: name,
      number: number
    })
    console.log("written with doc id: ", docRef.id)
  }
  const registerName = (e)=>{
    console.log(e.target.value)
    setName(e.target.value)
  }
  const registerNumber = (e)=>{
    console.log(e.target.value)
    setNumber(e.target.value)
  }
  const call = (e) =>{
    //console.log(e.target.id)
    //makeCall(e.target.id)
  }
  
  return (
    <div className="App">
      <div className = "AppBody">
        <div className = "ContactInfo">
          <Form>
            <Form.Label>Please enter the contact information below:</Form.Label>
            <Form.Group className="mb-3">
              <Form.Control type="text" placeholder="Enter name" onChange={registerName}/>
            </Form.Group>
          
            <Form.Group className="mb-3">
              <Form.Control type="text" placeholder="Phone Number" onChange={registerNumber}/>
            </Form.Group>
            <Button onClick = {handleClick}>
              Submit
            </Button>
          </Form>
        </div>
        <div className="ContactList">
          <p>Saved Contacts</p>
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>Name</th>
                <th>Phone #</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {contacts != null && contacts.map((user)=>{
                return (
                  <tr>
                    <td>{user.name}</td>
                    <td>{user.number}</td>
                    <td><Button id={user.number} onClick={call}>Call</Button></td>
                  </tr>
                )
              })}
            </tbody>
          </Table>
        </div>
      </div>
    </div>
  );
}

export default App;
