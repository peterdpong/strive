// Holds all budget optimization functions

import { exit } from "process";
import { UserModel } from "../models/UserModel";

export class BudgetEngine {
  static generateGoals(
    userData: UserModel,
    goalNetWorth: number,
    goalTimeline: number
  ) {
    //formula 1: net worth differential

    //present net worth

    //total assets
    const totalAssets: number =
      userData.financialInfo.accounts.bankAccounts.BankInvestmentAccount.value +
      userData.financialInfo.accounts.fixedInvestments.FixedInvestment
        .startingValue +
      userData.financialInfo.accounts.otherAssets.OtherAsset.value;

    //total liabilities
    const totalLiabilities: number =
      userData.financialInfo.accounts.loans.LoanAccount.remainingAmount +
      userData.financialInfo.accounts.creditCards.CreditCardAccount.amountOwned;

    //present net worth
    const currNetWorth = totalAssets - totalLiabilities;

    //goal net worth

    userData.return;

    //total assets
    const totalAssets: number =
      userData.financialInfo.accounts.bankAccounts.BankInvestmentAccount.value *
        (1 +
          userData.financialInfo.accounts.bankAccounts.BankInvestmentAccount
            .interestRate) **
          goalTimeline +
      userData.financialInfo.accounts.fixedInvestments.FixedInvestment
        .startingValue *
        (1 +
          userData.financialInfo.accounts.bankAccounts.FixedInvestment
            .interestRate) **
          goalTimeline +
      userData.financialInfo.accounts.otherAssets.OtherAsset.value;

    //total liabilities
    //TO DO: ror adjustments
    const totalLiabilities: number =
      userData.financialInfo.accounts.loans.LoanAccount.remainingAmount +
      userData.financialInfo.accounts.creditCards.CreditCardAccount.amountOwned;

    //present net worth
    const currNetWorth: number = totalAssets - totalLiabilities;

    //net worth differential
    const netWorthDiff: number = goalNetWorth - currNetWorth;

    //formula 2: monthly savings available

    //cash inflows
    //TO DO: ror adjustments, cash inflows
    const monthlySavingsAvail: number =
      userData.budgetInfo.monthlyVariableBudgetUnallocated;

    //formula 3: comparing monthly savings available to calculated monthly savings needed to reach goal
    const calcMonthlySavings =
      netWorthDiff / ((1.015 / 12) ** 12 * goalTimeline - 1) / (1.015 / 12);

    if (calcMonthlySavings > monthlySavingsAvail) {
      exit;
    } else {
      return calcMonthlySavings;
    }
  }

  static generateBudgetDemographicSuggestions() {
    return;
  }

  static generateBudgetSelfComparisons() {
    return;
  }

  static generateTimeAlert() {
    return;
  }

  static generateFinancialHealthSuggestions() {
    return;
  }
}

/*
export default function netWorthDifferential() {
  const { useRequiredAuth } = useAuth();
  const userData = useRequiredAuth();

return (

    //present net worth
    //userData.

);
}
*/
