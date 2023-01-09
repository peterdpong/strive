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
  accountValue: number;
  accountInfo: {
    depositAccountInfo?: { interestRate: number }; // Deposit account refers to savings or chequings
    creditCardInfo?: {
      interestRate: number;
      nextPaymentDate: Date;
      paymentValue: number;
      minimumPayment: number;
      paymentPaid: boolean;
    };
    loanInfo?: {
      interestRate: number;
      nextPaymentDate: Date;
      paymentValue: number;
      minimumPayment: number;
      paymentPaid: boolean;
    };
  };
};
