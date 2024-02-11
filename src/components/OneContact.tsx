import { useState } from "react";
import { useContactContext } from "../Context";
import xMarkIcon from "../assets/xmark.svg";
// import sear from "../assets/cross.svg";
import ProfilePicture from "./ProfilePicture";
import ContactEditor from "./ContactEditor";
import TrashIcon from "../assets/trash.svg";
import { deleteObjectFromArray } from "../utils";
const OneContact = () => {
  const { setChosenContact, chosenContactRef, setContacts, contacts } =
    useContactContext();
  const [editMode, setEditMode] = useState<boolean>(false);

  const deleteContact = (id: number | string) => {
    if (chosenContactRef) {
      setContacts(deleteObjectFromArray(id, contacts));
      setChosenContact(null);
    }
  };

  return (
    <div style={{ width: "66%" }}>
      {chosenContactRef !== null ? (
        editMode ? (
          <ContactEditor
            initialContact={chosenContactRef}
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
                onClick={() => deleteContact(chosenContactRef.id)}
                className={"button-icon"}
                src={TrashIcon}
                alt={"delete"}
              />
              <h1>{chosenContactRef.name}</h1>{" "}
              <img
                onClick={() => setChosenContact(null)}
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
                    chosenContactRef.photoURL === null
                      ? undefined
                      : chosenContactRef.photoURL
                  }
                />
                <button onClick={() => setEditMode(!editMode)}>Upravit</button>
              </div>

              <div style={{ flex: 1 }}>
                <p>{chosenContactRef.name}</p>
                {chosenContactRef.emails.map((email, index) => (
                  <p key={index} style={{ color: "lightblue" }}>
                    <a href={`mailto:${email}`}>{email}</a>
                  </p>
                ))}
                <p style={{}}>
                  Labels:{" "}
                  {chosenContactRef.labels
                    ?.split("#")
                    .map(
                      (label, index) =>
                        label.trim() && (
                          <span key={index}>{label.trim()}, </span>
                        )
                    )}
                </p>

                <div>
                  <p>Street: {chosenContactRef.address.street}</p>
                  <p>City: {chosenContactRef.address.city}</p>
                  <p>State: {chosenContactRef.address.state}</p>
                  <p>Postal Code: {chosenContactRef.address.postalCode}</p>
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
