// Holds all budget optimization functions

//import { exit } from "process";
import { UserModel } from "../models/UserModel";

export class BudgetEngine {
  static generateGoals(userData: UserModel | null, goalNetWorth: number, goalTimeline: number) {
    if (userData == null) {
      return 0;
    }

    //FORMULA 1: net worth differential

    //total assets
    //goal timeline is in number of years

    //bank accounts
    let bankAcctTotal = 0;

    Object.values(userData.financialInfo.accounts.bankAccounts).map((account) => {
      bankAcctTotal += account.value;
    })
    //fv bank account assets
    //const bankAcctTotalInterest = bankAcctTotal*(1+(userData.financialInfo.accounts.bankAccounts.BankInvestmentAccount.interestRate)/100)**goalTimeline;

    //fixed investments

    let fixedInvTotal = 0;

    Object.values(userData.financialInfo.accounts.fixedInvestments).map((account) => {
      fixedInvTotal += account.startingValue;
    })
    //fv investments assets
    //const fixedInvTotalInterest = fixedInvTotal*(1+(userData.financialInfo.accounts.bankAccounts.FixedInvestment.interestRate)/100)**goalTimeline;

    //other assets

    let houseTotal = 0;
    let vehicleTotal = 0;
    let collectiblesTotal = 0;
    let artTotal = 0;
    let valuablesTotal = 0;

    Object.values(userData.financialInfo.accounts.otherAssets).map((account) => {
      if (account.type == 'House') {
        houseTotal += account.value;
      }

      else if (account.type == 'Vehicle') {
        vehicleTotal += account.value;
      } 

      else if (account.type == 'Collectibles') {
        collectiblesTotal += account.value;
      }

      else if (account.type == 'Art') {
        artTotal += account.value;
      }

      else if (account.type == 'Valuables') {
        valuablesTotal += account.value;
      }
    })

    //fv house
    //const houseTotalInterest = houseTotal*(1.02)**goalTimeline;

    //fv vehicle
    //const vehicleTotalInterest = vehicleTotal*(0.90)**goalTimeline;

    //fv collectibles
    //const collectiblesTotalInterest = collectiblesTotal*(1.02)**goalTimeline;

    //fv art
    //const artTotalInterest = artTotal*(1.02)**goalTimeline;

    //fv valuables
    //const valuablesTotalInterest = valuablesTotal*(1.02)**goalTimeline;

    //total other assets
    const otherAssetsTotal = houseTotal + vehicleTotal + collectiblesTotal + artTotal + valuablesTotal;

    //summation
    let totalAssets = 0;
    totalAssets += bankAcctTotal + fixedInvTotal + otherAssetsTotal;

    /*
    for (const [key, value] of Object.entries(userData.financialInfo.accounts.bankAccounts)) {
      bankAcctTotal += userData.financialInfo.accounts.bankAccounts.bank
    }
    Object.keys(userData.financialInfo.accounts.bankAccounts).map(key => {
      userData.financialInfo.accounts.bankAccounts[key].map(el => {
      })
    })

    const totalAssets: number = (userData.financialInfo.accounts.bankAccounts.BankInvestmentAccount.value)*(1+(userData.financialInfo.accounts.bankAccounts.BankInvestmentAccount.interestRate)/100)**goalTimeline
    + (userData.financialInfo.accounts.fixedInvestments.FixedInvestment.startingValue)*(1+(userData.financialInfo.accounts.bankAccounts.FixedInvestment.interestRate)/100)**goalTimeline
    + userData.financialInfo.accounts.otherAssets.OtherAsset.value
    */
    

    //total liabilities

    //credit card debt
    let creditCardTotal = 0;

    Object.values(userData.financialInfo.accounts.creditCards).map((account) => {
      creditCardTotal += account.amountOwned;
    })

    //loans debt
    let loansTotal = 0;

    Object.values(userData.financialInfo.accounts.loans).map((account) => {
      loansTotal += account.remainingAmount;
    })

    //summation

    let totalLiabilities = 0;
    totalLiabilities += creditCardTotal + loansTotal;

    /*
    const totalLiabilities: number = (userData.financialInfo.accounts.loans.LoanAccount.remainingAmount)
    + userData.financialInfo.accounts.creditCards.CreditCardAccount.amountOwned
    */

    //present net worth
    let currNetWorth = 0;
    currNetWorth = totalAssets - totalLiabilities;
 
    //present net worth future valued
    let currNetWorthFV = 0;
    currNetWorthFV = currNetWorth*1.05**(goalTimeline); //5% RoR assumption

    //net worth differential
    let netWorthDiff = 0;
    netWorthDiff = goalNetWorth - currNetWorthFV;


    //FORMULA 2: monthly savings available

    //cash inflows
    //const monthlySavingsAvail: number = userData.budgetInfo.monthlyVariableBudgetUnallocated

    let monthlyIncome = 0;
    monthlyIncome = (userData.financialInfo.annualIncome)/12;

    //cash outflows

    let categoryAllocations = 0;
    Object.values(userData.financialInfo.monthlyTransactions).map((account) => {
      categoryAllocations += account.amount; //monthly expenses
    })

    let creditCardRepayment = 0;
    Object.values(userData.financialInfo.accounts.creditCards).map((account) => {
      creditCardRepayment += account.nextPaymentAmount; //monthly payment
    })
    
    let loanRepayment = 0;
    Object.values(userData.financialInfo.accounts.loans).map((account) => {
      loanRepayment += account.minimumPayment; //monthly payment
    })

    let totalOutflows = 0;
    totalOutflows = categoryAllocations + creditCardRepayment + loanRepayment;

    //monthly savings available (inflows - outflows)

    let monthlySavingsAvail = 0;
    monthlySavingsAvail = monthlyIncome - totalOutflows;


    //FORMULA 3: comparing monthly savings available to calculated monthly savings needed to reach goal
    let calcMonthlySavings = 0;
    calcMonthlySavings = netWorthDiff/((1.015/12)**12*goalTimeline-1)/(1.015/12)

    if (calcMonthlySavings > monthlySavingsAvail) {
      console.log("Error - not enough $ for monthly savings required to meet your goals.");
    }
    else {
      let monthlySavingsArray: Array<number>;
      //less aggressive, neutral and more aggressive options
      monthlySavingsArray = [1.05*calcMonthlySavings, calcMonthlySavings, 0.95*calcMonthlySavings]
      return monthlySavingsArray;
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
