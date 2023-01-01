export type BudgetModel = {
  monthlyAllocations: { [category: string]: Transaction[] };
  totalVariableBudget: number;
};

export enum TransactionCategories {
  TRANSPORTATION,
  FOODANDDRINK,
  ENTERTAINMENT,
  UTILITIES,
}

export type Transaction = {
  date: Date;
  category: TransactionCategories;
  amount: number;
};
