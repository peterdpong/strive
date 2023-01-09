import {
  setDoc,
  doc,
  getDoc,
  DocumentSnapshot,
  DocumentData,
  updateDoc,
} from "firebase/firestore";
import { BudgetEngineUtils } from "../engine/BudgetEngineUtils";
import { BudgetModel, Transaction } from "../models/BudgetModel";
import { GoalModel } from "../models/GoalModel";
import { Account, FinancialInfo, UserModel } from "../models/UserModel";
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
      monthlyIncome: 0,
      monthlyTransactions: [],
      accounts: [],
    },
    budgetInfo: {
      monthlyAllocations: {},
      monthlyVariableBudget: 0,
      monthlyVariableBudgetUnallocated: 0,
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

export const setMonthlyIncome = (uid: string, monthlyIncome: number) => {
  const userDataRef = doc(firestoreDB, "users", uid);
  updateDoc(userDataRef, { "financialInfo.monthlyIncome": monthlyIncome });
};

export const addBudgetInfo = (uid: string, budgetInfo: BudgetModel) => {
  const userDataRef = doc(firestoreDB, "users", uid);
  setDoc(userDataRef, { budgetInfo: budgetInfo }, { merge: true });
};

export const addMonthlyTransaction = (
  uid: string,
  monthlyTransactions: Transaction[],
  newTransaction: Transaction
) => {
  monthlyTransactions.push(newTransaction);

  const userDataRef = doc(firestoreDB, "users", uid);
  updateDoc(userDataRef, {
    "financialInfo.monthlyTransactions": monthlyTransactions,
  });
};

export const deleteMonthlyTransaction = (
  uid: string,
  monthlyTransactions: Transaction[],
  index: number
) => {
  monthlyTransactions.splice(index, 1);

  const userDataRef = doc(firestoreDB, "users", uid);
  updateDoc(userDataRef, {
    "financialInfo.monthlyTransactions": monthlyTransactions,
  });
};

export const addAccount = (
  uid: string,
  accounts: Account[],
  newAccount: Account
) => {
  accounts.push(newAccount);

  const userDataRef = doc(firestoreDB, "users", uid);
  updateDoc(userDataRef, {
    "financialInfo.accounts": accounts,
  });
};

export const deleteAccount = (
  uid: string,
  accounts: Account[],
  index: number
) => {
  accounts.splice(index, 1);

  const userDataRef = doc(firestoreDB, "users", uid);
  updateDoc(userDataRef, {
    "financialInfo.accounts": accounts,
  });
};

export const updateMonthlyVariableBudget = (userData: UserModel) => {
  const balanceAfterFixed =
    userData?.financialInfo.monthlyIncome -
    BudgetEngineUtils.calculateFixedMonthlyExpenses(
      userData?.financialInfo.monthlyTransactions
    );

  const balanceAfterAllocate =
    balanceAfterFixed -
    BudgetEngineUtils.calculateBudgetExpenses(userData?.budgetInfo);

  const userDataRef = doc(firestoreDB, "users", userData.uid);
  updateDoc(userDataRef, {
    "budgetInfo.monthlyVariableBudget": balanceAfterFixed,
    "budgetInfo.monthlyVariableBudgetUnallocated": balanceAfterAllocate,
  });
};

export const addBudgetCategoryAllocation = (
  uid: string,
  monthlyAllocations: {
    [categoryKey: string]: { allocation: number; color: string };
  },
  categoryKey: string,
  color: string,
  allocation: number
) => {
  monthlyAllocations[categoryKey] = { allocation, color };

  const userDataRef = doc(firestoreDB, "users", uid);
  updateDoc(userDataRef, {
    "budgetInfo.monthlyAllocations": monthlyAllocations,
  });
};

export const deleteBudgetAllocation = (
  uid: string,
  monthlyAllocations: {
    [categoryKey: string]: { allocation: number; color: string };
  },
  categoryKey: string
) => {
  delete monthlyAllocations[categoryKey];

  const userDataRef = doc(firestoreDB, "users", uid);
  updateDoc(userDataRef, {
    "budgetInfo.monthlyAllocations": monthlyAllocations,
  });
};
