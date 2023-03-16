// Holds all budget optimization functions
import { GoalModel } from "../models/GoalModel";
import { UserModel } from "../models/UserModel";

export type GeneratedGoals = {
  lessAggressiveGoal: GoalModel;
  neutralGoal: GoalModel;
  moreAggressiveGoal: GoalModel;
};

export class BudgetEngine {
  static generateGoals(
    userData: UserModel | null,
    goalNetWorth: number,
    goalTimeline: number
  ) {
    if (userData == null) {
      return undefined;
    }

    //FORMULA 1: net worth differential

    //total assets
    //goal timeline is in number of years

    //bank accounts
    let bankAcctTotal = 0;

    Object.values(userData.financialInfo.accounts.bankAccounts).map(
      (account) => {
        bankAcctTotal += account.value;
      }
    );

    //return ("this is bankaacctotal:" ) + bankAcctTotal;

    //fv bank account assets
    //const bankAcctTotalInterest = bankAcctTotal*(1+(userData.financialInfo.accounts.bankAccounts.BankInvestmentAccount.interestRate)/100)**goalTimeline;

    //fixed investments

    let fixedInvTotal = 0;

    Object.values(userData.financialInfo.accounts.fixedInvestments).map(
      (account) => {
        fixedInvTotal += account.startingValue;
      }
    );

    //return ("this is fixedInvTotal: ") + fixedInvTotal;

    //fv investments assets
    //const fixedInvTotalInterest = fixedInvTotal*(1+(userData.financialInfo.accounts.bankAccounts.FixedInvestment.interestRate)/100)**goalTimeline;

    //other assets

    let houseTotal = 0;
    let vehicleTotal = 0;
    let collectiblesTotal = 0;
    let artTotal = 0;
    let valuablesTotal = 0;
    let othersTotal = 0;

    Object.values(userData.financialInfo.accounts.otherAssets).map(
      (account) => {
        if (account.type == "House") {
          houseTotal += account.value;
        } else if (account.type == "Vehicle") {
          vehicleTotal += account.value;
        } else if (account.type == "Collectibles") {
          collectiblesTotal += account.value;
        } else if (account.type == "Art") {
          artTotal += account.value;
        } else if (account.type == "Valuables") {
          valuablesTotal += account.value;
        } else if (account.type == "Other") {
          othersTotal += account.value;
        }
      }
    );

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
    const otherAssetsTotal =
      houseTotal +
      vehicleTotal +
      collectiblesTotal +
      artTotal +
      valuablesTotal +
      othersTotal;

    //return ("artTotal: ") + artTotal;
    //return ("this is other assets: ") + otherAssetsTotal;

    //summation
    let totalAssets = 0;
    totalAssets = bankAcctTotal + fixedInvTotal + otherAssetsTotal;

    //return ("this is total assets: ") + totalAssets;

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

    Object.values(userData.financialInfo.accounts.creditCards).map(
      (account) => {
        creditCardTotal += account.amountOwned;
      }
    );

    //return ("this is credit card debt: ") + creditCardTotal;

    //loans debt
    let loansTotal = 0;

    Object.values(userData.financialInfo.accounts.loans).map((account) => {
      loansTotal += account.remainingAmount;
    });

    //return ("this is loan debt: ") + loansTotal;

    //summation

    let totalLiabilities = 0;
    totalLiabilities = creditCardTotal + loansTotal;

    //return ("this is totalLiabilities: ") + totalLiabilities;

    /*
    const totalLiabilities: number = (userData.financialInfo.accounts.loans.LoanAccount.remainingAmount)
    + userData.financialInfo.accounts.creditCards.CreditCardAccount.amountOwned
    */

    //present net worth
    let currNetWorth = 0;
    currNetWorth = totalAssets - totalLiabilities;

    //console.log("this is curr net worth: " + currNetWorth);

    //present net worth future valued
    let currNetWorthFV = 0;
    currNetWorthFV = currNetWorth * (1 + 0.05 / 12) ** (12 * goalTimeline); //5% RoR assumption

    //console.log("this is FV currNW: " + currNetWorthFV);
    //console.log("goalTimeline" + goalTimeline);

    //net worth differential
    let netWorthDiff = 0;
    netWorthDiff = goalNetWorth - currNetWorthFV;

    //const arr1 = [goalNetWorth, currNetWorthFV, netWorthDiff];
    //return (arr1);

    //FORMULA 2: monthly savings available

    //cash inflows
    //const monthlySavingsAvail: number = userData.budgetInfo.monthlyVariableBudgetUnallocated

    let monthlyIncome = 0;
    //monthlyIncome = userData.financialInfo.annualIncome / 12;
    monthlyIncome =
      userData.financialInfo.annualIncome * userData.financialInfo.payfreq;

    //return ("this is monthly income: ") + monthlyIncome;

    //cash outflows

    let categoryAllocations = 0;
    Object.values(userData.budgetInfo.monthlyAllocations).map((account) => {
      categoryAllocations += account.allocation; //monthly expenses
    });

    //return ("this is monthly transactions: ") + categoryAllocations;

    let creditCardRepayment = 0;
    Object.values(userData.financialInfo.accounts.creditCards).map(
      (account) => {
        creditCardRepayment += account.nextPaymentAmount; //monthly payment
      }
    );

    //return ("this is credit card repayment: ") + creditCardRepayment;

    let loanRepayment = 0;
    Object.values(userData.financialInfo.accounts.loans).map((account) => {
      loanRepayment += account.minimumPayment; //monthly payment
    });

    //return ("this is loan repayment: ") + loanRepayment;

    let totalOutflows = 0;
    totalOutflows = categoryAllocations + creditCardRepayment + loanRepayment;

    //return ("this is total outflows: ") + totalOutflows;

    //monthly savings available (inflows - outflows)

    let monthlySavingsAvail = 0;
    monthlySavingsAvail = monthlyIncome - totalOutflows;

    //return ("This is monthlysavingsavail: ") + monthlySavingsAvail;

    //FORMULA 3: comparing monthly savings available to calculated monthly savings needed to reach goal
    let calcMonthlySavings = 0;
    //calcMonthlySavings = netWorthDiff/((1.015/12)**12*goalTimeline-1)/(1.015/12)
    //return goalTimeline;
    calcMonthlySavings =
      (netWorthDiff * (0.05 / 12)) /
      ((1 + 0.05 / 12) ** (12 * goalTimeline) - 1);

    //return ("this is calcMonthlySavings: ") + calcMonthlySavings;

    //CALCULATION: future net worth for less aggressive and more aggressive options
    //less aggressive
    let lessAggressiveNW = 0;
    let futureValLessAggressive = 0;

    futureValLessAggressive =
      calcMonthlySavings *
      0.95 *
      (((1 + 0.05 / 12) ** (12 * goalTimeline) - 1) / (0.05 / 12));
    lessAggressiveNW = currNetWorthFV + futureValLessAggressive;

    //more aggressive
    let moreAggressiveNW = 0;
    let futureValMoreAggressive = 0;

    futureValMoreAggressive =
      calcMonthlySavings *
      1.05 *
      (((1 + 0.05 / 12) ** (12 * goalTimeline) - 1) / (0.05 / 12));
    moreAggressiveNW = currNetWorthFV + futureValMoreAggressive;

    if (calcMonthlySavings > monthlySavingsAvail) {
      return null;
      //TO DO: return suggestions
    } else {
      return {
        lessAggressiveGoal: {
          monthlyAmount: calcMonthlySavings * 0.95,
          networthGoal: lessAggressiveNW,
          timelineGoal: goalTimeline,
        },
        neutralGoal: {
          monthlyAmount: calcMonthlySavings,
          networthGoal: goalNetWorth,
          timelineGoal: goalTimeline,
        },
        moreAggressiveGoal: {
          monthlyAmount: calcMonthlySavings * 1.05,
          networthGoal: moreAggressiveNW,
          timelineGoal: goalTimeline,
        },
      };
    }
  }

  static generateBudgetSelfComparisons() {
    return;
  }

  static generateTimeAlert() {
    return;
  }
}
