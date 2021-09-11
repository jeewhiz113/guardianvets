import db from './firebase';
import { collection, getDocs, getDoc, addDoc, doc, onSnapshot, query } from 'firebase/firestore';
import React, { useState, useEffect } from 'react';
import {Form, Button, Table} from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css'

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
    let reqUrl = 'http://localhost:4000/makecall/' + e.target.id;
    fetch(reqUrl, {
      method: "GET",
    }).then(response=>{
      console.log(response)
    }).catch(err => console.log(err))
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
