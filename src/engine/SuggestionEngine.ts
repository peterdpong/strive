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
      // for each transaction made in the last month - negative we are looking at percentage spend
      if (transaction.category in CategoryPercentages) {
        categorySpend[transaction.category] += -transaction.amount;
      }
    });

    const suggestionArray: Suggestion[] = [];
    const suggestionType = "SpendingAndBudget";
    const suggestionBadge = "Category Spending";
    for (const category of enumKeys(TransactionCategories)) {
      if (categorySpend[TransactionCategories[category]] < 0) {
        // Skip category if negative as it implies no spending rather money gained
        continue;
      }

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
          badgeColor: "red",
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

  // static generateMoneyAllocationSuggestions(userData: UserModel | null) {
  //   return;
  // }

  static generateFinancialHealthSuggestions(userData: UserModel | null) {
    if (userData === null) return;

    const suggestionType = "FinancialHealth";
    const financialHealthSuggestions: Suggestion[] = [];

    // Time Alerts
    const currentDate = new Date();

    // Taxes are always due April 30th of the current year
    const taxDueDate = new Date(currentDate.getFullYear(), 3, 30);
    if (currentDate < taxDueDate) {
      // Add suggestion/reminder of taxes
      financialHealthSuggestions.push({
        suggestionType: suggestionType,
        suggestionTitle: `${
          currentDate.getFullYear() - 1
        } Tax Deadline Reminder - ${taxDueDate.toDateString()}`,
        suggestionDescription: `Your ${
          currentDate.getFullYear() - 1
        } taxes are expected to be submitted by ${taxDueDate.toDateString()}. That is ${Math.floor(
          (taxDueDate.getTime() - currentDate.getTime()) / 86400000
        )} days away from today.`,
        suggestionBadge: `Tax Deadline`,
        badgeColor: "blue",
      });
    }

    const RRSPDepositDeadlinePrevTax = new Date(
      currentDate.getFullYear(),
      2,
      1
    );
    const RRSPDepositDeadlineCurrentTax = new Date(
      currentDate.getFullYear() + 1,
      2,
      1
    );
    if (currentDate < RRSPDepositDeadlinePrevTax) {
      // Add suggestion/reminder of previous years tax rrsp deposit deadline
      financialHealthSuggestions.push({
        suggestionType: suggestionType,
        suggestionTitle: `${
          currentDate.getFullYear() - 1
        } RRSP Deposit Deadline - ${RRSPDepositDeadlinePrevTax.toDateString()}`,
        suggestionDescription: `Your deadline to deposit into you RRSP for deduction on your ${
          currentDate.getFullYear() - 1
        } taxes is ${RRSPDepositDeadlinePrevTax.toDateString()}. That is ${Math.floor(
          (RRSPDepositDeadlinePrevTax.getTime() - currentDate.getTime()) /
            86400000
        )} days away from today.`,
        suggestionBadge: `RRSP Deposit Deadline`,
        badgeColor: "blue",
      });
    }

    if (currentDate < RRSPDepositDeadlineCurrentTax) {
      // Add suggestion/reminder of current year rrsp deposite deadline
      financialHealthSuggestions.push({
        suggestionType: suggestionType,
        suggestionTitle: `${currentDate.getFullYear()} RRSP Deposit Deadline - ${RRSPDepositDeadlineCurrentTax.toDateString()}`,
        suggestionDescription: `Your deadline to deposit into you RRSP for deduction on your ${currentDate.getFullYear()} taxes is ${RRSPDepositDeadlineCurrentTax.toDateString()}. That is ${Math.floor(
          (RRSPDepositDeadlineCurrentTax.getTime() - currentDate.getTime()) /
            86400000
        )} days away from today.`,
        suggestionBadge: `RRSP Deposit Deadline`,
        badgeColor: "blue",
      });
    }

    // Emergency Fund Recommendation -- look back 3 months
    let averageThreeMonthsSpending = 0;
    const lookBackDate = new Date();
    lookBackDate.setMonth(lookBackDate.getMonth() - 3);
    let dateParts = lookBackDate.toISOString().split("T")[0].split("-");
    let monthAndYear = parseInt(dateParts[1]) + "-" + dateParts[0];

    // Assumption here - we only calculate their average past 3 months spending if they
    // have some transaction for data for 3 months ago
    if (userData.monthTransactionsMap[monthAndYear]) {
      while (lookBackDate.getMonth() !== currentDate.getMonth()) {
        if (userData.monthTransactionsMap[monthAndYear]) {
          userData.monthTransactionsMap[monthAndYear].forEach((transaction) => {
            if (transaction.amount < 0) {
              // Again split the transaction amount to positive $ spent.
              averageThreeMonthsSpending += -transaction.amount;
            }
          });
        }

        lookBackDate.setMonth(lookBackDate.getMonth() + 1);
        dateParts = lookBackDate.toISOString().split("T")[0].split("-");
        monthAndYear = parseInt(dateParts[1]) + "-" + dateParts[0];
      }

      averageThreeMonthsSpending /= 3;
      financialHealthSuggestions.push({
        suggestionType: suggestionType,
        suggestionTitle: `Build an emergency fund.`,
        suggestionDescription: `It is recommended you have at least 3-6 months worth of your living expenses as an emergency fund. Based on your last 3 months spending, you averaged monthly expenses of $${averageThreeMonthsSpending.toFixed(
          2
        )}. A good range of funds you should keep as an emergency fund is then $${(
          averageThreeMonthsSpending * 3
        ).toFixed(2)} to $${(averageThreeMonthsSpending * 6).toFixed(
          2
        )} which represent 3-6 months worth of expenses.`,
        suggestionBadge: `Emergency Fund`,
        badgeColor: "blue",
      });
    }

    // Debt Analysis
    // Ideal for all debts to not exceed their total assets
    let totalDebts = 0;
    Object.values(userData.financialInfo.accounts.loans).forEach((account) => {
      totalDebts += account.remainingAmount;
    });

    Object.values(userData.financialInfo.accounts.creditCards).forEach(
      (account) => {
        totalDebts += account.amountOwned;
      }
    );

    let totalAssets = 0;
    Object.values(userData.financialInfo.accounts.bankAccounts).forEach(
      (account) => {
        totalAssets += account.value;
      }
    );
    Object.values(userData.financialInfo.accounts.fixedInvestments).forEach(
      (account) => {
        totalAssets += account.startingValue;
      }
    );
    Object.values(userData.financialInfo.accounts.otherAssets).forEach(
      (account) => {
        totalAssets += account.value;
      }
    );

    const debtToAssetRatio = totalDebts / totalAssets;

    if (debtToAssetRatio > 0.5) {
      financialHealthSuggestions.push({
        suggestionType: suggestionType,
        suggestionTitle: `Debt to Asset ratio greater than 50%`,
        suggestionDescription: `It is recommended your total debt does not exceed 50% of your total assets. Currently your debts total to ${(
          debtToAssetRatio * 100
        ).toFixed(
          2
        )}% of your total assets. This percentage represents your individual ability to borrow, the higher the percentage the less you can borrow thus lowering your long-term financial flexibility.`,
        suggestionBadge: `Debt Ratio`,
        badgeColor: "red",
      });
    }

    updateSuggestion(
      userData.uid,
      suggestionType,
      financialHealthSuggestions,
      userData.suggestions
    );
  }
}
