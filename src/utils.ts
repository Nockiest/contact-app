import { CollectionReference, Firestore, addDoc, collection, deleteDoc, doc, getDocs } from "firebase/firestore";
import { Contact, Id } from "./types/types";
import { db, storage } from "./firebase";
import { deleteObject, ref } from "firebase/storage";
import { FirebaseError } from "firebase/app";

export const deleteObjectFromArray = (
  objId: Id,
  array: any[]
): any[] => {
  const filteredArray = array.filter((obj) => obj.id === objId);

  if (filteredArray.length === 0) {
    throw new Error(`Object with id ${objId} does not exist in the array.`);
  } else if (filteredArray.length > 1) {
    console.warn(
      `Warning: More than one object with id ${objId} found in the array.`
    );
  }

  return array.filter((obj) => obj.id !== objId);
};

export const addContactsToFirestore = async (
  cntacts: Contact[],
  contactsCollection: CollectionReference
) => {
  // this is collectionrefernce ->  collection(db, 'Contacts')
  try {
    // Iterate over the mockContacts array and add each contact as a document in the "Contacts" collection
    await Promise.all(
      cntacts.map(async (contact) => {
        await addDoc(contactsCollection, contact); // Use addDoc instead of setDoc
      })
    );

    console.log("Mock contacts added to Firestore successfully!");
  } catch (error) {
    console.error("Error adding mock contacts to Firestore:", error);
  }
};


export async function getCollectionSize(db: Firestore, collectionName: string): Promise<number> {
    const collectionRef = collection(db, collectionName);
    const snapshot = await getDocs(collectionRef);
    return snapshot.size;
}
export const removeFromFirebase = async (id: Id) => {
    const docRef = doc(db, "Contacts", `${id}`);

    try {
        // Fetch the collection snapshot before deletion
        const numContactsBefore = await getCollectionSize(db, "Contacts");
        console.log("Number of values before deletion:", numContactsBefore);

        // Delete the document from Firestore
        await deleteDoc(docRef);
        console.log("Entire Document has been deleted successfully:", docRef.id);

        // Fetch the collection snapshot after deletion
        const numContactsAfter = await getCollectionSize(db, "Contacts");
        console.log("Number of values after deletion:", numContactsAfter);

        // Delete the image from Firestore storage
        const imageRef = ref(storage, `images/${id}`);
        await deleteObject(imageRef);
        console.log("Image has been deleted successfully.");
    } catch (ex ) {
        if (ex instanceof FirebaseError) {
            // Handle Firebase errors
            console.error("Firebase error:", ex.code, ex.message);
          } else {
            // Handle other types of errors
            console.error("Unexpected error:", ex);
          }
    }
};

// export const deleteContactsFromFirestore = async (
//     contactIds: Id[],
//     contactsCollection: CollectionReference
//   ) => {
//     try {
//       // Iterate over the contactIds array and delete each contact as a document in the "Contacts" collection
//       await Promise.all(
//         contactIds.map(async (id: Id) => { // Specify the type of id
//           const contactRef = doc(firestore().collection('Contacts'), id); // Get a reference to the document to delete
//           await deleteDoc(contactRef); // Delete the document
//         })
//       );

//       console.log("Contacts deleted from Firestore successfully!");
//     } catch (error) {
//       console.error("Error deleting contacts from Firestore:", error);
//     }
//   };
export const newContact: Omit<Contact, "id"> = {
    name: "",
    phoneNumbers: [ ],
    labels: "",
    emails: [ ],
    photoURL: null,
    address: {
      street: null,
      city: null,
      state: null,
      postalCode: null, // Add the postal code here
    },
  };