export type BankAccount = {};

export type CreditCardAccount = {};

export type FixedInvestment = {};

export type LoanAccount = {};

export type TFSAAccount = {};

export type RRSPAccount = {};

export enum AccountType {
  SAVINGS = "Savings",
  CHEQUINGS = "Chequings",
  CREDITCARD = "Credit Card",
  LOAN = "Loan",
  TFSA = "TFSA",
  RRSP = "RRSP",
  GIC = "GIC",
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
