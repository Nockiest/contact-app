import React from "react";
import "./App.css";
import ContactList from "./components/ContactList";
import OneContact from "./components/OneContact";
import Header from "./components/Header";
import {   useContactContext  } from "./Context";
import { useMediaQuery } from "@mui/material";

function App() {
  const { chosenContactId } = useContactContext();
  const bigScreen = useMediaQuery('(min-width:800px)');
  return (


      <div className="App">
        <Header />
        <div
          style={{
            maxWidth: "1000px",
            margin: "0px auto",
            display: "flex",
            justifyContent: "center",
            border: "1px solid",
            height: '100%'
          }}
        >

          {bigScreen? <>
           <div style={{ width: "66%" }}> <OneContact /></div>
           <div style={{ width: "33%" }}>  <ContactList /></div>

          </> : <>
           <div>{chosenContactId? <OneContact />:  <ContactList />}</div>
          </>}

        </div>
      </div>


  );
}

export default App;
        /* <p style={{color:'black'}}>Screen: {bigScreen ? 'Big' : 'Small'}, Contact: {chosenContactId  || 'No contact selected'}</p> */