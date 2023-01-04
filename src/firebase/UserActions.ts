import {
  setDoc,
  doc,
  getDoc,
  DocumentSnapshot,
  DocumentData,
} from "firebase/firestore";
import { BudgetModel, Transaction } from "../models/BudgetModel";
import { GoalModel } from "../models/GoalModel";
import { FinancialInfo, UserModel } from "../models/UserModel";
import { firestoreDB } from "./firebase";

export const addNewUser = (
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

  const newUserData: UserModel = {
    uid,
    email,
    firstName,
    lastName,
    onboardingStatus: {
      finished: false,
      stageNum: -1,
    },
    financialInfo: {
      incomeValue: 0,
      incomeIsAnnual: true,
      hoursPerWeek: 0,
      monthlyTransactions: [],
      accounts: [],
    },
    budgetInfo: {
      monthlyAllocations: {},
      totalVariableBudget: 0,
    },
    goalInfo: {
      goalType: "timeframe",
      goalValue: 25000,
      monthlyAmount: 500,
      timeframeValue: 5,
    },
    monthTransactionsMap: initMonthTransactionsMap,
  };

  try {
    setDoc(doc(firestoreDB, "users", uid), newUserData);
    console.log("Document written with ID: ", uid);
    return newUserData;
  } catch (e) {
    console.error("Error adding document: ", e);
  }

  return null;
};

export const getUserData = async (
  uid: string
): Promise<UserModel | undefined> => {
  const userDataRef = doc(firestoreDB, "users", uid);

  let userData: UserModel | undefined = undefined;

  await getDoc(userDataRef).then(
    (userDataSnapshot: DocumentSnapshot<DocumentData>) => {
      // console.log(uid, userDataSnapshot.exists(), userDataSnapshot.data());
      if (userDataSnapshot.exists()) {
        console.log("returned", userDataSnapshot.data());
        userData = userDataSnapshot.data() as UserModel;
      }
    }
  );

  return userData;
};

export const addUserGoal = async (uid: string, goalInfo: GoalModel) => {
  const userDataRef = doc(firestoreDB, "users", uid);
  setDoc(userDataRef, { goalInfo: goalInfo }, { merge: true });
};

export const getUserGoal = (uid: string) => {
  const userDataRef = doc(firestoreDB, "users", uid);
  getDoc(userDataRef).then((userDataSnapshot) => {
    if (userDataSnapshot.exists()) {
      return (userDataSnapshot.data() as UserModel).goalInfo;
    } else {
      return null;
    }
  });
};

export const addFinancialInfo = (uid: string, financialInfo: FinancialInfo) => {
  const userDataRef = doc(firestoreDB, "users", uid);
  setDoc(userDataRef, { financialInfo: financialInfo }, { merge: true });
};

export const getFinancialInfo = (uid: string | undefined) => {
  if (uid === undefined) return undefined;

  const userDataRef = doc(firestoreDB, "users", uid);
  getDoc(userDataRef).then((userDataSnapshot) => {
    if (userDataSnapshot.exists()) {
      return (userDataSnapshot.data() as UserModel).financialInfo;
    } else {
      return null;
    }
  });
};

export const addBudgetInfo = (uid: string, budgetInfo: BudgetModel) => {
  const userDataRef = doc(firestoreDB, "users", uid);
  setDoc(userDataRef, { budgetInfo: budgetInfo }, { merge: true });
};
