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
    let currentSavings = 0;

    const userCurrentMonthTransactions =
      BudgetEngineUtils.getCurrentMonthTransactions(userData);

    for (const transaction of userCurrentMonthTransactions) {
      currentSavings += transaction.amount;
    }

    return currentSavings;
  }

  static calculateCurrentMonthExpenses(userData: UserModel) {
    let allExpenses = 0;

    const userCurrentMonthTransactions =
      BudgetEngineUtils.getCurrentMonthTransactions(userData);

    for (const transaction of userCurrentMonthTransactions) {
      if (transaction.amount < 0) {
        allExpenses += -transaction.amount;
      }
    }

    return allExpenses;
  }

  static addMonths(date: Date, months: number) {
    const d = date.getDate();
    date.setMonth(date.getMonth() + +months);
    if (date.getDate() != d) {
      date.setDate(0);
    }
    return date;
  }

  static loanMinimumDateToPayoff(userData: UserModel) {
    const monthToPayOffLoans = Object.values(
      userData.financialInfo.accounts.loans
    ).map((loan) => {
      const monthlyInterest = loan.interestRate / 100 / 12;
      if (monthlyInterest === 0)
        return loan.remainingAmount / loan.minimumPayment;

      return (
        -Math.log(
          1 - (monthlyInterest * loan.remainingAmount) / loan.minimumPayment
        ) / Math.log(1 + monthlyInterest)
      );
    });

    const date = new Date();
    return BudgetEngineUtils.addMonths(
      date,
      monthToPayOffLoans.reduce((a, b) => Math.max(a, b), -Infinity)
    );
  }

  static loanPaymentSchedule(userData: UserModel) {
    const paymentSchedule = Object.values(
      userData.financialInfo.accounts.loans
    ).map((loan) => {
      const monthlyInterest = loan.interestRate / 100 / 12;
      const balanceSchedule = [];
      let currentBalance = loan.remainingAmount;

      while (currentBalance > 0) {
        const currentMonthInterest = monthlyInterest * currentBalance;
        const currentMonthPrincipal =
          loan.minimumPayment - currentMonthInterest;
        let payment = loan.minimumPayment;

        if (loan.minimumPayment > currentBalance + currentMonthInterest) {
          payment = currentBalance + currentMonthInterest;
          currentBalance = 0;
        } else {
          currentBalance -= currentMonthPrincipal;
        }
        balanceSchedule.push({
          payment: payment,
          interest: currentMonthInterest,
          principal: currentMonthPrincipal,
          balance: currentBalance,
        });
      }
      return balanceSchedule;
    });

    return paymentSchedule;
  }

  static getTargetGoalValueCurrentMonth = (userData: UserModel) => {
    let startMonth = "100-100000";
    Object.keys(userData.monthTransactionsMap).forEach((month) => {
      const month1 = startMonth.split("-");
      const month2 = month.split("-");
      if (
        parseInt(month2[1]) < parseInt(month1[1]) ||
        parseInt(month2[0]) < parseInt(month1[0])
      ) {
        startMonth = month;
      }
    });

    let FVPrevNetWorth = userData.goalInfo.startingNetWorth;
    let currMonth = startMonth;
    const date = new Date(); // current date
    const monthParts = currMonth.split("-").map((part) => parseInt(part));

    while (
      monthParts[0] !== date.getMonth() + 2 ||
      monthParts[1] !== date.getFullYear()
    ) {
      FVPrevNetWorth =
        FVPrevNetWorth * (1 + 0.05 / 12) + userData.goalInfo.monthlyAmount;

      // increase currMonth
      if (monthParts[0] === 12) {
        monthParts[0] = 1;
        monthParts[1] += 1;
      } else {
        monthParts[0] += 1;
      }
      currMonth = monthParts.join("-");
    }

    return FVPrevNetWorth;
  };

  // Loan Utils - todo
  // static loanProjectPayoff(
  //   userData: UserModel,
  //   extraMonthlyPayment: number,
  //   isAvalanche: boolean
  // ) {
  //   if (isAvalanche) {
  //     const loanSortedByInterestRate = Object.values(
  //       userData.financialInfo.accounts.loans
  //     ).sort(
  //       (account1, account2) => account2.interestRate - account1.interestRate
  //     );
  //   } else {
  //     const loanSortedByPrincipal = Object.values(
  //       userData.financialInfo.accounts.loans
  //     ).sort(
  //       (account1, account2) =>
  //         account1.remainingAmount - account2.remainingAmount
  //     );
  //   }

  //   return;
  // }
}
