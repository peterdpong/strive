export type BudgetModel = {
  monthlyAllocations: { [category: string]: Transaction[] };
  totalVariableBudget: number;
};

export enum TransactionCategories {
  TRANSPORTATION = "Transportation",
  FOODANDDRINK = "Food and drinks",
  ENTERTAINMENT = "Entertainment",
  UTILITIES = "Utilities",
  RENT = "Rent",
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
  date: Date;
  isMonthly: boolean;
  name: string;
  category: TransactionCategories;
  amount: number;
};
