import { UserModel } from "../models/UserModel";
import { Transaction, TransactionCategories } from "../models/BudgetModel";
import { updateSuggestion } from "../firebase/UserActions";

// enum CategoryPercentages {
//   GROCERIES = 10,
//   ENTERTAINMENT = 5,
//   UTILITIES = 4,
//   MOBILEPLAN = 1,
//   RENT = 35,
//   TRANSPORTATION = 15,
//   DININGOUT = 5,
//   CLOTHING = 5,
//   TRAVEL = 5,
//   EDUCATION = 7.5,
//   INTEREST = 5,
//   SAVINGS = 7.5,
// }

const CategoryPercentages = {
  [TransactionCategories.GROCERIES]: 10,
  [TransactionCategories.ENTERTAINMENT]: 5,
  [TransactionCategories.UTILITIES]: 4,
  [TransactionCategories.MOBILEPLAN]: 1,
  [TransactionCategories.RENT]: 35,
  [TransactionCategories.TRANSPORTATION]: 15,
  [TransactionCategories.DININGOUT]: 5,
  [TransactionCategories.CLOTHING]: 5,
  [TransactionCategories.TRAVEL]: 5,
  [TransactionCategories.EDUCATION]: 7.5,
  [TransactionCategories.INTEREST]: 5,
  [TransactionCategories.SAVINGS]: 7.5,
};

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

    const categorySpend: { [categoryKey: string]: number } = {
      [TransactionCategories.GROCERIES]: 0,
      [TransactionCategories.ENTERTAINMENT]: 0,
      [TransactionCategories.UTILITIES]: 0,
      [TransactionCategories.MOBILEPLAN]: 0,
      [TransactionCategories.RENT]: 0,
      [TransactionCategories.TRANSPORTATION]: 0,
      [TransactionCategories.DININGOUT]: 0,
      [TransactionCategories.CLOTHING]: 0,
      [TransactionCategories.TRAVEL]: 0,
      [TransactionCategories.EDUCATION]: 0,
      [TransactionCategories.INTEREST]: 0,
      [TransactionCategories.SAVINGS]: 0,
    };

    const suggestion: { [categoryKey: string]: number } = {
      [TransactionCategories.GROCERIES]: 0,
      [TransactionCategories.ENTERTAINMENT]: 0,
      [TransactionCategories.UTILITIES]: 0,
      [TransactionCategories.MOBILEPLAN]: 0,
      [TransactionCategories.RENT]: 0,
      [TransactionCategories.TRANSPORTATION]: 0,
      [TransactionCategories.DININGOUT]: 0,
      [TransactionCategories.CLOTHING]: 0,
      [TransactionCategories.TRAVEL]: 0,
      [TransactionCategories.EDUCATION]: 0,
      [TransactionCategories.INTEREST]: 0,
      [TransactionCategories.SAVINGS]: 0,
    };

    const availableFunds = userData.budgetInfo.monthlyVariableBudgetUnallocated; // total funds available for allocation
    const now: Date = new Date();
    const lastMonthDate =
      now.getUTCMonth().toString() + "-" + now.getUTCFullYear().toString();
    console.log(lastMonthDate);
    if (userData.monthTransactionsMap[lastMonthDate] === undefined) {
      console.log("No transactions in previous month");
      return undefined;
    }

    // loop through every transaction ever made by this user
    userData.monthTransactionsMap[lastMonthDate].forEach((transaction) => {
      // for each transaction made in the last month
      console.log(
        transaction.category,
        transaction.category in CategoryPercentages
      );
      if (transaction.category in CategoryPercentages) {
        categorySpend[transaction.category] += transaction.amount;
      }
    });

    console.log(categorySpend);

    for (const transactionCategory in TransactionCategories) {
      // index = categorySpend.findIndex(
      //   ([category]) => category === transactionCategory
      // );
      console.log(
        transactionCategory,
        categorySpend[transactionCategory],
        availableFunds,
        CategoryPercentages[transactionCategory]
      );
      const totalCategorySpendPercentage: number =
        (categorySpend[transactionCategory] / availableFunds) * 100;
      const targetPercent: number = CategoryPercentages[transactionCategory]; // to suppress error as it doesn't know that this is a number
      if (totalCategorySpendPercentage > targetPercent) {
        //create a suggestion
        const reduceAmount =
          (totalCategorySpendPercentage - targetPercent) * availableFunds;
        suggestion[transactionCategory] += reduceAmount;
      }
    }

    console.log(suggestion);

    const suggestionArray: Suggestion[] = [];
    for (const suggestions in suggestion) {
      const temp_type = "Category Suggestions";
      const temp_title = suggestions; //should be "Groceries, Entertainment, ..."
      let temp_badge = "";
      let temp_description = "";
      if (suggestion[suggestions] > 0) {
        temp_badge = "Increased Spending";
      } else {
        temp_badge = "Good Job!"; //not really sure what to put here
      }
      if (suggestion[suggestions] === 0) {
        temp_description = "Maintain this spending!";
      } else {
        temp_description =
          "Spend " +
          suggestion[suggestions] +
          "less each month in this category.";
      }
      const temp_suggestion: Suggestion = {
        suggestionBadge: temp_badge,
        suggestionTitle: temp_title,
        suggestionType: temp_type,
        suggestionDescription: temp_description,
      };
      suggestionArray.push(temp_suggestion);
    }
    //
    updateSuggestion(
      userData.uid,
      "Category_Suggestion",
      suggestionArray,
      userData.suggestions
    );
  }

  // static generateDemographicSuggestions(userData: UserModel | null) {
  //   //do something
  // }

  // static addToSuggestions = (suggestion: Suggestion[]) => {
  //   // add this suggestion to the UserModel
  // };

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
