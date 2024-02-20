import  { useEffect, useRef, useState } from "react";
import { useContactContext } from "../Context";
import exportIcon from "../assets/export.svg";
import idCard from "../assets/id-card.svg";
import AutocompleteSearchBar from "./SearchBar";
import { Contact } from "../types/types";
import { v4 as uuidv4 } from "uuid";
import AlphabetColumn from "./AlphabetColumn";
import { addContactsToFirestore, newContact } from "../utils";
import mockContacts from "../mockContacts";
import { collection } from "firebase/firestore";
import { db } from "../firebase";

const ContactList = () => {
  const { contacts, setContacts, query, setChosenId, setEditMode } = useContactContext();
  const [showContacts, setShowContacts] = useState<boolean>(true);
  const [selectedLetter, setSelectedLetter] = useState<string>("");
  const contactPreviewRef = useRef<HTMLDivElement>(null);
  const addContact = () => {
    //newContact
    const createdContacct:Contact =  {  ...newContact, id: uuidv4() }
    setContacts((prev: Contact[]) => [
      ...prev,
      createdContacct,
    ]);
    setChosenId(createdContacct.id)
    setEditMode(true)
  };

  useEffect(() => {
    const contactPreview = contactPreviewRef.current;
    console.log(contactPreview, selectedLetter);
    if (!contactPreview) return;

    const contactChildren = contactPreview.querySelectorAll(
      ".contact-preview > div"
    );

    if (!contactChildren) return;

    const sortedContacts = Array.from(contactChildren).sort(
      (a: Element, b: Element) => {
        if (!a.textContent || !b.textContent) {
          return 1000000;
        }
        const distanceA = Math.abs(
          a.textContent.charCodeAt(0) - selectedLetter.charCodeAt(0)
        );
        const distanceB = Math.abs(
          b.textContent.charCodeAt(0) - selectedLetter.charCodeAt(0)
        );
        return distanceA - distanceB;
      }
    );
    if (sortedContacts[0]) {
      sortedContacts[0].scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [selectedLetter]);

  const sortedContacts = [...contacts]
    .filter((contact) =>
      contact.name.toLowerCase().includes(query.trim().toLowerCase())
    )
    .sort((a, b) => a.name.localeCompare(b.name));

  return (
    <div
    style={{

      margin: "15px 1rem",
    }}
    >

        <div
          style={{
            display: "flex",
            justifyContent: "center",
            padding: "auto 1rem",
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


      <div style={{ display: "flex", height: "300px", width: "100%" }}>
        <div
          className={"contact-preview"}
          style={{ width: "80%", overflowY: "scroll", boxSizing: "border-box" }}
          ref={contactPreviewRef}
        >
          {showContacts &&
            sortedContacts.map((contact) => (
              <div
                className={contact.name}
                key={contact.name}
                onClick={() => {
                  setChosenId(contact.id);
                  setEditMode(false)
                }}
                style={{ cursor: "pointer" }}
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

        <div className="two-column">
          <button
            className="action-button"
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <img className={"button-icon"} src={exportIcon} alt="export icon" />
            Exportovat
          </button>
          <button className="action-button">Importovat</button>
        </div>
        <div className="two-column">
          <button
            className="action-button"
            onClick={() => {
              addContactsToFirestore(mockContacts, collection(db, "Contacts"));
            }}
          >
            Nahrát Na Server
          </button>
          <button className="action-button">Stáhnout Ze Serveru</button>
        </div>
      </div>
    </div>
  );
};

export default ContactList;
