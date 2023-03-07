import { BudgetModel, Transaction } from "../models/BudgetModel";
import { AccountMap, UserModel } from "../models/UserModel";

export class BudgetEngineUtils {
  static getCurrentMonthTransactions(userData: UserModel) {
    const currentDate = new Date();

    return userData.monthTransactionsMap[
      (currentDate.getUTCMonth() + 1).toString() +
        "-" +
        currentDate.getUTCFullYear().toString()
    ];
  }

  static calculateBudgetExpenses(budgetInfo: BudgetModel) {
    let expenseAmount = 0;

    for (const key of Object.keys(budgetInfo.monthlyAllocations)) {
      expenseAmount += budgetInfo.monthlyAllocations[key].allocation;
    }

    return expenseAmount;
  }

  static calculateFixedMonthlyExpenses(monthTransactionsMap: Transaction[]) {
    let expenseAmount = 0;

    for (const transaction of monthTransactionsMap) {
      expenseAmount += transaction.amount;
    }

    return expenseAmount;
  }

  static calculateNetWorth(accounts: AccountMap) {
    let assets = 0;
    let debts = 0;

    Object.values(accounts.bankAccounts).map((account) => {
      assets += account.value;
    });

    Object.values(accounts.fixedInvestments).map((account) => {
      assets += account.startingValue;
    });

    Object.values(accounts.otherAssets).map((account) => {
      assets += account.value;
    });

    Object.values(accounts.creditCards).map((account) => {
      debts += account.amountOwned;
    });

    Object.values(accounts.loans).map((account) => {
      debts += account.remainingAmount;
    });

    return assets - debts;
  }

  static calculateCurrentMonthSavings(userData: UserModel) {
    let currentSavings = userData.financialInfo.annualIncome / 12;

    const userCurrentMonthTransactions =
      BudgetEngineUtils.getCurrentMonthTransactions(userData);

    for (const transaction of userCurrentMonthTransactions) {
      currentSavings += transaction.amount;
    }

    return currentSavings;
  }
}
