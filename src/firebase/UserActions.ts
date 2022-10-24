import { setDoc, doc } from "firebase/firestore";
import { firestoreDB } from "./firebase";

export const addNewUser = async (
  uid: string,
  email: string,
  firstName: string,
  lastName: string
) => {
  try {
    await setDoc(doc(firestoreDB, "users", uid), {
      email,
      firstName,
      lastName,
    });
    console.log("Document written with ID: ", uid);
  } catch (e) {
    console.error("Error adding document: ", e);
  }
};
