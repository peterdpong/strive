import {
  BankInvestmentAccount,
  CreditCardAccount,
  FixedInvestment,
  LoanAccount,
} from "./AccountModel";
import { BudgetModel, Transaction } from "./BudgetModel";
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

export type AccountMap = {
  bankAccounts: { [key: string]: BankInvestmentAccount };
  creditCards: { [key: string]: CreditCardAccount };
  loans: { [key: string]: LoanAccount };
  fixedInvestments: { [key: string]: FixedInvestment };
};

export type FinancialInfo = {
  annualIncome: number;
  monthlyTransactions: Transaction[];
  accounts: AccountMap;
};
