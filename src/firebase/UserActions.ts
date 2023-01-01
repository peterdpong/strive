import { setDoc, doc } from "firebase/firestore";
import { BudgetModel, Transaction } from "../models/BudgetModel";
import { GoalModel } from "../models/GoalModel";
import { FinancialInfo } from "../models/UserModel";
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
      onboardingFinished: {
        finished: false,
        stageNum: -1,
      },
      monthTransactionsMap: initMonthTransactionsMap,
    });
    console.log("Document written with ID: ", uid);
  } catch (e) {
    console.error("Error adding document: ", e);
  }
};

export const addUserGoal = async (uid: string, goalInfo: GoalModel) => {
  const userDataRef = doc(firestoreDB, "users", uid);
  setDoc(userDataRef, { goalInfo: goalInfo }, { merge: true });
};

export const addFinancialInfo = async (
  uid: string,
  financialInfo: FinancialInfo
) => {
  const userDataRef = doc(firestoreDB, "users", uid);
  setDoc(userDataRef, { financialInfo: financialInfo }, { merge: true });
};

export const addBudgetInfo = async (uid: string, budgetInfo: BudgetModel) => {
  const userDataRef = doc(firestoreDB, "users", uid);
  setDoc(userDataRef, { budgetInfo: budgetInfo }, { merge: true });
};
