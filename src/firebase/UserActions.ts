import { setDoc, doc } from "firebase/firestore";
import { Transaction } from "../models/BudgetModel";
import { firestoreDB } from "./firebase";

export const addNewUser = async (
  uid: string,
  email: string,
  firstName: string,
  lastName: string
) => {
  const initMonthTransactionsMap: { [key: string]: Transaction[] } = {};
  const currentDate = new Date();

  // Month Transaction Map Key Format -> MM-YYYY
  initMonthTransactionsMap[
    (currentDate.getUTCMonth() + 1).toString() +
      "-" +
      currentDate.getUTCFullYear().toString()
  ] = [];

  try {
    await setDoc(doc(firestoreDB, "users", uid), {
      email,
      firstName,
      lastName,
      monthTransactionsMap: initMonthTransactionsMap,
    });
    console.log("Document written with ID: ", uid);
  } catch (e) {
    console.error("Error adding document: ", e);
  }
};
