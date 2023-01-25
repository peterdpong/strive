// Holds all budget optimization functions

import { UserModel } from "../models/UserModel";

export class BudgetEngine {
  static generateGoals(userData: UserModel, goalNetWorth: number) {
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
