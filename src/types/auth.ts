export interface User {
  accessToken: string;
  email: string;
  firstName: string;
  lastName: string;
}

export interface BusinessUserSignup {
  businessUserInvitationKey: string;
  businessKey: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  password: string;
  email: string;
}

export const defaultBusinessUserSignup: BusinessUserSignup = {
  businessUserInvitationKey: "",
  businessKey: "",
  firstName: "",
  lastName: "",
  phoneNumber: "",
  password: "",
  email: "",
};
export interface AddToBusiness {
  businessUserInvitationKey: string;
  businessKey: string;
}
export const defaultAddToBusiness: AddToBusiness = {
  businessUserInvitationKey: "",
  businessKey: "",
};
