import { UserModel } from "../models/UserModel";
import {getTransactionCategoriesArray, TransactionCategories} from "../models/BudgetModel";

/*
export enum TransactionCategories {
  GROCERIES = "Groceries",
  ENTERTAINMENT = "Entertainment",
  UTILITIES = "Utilities",
  MOBILEPLAN = "Mobile Plan",
  RENT = "Rent",
  TRANSPORTATION = "Transportation",
  DININGOUT = "Dining Out",
  CLOTHING = "Clothing",
  TRAVEL = "Travel",
  EDUCATION = "Education",
  INTEREST = "Interest",
  SAVINGS = "Savings",
  INCOME = "Income",
}
*/

export class SuggestionEngine {
    static generateSuggestions( userData: UserModel | null ) {
        if (userData == null) {
            return undefined;
        }
        // generate spending suggestions by category (make this into function later)
        let targetPercent = []
        let availableFunds = userData.budgetInfo.monthlyVariableBudget; // total funds available for allocation
        let categories = [];
        categories = getTransactionCategoriesArray()
        for (let i = 0; i < categories.length; i++) {
            //for each Transaction Category, match with a target percent
        }
        //for each actual spending in category, generate list of suggestions for each category to reach target percentage
        //for categories with less than target percentage spending, ignore
        //display additional savings from current spending practices

        //more functions for each type of suggestion

        //append each type of suggestion into userData.suggestions
        //return the entire suggestion at the end of this function
        return userData.suggestions
    }
}