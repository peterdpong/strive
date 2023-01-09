import { BudgetModel, Transaction } from "../models/BudgetModel";
import { Account, AccountType } from "../models/UserModel";

export class BudgetEngineUtils {
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

  static calculateNetWorth(accounts: Account[]) {
    let assets = 0;
    let debts = 0;

    for (const account of accounts) {
      if (
        account.type === AccountType.SAVINGS ||
        account.type === AccountType.CHEQUINGS
      ) {
        assets += account.accountValue;
      } else {
        debts += account.accountValue;
      }
    }

    return assets - debts;
  }
}
