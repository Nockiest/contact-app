import React, { useRef, useState } from "react";
import { Contact } from "../types/types";
import { useContactContext } from "../Context";

type ContactFormProps = {
  initialContact: Contact;
  setEditMode: (value: any) => void;
};

const ContactEditor: React.FC<ContactFormProps> = ({
    initialContact,
    setEditMode,
  }) => {
    const [editedContact, setEditedContact] = useState<Contact>(initialContact);
    const { contacts, setContacts } = useContactContext();
    const phoneRegex =
      /^(\+\d{1,2}\s?)?1?-?\.?\s?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}$/;
    const emailRegex = /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/; // this is unsafe
    const labelsRegex = /^(#[\w/-]+\s?)*$/;
    // const addressRegex =
    // /^[a-zA-Z0-9\s,.'-]+(\n|$)[a-zA-Z\s,'-]+(\n|$)([a-zA-Z\s,'-]+)?(\n|$)\d{5}$/;

    // Refs for address fields
    const streetRef = useRef<HTMLInputElement>(null);
    const cityRef = useRef<HTMLInputElement>(null);
    const stateRef = useRef<HTMLInputElement>(null);
    const postalCodeRef = useRef<HTMLInputElement>(null);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value } = e.target;
      const formattedValue = value.replace(/\s/g, '');
      // Update address fields
      if (name.startsWith('address.')) {
        const addressField = name.split('.')[1]; // Extract address field name
        setEditedContact((prevState) => ({
          ...prevState,
          address: {
            ...prevState.address,
            [addressField]: formattedValue,
          },
        }));
      } else {
        // Update other fields
        setEditedContact((prevState) => ({
          ...prevState,
          [name]: formattedValue,
        }));
      }
    };

    const handlePhoneChange = (index: number) => (e: React.ChangeEvent<HTMLInputElement>) => {
      const newPhoneNumbers = [...editedContact.phoneNumbers];
      newPhoneNumbers[index] = e.target.value;
      setEditedContact((prevState) => ({
        ...prevState,
        phoneNumbers: newPhoneNumbers,
      }));
    };

    const handleEmailChange = (index: number) => (e: React.ChangeEvent<HTMLInputElement>) => {
      const newEmails = [...editedContact.emails];
      newEmails[index] = e.target.value;
      setEditedContact((prevState) => ({
        ...prevState,
        emails: newEmails,
      }));
    };

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      let invalidEntries = [];

      const { street, city, state, postalCode } = editedContact.address;


      editedContact.emails.forEach((email, index) => {
        if (!emailRegex.test(email)) {
          invalidEntries.push(`Email ${index + 1}`);
        }
      });

      editedContact.phoneNumbers.forEach((phoneNumber, index) => {
        if (!phoneRegex.test(phoneNumber)) {
          invalidEntries.push(`Phone Number ${index + 1}`);
        }
      });

      if (!labelsRegex.test(editedContact.labels || "")) {
        invalidEntries.push("Labels");
      }

      if ((!postalCode?.trim() || !/^\d{5}$/.test(postalCode.trim())) && postalCode !== null) {
        invalidEntries.push("Postal Code");
      }

      if (invalidEntries.length > 0) {
        alert(`The following parts of the address are invalid: ${invalidEntries.join(", ") } ${ postalCode}`);
        return;
      }

      const updatedContacts = contacts.map((contact) => (contact.id === editedContact.id ? editedContact : contact));
      setContacts(updatedContacts);
    //   initialContact = editedContact
      console.log(editedContact,  contacts.find((contact) => {return contact.id === editedContact.id}))
      setEditMode(false);
    };

    return (
      <form
        onSubmit={handleSubmit}
        style={{ display: "flex", flexDirection: "column", alignItems: "start", margin:'1rem' }}
      >
        <label>
          Name:
          <input
            type="text"
            name="name"
            value={editedContact.name}
            onChange={handleChange}
          />
        </label>

        {/* Add similar input fields for other properties */}
        {editedContact.phoneNumbers.map((phoneNumber, index) => (
          <label key={index}>
            Phone Number {index + 1}:
            <input
              type="text"
              name={`phoneNumbers${index}`}
              value={phoneNumber}
              onChange={handlePhoneChange(index)}
            />
          </label>
        ))}
        <button
          type="button"
          onClick={() =>
            setEditedContact((prevState) => ({
              ...prevState,
              phoneNumbers: [...prevState.phoneNumbers, ""],
            }))
          }
        >
          Add Phone Number
        </button>
        {editedContact.emails.map((email, index) => (
          <label key={index}>
            Email {index + 1}:
            <input
              type="text"
              name={`emails${index}`}
              value={email}
              onChange={handleEmailChange(index)}
            />
          </label>
        ))}
        <button
          type="button"
          onClick={() =>
            setEditedContact((prevState) => ({
              ...prevState,
              emails: [...prevState.emails, ""],
            }))
          }
        >
          Add Email
        </button>

        <label>
          Labels:
          <input
            type="text"
            name="labels"
            value={editedContact.labels?.replace(/\s+/g, " ")}
            onChange={handleChange}
          />
        </label>
        {/* Separate input fields for address */}
        <label>
          Street:
          <input
            type="text"
            name="address.street"
            value={editedContact.address.street || ''}
            onChange={handleChange}
            ref={streetRef}
          />
        </label>
        <label>
          City:
          <input
            type="text"
            name="address.city"
            value={editedContact.address.city || ''}
            onChange={handleChange}
            ref={cityRef}
          />
        </label>
        <label>
          State:
          <input
            type="text"
            name="address.state"
            value={editedContact.address.state || ''}
            onChange={handleChange}
            ref={stateRef}
          />
        </label>
      <label>
  Postal Code:
  <input
    type="text"
    name="address.postalCode"
    value={editedContact.address.postalCode ? `${editedContact.address.postalCode.slice(0, 3)} ${editedContact.address.postalCode.slice(3)}` : ''}
    onChange={handleChange}
    ref={postalCodeRef}
  />
</label>

        <button className={'action-button'} type="submit">Submit</button>
      </form>
    );
  };

  export default ContactEditor;