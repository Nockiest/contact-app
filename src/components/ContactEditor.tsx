import React, {  useState } from "react";
import { Contact, Id } from "../types/types";
import { useContactContext } from "../Context";
import { db, storage } from "../firebase";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { addDoc, collection, doc, getDoc,   updateDoc } from "firebase/firestore";
import {isEmail} from 'validator';
import DeleteButton from "./DeleteButton";
type ContactFormProps = {
  initialContact: Contact;
  setEditMode: (value: any) => void;
};

type HandleChangeProps =
  | {}
  | { postId: Id }
  | { e: React.ChangeEvent<HTMLInputElement>; index: number }
  | { e: React.ChangeEvent<HTMLInputElement> };
const ContactEditor: React.FC<ContactFormProps> = ({
  initialContact,
  setEditMode,
}) => {
  const [editedContact, setEditedContact] = useState<Contact>(initialContact);
  const { contacts, setContacts } = useContactContext();
  const phoneRegex =
    /^(\+\d{1,2}\s?)?1?-?\.?\s?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}$/;
  // const emailRegex = /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/; // this is unsafe
  const labelsRegex = /^(#[\w/-]+\s?)*$/;
  const [imageUpload, setImageUpload] = useState<File | undefined>(undefined); // Change the state type to File | null

  const handleChange = ({ ...props }: HandleChangeProps) => {
    if ("postId" in props) {
      // Handle file upload
      const postId = props.postId;
      const file = imageUpload;

      if (file) {
        const imageRef = ref(storage, `images/${postId}`);
        uploadBytes(imageRef, file).then((snapshot) => {
          getDownloadURL(snapshot.ref).then((url) => {
            console.log(url);
          });
        });
      }
    } else if ("index" in props) {
      // Handle phone/email change
      const { e, index } = props;
      const { name, value } = e.target;

      if (name.startsWith("phoneNumbers") || name.startsWith("emails")) {
        const field = name.startsWith("phoneNumbers")
          ? "phoneNumbers"
          : "emails";
        const newValue = value.trim();
        setEditedContact((prevState) => ({
          ...prevState,
          [field]: prevState[field].map((item, idx) =>
            idx === index ? newValue : item
          ),
        }));
      }
    } else if ("e" in props) {
      // Handle other field changes
      const { e } = props;
      const { name, value } = e.target;
      console.log(name,value)
      if (name.startsWith("address.")) {
        const addressField = name.split(".")[1];
        setEditedContact((prevState) => ({
          ...prevState,
          address: {
            ...prevState.address,
            [addressField]: value.trim(),
          },
        }));
      } else {
        setEditedContact((prevState) => ({
          ...prevState,
          [name]: value.trim(), // Remove leading/trailing spaces
        }));
      }
    } else {
      throw new Error("Invalid props provided to handleChange");
    }
  };

  const uploadFile = (postId: string) => {
    if (!imageUpload) return;
    console.log('uploading file')
    const imageRef = ref(storage, `images/${postId}`);

    uploadBytes(imageRef, imageUpload).then((snapshot) => {
      getDownloadURL(snapshot.ref).then((url) => {
        console.log(url, editedContact.id);
      });
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    let invalidEntries = [];

    const { postalCode } = editedContact.address;

    editedContact.emails.forEach((email, index) => {

      if (!isEmail(email)) {
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

    try {
      const contactRef = doc(db, 'Contacts', editedContact.id.toString());
      const docSnap = await getDoc(contactRef);

      if (docSnap.exists()) {
        await updateDoc(contactRef, editedContact);
        console.log('Contact updated successfully in Firestore');
      } else {
        await addDoc(collection(db, 'Contacts'), editedContact);
        console.log('New contact created successfully in Firestore');
      }

      alert(`contact uploaded ${editedContact.name} sucesfully`)
      setEditMode(false)

    } catch (error) {
      console.error('Error updating/creating contact in Firestore:', error);
      alert(`problem occured when uploading fiel ${error}`)
      return;
    }

    // Update contacts state
    const updatedContacts = contacts.map((contact) =>
      contact.id === editedContact.id ? editedContact : contact
    );
    editedContact.photoURL = `images/${editedContact.id.toString()}`;
    uploadFile(editedContact.id.toString());
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
          onChange={(e) => handleChange({ e })}
        />
      </label>

      {/* Add similar input fields for other properties */}
      {editedContact.phoneNumbers.map((phoneNumber, index) => (
        <div style={{display:'flex'}} key={index}>
          <label>
            Phone Number {index + 1}:
            <input
              type="text"
              name={`phoneNumbers${index}`}
              value={phoneNumber}
              onChange={(e) => handleChange({ e, index })}
            />
          </label>
          <DeleteButton  onClick={() => {
              setEditedContact((prevState) => ({
                ...prevState,
                phoneNumbers: prevState.phoneNumbers.filter((_, i) => i !== index),
              }));
            }} />

        </div>
      ))}
      {/* Add button to add a new phone number */}
    {editedContact.phoneNumbers.length < 3 &&  <button
        type="button"
        onClick={() =>
          setEditedContact((prevState) => ({
            ...prevState,
            phoneNumbers: [...prevState.phoneNumbers, ""],
          }))
        }
      >
        Add Phone Number
      </button>}

      {editedContact.emails.map((email, index) => (
         <div style={{display:'flex'}} key={index}>
          <label>
            Email {index + 1}:
            <input
              type="text"
              name={`emails${index}`}
              value={email}
              onChange={(e) => handleChange({ e, index })}
            />
          </label>
          <DeleteButton  onClick={() => {
              setEditedContact((prevState) => ({
                ...prevState,
                emails: prevState.emails.filter((_, i) => i !== index),
              }));
            }} />

        </div>
      ))}

     {editedContact.emails.length < 3 &&  <button
        type="button"
        onClick={() =>
          setEditedContact((prevState) => ({
            ...prevState,
            emails: [...prevState.emails, ""],
          }))
        }
      >
        Add Email
      </button>}
      <label>
        Labels:
        <input
          type="text"
          name="labels"
          value={editedContact.labels?.replace(/\s+/g, " ")}
          onChange={(e) => handleChange({ e })}
        />
      </label>
      <label>
        Street:
        <input
          type="text"
          name="address.street"
          value={editedContact.address.street || ""}
          onChange={(e) => handleChange({ e })}
        />
      </label>
      <label>
        City:
        <input
          type="text"
          name="address.city"
          value={editedContact.address.city || ""}
          onChange={(e) => handleChange({ e })}
        />
      </label>
      <label>
        State:
        <input
          type="text"
          name="address.state"
          value={editedContact.address.state || ""}
          onChange={(e) => handleChange({ e })}
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
          onChange={(e) => {
            const trimmedValue = e.target.value.replace(/\s/g, ""); // Trim white spaces
            const updatedEvent = {
              ...e,
              target: {
                ...e.target,
                value: trimmedValue,
                name: e.target.name // Preserve the name property
              }
            };
            handleChange({ e: updatedEvent }); // Call handleChange with the updated event object
          }}
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

// const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//   const { name, value } = e.target;
//   const formattedValue = value.replace(/\s/g, "");
//   // Update address fields
//   if (name.startsWith("address.")) {
//     const addressField = name.split(".")[1]; // Extract address field name
//     setEditedContact((prevState) => ({
//       ...prevState,
//       address: {
//         ...prevState.address,
//         [addressField]: formattedValue,
//       },
//     }));
//   } else {
//     // Update other fields
//     setEditedContact((prevState) => ({
//       ...prevState,
//       [name]: formattedValue,
//     }));
//   }
// };

// const handlePhoneChange =
//   (index: number) => (e: React.ChangeEvent<HTMLInputElement>) => {
//     const newPhoneNumbers = [...editedContact.phoneNumbers];
//     newPhoneNumbers[index] = e.target.value;
//     setEditedContact((prevState) => ({
//       ...prevState,
//       phoneNumbers: newPhoneNumbers,
//     }));
//   };

// const handleEmailChange =
//   (index: number) => (e: React.ChangeEvent<HTMLInputElement>) => {
//     const newEmails = [...editedContact.emails];
//     newEmails[index] = e.target.value;
//     setEditedContact((prevState) => ({
//       ...prevState,
//       emails: newEmails,
//     }));
//   };

// const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
//   const file = event.target.files?.[0]; // Get the first file from the selected files
//   if (file) {
//     setImageUpload(file); // Set the file data to the state
//   }
// };
