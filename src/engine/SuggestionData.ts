import { TransactionCategories } from "../models/BudgetModel";

// Survey - 800+ responses
//https://docs.google.com/spreadsheets/d/15c7ZnSVMEaTFHxsEVqz5I8HBMBYpMiTPCz8OvbZNHV4/edit#gid=1892118786
export const AverageIncomeByAge: { [ageKey: string]: number } = {
  "18-24": 4052,
  "25-29": 5222,
  "30-34": 6948,
  "35-39": 7873,
  "40-44": 9793,
};

export const AverageExpensesByAge: { [ageKey: string]: number } = {
  "18-24": 2347,
  "25-29": 3284,
  "30-34": 4350,
  "35-39": 4921,
  "40-44": 5709,
};

export const AverageSavingsByAge: { [ageKey: string]: number } = {
  "18-24": 1515,
  "25-29": 1658,
  "30-34": 2159,
  "35-39": 2175,
  "40-44": 3584,
};

// Stats Canada 2019
export const AverageExpensesOnePersonHousehold: {
  [categoryKey: string]: number;
} = {
  [TransactionCategories.GROCERIES]: 4078 / 12,
  [TransactionCategories.DININGOUT]: 1596 / 12,
  [TransactionCategories.CLOTHING]: 1642 / 12,
  [TransactionCategories.UTILITIES]: 1412 / 12,
  [TransactionCategories.HOUSING]: 12477 / 12,
  [TransactionCategories.TRANSPORTATION]: 5701 / 12,
};
