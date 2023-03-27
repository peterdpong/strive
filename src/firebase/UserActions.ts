import {
  setDoc,
  doc,
  getDoc,
  DocumentSnapshot,
  DocumentData,
  updateDoc,
} from "firebase/firestore";
import { BudgetEngineUtils } from "../engine/BudgetEngineUtils";
import { SuggestionEngine } from "../engine/SuggestionEngine";
import {
  BankInvestmentAccount,
  CreditCardAccount,
  FixedInvestment,
  LoanAccount,
  OtherAsset,
} from "../models/AccountModel";
import { BudgetModel, Transaction } from "../models/BudgetModel";
import { GoalModel } from "../models/GoalModel";
import {
  AccountMap,
  FinancialInfo,
  Suggestion,
  UserModel,
} from "../models/UserModel";
import { firestoreDB } from "./firebase";

export const addNewUser = (
  uid: string,
  email: string,
  firstName: string,
  lastName: string,
  age: number
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
    age,
    onboardingStatus: {
      finished: false,
      stageNum: -1,
    },
    financialInfo: {
      annualIncome: 0,
      payfreq: 0,
      monthlyTransactions: [],
      accounts: {
        bankAccounts: {},
        creditCards: {},
        loans: {},
        fixedInvestments: {},
        otherAssets: {},
      },
    },
    budgetInfo: {
      monthlyAllocations: {},
      monthlyVariableBudget: 0,
      monthlyVariableBudgetUnallocated: 0,
    },
    goalInfo: {
      startingNetWorth: 0,
      monthlyAmount: 0,
      networthGoal: 0,
      timelineGoal: 0,
    },
    monthTransactionsMap: initMonthTransactionsMap,
    suggestions: {},
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
        updateMonthsMap(uid, userData.monthTransactionsMap);
        SuggestionEngine.runAllSuggestions(userData);
      }
    }
  );

  return userData;
};

export const updateMonthsMap = (
  uid: string,
  monthTransactionsMap: {
    [key: string]: Transaction[];
  }
) => {
  const currentDate = new Date();
  if (
    monthTransactionsMap[
      (currentDate.getUTCMonth() + 1).toString() +
        "-" +
        currentDate.getUTCFullYear().toString()
    ] === undefined
  ) {
    monthTransactionsMap[
      (currentDate.getUTCMonth() + 1).toString() +
        "-" +
        currentDate.getUTCFullYear().toString()
    ] = [];

    const userDataRef = doc(firestoreDB, "users", uid);
    updateDoc(userDataRef, { monthTransactionsMap: monthTransactionsMap });
  }
};

export const addUserGoal = async (uid: string, goalInfo: GoalModel) => {
  const userDataRef = doc(firestoreDB, "users", uid);
  updateDoc(userDataRef, { goalInfo: goalInfo });
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

export const setIncome = (
  uid: string,
  annualIncome: number,
  payfreq: number
) => {
  const userDataRef = doc(firestoreDB, "users", uid);
  updateDoc(userDataRef, {
    "financialInfo.annualIncome": annualIncome,
    "financialInfo.payfreq": payfreq,
  });
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
    | OtherAsset
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
  } else if (type === "OtherAsset") {
    if (accounts.otherAssets === undefined) {
      accounts["otherAssets"] = {};
    }
    accounts.otherAssets[newAccount.name] = newAccount as OtherAsset;
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
  } else if (type === "OtherAsset") {
    delete accounts.otherAssets[key];
  }

  const userDataRef = doc(firestoreDB, "users", uid);
  updateDoc(userDataRef, {
    "financialInfo.accounts": accounts,
  });
};

export const updateMonthlyVariableBudget = (userData: UserModel) => {
  //const monthlyVariableBudget = userData.financialInfo.annualIncome / 12;
  const monthlyVariableBudget =
    userData.financialInfo.annualIncome * userData.financialInfo.payfreq;

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
  accounts: AccountMap,
  monthAndYear: string,
  transaction: Transaction
) => {
  if (!(monthAndYear in monthTransactionsMap)) {
    monthTransactionsMap[monthAndYear] = [transaction];
  } else {
    monthTransactionsMap[monthAndYear].push(transaction);
  }

  const accountAndType = new Map<string, string>();
  for (let i = 0; i < Object.keys(accounts.bankAccounts).length; i++) {
    accountAndType.set(Object.keys(accounts.bankAccounts)[i], "bankAccount");
  }

  for (let i = 0; i < Object.keys(accounts.creditCards).length; i++) {
    accountAndType.set(Object.keys(accounts.creditCards)[i], "creditCard");
  }

  for (let i = 0; i < Object.keys(accounts.loans).length; i++) {
    accountAndType.set(Object.keys(accounts.loans)[i], "loan");
  }

  const accountType: string | undefined = accountAndType.get(
    transaction.account
  );

  if (accountType === "bankAccount") {
    accounts.bankAccounts[transaction.account].value += transaction.amount;
  } else if (accountType === "creditCard") {
    accounts.creditCards[transaction.account].amountOwned +=
      -transaction.amount;
  } else if (accountType === "loan") {
    accounts.loans[transaction.account].remainingAmount += -transaction.amount;
  }

  const userDataRef = doc(firestoreDB, "users", uid);
  updateDoc(userDataRef, {
    monthTransactionsMap: monthTransactionsMap,
    "financialInfo.accounts": accounts,
  });
};

export const deleteTransaction = (
  uid: string,
  monthTransactionsMap: {
    [monthAndYear: string]: Transaction[];
  },
  accounts: AccountMap,
  monthAndYear: string,
  transaction: Transaction
) => {
  const index = monthTransactionsMap[monthAndYear].indexOf(transaction);
  if (index > -1) {
    monthTransactionsMap[monthAndYear].splice(index, 1);
  }

  const accountAndType = new Map<string, string>();
  for (let i = 0; i < Object.keys(accounts.bankAccounts).length; i++) {
    accountAndType.set(Object.keys(accounts.bankAccounts)[i], "bankAccount");
  }

  for (let i = 0; i < Object.keys(accounts.creditCards).length; i++) {
    accountAndType.set(Object.keys(accounts.creditCards)[i], "creditCard");
  }

  for (let i = 0; i < Object.keys(accounts.loans).length; i++) {
    accountAndType.set(Object.keys(accounts.loans)[i], "loan");
  }

  const accountType: string | undefined = accountAndType.get(
    transaction.account
  );

  if (accountType === "bankAccount") {
    accounts.bankAccounts[transaction.account].value -= transaction.amount;
  } else if (accountType === "creditCard") {
    accounts.creditCards[transaction.account].amountOwned -=
      -transaction.amount;
  } else if (accountType === "loan") {
    accounts.loans[transaction.account].remainingAmount -= -transaction.amount;
  }

  const userDataRef = doc(firestoreDB, "users", uid);
  updateDoc(userDataRef, {
    monthTransactionsMap: monthTransactionsMap,
    "financialInfo.accounts": accounts,
  });
};

export const updateSuggestion = (
  uid: string,
  suggestionType: string,
  SuggestionArray: Suggestion[],
  suggestionMap: {
    [suggestionType: string]: Suggestion[];
  }
) => {
  suggestionMap[suggestionType] = SuggestionArray;
  const userDataRef = doc(firestoreDB, "users", uid);
  updateDoc(userDataRef, {
    suggestions: suggestionMap,
  });
};
