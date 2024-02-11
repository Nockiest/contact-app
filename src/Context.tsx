import { useContext, createContext, ReactNode, useState, useRef, useEffect } from "react";
import { Contact } from "./types/types";
// import {v4 as uuidv4} from 'uuid';
// import mockContacts from './mockContacts'
import { db } from './firebase'; // Import Firestore from your firebase.js file

import {   collection, getDocs  } from 'firebase/firestore'; // Import necessary Firestore functions

interface ContactContextType {
  chosenContactRef:  Contact | null;
  setChosenContact: (value: Contact | null) => void;
  contacts: Array<Contact>;
  setContacts: (value: any) => void;
  query: string;
  setQuery: (value: string) => void;
}

export const ContactContext = createContext<ContactContextType>({
  chosenContactRef: null,
  setChosenContact: () => {},
  contacts: [],
  setContacts: () => {},
  query: '',
  setQuery: () => {},
});

export const ContextProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [query, setQuery] = useState<string>('')
  const chosenContactRef = useRef<Contact | null>(null);
  const [ trigger, setTrigger] = useState(0); // Add this line
  const setChosenContact = (contact: Contact | null) => {
    chosenContactRef.current = contact;
    setTrigger(prev => prev + 1);
    console.log('newContactREf',  chosenContactRef.current)
  };




  const [contacts, setContacts] = useState<Array<Contact>>([ ]);  //...mockContacts

  // Call the function to add mock contacts to Firestore
  useEffect(() => {
    const fetchDataAndAddMockContacts = async () => {
      try {

        const fetchContacts = async () => {
          try {
            const contactsCollection = collection(db, 'Contacts');
            const contactsSnapshot = await getDocs(contactsCollection);
            const contactsData = contactsSnapshot.docs.map(doc => doc.data() as Contact);
            setContacts(contactsData);
          } catch (error) {
            console.error('Error fetching contacts:', error);
          }
        };


        await fetchContacts();
      } catch (error) {
        console.error('Error:', error);
      }
    };

    fetchDataAndAddMockContacts();
  }, []);

  return (
    <ContactContext.Provider value={{ chosenContactRef: chosenContactRef.current, setChosenContact, contacts, setContacts, query, setQuery }}>
      {children}
    </ContactContext.Provider>
  );
};

export const useContactContext = (): ContactContextType => {
  const context = useContext(ContactContext);
  if (!context) {
    throw new Error(
      "useContactContext must be used within a ContactContextProvider"
    );
  }
  return context;
};
