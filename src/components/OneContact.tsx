import { useState } from "react";
import { useContactContext } from "../Context";
import xMarkIcon from "../assets/xmark.svg";
import ProfilePicture from "./ProfilePicture";
import ContactEditor from "./ContactEditor";
import TrashIcon from "../assets/trash.svg";
import { deleteObjectFromArray } from "../utils";
import { Id } from "../types/types";
const OneContact = () => {
  const { setChosenId,  chosenContactId, setContacts, contacts } =
    useContactContext();
  const [editMode, setEditMode] = useState<boolean>(false);

  const deleteContact = (id: Id) => {
    if (chosenContactId) {
      setContacts(deleteObjectFromArray(id, contacts));
      setChosenId(null);
    }
  };
  const chosenContact = contacts.find(obj => obj.id === chosenContactId);
  return (
    <div style={{ width: "66%" }}>
      {chosenContactId&& chosenContact? (
        editMode ? (
          <ContactEditor
            initialContact={chosenContact}
            setEditMode={setEditMode}
          />
        ) : (
          <div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-around",
                alignItems: "center",
              }}
            >
              <img
                onClick={() => deleteContact(chosenContactId)}
                className={"button-icon"}
                src={TrashIcon}
                alt={"delete"}
              />
              <h1>{chosenContact.name}</h1>{" "}
              <img
                onClick={() => setChosenId(null)}
                className={"button-icon"}
                src={xMarkIcon}
                alt="deleteimg"
              />
            </div>
            <div style={{ display: "flex" }}>
              <div
                style={{
                  flex: 1,
                  flexDirection: "column",
                  width: "auto",
                  height: "500px",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <ProfilePicture
                  photoURL={
                    chosenContact.photoURL === null
                      ? undefined
                      : chosenContact.photoURL
                  }
                />
                <button onClick={() => setEditMode(!editMode)}>Upravit</button>
              </div>

              <div style={{ flex: 1 }}>
                <p>{chosenContact.name}</p>
                {chosenContact.emails.map((email, index) => (
                  <p key={index} style={{ color: "lightblue" }}>
                    <a href={`mailto:${email}`}>{email}</a>
                  </p>
                ))}
                <p style={{}}>
                  Labels:{" "}
                  {chosenContact.labels
                    ?.split("#")
                    .map(
                      (label, index) =>
                        label.trim() && (
                          <span key={index}>{label.trim()}, </span>
                        )
                    )}
                </p>

                <div>
                  <p>Street: {chosenContact.address.street}</p>
                  <p>City: {chosenContact.address.city}</p>
                  <p>State: {chosenContact.address.state}</p>
                  <p>Postal Code: {chosenContact.address.postalCode}</p>
                </div>
              </div>
            </div>
          </div>
        )
      ) : (
        <p>Pokračujte výběrem kontaktu</p>
      )}
    </div>
  );
};

export default OneContact;
