export type UserModel = {
  uid: string;
  firstName: string;
  lastName: string;
};

export const createUserModel = (
  uid: string,
  firstName: string,
  lastName: string
) => {
  const newUserModel: UserModel = {
    uid,
    firstName,
    lastName,
  };

  return newUserModel;
};
