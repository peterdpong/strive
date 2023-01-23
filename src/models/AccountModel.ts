import { Timestamp } from "firebase/firestore";

export type BankInvestmentAccount = {
  name: string;
  type: string;
  value: number;
  interestRate: number;
};

export type CreditCardAccount = {
  name: string;
  amountOwned: number;
  interestRate: number;
  nextPaymentAmount: number;
  nextPaymentDate: Date | Timestamp;
};

export type LoanAccount = {
  name: string;
  remainingAmount: number;
  interestRate: number;
  minimumPayment: number;
  paymentDate: Date | Timestamp;
};

export type FixedInvestment = {
  name: string;
  startDate: Date | Timestamp;
  maturityDate: Date | Timestamp;
  interestRate: number;
  startingValue: number;
};

export type OtherAsset = {
  type: AssetTypes;
  name: string;
  value: number;
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

export enum AssetTypes {
  VEHICLE = "Vehicle",
  HOUSE = "House",
  COLLECTIBLES = "Collectibles",
  ART = "Art",
  VALUABLES = "Valuables",
}
