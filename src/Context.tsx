import { useContext, createContext, ReactNode, useState,   useEffect } from "react";
import { Contact, Id } from "./types/types";
import { db } from './firebase'; // Import Firestore from your firebase.js file

import {   collection, getDocs  } from 'firebase/firestore'; // Import necessary Firestore functions

interface ContactContextType {
  chosenContactId:  Id|null;
  setChosenId: (value: Id | null) => void;
  contacts: Array<Contact>;
  setContacts: (value: any) => void;
  query: string;
  setQuery: (value: string) => void;
  editMode: boolean;
  setEditMode: (value: boolean) => void;
}

export const ContactContext = createContext<ContactContextType>({
  chosenContactId: null,
  setChosenId: () => {},
  contacts: [],
  setContacts: () => {},
  query: '',
  setQuery: () => {},
  editMode: false,
  setEditMode: () => {},
});

export const ContextProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [query, setQuery] = useState<string>('');
  const [chosenContactId, setChosenId] = useState<Id | null>(null);
  const [contacts, setContacts] = useState<Array<Contact>>([]);
  const [editMode, setEditMode] = useState<boolean>(false);
  useEffect(() => {
    const fetchDataAndAddMockContacts = async () => {
      try {
        const fetchContacts = async () => {
          try {
            const contactsCollection = collection(db, 'Contacts');
            const contactsSnapshot = await getDocs(contactsCollection);
            const contactsData = contactsSnapshot.docs.map(doc => {
              const contactData = doc.data() as Contact;
              return { ...contactData, id: doc.id }; // Add the document ID to the contact object
            });
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
    <ContactContext.Provider value={{editMode, setEditMode, chosenContactId, setChosenId, contacts, setContacts, query, setQuery }}>
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