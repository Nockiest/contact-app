import React, { useEffect, useRef, useState } from "react";
import { useContactContext } from "../Context";
import exportIcon from "../assets/export.svg";
// import crossIcon from '../assets/cross.svg';
// import exportIcon from '../assets/export.svg';
import idCard from "../assets/id-card.svg";
import AutocompleteSearchBar from "./SearchBar";
import { Contact } from "../types/types";
import { v4 as uuidv4 } from "uuid";
import AlphabetColumn from "./AlphabetColumn";
import { addDoc, collection } from "firebase/firestore";
import mockContacts from "../mockContacts";
import { db } from "../firebase";
const ContactList = () => {

  const { contacts,  setContacts, query, setChosenContact } = useContactContext();
  const [showContacts, setShowContacts] = useState<boolean>(true);
  const [selectedLetter, setSelectedLetter] = useState<string>("");
  const contactPreviewRef = useRef<HTMLDivElement>(null);
  const addContact = () => {
    const newContact: Omit<Contact, "id"> = {
      name: "Andrew Lukes",
      phoneNumbers: ["1234567890", "9876543210"],
      labels: "#Developer #Suprise",
      emails: ["ondralukes06@seznam.cz"],
      photoURL: "https://example.com/johndoe.jpg",
      address: {
        street: "Medkova 54",
        city: "Praha",
        state: "Cze",
        postalCode: "12345" // Add the postal code here
      },
    };
    setContacts((prev: Contact[]) => [
      ...prev,
      { ...newContact, id: uuidv4() },
    ]);
  };


  useEffect(() => {
    const contactPreview = contactPreviewRef.current;
    console.log(contactPreview,selectedLetter)
    if (!contactPreview) return;

    const contactChildren = contactPreview.querySelectorAll('.contact-preview > div');

    if (!contactChildren) return;

    const sortedContacts = Array.from(contactChildren).sort((a:  Element, b:  Element) => {
      if (!a.textContent || !b.textContent){ return 1000000 }
      const distanceA = Math.abs(a.textContent.charCodeAt(0) - selectedLetter.charCodeAt(0));
      const distanceB = Math.abs(b.textContent.charCodeAt(0) - selectedLetter.charCodeAt(0));
      return distanceA - distanceB;
    });
    if (  sortedContacts[0]){
      sortedContacts[0].scrollIntoView({ behavior: 'smooth', block: 'start' });
    }

  }, [selectedLetter]);

const sortedContacts = [...contacts]
  .filter(contact => contact.name.toLowerCase().includes(query.trim().toLowerCase()))
  .sort((a, b) => a.name.localeCompare(b.name));

   const addMockContactsToFirestore = async () => {
    try {
      const contactsCollection = collection(db, 'Contacts'); // Reference to the "Contacts" collection

      // Iterate over the mockContacts array and add each contact as a document in the "Contacts" collection
      await Promise.all(mockContacts.map(async (contact) => {
        await addDoc(contactsCollection, contact); // Use addDoc instead of setDoc
      }));

      console.log('Mock contacts added to Firestore successfully!');
    } catch (error) {
      console.error('Error adding mock contacts to Firestore:', error);
    }
  };

  //  addMockContactsToFirestore();
  return (
    <div
      style={{
        width: '33%'
      }}
    >
      <div>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            padding: "auto 0",
          }}
        >
          <AutocompleteSearchBar />
        </div>
        <div className="two-column">
          <button
            className="action-button"
            onClick={() => setShowContacts(!showContacts)}
          >
            {showContacts ? <span>Hide</span> : <span>Show</span>} Contacts
          </button>
          <button className="action-button" onClick={() => setContacts([])}>
            Delete All
          </button>
        </div>
      </div>

      <div style={{ display: "flex", height: "300px", width: "100%" }}>
        <div
          className={"contact-preview"}
          style={{ width:'80%', overflowY: "scroll",boxSizing: "border-box"  }}
          ref={contactPreviewRef}
        >
          {showContacts &&
            sortedContacts.map((contact) => (
              <div
                className={contact.name}
                key={contact.name}
                onClick={() => {setChosenContact(contact)} }
                style={{cursor:'pointer'}}
              >
                <img className={"button-icon"} src={idCard} alt="id icon" />
                {contact.name}
              </div>
            ))}
        </div>

        <div style={{ width: "20%" }}>
          <AlphabetColumn setSelectedLetter={setSelectedLetter} />
        </div>
      </div>

      <div>
        <button
          className={"action-button"}
          style={{
            backgroundColor: "green",
            width: "100%",
          }}
          onClick={() => addContact()}
        >
          Přidat Kontakt
        </button>

        <div className="two-column ">
          <button className="action-button" style = {{ display: 'flex', alignItems:'center', justifyContent:'center'}}>
            <img className={"button-icon"} src={exportIcon} alt="export icon" />
             Exportovat
          </button>
          <button className="action-button">Importovat</button>
        </div>
        <div className="two-column ">
          <button className="action-button" onClick={() =>{addMockContactsToFirestore()}} >Nahrát Na Server</button>
          <button className="action-button">Stáhnout Ze Serveru</button>
        </div>
      </div>
    </div>
  );
};

export default ContactList;
