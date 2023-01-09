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

export type FinancialInfo = {
  monthlyIncome: number;
  monthlyTransactions: Transaction[];
  accounts: {
    bankAccounts: [];
    creditCards: [];
    fixedInvestments: [];
    loans: [];
    tfsaAccounts: [];
    rrspAccounts: [];
  };
};
