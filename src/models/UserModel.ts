export type UserModel = {
  uid: string;
  email: string;
  firstName: string;
  lastName: string;
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
