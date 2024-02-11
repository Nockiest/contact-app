import React, {   useRef, useState } from "react";
import { Contact, Id } from "../types/types";
import { useContactContext } from "../Context";
import { storage } from "../firebase";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";

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
  const [imageUpload, setImageUpload] = useState<File | undefined>(undefined); // Change the state type to File | null


  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const formattedValue = value.replace(/\s/g, "");
    // Update address fields
    if (name.startsWith("address.")) {
      const addressField = name.split(".")[1]; // Extract address field name
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

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]; // Get the first file from the selected files
    if (file) {
      setImageUpload(file); // Set the file data to the state
    }
  };

  const uploadFile = (postId: string) => {
    if (!imageUpload) return;

    const imageRef = ref(storage, `images/${postId}`);

    uploadBytes(imageRef, imageUpload).then((snapshot) => {
      getDownloadURL(snapshot.ref).then((url) => {
        console.log(url);
      });
    });
  };
  const handlePhoneChange =
    (index: number) => (e: React.ChangeEvent<HTMLInputElement>) => {
      const newPhoneNumbers = [...editedContact.phoneNumbers];
      newPhoneNumbers[index] = e.target.value;
      setEditedContact((prevState) => ({
        ...prevState,
        phoneNumbers: newPhoneNumbers,
      }));
    };

  const handleEmailChange =
    (index: number) => (e: React.ChangeEvent<HTMLInputElement>) => {
      const newEmails = [...editedContact.emails];
      newEmails[index] = e.target.value;
      setEditedContact((prevState) => ({
        ...prevState,
        emails: newEmails,
      }));
    };
      const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        let invalidEntries = [];

        const { postalCode } = editedContact.address;

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

        if (
          (!postalCode?.trim() || !/^\d{5}$/.test(postalCode.trim())) &&
          postalCode !== null
        ) {
          invalidEntries.push("Postal Code");
        }

        if (invalidEntries.length > 0) {
          alert(
            `The following parts of the address are invalid: ${invalidEntries.join(
              ", "
            )} `
          );
          return;
        }

        const updatedContacts = contacts.map((contact) =>
          contact.id === editedContact.id ? editedContact : contact
        );
        editedContact.photoURL =`images/${editedContact.id.toString()}`
        uploadFile(editedContact.id.toString())
        setContacts(updatedContacts);
        setEditMode(false);

      };

  return (
    <form
      onSubmit={handleSubmit}
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "start",
        margin: "1rem",
      }}
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
      <label>
        Street:
        <input
          type="text"
          name="address.street"
          value={editedContact.address.street || ""}
          onChange={handleChange}

        />
      </label>
      <label>
        City:
        <input
          type="text"
          name="address.city"
          value={editedContact.address.city || ""}
          onChange={handleChange}

        />
      </label>
      <label>
        State:
        <input
          type="text"
          name="address.state"
          value={editedContact.address.state || ""}
          onChange={handleChange}

        />
      </label>
      <label>
        Postal Code:
        <input
          type="text"
          name="address.postalCode"
          value={
            editedContact.address.postalCode
              ? `${editedContact.address.postalCode.slice(
                  0,
                  3
                )} ${editedContact.address.postalCode.slice(3)}`
              : ""
          }
          onChange={handleChange}

        />
      </label>
      <label>
  Image URL:
  <input
    type="file"
    onChange={(event) => {
      setImageUpload(event.target.files?.[0]);
    }}
  />
</label>
      <button className={"action-button"} type="submit">
        Submit
      </button>
    </form>
  );
};

export default ContactEditor;
