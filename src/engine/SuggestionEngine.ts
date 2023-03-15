import { Suggestion, UserModel } from "../models/UserModel";
import { TransactionCategories } from "../models/BudgetModel";
import { updateSuggestion } from "../firebase/UserActions";
import { enumKeys } from "../utils";

const CategoryPercentages: { [categoryKey: string]: number } = {
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
    const availableFunds = userData.budgetInfo.monthlyVariableBudgetUnallocated; // total funds available for allocation
    const now: Date = new Date();
    const lastMonthDate =
      now.getUTCMonth().toString() + "-" + now.getUTCFullYear().toString();
    if (userData.monthTransactionsMap[lastMonthDate] === undefined) {
      return;
    }

    // loop through every transaction ever made by this user
    userData.monthTransactionsMap[lastMonthDate].forEach((transaction) => {
      // for each transaction made in the last month
      if (transaction.category in CategoryPercentages) {
        categorySpend[transaction.category] += transaction.amount;
      }
    });

    const suggestionArray: Suggestion[] = [];
    const suggestionType = "SpendingAndBudget";
    const suggestionBadge = "Category Spending";
    for (const category of enumKeys(TransactionCategories)) {
      // Calculate the percentage of income spend on specific category and compare to recommended standard
      const totalCategorySpendPercentage: number =
        (categorySpend[TransactionCategories[category]] / availableFunds) * 100;
      const targetPercent: number =
        CategoryPercentages[TransactionCategories[category]];

      if (totalCategorySpendPercentage > targetPercent) {
        //Their percentage spend is greater than target recommended, create a suggestion
        const reduceAmount =
          (totalCategorySpendPercentage - targetPercent) * availableFunds;

        const newSuggestion: Suggestion = {
          suggestionType: suggestionType,
          isPositive: false,
          suggestionBadge: suggestionBadge,
          suggestionTitle: `Your spending in ${
            TransactionCategories[category]
          } last month was ${Math.trunc(
            totalCategorySpendPercentage
          )}% of your monthly income, higher than the recommended percentage.`,
          suggestionDescription: `Based on budgetting guidelines set by The Credit Counselling Society, you should aim to spend ${targetPercent}% of your income on ${
            TransactionCategories[category]
          }. Analyzing your last month spending on ${
            TransactionCategories[category]
          }, we found you spent ${Math.trunc(
            totalCategorySpendPercentage
          )}% of your monthly income on ${
            TransactionCategories[category]
          } which is ${Math.trunc(
            totalCategorySpendPercentage - targetPercent
          )}%. It is recommened for you to reduce you spending in this category by $${reduceAmount}!`,
        };
        suggestionArray.push(newSuggestion);
      }
    }

    // nts: future reference once we add source -> https://www.mymoneycoach.ca/budgeting/budgeting-guidelines

    updateSuggestion(
      userData.uid,
      suggestionType,
      suggestionArray,
      userData.suggestions
    );
  }

  // static generateDemographicSuggestions(userData: UserModel | null) {
  //   //do something
  // }
}
