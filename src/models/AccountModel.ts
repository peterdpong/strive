export type BankAccount = {
  name: string;
  type: AccountType.SAVINGS | AccountType.CHEQUINGS;
  value: number;
  interestRate: number;
};

export type CreditCardAccount = {
  name: string;
  amountOwned: number;
  interestRate: number;
  nextPaymentAmount: number;
  nextPaymentDate: Date;
};

export type LoanAccount = {
  name: string;
  remainingAmount: number;
  interestRate: number;
  minimumPayment: number;
  paymentDate: Date;
};

export type FixedInvestment = {
  name: string;
  startDate: Date;
  maturityDate: Date;
  interestRate: number;
};

//TODO(peter): future implementations
export type TFSAAccount = {
  name: string;
  value: number;
};

export type RRSPAccount = {
  name: string;
  value: number;
};

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
