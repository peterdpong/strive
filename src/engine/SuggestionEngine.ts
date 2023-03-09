import { UserModel } from "../models/UserModel";
import { TransactionCategories } from "../models/BudgetModel";

enum CategoryPercentages {
  GROCERIES = 10,
  ENTERTAINMENT = 5,
  UTILITIES = 4,
  MOBILEPLAN = 1,
  RENT = 35,
  TRANSPORTATION = 15,
  DININGOUT = 5,
  CLOTHING = 5,
  TRAVEL = 5,
  EDUCATION = 7.5,
  INTEREST = 5,
  SAVINGS = 7.5,
}

const categorySpend: [TransactionCategories, number][] = [
  [TransactionCategories.GROCERIES, 0],
  [TransactionCategories.ENTERTAINMENT, 0],
  [TransactionCategories.UTILITIES, 0],
  [TransactionCategories.MOBILEPLAN, 0],
  [TransactionCategories.RENT, 0],
  [TransactionCategories.TRANSPORTATION, 0],
  [TransactionCategories.DININGOUT, 0],
  [TransactionCategories.CLOTHING, 0],
  [TransactionCategories.TRAVEL, 0],
  [TransactionCategories.EDUCATION, 0],
  [TransactionCategories.INTEREST, 0],
  [TransactionCategories.SAVINGS, 0],
];

const suggestion: [TransactionCategories, number][] = [
  [TransactionCategories.GROCERIES, 0],
  [TransactionCategories.ENTERTAINMENT, 0],
  [TransactionCategories.UTILITIES, 0],
  [TransactionCategories.MOBILEPLAN, 0],
  [TransactionCategories.RENT, 0],
  [TransactionCategories.TRANSPORTATION, 0],
  [TransactionCategories.DININGOUT, 0],
  [TransactionCategories.CLOTHING, 0],
  [TransactionCategories.TRAVEL, 0],
  [TransactionCategories.EDUCATION, 0],
  [TransactionCategories.INTEREST, 0],
  [TransactionCategories.SAVINGS, 0],
];

type Suggestion = {
  suggestionType: string;
  suggestionTitle: string;
  suggestionBadge: string;
  suggestionDescription: string;
};

export class SuggestionEngine {
  static generateCategorySuggestions(userData: UserModel | null) {
    if (userData == null) {
      return undefined;
    }

    const availableFunds = userData.budgetInfo.monthlyVariableBudgetUnallocated; // total funds available for allocation
    const categories: { value: number; key: TransactionCategories }[] = [];
    const now: Date = new Date();
    const lastMonthDate =
      (now.getUTCMonth() - 1).toString() +
      "-" +
      now.getUTCFullYear().toString();
    let index: number;
    // loop through every transaction ever made by this user
    userData.financialInfo.monthlyTransactions.forEach((transaction) => {
      // for each transaction made in the last month
      if (transaction.date === lastMonthDate) {
        // loop through each transaction category until it matches the category of the transaction made
        for (const transactionCategory in TransactionCategories) {
          if (transaction.category === transactionCategory) {
            // add the value of the transaction to the array of transactions in categorySpend to keep track of total spend in each category by month
            index = categorySpend.findIndex(
              ([category]) => category === transactionCategory
            );
            if (index != -1) {
              categorySpend[index][1] += transaction.amount;
            }
          }
        }
      }
    });

    for (const transactionCategory in CategoryPercentages) {
      index = categorySpend.findIndex(
        ([category]) => category === transactionCategory
      );
      const totalCategorySpendPercentage: number =
        (categorySpend[index][1] / availableFunds) * 100;
      const targetPercent: number = CategoryPercentages[
        transactionCategory
      ] as unknown as number; // to suppress error as it doesn't know that this is a number
      if (totalCategorySpendPercentage > targetPercent) {
        //create a suggestion
        const reduceAmount =
          (totalCategorySpendPercentage - targetPercent) * availableFunds;
        suggestion[index][1] += reduceAmount;
      }
    }

    const suggestionArray: Suggestion[] = [];

    //
    SuggestionEngine.addToSuggestions(suggestionArray);
  }

  static generateDemographicSuggestions(userData: UserModel | null) {
    //do something
  }

  static addToSuggestions = (suggestion: Suggestion[]) => {
    // add this suggestion to the UserModel
  };

  // for reference
  // suggestions: {
  //   [suggestionType: string]: Suggestion[];
  // };

  // export type Suggestion = {
  //   suggestionType: string;
  //   suggestionTitle: string;
  //   suggestionBadge: string;
  //   suggestionDescription: string;
  // };
}
