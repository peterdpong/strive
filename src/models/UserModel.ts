export type UserModel = {
  uid: string;
  email: string;
  firstName: string;
  lastName: string;
};

export type UserFinancials = {
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

export const createUserModel = (
  uid: string,
  email: string,
  firstName: string,
  lastName: string
) => {
  const newUserModel: UserModel = {
    uid,
    email,
    firstName,
    lastName,
  };

  return newUserModel;
};
