import { Transaction } from "./BudgetModel";
import { GoalModel } from "./GoalModel";

export type UserModel = {
  uid: string;
  email: string;
  firstName: string;
  lastName: string;
  onboardingStatus: OnboardingStatus;
  financialInfo: UserFinancialInfo;
  goalInfo: GoalModel;
  monthTransactionsMap: { [key: string]: Transaction[] };
};

export type OnboardingStatus = {
  finished: boolean;
  stageNum: number;
};

export type UserFinancialInfo = {
  income: number;
  fixedCosts: number;
  accounts: Account[];
};

export enum AccountType {
  SAVINGS,
  CHEQUINGS,
  TFSA,
  RRSP,
  GIC,
}

export type Account = {
  type: AccountType;
};

// TODO(Peter): Clean up once sure we do no need this.
// export const createUserModel = (
//   uid: string,
//   email: string,
//   firstName: string,
//   lastName: string
// ) => {
//   const newUserModel: UserModel = {
//     uid,
//     email,
//     firstName,
//     lastName,
//   };

//   return newUserModel;
// };
