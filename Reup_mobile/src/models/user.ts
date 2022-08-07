// import { IGenres } from "@reup/reup-api-sdk/libs/api/book/models";

interface IValue {
  [name: string]: any;
}

export interface IUser extends IValue {
  user_id: string;
  email: string;
  first_name: string;
  last_name: string;
  avatar: string;
  phone: string;
  phone1: string;
  gender: string;
  date_of_birth: string;
  identity_code: string;
  identity_type: string;
  address: string;
  is_updated_profile: boolean;
}
