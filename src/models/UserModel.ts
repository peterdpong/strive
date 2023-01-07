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
  incomeIsAnnual: boolean;
  hoursPerWeek: number;
  monthlyTransactions: MonthlyTransaction[];
  accounts: Account[];
};

export enum AccountType {
  SAVINGS = "Savings",
  CHEQUINGS = "Chequings",
  CREDITCARD = "Credit Card",
  // TFSA,
  // RRSP,
  // GIC,
}

export type Account = {
  type: AccountType;
  value: number;
};
