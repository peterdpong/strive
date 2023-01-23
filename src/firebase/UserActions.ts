import {
  setDoc,
  doc,
  getDoc,
  DocumentSnapshot,
  DocumentData,
  updateDoc,
} from "firebase/firestore";
import { BudgetEngineUtils } from "../engine/BudgetEngineUtils";
import {
  BankInvestmentAccount,
  CreditCardAccount,
  FixedInvestment,
  LoanAccount,
} from "../models/AccountModel";
import { BudgetModel, Transaction } from "../models/BudgetModel";
import { GoalModel } from "../models/GoalModel";
import { AccountMap, FinancialInfo, UserModel } from "../models/UserModel";
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
      annualIncome: 0,
      monthlyTransactions: [],
      accounts: {
        bankAccounts: {},
        creditCards: {},
        loans: {},
        fixedInvestments: {},
      },
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
      if (userDataSnapshot.exists()) {
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

export const setAnnualIncome = (uid: string, annualIncome: number) => {
  const userDataRef = doc(firestoreDB, "users", uid);
  updateDoc(userDataRef, { "financialInfo.annualIncome": annualIncome });
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
  accounts: AccountMap,
  type: string,
  newAccount:
    | BankInvestmentAccount
    | CreditCardAccount
    | LoanAccount
    | FixedInvestment
) => {
  if (type === "BankInvestmentAccount") {
    accounts.bankAccounts[newAccount.name] =
      newAccount as BankInvestmentAccount;
  } else if (type === "CreditCard") {
    accounts.creditCards[newAccount.name] = newAccount as CreditCardAccount;
  } else if (type === "Loan") {
    accounts.loans[newAccount.name] = newAccount as LoanAccount;
  } else if (type === "FixedInvestment") {
    accounts.fixedInvestments[newAccount.name] = newAccount as FixedInvestment;
  }

  const userDataRef = doc(firestoreDB, "users", uid);
  updateDoc(userDataRef, {
    "financialInfo.accounts": accounts,
  });
};

export const deleteAccount = (
  uid: string,
  accounts: AccountMap,
  type: string,
  key: string
) => {
  if (type === "BankAccount") {
    delete accounts.bankAccounts[key];
  } else if (type === "CreditCard") {
    delete accounts.creditCards[key];
  } else if (type === "Loan") {
    delete accounts.loans[key];
  } else if (type === "FixedInvestment") {
    delete accounts.fixedInvestments[key];
  }

  const userDataRef = doc(firestoreDB, "users", uid);
  updateDoc(userDataRef, {
    "financialInfo.accounts": accounts,
  });
};

export const updateMonthlyVariableBudget = (userData: UserModel) => {
  const monthlyVariableBudget = userData?.financialInfo.annualIncome / 12;

  const balanceAfterAllocate =
    monthlyVariableBudget -
    BudgetEngineUtils.calculateBudgetExpenses(userData?.budgetInfo);

  const userDataRef = doc(firestoreDB, "users", userData.uid);
  updateDoc(userDataRef, {
    "budgetInfo.monthlyVariableBudget": monthlyVariableBudget,
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

export const addTransaction = (
  uid: string,
  monthTransactionsMap: {
    [monthAndYear: string]: Transaction[];
  },
  monthAndYear: string,
  transaction: Transaction
) => {
  if (!(monthAndYear in monthTransactionsMap)) {
    monthTransactionsMap[monthAndYear] = [transaction];
  } else {
    monthTransactionsMap[monthAndYear].push(transaction);
  }

  const userDataRef = doc(firestoreDB, "users", uid);
  updateDoc(userDataRef, {
    monthTransactionsMap: monthTransactionsMap,
  });
};

export const deleteTransaction = (
  uid: string,
  monthTransactionsMap: {
    [monthAndYear: string]: Transaction[];
  },
  monthAndYear: string,
  transaction: Transaction
) => {
  const index = monthTransactionsMap[monthAndYear].indexOf(transaction);
  if (index > -1) {
    monthTransactionsMap[monthAndYear].splice(index, 1);
  }

  const userDataRef = doc(firestoreDB, "users", uid);
  updateDoc(userDataRef, {
    monthTransactionsMap: monthTransactionsMap,
  });
};
