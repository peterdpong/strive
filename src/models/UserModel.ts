import { BudgetModel, MonthlyTransaction, Transaction } from "./BudgetModel";
import { GoalModel } from "./GoalModel";

export type UserModel = {
  uid: string;
  email: string;
  firstName: string;
  lastName: string;
  onboardingStatus: OnboardingStatus;
  financialInfo: FinancialInfo;
  budgetInfo: BudgetModel;
  goalInfo: GoalModel;
  monthTransactionsMap: { [key: string]: Transaction[] };
};

export type OnboardingStatus = {
  finished: boolean;
  stageNum: number;
};

export type FinancialInfo = {
  incomeValue: number;
  incomeIsAnnual: string;
  hoursPerWeek: number;
  monthlyTransactions: MonthlyTransaction[];
  accounts: Account[];
};

export enum AccountType {
  SAVINGS = "Savings",
  CHEQUINGS = "Chequings",
  CREDITCARD = "Credit Card",
  LOAN = "Loan",
  // TFSA,
  // RRSP,
  // GIC,
}

export const getAccountTypeArray = () => {
  const accountTypes = [];
  for (const value of Object.values(AccountType)) {
    accountTypes.push({
      value: value,
      key: Object.keys(AccountType)[Object.values(AccountType).indexOf(value)],
    });
  }

  return accountTypes;
};

export type Account = {
  name: string;
  type: AccountType;
  value: number;
};
