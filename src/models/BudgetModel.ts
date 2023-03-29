export type BudgetModel = {
  monthlyAllocations: {
    [categoryKey: string]: { allocation: number; color: string };
  };
  monthlyVariableBudget: number;
  monthlyVariableBudgetUnallocated: number;
};

export enum TransactionCategories {
  GROCERIES = "Groceries",
  ENTERTAINMENT = "Entertainment",
  UTILITIES = "Utilities",
  MOBILEPLAN = "Mobile Plan",
  HOUSING = "Housing",
  TRANSPORTATION = "Transportation",
  DININGOUT = "Dining Out",
  CLOTHING = "Clothing",
  TRAVEL = "Travel",
  EDUCATION = "Education",
  LOANREPAYMENT = "Loan Repayment",
  INSURANCE = "Insurance",
  INTEREST = "Interest",
  SAVINGS = "Savings",
  INCOME = "Income",
  OTHEREXP = "Other",
}

export const getTransactionCategoriesArray = () => {
  const transactionCategories = [];
  for (const value of Object.values(TransactionCategories)) {
    transactionCategories.push({
      value: value,
      key: Object.keys(TransactionCategories)[
        Object.values(TransactionCategories).indexOf(value)
      ],
    });
  }

  return transactionCategories;
};

export type Transaction = {
  account: string;
  date: string;
  isMonthly: boolean;
  name: string;
  category: TransactionCategories;
  amount: number;
};
