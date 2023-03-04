// import { Suggestion, UserModel } from "../models/UserModel";
// import {
//   getTransactionCategoriesSpend,
//   TransactionCategories,
//   Transaction,
// } from "../models/BudgetModel";


enum TransactionCategories {
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
  SAVINGS = 7.5
}

// type TransactionType = {
//   category: TransactionCategories;
//   amount: number;
// };

export class SuggestionEngine {
  // static generateSuggestions( userData: UserModel | null ) {
  //     if (userData == null) {
  //         return undefined;
  //     }
  //     // generate spending suggestions by category (make this into function later)
  //     let suggestions: {
  //         [suggestionType: string]: Suggestion[];
  //     };
  //     suggestions = userData.suggestions
  //     const targetPercent = [10, 5, 4, 1, 35, 15, 5, 5, 5, 7.5, 5, 7.5, 100]
  //     const availableFunds = userData.budgetInfo.monthlyVariableBudget; // total funds available for allocation
  //     let categories: { value: number; key: TransactionCategories; }[] = [];
  //     categories = getTransactionCategoriesSpend()
  //     let transactions: TransactionType[] //fetch all transaction;
  //     //need a function to populate TransactionType[] with all transactions
  //     for (let i = 0; i < transactions.length; i++) {
  //         if (categories.find(element => element.category === transactions[i].category)) {
  //             categories[transactions[i].category].value += transactions[i].amount;
  //         }
  //     }
  //     let suggestionArray: { value: number; key: TransactionCategories; }[] = [];
  //     for (let i = 0; i < targetPercent.length; i++) {
  //         //for each Transaction Category, match with a target percent
  //         Object.values(userData.budgetInfo.monthlyAllocations).map((spending) => {
  //             const categoryPercent = categories[TransactionCategories[i]].value / availableFunds;
  //             if (categoryPercent > targetPercent[i]) {
  //                 suggestionArray.push(TransactionCategories[i]: -((categoryPercent - targetPercent[i]) * availableFunds / 100));
  //             }
  //             else {
  //                 suggestionArray.push(TransactionCategories[i]: 0);
  //             }
  //         });
  //     }
  //     suggestions['Category Spending'] = suggestionArray; //suggestion array takes single element arrays, not mapped ones
  //     //for each actual spending in category, generate list of suggestions for each category to reach target percentage
  //     //for categories with less than target percentage spending, ignore
  //     //display additional savings from current spending practices
  //     //more functions for each type of suggestion
  //     //append each type of suggestion into userData.suggestions
  //     //return the entire suggestion at the end of this function
  //     userData.suggestions = suggestions;
  //     return userData.suggestions
  // }
}
